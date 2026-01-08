from django.contrib import admin
from .models import MenuItem, Order, OrderItem, Payment, UserProfile, Table


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    """Admin interface for Tables"""
    list_display = ['table_number', 'capacity', 'location', 'is_active', 'created_at']
    list_filter = ['is_active', 'capacity']
    search_fields = ['table_number', 'location']
    list_editable = ['is_active']
    readonly_fields = ['qr_code', 'qr_code_url', 'created_at']
    
    fieldsets = (
        ('Table Information', {
            'fields': ('table_number', 'capacity', 'location', 'is_active')
        }),
        ('QR Code', {
            'fields': ('qr_code', 'qr_code_url'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['generate_qr_codes']
    
    def generate_qr_codes(self, request, queryset):
        """Generate QR codes for selected tables"""
        base_url = request.build_absolute_uri('/qr-landing/')
        count = 0
        for table in queryset:
            table.generate_qr_code(base_url)
            count += 1
        self.message_user(request, f'Generated QR codes for {count} tables')
    generate_qr_codes.short_description = "Generate QR codes for selected tables"


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    """Admin interface for Menu Items with full management"""
    list_display = ['name', 'category', 'price', 'available', 'created_at']
    list_filter = ['category', 'available', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['available', 'price']
    ordering = ['category', 'name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'available')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class OrderItemInline(admin.TabularInline):
    """Inline display of order items within orders"""
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']
    fields = ['menu_item', 'quantity', 'price', 'subtotal']


class PaymentInline(admin.StackedInline):
    """Inline display of payment within orders"""
    model = Payment
    extra = 0
    readonly_fields = ['transaction_id', 'created_at', 'updated_at', 'paid_at', 'payment_screenshot_preview']
    fields = ['payment_method', 'payment_status', 'transaction_id', 'amount', 
              'upi_id', 'payment_screenshot', 'payment_screenshot_preview', 'verification_notes', 'created_at', 'paid_at']
    
    def payment_screenshot_preview(self, obj):
        if obj.payment_screenshot:
            return f'<img src="{obj.payment_screenshot.url}" style="max-width: 200px; max-height: 150px;">'
        return "No screenshot uploaded"
    payment_screenshot_preview.allow_tags = True
    payment_screenshot_preview.short_description = 'Screenshot Preview'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin interface for Orders with comprehensive tracking"""
    list_display = ['order_id', 'user', 'status', 'total_amount', 'delivery_fee', 
                    'grand_total', 'created_at']
    list_filter = ['status', 'created_at', 'confirmed_at', 'completed_at']
    search_fields = ['order_id', 'user__username', 'user__email', 'delivery_phone']
    list_editable = ['status']
    ordering = ['-created_at']
    readonly_fields = ['order_id', 'grand_total', 'created_at', 'updated_at', 
                      'confirmed_at', 'ready_at', 'completed_at']
    inlines = [OrderItemInline, PaymentInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_id', 'user', 'status', 'order_type', 'table')
        }),
        ('Customer Info', {
            'fields': ('customer_name', 'customer_phone', 'customer_email'),
            'classes': ('collapse',)
        }),
        ('Pricing', {
            'fields': ('total_amount', 'delivery_fee', 'grand_total')
        }),
        ('Delivery & Notes', {
            'fields': ('delivery_address', 'delivery_phone', 'delivery_notes', 'special_instructions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'confirmed_at', 'ready_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_confirmed', 'mark_as_preparing', 'mark_as_ready', 
               'mark_as_completed', 'mark_as_cancelled']
    
    def mark_as_confirmed(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='confirmed', confirmed_at=timezone.now())
        self.message_user(request, f'{updated} orders marked as confirmed')
    mark_as_confirmed.short_description = 'Mark selected orders as Confirmed'
    
    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status='preparing')
        self.message_user(request, f'{updated} orders marked as preparing')
    mark_as_preparing.short_description = 'Mark selected orders as Preparing'
    
    def mark_as_ready(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='ready', ready_at=timezone.now())
        self.message_user(request, f'{updated} orders marked as ready')
    mark_as_ready.short_description = 'Mark selected orders as Ready'
    
    def mark_as_completed(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='completed', completed_at=timezone.now())
        self.message_user(request, f'{updated} orders marked as completed')
    mark_as_completed.short_description = 'Mark selected orders as Completed'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} orders marked as cancelled')
    mark_as_cancelled.short_description = 'Mark selected orders as Cancelled'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment management"""
    list_display = ['transaction_id', 'order', 'payment_method', 'payment_status', 
                    'amount', 'has_screenshot', 'created_at']
    list_filter = ['payment_method', 'payment_status', 'created_at', 'paid_at']
    search_fields = ['transaction_id', 'order__order_id', 'upi_id']
    list_editable = ['payment_status']
    ordering = ['-created_at']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at', 'paid_at', 'payment_screenshot_preview']
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('order', 'transaction_id', 'payment_method', 'payment_status', 'amount')
        }),
        ('Payment Details', {
            'fields': ('upi_id', 'card_last4', 'payment_response')
        }),
        ('Payment Verification', {
            'fields': ('payment_screenshot', 'payment_screenshot_preview', 'verification_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_completed', 'mark_as_failed', 'mark_as_refunded']
    
    def has_screenshot(self, obj):
        return bool(obj.payment_screenshot)
    has_screenshot.boolean = True
    has_screenshot.short_description = 'Screenshot'
    
    def payment_screenshot_preview(self, obj):
        if obj.payment_screenshot:
            return f'<img src="{obj.payment_screenshot.url}" style="max-width: 300px; max-height: 200px; border: 1px solid #ddd; border-radius: 5px;">'
        return "No screenshot uploaded"
    payment_screenshot_preview.allow_tags = True
    payment_screenshot_preview.short_description = 'Screenshot Preview'
    
    def mark_as_completed(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(payment_status='completed', paid_at=timezone.now())
        self.message_user(request, f'{updated} payments marked as completed')
    mark_as_completed.short_description = 'Mark selected payments as Completed'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(payment_status='failed')
        self.message_user(request, f'{updated} payments marked as failed')
    mark_as_failed.short_description = 'Mark selected payments as Failed'
    
    def mark_as_refunded(self, request, queryset):
        updated = queryset.update(payment_status='refunded')
        self.message_user(request, f'{updated} payments marked as refunded')
    mark_as_refunded.short_description = 'Mark selected payments as Refunded'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for User Profiles"""
    list_display = ['user', 'phone', 'city', 'state', 'created_at']
    list_filter = ['city', 'state', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'city']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'phone')
        }),
        ('Address Details', {
            'fields': ('address', 'city', 'state', 'pincode')
        }),
        ('Preferences', {
            'fields': ('default_delivery_address',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
