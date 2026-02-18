from rest_framework import viewsets, status, filters, mixins, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Q, Sum, Count
from django.utils import timezone
from .models import MenuItem, Order, Payment, UserProfile
from .serializers import (
    MenuItemSerializer, OrderSerializer, PaymentSerializer, UserProfileSerializer,
    UserSerializer, UserRegistrationSerializer, OrderCreateSerializer, PaymentCreateSerializer
)


# Base Mixins for common functionality
class UserFilteredQuerySetMixin:
    """Mixin to filter queryset by user - non-admin users see only their own data"""
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            # Filter by user for non-admin
            if hasattr(queryset.model, 'user'):
                queryset = queryset.filter(user=self.request.user)
            elif self.basename == 'payment':
                queryset = queryset.filter(order__user=self.request.user)
            elif self.basename == 'userprofile':
                queryset = queryset.filter(user=self.request.user)
        return queryset


class StatusUpdateMixin:
    """Mixin for common status update operations"""
    
    def perform_status_update(self, instance, new_status, timestamp_field=None):
        """Generic method to update status and related timestamps"""
        instance.status = new_status
        if timestamp_field and not getattr(instance, timestamp_field):
            setattr(instance, timestamp_field, timezone.now())
        instance.save()
        return instance


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Menu Items with full CRUD operations
    - List/Retrieve: Available to all users
    - Create/Update/Delete: Admin only
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['category', 'name']
    
    def get_permissions(self):
        """Allow read operations for all, write operations for admin only"""
        permission_classes = [AllowAny] if self.action in ['list', 'retrieve', 'categories'] else [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filter available items for non-admin users and by category"""
        queryset = super().get_queryset()
        
        # Non-admin users see only available items
        if not self.request.user.is_staff:
            queryset = queryset.filter(available=True)
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get list of available categories"""
        categories = self.get_queryset().values_list('category', flat=True).distinct()
        return Response({'categories': list(categories)})
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def toggle_availability(self, request, pk=None):
        """Toggle item availability (admin only)"""
        item = self.get_object()
        item.available = not item.available
        item.save()
        return Response({'id': item.id, 'name': item.name, 'available': item.available})


class OrderViewSet(UserFilteredQuerySetMixin, StatusUpdateMixin, viewsets.ModelViewSet):
    """ViewSet for Orders with tracking and management"""
    queryset = Order.objects.select_related('user', 'payment').prefetch_related('items__menu_item')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filter by status if provided"""
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    
    def get_serializer_class(self):
        """Use different serializer for create action"""
        return OrderCreateSerializer if self.action == 'create' else OrderSerializer
    
    def create(self, request):
        """Create new order with items and payment"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancel an order (only if pending or confirmed)"""
        order = self.get_object()
        
        if order.status not in ['pending', 'confirmed']:
            return Response(
                {'error': f'Cannot cancel order in {order.status} status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_status_update(order, 'cancelled')
        
        # Update payment status if exists
        if hasattr(order, 'payment'):
            order.payment.payment_status = 'refunded'
            order.payment.save()
        
        return Response({
            'message': 'Order cancelled successfully',
            'order': self.get_serializer(order).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status or new_status not in [s[0] for s in Order.STATUS_CHOICES]:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        timestamp_map = {
            'confirmed': 'confirmed_at',
            'ready': 'ready_at',
            'completed': 'completed_at',
        }
        
        self.perform_status_update(order, new_status, timestamp_map.get(new_status))
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active orders"""
        orders = self.get_queryset().filter(status__in=['pending', 'confirmed', 'preparing', 'ready'])
        return Response(self.get_serializer(orders, many=True).data)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get order history (delivered/cancelled)"""
        orders = self.get_queryset().filter(status__in=['delivered', 'cancelled'])
        return Response(self.get_serializer(orders, many=True).data)


class PaymentViewSet(UserFilteredQuerySetMixin, viewsets.ModelViewSet):
    """ViewSet for Payment management"""
    queryset = Payment.objects.select_related('order', 'order__user')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    basename = 'payment'
    
    def get_serializer_class(self):
        """Use different serializer for create action"""
        return PaymentCreateSerializer if self.action == 'process' else PaymentSerializer
    
    @action(detail=False, methods=['post'])
    def process(self, request):
        """Process a payment for an order"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def mark_completed(self, request, pk=None):
        """Mark payment as completed (admin only)"""
        payment = self.get_object()
        payment.mark_as_completed()
        return Response({
            'message': 'Payment marked as completed',
            'payment': self.get_serializer(payment).data
        })


class UserProfileViewSet(UserFilteredQuerySetMixin, mixins.RetrieveModelMixin, 
                         mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """ViewSet for User Profile management - Read and Update only"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    basename = 'userprofile'
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user's profile"""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            return Response(self.get_serializer(profile).data)
        
        # PUT or PATCH
        serializer = self.get_serializer(profile, data=request.data, partial=request.method == 'PATCH')
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# Authentication API Views - Using function-based views for simplicity

@api_view(['POST'])
@permission_classes([AllowAny])
def register_api(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
        'message': 'Registration successful'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    """Login user and return auth token"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=email, password=password)
    if not user:
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
        'message': 'Login successful'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """Logout user by deleting auth token"""
    try:
        request.auth.delete()
        return Response({'message': 'Logged out successfully'})
    except Exception:
        return Response({'error': 'Logout failed'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def current_user_api(request):
    """Get or update current user information"""
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    
    # PUT or PATCH
    serializer = UserSerializer(request.user, data=request.data, partial=request.method == 'PATCH')
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats_api(request):
    """Get dashboard statistics for current user"""
    orders = Order.objects.filter(user=request.user)
    
    # Use aggregation for better performance
    stats_data = orders.aggregate(
        total_orders=Count('id'),
        pending_orders=Count('id', filter=Q(status='pending')),
        completed_orders=Count('id', filter=Q(status='delivered')),
        cancelled_orders=Count('id', filter=Q(status='cancelled')),
        total_spent=Sum('grand_total', filter=Q(status='delivered')) or 0
    )
    
    # Add recent orders
    recent_orders = orders.select_related('payment').prefetch_related('items__menu_item')[:5]
    stats_data['recent_orders'] = OrderSerializer(recent_orders, many=True).data
    
    return Response(stats_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_dashboard_stats_api(request):
    """Get real-time stats for admin dashboard"""
    from datetime import date, timedelta
    from decimal import Decimal
    
    today = date.today()
    
    # Active orders
    active_orders = Order.objects.filter(
        status__in=['pending', 'confirmed', 'preparing', 'ready']
    ).select_related('table', 'user').prefetch_related('items__menu_item').order_by('-created_at')
    
    # Today's orders
    today_orders = Order.objects.filter(created_at__date=today)
    
    # Yesterday's orders for comparison
    yesterday = today - timedelta(days=1)
    yesterday_orders = Order.objects.filter(created_at__date=yesterday)
    
    # Calculate today's revenue from all orders (not just completed)
    today_revenue = float(today_orders.aggregate(total=Sum('total_amount'))['total'] or 0)
    yesterday_revenue = float(yesterday_orders.aggregate(total=Sum('total_amount'))['total'] or 0)
    
    # Calculate percentage change
    revenue_change = 0
    if yesterday_revenue > 0:
        revenue_change = ((today_revenue - yesterday_revenue) / yesterday_revenue) * 100
    
    # Calculate average preparation time for completed orders
    completed_today = today_orders.filter(status__in=['completed', 'ready'])
    avg_time_minutes = 0
    if completed_today.exists():
        total_minutes = 0
        count = 0
        for order in completed_today:
            if order.confirmed_at and order.ready_at:
                time_diff = order.ready_at - order.confirmed_at
                total_minutes += time_diff.total_seconds() / 60
                count += 1
        if count > 0:
            avg_time_minutes = int(total_minutes / count)
    
    avg_time = f"{avg_time_minutes} min" if avg_time_minutes > 0 else "N/A"
    
    # Statistics
    stats = {
        'active_orders_count': active_orders.count(),
        'today_revenue': today_revenue,
        'yesterday_revenue': yesterday_revenue,
        'revenue_change': round(revenue_change, 1),
        'completed_today': today_orders.filter(status='completed').count(),
        'total_today': today_orders.count(),
        'avg_time': avg_time,
        'orders': []
    }
    
    # Serialize active orders
    for order in active_orders:
        order_data = {
            'id': order.id,
            'order_id': order.order_id,
            'order_type': order.order_type,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'created_at': order.created_at.strftime('%I:%M %p'),
            'table_number': order.table.table_number if order.table else None,
            'customer_name': order.customer_name or (order.user.username if order.user else 'Guest'),
            'customer_phone': order.customer_phone,
            'items': [
                {
                    'name': item.menu_item.name,
                    'quantity': item.quantity,
                    'price': float(item.price)
                }
                for item in order.items.all()
            ]
        }
        stats['orders'].append(order_data)
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def kitchen_orders_api(request):
    """Get real-time orders for kitchen portal"""
    from datetime import date
    
    today = date.today()
    
    # Active orders for kitchen
    active_orders = Order.objects.filter(
        status__in=['pending', 'confirmed', 'preparing', 'ready']
    ).select_related('table', 'user').prefetch_related('items__menu_item').order_by('created_at')
    
    # Counts by status
    stats = {
        'pending_count': active_orders.filter(status='pending').count(),
        'preparing_count': active_orders.filter(status='preparing').count(),
        'ready_count': active_orders.filter(status='ready').count(),
        'completed_today': Order.objects.filter(
            created_at__date=today,
            status='completed'
        ).count(),
        'orders': []
    }
    
    # Serialize orders
    for order in active_orders:
        order_data = {
            'id': order.id,
            'order_id': order.order_id,
            'order_number': order.order_id.split('-')[-1] if '-' in order.order_id else order.order_id,
            'order_type': order.order_type,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'created_at': order.created_at.strftime('%I:%M %p'),
            'time_ago': get_time_ago(order.created_at),
            'table_number': order.table.table_number if order.table else None,
            'customer_name': order.customer_name or (order.user.username if order.user else 'Guest'),
            'customer_phone': order.customer_phone,
            'customer_email': order.customer_email,
            'delivery_address': order.delivery_address,
            'special_instructions': order.special_instructions,
            'items': [
                {
                    'name': item.menu_item.name,
                    'quantity': item.quantity,
                    'price': float(item.price)
                }
                for item in order.items.all()
            ]
        }
        stats['orders'].append(order_data)
    
    return Response(stats)


def get_time_ago(dt):
    """Helper to get human-readable time difference"""
    from django.utils import timezone
    diff = timezone.now() - dt
    
    if diff.seconds < 60:
        return f'{diff.seconds}s ago'
    elif diff.seconds < 3600:
        return f'{diff.seconds // 60}m ago'
    elif diff.seconds < 86400:
        return f'{diff.seconds // 3600}h ago'
    else:
        return f'{diff.days}d ago'


@api_view(['POST'])
@permission_classes([AllowAny])
def update_order_status_api(request, order_id):
    """Update order status - for kitchen/admin"""
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    
    new_status = request.data.get('status')
    
    if not new_status or new_status not in [s[0] for s in Order.STATUS_CHOICES]:
        return Response({'error': 'Invalid status'}, status=400)
    
    order.status = new_status
    
    # Update timestamps
    if new_status == 'confirmed' and not order.confirmed_at:
        order.confirmed_at = timezone.now()
    elif new_status == 'ready' and not order.ready_at:
        order.ready_at = timezone.now()
    elif new_status == 'completed' and not order.completed_at:
        order.completed_at = timezone.now()
    
    order.save()
    
    return Response({
        'success': True,
        'message': f'Order {order.order_id} updated to {new_status}',
        'order': {
            'id': order.id,
            'order_id': order.order_id,
            'status': order.status
        }
    })
