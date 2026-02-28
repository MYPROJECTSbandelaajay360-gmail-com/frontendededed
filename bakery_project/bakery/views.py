from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Prefetch, Sum, Count, Q
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
from .models import MenuItem, Order, OrderItem, Payment, UserProfile, Table, DriverLocation, SavedAddress
from .decorators import admin_required, driver_required
import json
import uuid
import razorpay
from django.utils import timezone
from decimal import Decimal
import os
from datetime import datetime, timedelta



def process_cart_items(cart_data):
    """Process cart data and return valid order items with total amount"""
    cart = json.loads(cart_data)
    if not cart:
        return None, None, "Cart is empty"
    
    total_amount = Decimal('0.00')
    order_items = []
    
    for item_id, item_data in cart.items():
        try:
            menu_item = MenuItem.objects.get(id=int(item_id))
            quantity = int(item_data.get('quantity', 0))
            if quantity > 0:
                subtotal = menu_item.price * quantity
                total_amount += subtotal
                order_items.append({
                    'menu_item': menu_item,
                    'quantity': quantity,
                    'price': menu_item.price
                })
        except (MenuItem.DoesNotExist, ValueError):
            continue
    
    if not order_items:
        return None, None, "No valid items in cart"
    
    return order_items, total_amount, None


# Simple template views
def index(request):
    return render(request, 'bakery/index.html')


def chatbot_view(request):
    """Display the chatbot interface"""
    return render(request, 'bakery/chatbot_premium_v2.html', {
        'table_number': ''
    })


def qr_landing_view(request):
    """Landing page after scanning QR code"""
    table_number = request.GET.get('table', '')
    return render(request, 'bakery/qr_landing.html', {
        'table_number': table_number
    })


def chatbot_order_view(request):
    """Chatbot ordering interface"""
    table_number = request.GET.get('table', '')
    return render(request, 'bakery/chatbot_premium_v2.html', {
        'table_number': table_number
    })


@admin_required
def admin_dashboard_view(request):
    """Admin dashboard for managing orders"""
    return render(request, 'bakery/admin_dashboard_v2.html')


def admin_stats_api(request):
    """API endpoint for admin dashboard stats"""
    from django.utils import timezone
    from django.db.models import Q
    from datetime import timedelta
    
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    
    # Today's orders
    today_orders = Order.objects.filter(created_at__date=today)
    today_completed = today_orders.filter(status='completed')
    today_revenue = today_orders.filter(status='completed').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    # Yesterday's orders
    yesterday_orders = Order.objects.filter(created_at__date=yesterday)
    yesterday_revenue = yesterday_orders.filter(status='completed').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    # Active orders (not completed/cancelled)
    active_orders = Order.objects.filter(
        ~Q(status__in=['completed', 'cancelled', 'served'])
    ).order_by('-created_at')
    
    # Calculate revenue change percentage
    revenue_change = 0
    if yesterday_revenue > 0:
        revenue_change = ((float(today_revenue) - float(yesterday_revenue)) / float(yesterday_revenue)) * 100
    elif today_revenue > 0:
        revenue_change = 100
    
    # Calculate average preparation time
    completed_with_times = Order.objects.filter(
        status='completed',
        created_at__date=today,
        ready_at__isnull=False
    )
    
    if completed_with_times.exists():
        total_time = sum([(order.ready_at - order.created_at).total_seconds() for order in completed_with_times])
        avg_seconds = total_time / completed_with_times.count()
        avg_minutes = int(avg_seconds / 60)
        avg_time = f"{avg_minutes}m"
    else:
        avg_time = "--"
    
    # Prepare orders data
    orders_data = []
    for order in active_orders[:10]:  # Last 10 active orders
        orders_data.append({
            'order_id': order.order_id,
            'customer': order.customer_name or (order.user.get_full_name() if order.user else 'Guest'),
            'status': order.status,
            'amount': str(order.total_amount),
            'type': order.get_order_type_display(),
            'table': str(order.table.table_number) if order.table else 'N/A',
            'time': order.created_at.strftime('%H:%M'),
        })
    
    return JsonResponse({
        'today_revenue': float(today_revenue),
        'yesterday_revenue': float(yesterday_revenue),
        'revenue_change': revenue_change,
        'active_orders_count': active_orders.count(),
        'completed_today': today_completed.count(),
        'total_today': today_orders.count(),
        'avg_time': avg_time,
        'orders': orders_data
    })


@admin_required
def kitchen_portal_view(request):
    """Kitchen staff portal for managing orders"""
    return render(request, 'bakery/kitchen_portal_v2.html')


def menu_view(request):
    menu_items = MenuItem.objects.filter(available=True)
    table_number = request.GET.get('table', '')
    mode = request.GET.get('mode', 'browse')  # browse or chatbot
    
    return render(request, 'bakery/menu.html', {
        'menu_items': menu_items,
        'table_number': table_number,
        'mode': mode
    })


def about_view(request):
    return render(request, 'bakery/about.html')


def contact_view(request):
    return render(request, 'bakery/contact.html')



@login_required
def cart_view(request):
    return render(request, 'bakery/cart.html')


@login_required
def orders_view(request):
    """Display user-specific orders - only orders belonging to the logged-in user"""
    if not request.user.is_authenticated:
        return redirect('login')
    
    # Optimized query with prefetch to reduce database hits
    orders_queryset = Order.objects.filter(user=request.user).select_related(
        'payment'
    ).prefetch_related(
        'items__menu_item'
    ).order_by('-created_at')
    
    # Get current active orders (include new delivery statuses)
    current_orders = orders_queryset.filter(
        status__in=['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way']
    )
    
    # Get order history
    order_history = orders_queryset.filter(status__in=['delivered', 'completed', 'cancelled'])
    
    # Calculate statistics
    total_orders = orders_queryset.count()
    completed_orders = orders_queryset.filter(status='completed').count()
    
    context = {
        'current_orders': current_orders,
        'order_history': order_history,
        'total_orders': total_orders,
        'completed_orders': completed_orders,
        'user_full_name': request.user.get_full_name() or request.user.username
    }
    return render(request, 'bakery/orders.html', context)


@login_required
def order_detail_view(request, order_id):
    """Display full detail of a single order belonging to the logged-in user"""
    from django.shortcuts import get_object_or_404
    order = get_object_or_404(Order, order_id=order_id, user=request.user)
    return render(request, 'bakery/order_detail.html', {'order': order})

