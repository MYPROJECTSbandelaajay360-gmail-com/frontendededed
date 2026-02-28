from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('menu/', views.menu_view, name='menu'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.cart_view, name='checkout'),
    path('orders/', views.orders_view, name='orders'),
    path('orders/<str:order_id>/', views.order_detail_view, name='order_detail'),
    path('orders/<str:order_id>/track/', views.track_order_view, name='track_order'),

    path('payment/', views.payment_view, name='payment'),
    path('upi-payment/', views.upi_payment_view, name='upi_payment'),
    path('razorpay/callback/', views.razorpay_callback, name='razorpay_callback'),
    path('razorpay/webhook/', views.razorpay_webhook, name='razorpay_webhook'),
    path('api/submit-contact/', views.submit_contact_form, name='submit_contact'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('reset-password/<uidb64>/<token>/', views.reset_password_view, name='reset_password'),
    path('bot/', views.chatbot_view, name='chatbot'),  # Old chatbot page
    
    # New Premium Café URLs
    path('qr-landing/', views.qr_landing_view, name='qr_landing'),
    path('order-assistant/', views.chatbot_order_view, name='chatbot_order'),
    path('kitchen/', views.kitchen_portal_view, name='kitchen_portal'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    
    # Admin API endpoints
    path('api/admin/stats/', views.admin_stats_api, name='admin_stats'),

    # Admin Management Panel
    path('admin-panel/menu/', views.menu_management_view, name='menu_management'),
    path('admin-panel/users/', views.user_management_view, name='user_management'),
    path('admin-panel/roles/', views.role_management_view, name='role_management'),
    path('admin-panel/payments/', views.payment_management_view, name='payment_management'),

    # Driver Pages
    path('driver/dashboard/', views.driver_dashboard_view, name='driver_dashboard'),
    path('driver/orders/', views.driver_orders_view, name='driver_orders'),
    path('driver/map/', views.driver_map_view, name='driver_map'),
    path('driver/earnings/', views.driver_earnings_view, name='driver_earnings'),
    path('driver/settings/', views.driver_settings_view, name='driver_settings'),

    # Driver API
    path('driver/api/stats/', views.driver_stats_api, name='driver_stats_api'),
    path('driver/api/update-status/', views.driver_update_status_api, name='driver_update_status'),
    path('driver/api/update-location/', views.driver_location_api, name='driver_location'),
    path('driver/api/toggle-availability/', views.driver_toggle_availability_api, name='driver_toggle_availability'),
    path('driver/api/active-delivery/', views.driver_active_delivery_api, name='driver_active_delivery'),

    # Tracking APIs  (Customer ↔ Driver real-time bridge)
    path('api/tracking/<str:order_id>/', views.tracking_data_api, name='tracking_data'),
    path('api/available-delivery-orders/', views.available_delivery_orders_api, name='available_delivery_orders'),

    # Saved Address APIs
    path('api/addresses/', views.get_saved_addresses_api, name='get_saved_addresses'),
    path('api/addresses/save/', views.save_address_api, name='save_address'),
    path('api/addresses/<int:address_id>/delete/', views.delete_address_api, name='delete_address'),
]
