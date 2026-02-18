from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import os
from bakery import views as bakery_views

urlpatterns = [
    path('admin/dashboard/', bakery_views.admin_dashboard_view, name='admin_dashboard'),
    path('admin/', admin.site.urls),
    path('api/', include('bakery.api_urls')),
    # Django template URLs
    path('', include('bakery.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