@login_required
def track_order_view(request, order_id):
    """Show tracking map for a delivery order"""
    from django.shortcuts import get_object_or_404
    order = get_object_or_404(
        Order.objects.select_related('assigned_driver', 'payment').prefetch_related('items__menu_item'),
        order_id=order_id, user=request.user
    )
    # Driver info
    driver_info = None
    driver_location = None
    if order.assigned_driver:
        profile = UserProfile.objects.filter(user=order.assigned_driver).first()
        driver_info = {
            'name': order.assigned_driver.get_full_name() or order.assigned_driver.username,
            'phone': profile.phone if profile else '',
            'vehicle_number': profile.vehicle_number if profile else '',
            'initial': (order.assigned_driver.first_name or order.assigned_driver.username)[0].upper(),
        }
        loc = DriverLocation.objects.filter(driver=order.assigned_driver).first()
        if loc:
            driver_location = {'lat': loc.latitude, 'lng': loc.longitude, 'heading': loc.heading}

    context = {
        'order': order,
        'driver_info': driver_info,
        'driver_location_json': json.dumps(driver_location) if driver_location else 'null',
    }
    return render(request, 'bakery/track_order.html', context)

@login_required
def upi_payment_view(request):
    if request.method != 'POST':
        return render(request, 'bakery/upi-payment.html')
    
    # Get POST data
    cart_data = request.POST.get('cart_data')
    delivery_address = request.POST.get('delivery_address')
    delivery_phone = request.POST.get('delivery_phone')
    delivery_notes = request.POST.get('delivery_notes', '')
    payment_screenshot = request.FILES.get('payment_screenshot')
    upi_transaction_id = request.POST.get('upi_transaction_id', '')
    
    # Validate required fields
    if not all([cart_data, delivery_address, payment_screenshot]):
        messages.error(request, 'Please fill all required fields and upload payment screenshot.')
        return render(request, 'bakery/upi-payment.html')
    
    try:
        # Process cart items
        order_items, total_amount, error = process_cart_items(cart_data)
        if error:
            messages.error(request, error)
            return redirect('cart')
        
        # Create order
        order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order.objects.create(
            user=request.user,
            order_id=order_id,
            status='pending',
            total_amount=total_amount,
            delivery_address=delivery_address,
            delivery_phone=delivery_phone,
            delivery_notes=delivery_notes
        )
        
        # Create order items
        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                menu_item=item['menu_item'],
                quantity=item['quantity'],
                price=item['price']
            ) for item in order_items
        ])
        
        # Create payment record
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        Payment.objects.create(
            order=order,
            payment_method='upi',
            payment_status='pending',
            transaction_id=transaction_id,
            amount=order.grand_total,
            upi_id=upi_transaction_id,
            payment_screenshot=payment_screenshot
        )
        
        # Send order notifications (Email + SMS)
        print(f"📦 Sending notifications for Order #{order.id}...")
        send_order_notification_email(order)
        send_order_sms_notification(order)
        
        success_message = f'Order placed successfully! Order ID: {order_id}. Your payment will be verified within 24 hours.'
        messages.success(request, success_message)
        
        return render(request, 'bakery/upi-payment.html', {
            'order_placed': True,
            'order_id': order_id,
            'message': success_message
        })
        
    except json.JSONDecodeError:
        messages.error(request, 'Invalid cart data.')
    except Exception as e:
        messages.error(request, f'Error processing order: {str(e)}')
    
    return render(request, 'bakery/upi-payment.html')


# Authentication views
def _get_role_dashboard(user):
    """Return the appropriate dashboard URL name for a user's role."""
    try:
        role = user.profile.role
    except Exception:
        from .models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        role = profile.role
    if role == 'admin':
        return 'admin_dashboard'
    elif role == 'driver':
        return 'driver_dashboard'
    return 'index'


def login_view(request):
    if request.user.is_authenticated:
        return redirect(_get_role_dashboard(request.user))
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)
        
        if user:
            login(request, user)
            messages.success(request, 'Login successful!')
            # If there's a ?next= param, honour it; otherwise go to role dashboard
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect(_get_role_dashboard(user))
        else:
            messages.error(request, 'Invalid email or password')
    
    return render(request, 'bakery/login.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect(_get_role_dashboard(request.user))
    
    if request.method == 'POST':
        fullname = request.POST.get('fullname', '')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if User.objects.filter(username=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'bakery/signin.html')
        
        # Parse fullname
        name_parts = fullname.split() if fullname else []
        first_name = name_parts[0] if name_parts else ''
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        # Auto-create UserProfile with 'customer' role
        UserProfile.objects.get_or_create(user=user)
        login(request, user)
        messages.success(request, 'Account created successfully!')
        return redirect('index')
    
    return render(request, 'bakery/signin.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'Logged out successfully!')
    return redirect('index')


def forgot_password_view(request):
    """Show forgot password form and send reset email"""
    if request.user.is_authenticated:
        return redirect(_get_role_dashboard(request.user))

    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, 'No account found with that email address.')
            return render(request, 'bakery/forgot_password.html')

        # Generate secure token
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Build reset link
        reset_url = request.build_absolute_uri(
            f'/reset-password/{uid}/{token}/'
        )

        # Send reset email
        user_name = user.get_full_name() or user.email.split('@')[0]
        html_message = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #fffaf5; border-radius: 16px; overflow: hidden; border: 1px solid #f0e0cc;">
            <div style="background: linear-gradient(135deg, #d2691e 0%, #b8571e 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🍰 The Bake Story</h1>
                <p style="color: rgba(255,255,255,0.9); margin-top: 5px; font-size: 14px;">Password Reset Request</p>
            </div>
            <div style="padding: 30px;">
                <p style="color: #333; font-size: 16px;">Hi <strong>{user_name}</strong>,</p>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <a href="{reset_url}" style="background: linear-gradient(135deg, #d2691e 0%, #b8571e 100%); color: white; padding: 14px 40px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block;">Reset Password</a>
                </div>
                <p style="color: #888; font-size: 13px; line-height: 1.5;">If you didn't request this, you can safely ignore this email. This link will expire automatically.</p>
                <hr style="border: none; border-top: 1px solid #f0e0cc; margin: 20px 0;">
                <p style="color: #aaa; font-size: 12px; text-align: center;">The Bake Story &bull; Chaitanyapuri, Dilsukhnagar, Hyderabad</p>
            </div>
        </div>
        """
        try:
            from django.core.mail import send_mail
            send_mail(
                subject='Reset Your Password - The Bake Story',
                message=f'Hi {user_name}, reset your password here: {reset_url}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            messages.success(request, 'A password reset link has been sent to your email!')
        except Exception as e:
            print(f"❌ Email send failed: {e}")
            messages.error(request, 'Failed to send reset email. Please try again later.')

        return render(request, 'bakery/forgot_password.html')

    return render(request, 'bakery/forgot_password.html')


def reset_password_view(request, uidb64, token):
    """Validate token and allow user to set new password"""
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_decode

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        messages.error(request, 'This password reset link is invalid or has expired.')
        return redirect('forgot_password')

    if request.method == 'POST':
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')

        if len(password) < 6:
            messages.error(request, 'Password must be at least 6 characters long.')
            return render(request, 'bakery/reset_password.html', {'valid_link': True})

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'bakery/reset_password.html', {'valid_link': True})

        # set_password handles PBKDF2 hashing + salting automatically
        user.set_password(password)
        user.save()
        messages.success(request, 'Your password has been reset successfully! Please login with your new password.')
        return redirect('login')

    return render(request, 'bakery/reset_password.html', {'valid_link': True})


# Razorpay Integration - Initialize client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@login_required
def payment_view(request):
    if request.method == 'POST':
        cart_data = request.POST.get('cart_data')
        delivery_address = request.POST.get('delivery_address')
        delivery_phone = request.POST.get('delivery_phone')
        delivery_notes = request.POST.get('delivery_notes', '')
        order_type = request.POST.get('order_type', 'delivery')

        # Validate required fields
        if not all([cart_data, delivery_address, delivery_phone]):
            messages.error(request, 'Please fill all required fields.')
            return redirect('cart')

        try:
            # Process cart items
            order_items, total_amount, error = process_cart_items(cart_data)
            if error:
                messages.error(request, error)
                return redirect('cart')

            # Determine delivery fee
            delivery_fee = Decimal('50.00') if order_type == 'delivery' else Decimal('0.00')

            # Create order in database
            order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
            order = Order.objects.create(
                user=request.user,
                order_id=order_id,
                order_type=order_type,
                status='pending',
                total_amount=total_amount,
                delivery_fee=delivery_fee,
                delivery_address=delivery_address,
                delivery_phone=delivery_phone,
                delivery_notes=delivery_notes
            )

            # Create order items
            OrderItem.objects.bulk_create([
                OrderItem(
                    order=order,
                    menu_item=item['menu_item'],
                    quantity=item['quantity'],
                    price=item['price']
                ) for item in order_items
            ])

            # Create Razorpay order (amount in paise: ₹100 = 10000 paise)
            grand_total = Decimal(str(order.total_amount)) + Decimal(str(order.delivery_fee))
            razorpay_amount = int(float(grand_total) * 100)

            razorpay_order = razorpay_client.order.create({
                'amount': razorpay_amount,
                'currency': 'INR',
                'receipt': order_id,
                'payment_capture': '1'
            })

            # Store Razorpay order ID
            order.razorpay_order_id = razorpay_order['id']
            order.save()

            context = {
                'order': order,
                'razorpay_order_id': razorpay_order['id'],
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'amount': razorpay_amount,
                'currency': 'INR',
                'user_name': request.user.get_full_name() or request.user.username,
                'user_email': request.user.email,
                'user_phone': delivery_phone
            }
            return render(request, 'bakery/razorpay-payment.html', context)

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'Payment view error: {str(e)}', exc_info=True)
            messages.error(request, 'Error creating order. Please try again.')
            return redirect('cart')

    return render(request, 'bakery/payment.html')


@csrf_exempt
@login_required
def razorpay_callback(request):
    """Handle Razorpay payment verification"""
    if request.method == 'POST':
        try:
            # Get payment details
            payment_id = request.POST.get('razorpay_payment_id')
            order_id = request.POST.get('razorpay_order_id')
            signature = request.POST.get('razorpay_signature')
            
            # Verify signature
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            
            try:
                razorpay_client.utility.verify_payment_signature(params_dict)
                
                # Payment verified successfully
                order = Order.objects.get(razorpay_order_id=order_id)
                order.status = 'confirmed'
                order.save()
                
                # Create payment record
                Payment.objects.create(
                    order=order,
                    payment_method='razorpay',
                    payment_status='completed',
                    transaction_id=payment_id,
                    amount=order.grand_total
                )
                
                # Send order notifications (Email + SMS) after successful payment
                print(f"💳 Payment verified! Sending notifications for Order #{order.id}...")
                send_order_notification_email(order)
                send_order_sms_notification(order)
                
                messages.success(request, f'Payment successful! Order ID: {order.order_id}')
                return redirect('orders')
                
            except razorpay.errors.SignatureVerificationError:
                # Payment verification failed
                order = Order.objects.get(razorpay_order_id=order_id)
                order.status = 'cancelled'
                order.save()
                
                Payment.objects.create(
                    order=order,
                    payment_method='razorpay',
                    payment_status='failed',
                    transaction_id=payment_id,
                    amount=order.grand_total
                )
                
                messages.error(request, 'Payment verification failed! Order cancelled.')
                return redirect('cart')
                
        except Exception as e:
            messages.error(request, f'Payment error: {str(e)}')
            return redirect('cart')
    
    return redirect('index')


@csrf_exempt
def razorpay_webhook(request):
    """Handle Razorpay webhooks for automatic confirmation"""
    if request.method == 'POST':
        try:
            # Get webhook secret from environment (set in Razorpay dashboard)
            webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET', settings.RAZORPAY_KEY_SECRET)
            webhook_signature = request.headers.get('X-Razorpay-Signature')
            webhook_body = request.body
            
            # Verify webhook signature
            razorpay_client.utility.verify_webhook_signature(
                webhook_body.decode('utf-8'),
                webhook_signature,
                webhook_secret
            )
            
            # Process webhook event
            event_data = json.loads(webhook_body)
            event = event_data.get('event')
            
            if event == 'payment.captured':
                # Payment successful
                payment_entity = event_data['payload']['payment']['entity']
                order_id = payment_entity['notes'].get('order_id')
                
                if order_id:
                    order = Order.objects.get(razorpay_order_id=order_id)
                    order.status = 'confirmed'
                    order.save()
            
            elif event == 'payment.failed':
                # Payment failed
                payment_entity = event_data['payload']['payment']['entity']
                order_id = payment_entity['notes'].get('order_id')
                
                if order_id:
                    order = Order.objects.get(razorpay_order_id=order_id)
                    order.status = 'cancelled'
                    order.save()
            
            return JsonResponse({'status': 'ok'})
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'invalid method'}, status=405)


def send_sms_notification(contact_id, name, email, phone, message):
    """Placeholder for SMS notification (AWS SNS removed)"""
    print(f"📱 SMS notification (simulated): New contact from {name}")
    return False


def send_email_notification(contact_id, name, email, phone, message):
    """Send email notification for contact form submission"""
    try:
        if not settings.EMAIL_NOTIFICATIONS_ENABLED:
            print("📧 Email notifications disabled in settings")
            return False
            
        # Prepare email content
        subject = f'🍰 New Contact Form - {settings.BAKERY_NAME}'
        
        email_message = f"""
New contact form submission received!

📋 CONTACT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: {name}
📧 Email: {email}
📱 Phone: {phone if phone else 'Not provided'}
🕒 Submitted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🆔 Contact ID: {contact_id}

💬 MESSAGE:
{message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 QUICK ACTIONS:
• Reply to customer: {email}
• Call customer: {phone if phone else 'No phone provided'}
• View in admin: https://thebakestory.shop/admin/

This notification was sent automatically from {settings.BAKERY_NAME} website.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        """
        
        # Send email
        send_mail(
            subject=subject,
            message=email_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )
        
        print(f"✅ Email notification sent successfully!")
        print(f"📧 Sent to: {settings.ADMIN_EMAIL}")
        print(f"📋 Subject: {subject}")
        
        return True
        
    except Exception as e:
        print(f"❌ Email notification failed: {str(e)}")
        return False


def send_order_notification_email(order):
    """Send detailed order notification email using AWS SES"""
    try:
        if not settings.ORDER_EMAIL_NOTIFICATIONS_ENABLED:
            print("📧 Order email notifications disabled in settings")
            return False
            
        from django.core.mail import EmailMultiAlternatives
        
        # Get payment status safely
        try:
            payment_status = order.payment.payment_status.upper() if hasattr(order, 'payment') else 'PENDING'
        except:
            payment_status = 'PENDING'
        
        # Calculate order items details
        order_items = order.items.all()
        items_html = ""
        items_text = ""
        
        for item in order_items:
            item_total = item.quantity * item.price
            items_html += f"""
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">{item.menu_item.name}</td>
                    <td style="padding: 10px; text-align: center;">₹{item.price}</td>
                    <td style="padding: 10px; text-align: center;">{item.quantity}</td>
                    <td style="padding: 10px; text-align: right;">₹{item_total}</td>
                </tr>
            """
            items_text += f"• {item.menu_item.name} - ₹{item.price} x {item.quantity} = ₹{item_total}\n"
        
        # Email subject
        subject = f'🍰 NEW ORDER #{order.id} - {settings.BAKERY_BUSINESS_NAME}'
        
        # HTML Email template
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #d2691e; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }}
                .order-details {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #ddd; }}
                .customer-details {{ background: #e8f4f8; padding: 15px; margin: 15px 0; border-radius: 8px; }}
                .items-table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
                .items-table th {{ background: #d2691e; color: white; padding: 12px; text-align: left; }}
                .total-row {{ background: #fff2e6; font-weight: bold; }}
                .status {{ padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; background: #ffc107; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🍰 NEW ORDER RECEIVED!</h1>
                    <h2>Order #{order.id}</h2>
                </div>
                
                <div class="content">
                    <div class="order-details">
                        <h3>📋 Order Information</h3>
                        <p><strong>Order ID:</strong> #{order.id}</p>
                        <p><strong>Order Date:</strong> {order.created_at.strftime('%d %B %Y at %H:%M')}</p>
                        <p><strong>Status:</strong> <span class="status">{order.status.upper()}</span></p>
                        <p><strong>Payment Status:</strong> {payment_status}</p>
                        <p><strong>Razorpay Order ID:</strong> {order.razorpay_order_id or 'N/A'}</p>
                    </div>
                    
                    <div class="customer-details">
                        <h3>👤 Customer Details</h3>
                        <p><strong>Name:</strong> {order.user.first_name} {order.user.last_name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Phone:</strong> {order.delivery_phone}</p>
                        <p><strong>Delivery Address:</strong><br>{order.delivery_address}</p>
                        {f'<p><strong>Special Notes:</strong><br>{order.delivery_notes}</p>' if order.delivery_notes else ''}
                    </div>
                    
                    <div class="order-details">
                        <h3>🛒 Order Items</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style="text-align: center;">Price</th>
                                    <th style="text-align: center;">Quantity</th>
                                    <th style="text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items_html}
                                <tr class="total-row">
                                    <td colspan="3" style="padding: 15px; text-align: right;"><strong>Subtotal:</strong></td>
                                    <td style="padding: 15px; text-align: right;"><strong>₹{order.total_amount}</strong></td>
                                </tr>
                                <tr class="total-row">
                                    <td colspan="3" style="padding: 15px; text-align: right;"><strong>Delivery Fee:</strong></td>
                                    <td style="padding: 15px; text-align: right;"><strong>₹{order.delivery_fee}</strong></td>
                                </tr>
                                <tr class="total-row" style="background: #d2691e; color: white;">
                                    <td colspan="3" style="padding: 15px; text-align: right;"><strong>GRAND TOTAL:</strong></td>
                                    <td style="padding: 15px; text-align: right;"><strong>₹{order.grand_total}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fff; border-radius: 8px;">
                        <h3 style="color: #d2691e;">Next Steps:</h3>
                        <p>1. Confirm the order with the customer</p>
                        <p>2. Prepare the items for delivery/pickup</p>
                        <p>3. Update order status in admin panel</p>
                        <p>4. Send delivery updates to customer</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>This notification was sent automatically from {settings.BAKERY_BUSINESS_NAME} Order Management System</p>
                    <p>{settings.BAKERY_BUSINESS_ADDRESS} | {settings.BAKERY_BUSINESS_PHONE}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        text_message = f"""
🍰 NEW ORDER RECEIVED - {settings.BAKERY_BUSINESS_NAME}

ORDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Order ID: #{order.id}
📅 Date: {order.created_at.strftime('%d %B %Y at %H:%M')}
🔄 Status: {order.status.upper()}
💳 Payment: {payment_status}
🔑 Razorpay ID: {order.razorpay_order_id or 'N/A'}

👤 CUSTOMER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {order.user.first_name} {order.user.last_name}
Email: {order.user.email}
Phone: {order.delivery_phone}
Address: {order.delivery_address}
{f'Notes: {order.delivery_notes}' if order.delivery_notes else ''}

🛒 ORDER ITEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{items_text}
                                                    
Subtotal: ₹{order.total_amount}
Delivery Fee: ₹{order.delivery_fee}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAND TOTAL: ₹{order.grand_total}

📝 NEXT STEPS:
1. Confirm order with customer
2. Prepare items for delivery
3. Update order status in admin panel
4. Send delivery updates to customer

📞 Contact Customer: {order.delivery_phone}
📧 Email Customer: {order.user.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{settings.BAKERY_BUSINESS_NAME} | {settings.BAKERY_BUSINESS_ADDRESS}
Phone: {settings.BAKERY_BUSINESS_PHONE}
        """
        
        # Send email using standard Django mail
        send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.ORDER_NOTIFICATION_EMAIL],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Order notification email sent for Order #{order.id}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send order notification email: {str(e)}")
        return False


def send_order_sms_notification(order):
    """Placeholder for Order SMS notification (AWS SNS removed)"""
    print(f"📱 Order SMS notification (simulated) for Order #{order.id}")
    return False


@csrf_exempt
def submit_contact_form(request):
    """Handle contact form submissions by printing to console (AWS removed)"""
    if request.method == 'POST':
        try:
            # Get form data
            data = json.loads(request.body)
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            phone = data.get('phone', '').strip()
            message = data.get('message', '').strip()
            
            # Validate required fields
            if not name or not email or not message:
                return JsonResponse({
                    'success': False,
                    'error': 'Name, email, and message are required'
                }, status=400)
            
            # Generate unique contact ID
            contact_id = str(uuid.uuid4())
            
            print(f"✅ Contact form submitted - ID: {contact_id}")
            print(f"   Name: {name}, Email: {email}, Phone: {phone}")
            print(f"   Message: {message}")
            
            return JsonResponse({
                'success': True,
                'message': 'Thank you for your message! We will get back to you soon.',
                'contact_id': contact_id
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid request data'
            }, status=400)
            
        except Exception as e:
            print(f"❌ Unexpected error in contact form: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Unable to save your message. Please try again later.'
            }, status=500)
            return JsonResponse({
                'success': False,
                'error': 'An error occurred. Please try again later.'
            }, status=500)
    

# ═══════════════════════════════════════════════════════════
# ADMIN MANAGEMENT VIEWS
# ═══════════════════════════════════════════════════════════

@admin_required
def menu_management_view(request):
    """Admin: CRUD for menu items"""
    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'add':
            MenuItem.objects.create(
                name=request.POST.get('name'),
                description=request.POST.get('description', ''),
                price=request.POST.get('price'),
                category=request.POST.get('category'),
                image_url=request.POST.get('image_url', ''),
                available=request.POST.get('available') == 'on',
            )
            messages.success(request, 'Menu item added successfully!')

        elif action == 'edit':
            item = get_object_or_404(MenuItem, id=request.POST.get('item_id'))
            item.name = request.POST.get('name')
            item.description = request.POST.get('description', '')
            item.price = request.POST.get('price')
            item.category = request.POST.get('category')
            item.image_url = request.POST.get('image_url', '')
            item.available = request.POST.get('available') == 'on'
            item.save()
            messages.success(request, f'"{item.name}" updated successfully!')

        elif action == 'delete':
            item = get_object_or_404(MenuItem, id=request.POST.get('item_id'))
            name = item.name
            item.delete()
            messages.success(request, f'"{name}" deleted successfully!')

        return redirect('menu_management')

    items = MenuItem.objects.all().order_by('category', 'name')
    categories = MenuItem.CATEGORY_CHOICES
    return render(request, 'bakery/menu_management.html', {
        'items': items,
        'categories': categories,
    })


def send_driver_invite_email(user, temp_password, role='driver'):
    """Send invite email with login credentials to a newly created driver/admin."""
    try:
        if not settings.EMAIL_NOTIFICATIONS_ENABLED:
            print("📧 Email notifications disabled — skipping invite email")
            return False

        from django.core.mail import EmailMultiAlternatives

        role_label = role.capitalize()
        subject = f'🚀 Welcome to {settings.BAKERY_BUSINESS_NAME} — {role_label} Account Created'

        text_content = (
            f"Hi {user.first_name},\n\n"
            f"You've been invited as a {role_label} at {settings.BAKERY_BUSINESS_NAME}.\n\n"
            f"Your login credentials:\n"
            f"  Username: {user.username}\n"
            f"  Password: {temp_password}\n\n"
            f"Please change your password after first login.\n\n"
            f"— {settings.BAKERY_BUSINESS_NAME} Team"
        )

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; color: #333; line-height: 1.6; }}
                .container {{ max-width: 560px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #e8590c, #c2410c); color: #fff; padding: 28px; text-align: center; border-radius: 12px 12px 0 0; }}
                .header h1 {{ margin: 0; font-size: 22px; }}
                .body {{ background: #f8fafc; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none; }}
                .creds {{ background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 16px 0; }}
                .creds p {{ margin: 6px 0; font-size: 15px; }}
                .creds strong {{ color: #1e293b; }}
                .footer {{ text-align: center; color: #94a3b8; font-size: 13px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome, {user.first_name}!</h1>
                    <p style="margin:6px 0 0;opacity:0.9;">You've been added as a <strong>{role_label}</strong></p>
                </div>
                <div class="body">
                    <p>Hello <strong>{user.first_name}</strong>,</p>
                    <p>You've been invited to join <strong>{settings.BAKERY_BUSINESS_NAME}</strong> as a <strong>{role_label}</strong>. Here are your login credentials:</p>
                    <div class="creds">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Password:</strong> {temp_password}</p>
                    </div>
                    <p style="color:#e8590c;font-weight:600;">⚠️ Please change your password after your first login.</p>
                    <p>If you have any questions, contact us at <strong>{settings.BAKERY_BUSINESS_PHONE}</strong>.</p>
                    <div class="footer">
                        <p>— {settings.BAKERY_BUSINESS_NAME} Team<br>{settings.BAKERY_BUSINESS_ADDRESS}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        admin_email = getattr(settings, 'ADMIN_EMAIL', settings.EMAIL_HOST_USER)
        msg = EmailMultiAlternatives(subject, text_content, admin_email, [user.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        print(f"✅ Invite email sent to {user.email}")
        return True

    except Exception as e:
        print(f"❌ Failed to send invite email: {e}")
        return False


@admin_required
def user_management_view(request):
    """Admin: list and search users, invite new drivers/admins"""

    # Handle invite driver POST
    if request.method == 'POST' and request.POST.get('action') == 'invite_driver':
        email = request.POST.get('email', '').strip()
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        phone = request.POST.get('phone', '').strip()
        vehicle_number = request.POST.get('vehicle_number', '').strip()
        role = request.POST.get('role', 'driver')

        if not email or not first_name:
            messages.error(request, 'First name and email are required.')
            return redirect('user_management')

        if User.objects.filter(email=email).exists():
            messages.error(request, f'A user with email {email} already exists.')
            return redirect('user_management')

        # Generate username from email prefix
        username_base = email.split('@')[0].lower()
        username = username_base
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

        # Generate random temp password
        import string, secrets
        temp_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))

        # Create user
        new_user = User.objects.create_user(
            username=username,
            email=email,
            password=temp_password,
            first_name=first_name,
            last_name=last_name,
        )

        # Create/update profile
        profile, _ = UserProfile.objects.get_or_create(user=new_user)
        profile.role = role if role in dict(UserProfile.ROLE_CHOICES) else 'driver'
        if phone:
            profile.phone = phone
        if vehicle_number:
            profile.vehicle_number = vehicle_number
        profile.save()

        # Send invite email
        email_sent = send_driver_invite_email(new_user, temp_password, role=profile.role)

        role_label = profile.get_role_display()
        if email_sent:
            messages.success(request, f'{role_label} account created for {first_name} ({email}). Login credentials sent via email.')
        else:
            messages.warning(request, f'{role_label} account created for {first_name}. Email could not be sent — credentials: username={username}, password={temp_password}')

        return redirect('user_management')

    # GET — list users
    search = request.GET.get('search', '').strip()
    users = User.objects.all().select_related('profile').order_by('-date_joined')
    if search:
        users = users.filter(
            Q(username__icontains=search) |
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )
    
    admin_count = users.filter(profile__role='admin').count()
    driver_count = users.filter(profile__role='driver').count()
    customer_count = users.filter(profile__role='customer').count()
    
    return render(request, 'bakery/user_management.html', {
        'users': users, 
        'search': search,
        'admin_count': admin_count,
        'driver_count': driver_count,
        'customer_count': customer_count,
    })


@admin_required
def role_management_view(request):
    """Admin: assign/change roles"""
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        new_role = request.POST.get('role')
        if new_role in dict(UserProfile.ROLE_CHOICES):
            target_user = get_object_or_404(User, id=user_id)
            profile, _ = UserProfile.objects.get_or_create(user=target_user)
            profile.role = new_role
            profile.save()
            messages.success(request, f'Role for {target_user.email} changed to {profile.get_role_display()}')
        else:
            messages.error(request, 'Invalid role selected.')
        return redirect('role_management')

    users = User.objects.all().select_related('profile').order_by('-date_joined')
    roles = UserProfile.ROLE_CHOICES
    return render(request, 'bakery/role_management.html', {'users': users, 'roles': roles})


@admin_required
def payment_management_view(request):
    """Admin: list all payments"""
    status_filter = request.GET.get('status', '')
    payments = Payment.objects.all().select_related('order', 'order__user').order_by('-created_at')
    if status_filter:
        payments = payments.filter(payment_status=status_filter)
    return render(request, 'bakery/payment_management.html', {
        'payments': payments,
        'status_filter': status_filter,
    })


# ═══════════════════════════════════════════════════════════
# DRIVER VIEWS
# ═══════════════════════════════════════════════════════════

@driver_required
def driver_dashboard_view(request):
    """Driver: main dashboard with stats, today's deliveries, earnings summary."""
    today = timezone.now().date()
    driver = request.user

    # Today's assigned deliveries
    todays_orders = Order.objects.filter(
        assigned_driver=driver,
        created_at__date=today,
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    # Also show unassigned delivery orders ready for pickup
    unassigned_orders = Order.objects.filter(
        order_type='delivery',
        assigned_driver__isnull=True,
        status__in=['confirmed', 'preparing', 'ready'],
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    # Earnings today
    completed_today = Order.objects.filter(
        assigned_driver=driver,
        status='completed',
        delivered_at__date=today,
    )
    todays_earnings = completed_today.aggregate(
        total=Sum('delivery_fee')
    )['total'] or Decimal('0.00')
    completed_count = completed_today.count()

    pending_count = todays_orders.filter(
        status__in=['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way']
    ).count()

    context = {
        'todays_orders': todays_orders,
        'unassigned_orders': unassigned_orders,
        'todays_earnings': todays_earnings,
        'completed_count': completed_count,
        'pending_count': pending_count,
        'delivery_count': todays_orders.count(),
        'page_title': 'Dashboard',
    }
    return render(request, 'bakery/driver_dashboard.html', context)


@driver_required
def driver_orders_view(request):
    """Driver: all orders with status filtering."""
    driver = request.user
    status_filter = request.GET.get('status', 'all')

    orders = Order.objects.filter(
        assigned_driver=driver,
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    if status_filter and status_filter != 'all':
        orders = orders.filter(status=status_filter)

    # Also show unassigned orders for the driver to accept
    unassigned = Order.objects.filter(
        order_type='delivery',
        assigned_driver__isnull=True,
        status__in=['confirmed', 'preparing', 'ready'],
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    context = {
        'orders': orders,
        'unassigned_orders': unassigned,
        'status_filter': status_filter,
        'page_title': 'Orders',
    }
    return render(request, 'bakery/driver_orders.html', context)


@driver_required
def driver_map_view(request):
    """Driver: full Google Maps page with real-time navigation — Swiggy/Zomato style."""
    driver = request.user
    active_orders = Order.objects.filter(
        assigned_driver=driver,
        status__in=['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way'],
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    # Build delivery data for JavaScript
    deliveries = []
    for order in active_orders:
        items = [{'name': i.menu_item.name, 'qty': i.quantity, 'price': str(i.price)} for i in order.items.all()]
        customer_profile = UserProfile.objects.filter(user=order.user).first() if order.user else None
        deliveries.append({
            'order_id': order.order_id,
            'order_pk': order.id,
            'customer': order.user.get_full_name() if order.user else order.customer_name or 'Guest',
            'address': order.delivery_address or 'No address',
            'phone': order.delivery_phone or (customer_profile.phone if customer_profile else ''),
            'amount': str(order.grand_total),
            'delivery_fee': str(order.delivery_fee),
            'status': order.status,
            'status_display': order.get_status_display(),
            'items': items,
            'notes': order.delivery_notes or '',
            'created_at': order.created_at.strftime('%I:%M %p'),
        })

    # Get driver's current GPS location from DB
    driver_loc = DriverLocation.objects.filter(driver=driver).first()
    driver_location_json = json.dumps(
        {'lat': driver_loc.latitude, 'lng': driver_loc.longitude} if driver_loc else None
    )

    context = {
        'active_orders': active_orders,
        'deliveries_json': json.dumps(deliveries),
        'driver_location_json': driver_location_json,
        'page_title': 'Delivery Map',
    }
    return render(request, 'bakery/driver_map.html', context)


@driver_required
def driver_earnings_view(request):
    """Driver: earnings breakdown and history."""
    driver = request.user
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    def get_earnings(start_date, end_date=None):
        qs = Order.objects.filter(
            assigned_driver=driver,
            status='completed',
        )
        if end_date:
            qs = qs.filter(delivered_at__date__gte=start_date, delivered_at__date__lte=end_date)
        else:
            qs = qs.filter(delivered_at__date=start_date)
        agg = qs.aggregate(
            total=Sum('delivery_fee'),
            count=Count('id'),
        )
        return agg['total'] or Decimal('0.00'), agg['count'] or 0

    today_earnings, today_count = get_earnings(today)
    week_earnings, week_count = get_earnings(week_start, today)
    month_earnings, month_count = get_earnings(month_start, today)

    # Last 7 days earnings for chart
    daily_earnings = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        amount, count = get_earnings(day)
        daily_earnings.append({
            'date': day.strftime('%a'),
            'amount': float(amount),
            'count': count,
        })

    # Recent completed orders
    recent_deliveries = Order.objects.filter(
        assigned_driver=driver,
        status='completed',
    ).select_related('user').order_by('-delivered_at')[:20]

    context = {
        'today_earnings': today_earnings,
        'today_count': today_count,
        'week_earnings': week_earnings,
        'week_count': week_count,
        'month_earnings': month_earnings,
        'month_count': month_count,
        'daily_earnings_json': json.dumps(daily_earnings),
        'recent_deliveries': recent_deliveries,
        'page_title': 'Earnings',
    }
    return render(request, 'bakery/driver_earnings.html', context)


@driver_required
def driver_settings_view(request):
    """Driver: profile and settings management."""
    driver = request.user
    profile = UserProfile.objects.get_or_create(user=driver)[0]

    if request.method == 'POST':
        action = request.POST.get('action', '')

        if action == 'update_profile':
            driver.first_name = request.POST.get('first_name', driver.first_name)
            driver.last_name = request.POST.get('last_name', driver.last_name)
            driver.save()
            profile.phone = request.POST.get('phone', profile.phone)
            profile.vehicle_number = request.POST.get('vehicle_number', profile.vehicle_number)
            profile.address = request.POST.get('address', profile.address)
            profile.city = request.POST.get('city', profile.city)
            profile.save()
            messages.success(request, 'Profile updated successfully!')

        elif action == 'toggle_availability':
            profile.is_available = not profile.is_available
            profile.save()
            status = 'Online' if profile.is_available else 'Offline'
            messages.success(request, f'You are now {status}')

        return redirect('driver_settings')

    context = {
        'profile': profile,
        'page_title': 'Settings',
    }
    return render(request, 'bakery/driver_settings.html', context)


# ── Driver API Endpoints ──────────────────────────────────────────────────────

@driver_required
def driver_stats_api(request):
    """API: Return driver dashboard stats as JSON."""
    driver = request.user
    today = timezone.now().date()

    completed = Order.objects.filter(
        assigned_driver=driver, status__in=['delivered', 'completed'], delivered_at__date=today,
    )
    pending = Order.objects.filter(
        assigned_driver=driver, status__in=['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way'],
    )
    earnings = completed.aggregate(total=Sum('delivery_fee'))['total'] or 0

    return JsonResponse({
        'todays_earnings': float(earnings),
        'completed_count': completed.count(),
        'pending_count': pending.count(),
    })


@csrf_exempt
@driver_required
def driver_update_status_api(request):
    """API: Update order status from driver panel."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        data = request.POST

    order_id = data.get('order_id')
    new_status = data.get('status')
    action = data.get('action')  # accept, pickup, on_the_way, delivered

    if not order_id:
        return JsonResponse({'error': 'order_id required'}, status=400)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)

    now = timezone.now()

    if action == 'accept':
        order.assigned_driver = request.user
        order.status = 'confirmed'
        order.confirmed_at = now
    elif action == 'pickup':
        order.status = 'picked_up'
        order.picked_up_at = now
    elif action == 'on_the_way':
        order.status = 'on_the_way'
    elif action == 'delivered':
        order.status = 'delivered'
        order.delivered_at = now
        order.completed_at = now
    elif new_status:
        order.status = new_status
    else:
        return JsonResponse({'error': 'action or status required'}, status=400)

    order.save()

    # Return driver info for customer tracking
    driver_data = None
    if order.assigned_driver:
        profile = UserProfile.objects.filter(user=order.assigned_driver).first()
        driver_data = {
            'name': order.assigned_driver.get_full_name() or order.assigned_driver.username,
            'phone': profile.phone if profile else '',
            'vehicle_number': profile.vehicle_number if profile else '',
        }

    return JsonResponse({
        'success': True,
        'order_id': order.order_id,
        'new_status': order.status,
        'driver': driver_data,
    })


@csrf_exempt
@driver_required
def driver_location_api(request):
    """API: Receive and store driver GPS location in DB."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    lat = data.get('lat')
    lng = data.get('lng')
    heading = data.get('heading', 0)
    speed = data.get('speed', 0)

    if lat is None or lng is None:
        return JsonResponse({'error': 'lat and lng required'}, status=400)

    # Store in DriverLocation model
    loc, created = DriverLocation.objects.update_or_create(
        driver=request.user,
        defaults={
            'latitude': lat,
            'longitude': lng,
            'heading': heading,
            'speed': speed,
        }
    )

    return JsonResponse({'success': True, 'lat': lat, 'lng': lng})


@csrf_exempt
@driver_required
def driver_toggle_availability_api(request):
    """API: Toggle driver availability status."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    profile = UserProfile.objects.get_or_create(user=request.user)[0]
    profile.is_available = not profile.is_available
    profile.save()

    return JsonResponse({
        'success': True,
        'is_available': profile.is_available,
    })


# ══════════════════════════════════════════════════════════════
# TRACKING API ENDPOINTS  (Customer ↔ Driver real-time bridge)
# ══════════════════════════════════════════════════════════════

@csrf_exempt
@login_required
def tracking_data_api(request, order_id):
    """API: Customer polls this to get driver location + order status in real-time."""
    try:
        order = Order.objects.select_related('assigned_driver', 'payment').prefetch_related('items__menu_item').get(
            order_id=order_id, user=request.user
        )
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)

    # Driver info
    driver_data = None
    driver_location = None
    if order.assigned_driver:
        profile = UserProfile.objects.filter(user=order.assigned_driver).first()
        driver_data = {
            'id': order.assigned_driver.id,
            'name': order.assigned_driver.get_full_name() or order.assigned_driver.username,
            'phone': profile.phone if profile else '',
            'vehicle_number': profile.vehicle_number if profile else '',
            'initial': (order.assigned_driver.first_name or order.assigned_driver.username)[0].upper(),
        }
        # Get driver's real-time location
        loc = DriverLocation.objects.filter(driver=order.assigned_driver).first()
        if loc:
            driver_location = {
                'lat': loc.latitude,
                'lng': loc.longitude,
                'heading': loc.heading,
                'speed': loc.speed,
                'updated_at': loc.updated_at.isoformat(),
            }

    return JsonResponse({
        'success': True,
        'order_id': order.order_id,
        'status': order.status,
        'status_display': order.get_status_display(),
        'order_type': order.order_type,
        'delivery_address': order.delivery_address,
        'created_at': order.created_at.isoformat(),
        'confirmed_at': order.confirmed_at.isoformat() if order.confirmed_at else None,
        'ready_at': order.ready_at.isoformat() if order.ready_at else None,
        'picked_up_at': order.picked_up_at.isoformat() if order.picked_up_at else None,
        'delivered_at': order.delivered_at.isoformat() if order.delivered_at else None,
        'completed_at': order.completed_at.isoformat() if order.completed_at else None,
        'driver': driver_data,
        'driver_location': driver_location,
    })


@csrf_exempt
def available_delivery_orders_api(request):
    """API: Returns delivery orders that are ready and unassigned — for drivers to accept."""
    orders = Order.objects.filter(
        order_type='delivery',
        assigned_driver__isnull=True,
        status__in=['confirmed', 'preparing', 'ready'],
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at')

    orders_data = []
    for order in orders:
        items = [{'name': i.menu_item.name, 'qty': i.quantity, 'price': str(i.price)} for i in order.items.all()]
        orders_data.append({
            'order_id': order.order_id,
            'customer_name': order.user.get_full_name() if order.user else order.customer_name or 'Guest',
            'customer_phone': order.delivery_phone,
            'delivery_address': order.delivery_address,
            'total_amount': str(order.grand_total),
            'delivery_fee': str(order.delivery_fee),
            'items': items,
            'status': order.status,
            'created_at': order.created_at.isoformat(),
        })

    return JsonResponse({'success': True, 'orders': orders_data})


@csrf_exempt
@login_required
def driver_active_delivery_api(request):
    """API: Returns the driver's current active delivery with customer details."""
    if request.method != 'GET':
        return JsonResponse({'error': 'GET required'}, status=405)

    order = Order.objects.filter(
        assigned_driver=request.user,
        status__in=['confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way'],
    ).select_related('user').prefetch_related('items__menu_item').order_by('-created_at').first()

    if not order:
        return JsonResponse({'success': True, 'active_delivery': None})

    customer_profile = UserProfile.objects.filter(user=order.user).first() if order.user else None
    items = [{'name': i.menu_item.name, 'qty': i.quantity, 'price': str(i.price)} for i in order.items.all()]

    return JsonResponse({
        'success': True,
        'active_delivery': {
            'order_id': order.order_id,
            'status': order.status,
            'status_display': order.get_status_display(),
            'customer': {
                'name': order.user.get_full_name() if order.user else order.customer_name or 'Guest',
                'phone': order.delivery_phone or (customer_profile.phone if customer_profile else ''),
            },
            'delivery_address': order.delivery_address,
            'delivery_notes': order.delivery_notes,
            'total_amount': str(order.grand_total),
            'delivery_fee': str(order.delivery_fee),
            'items': items,
            'created_at': order.created_at.isoformat(),
            'picked_up_at': order.picked_up_at.isoformat() if order.picked_up_at else None,
        }
    })


# ═══════════════════════════════════════════════════════════════
#  SAVED ADDRESS APIs (Swiggy-style — max 2 per user)
# ═══════════════════════════════════════════════════════════════

@login_required
def get_saved_addresses_api(request):
    """Return the user's saved addresses (max 2)."""
    addresses = SavedAddress.objects.filter(user=request.user)[:2]
    data = []
    for addr in addresses:
        data.append({
            'id': addr.id,
            'label': addr.label,
            'house_flat': addr.house_flat,
            'area_street': addr.area_street,
            'landmark': addr.landmark,
            'city': addr.city,
            'pincode': addr.pincode,
            'latitude': addr.latitude,
            'longitude': addr.longitude,
            'full_address': addr.full_address,
            'is_default': addr.is_default,
        })
    return JsonResponse({'success': True, 'addresses': data})


@csrf_exempt
@login_required
def save_address_api(request):
    """Save or update a delivery address for the user (max 2 total)."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    address_id = data.get('id')  # if set, update existing
    house_flat = data.get('house_flat', '').strip()
    area_street = data.get('area_street', '').strip()
    landmark = data.get('landmark', '').strip()
    city = data.get('city', 'Hyderabad').strip()
    pincode = data.get('pincode', '').strip()
    label = data.get('label', 'home')
    lat = data.get('latitude')
    lng = data.get('longitude')
    is_default = data.get('is_default', False)

    if not house_flat or not area_street:
        return JsonResponse({'error': 'house_flat and area_street are required'}, status=400)

    # Max 2 addresses per user
    existing_count = SavedAddress.objects.filter(user=request.user).count()

    if address_id:
        try:
            addr = SavedAddress.objects.get(id=address_id, user=request.user)
        except SavedAddress.DoesNotExist:
            return JsonResponse({'error': 'Address not found'}, status=404)
    else:
        if existing_count >= 2:
            return JsonResponse({
                'error': 'Maximum 2 addresses allowed. Delete one to add a new address.',
                'limit_reached': True
            }, status=400)
        addr = SavedAddress(user=request.user)

    addr.house_flat = house_flat
    addr.area_street = area_street
    addr.landmark = landmark
    addr.city = city
    addr.pincode = pincode
    addr.label = label
    if lat is not None:
        addr.latitude = float(lat)
    if lng is not None:
        addr.longitude = float(lng)

    if is_default:
        SavedAddress.objects.filter(user=request.user).update(is_default=False)
        addr.is_default = True

    addr.save()
    return JsonResponse({'success': True, 'id': addr.id, 'full_address': addr.full_address})


@csrf_exempt
@login_required
def delete_address_api(request, address_id):
    """Delete a saved address."""
    if request.method != 'DELETE':
        return JsonResponse({'error': 'DELETE required'}, status=405)
    try:
        addr = SavedAddress.objects.get(id=address_id, user=request.user)
        addr.delete()
        return JsonResponse({'success': True})
    except SavedAddress.DoesNotExist:
        return JsonResponse({'error': 'Address not found'}, status=404)