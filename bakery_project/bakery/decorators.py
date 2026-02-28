"""
Role-based access control decorators for the bakery app.
"""
from functools import wraps
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def _ensure_profile(user):
    """Get or create a UserProfile for the user, defaulting to 'customer'."""
    from .models import UserProfile
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile


def role_required(*allowed_roles):
    """
    Decorator that restricts access to users with specific roles.
    Usage: @role_required('admin')  or  @role_required('admin', 'driver')
    """
    def decorator(view_func):
        @wraps(view_func)
        @login_required(login_url='login')
        def wrapper(request, *args, **kwargs):
            profile = _ensure_profile(request.user)
            if profile.role in allowed_roles or request.user.is_superuser:
                return view_func(request, *args, **kwargs)
            messages.error(request, 'You do not have permission to access this page.')
            return redirect('index')
        return wrapper
    return decorator


def admin_required(view_func):
    """Shortcut decorator: only allow admin role (or superusers)."""
    @wraps(view_func)
    @login_required(login_url='login')
    def wrapper(request, *args, **kwargs):
        profile = _ensure_profile(request.user)
        if profile.role == 'admin' or request.user.is_superuser:
            return view_func(request, *args, **kwargs)
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('index')
    return wrapper


def driver_required(view_func):
    """Shortcut decorator: only allow driver role (or superusers)."""
    @wraps(view_func)
    @login_required(login_url='login')
    def wrapper(request, *args, **kwargs):
        profile = _ensure_profile(request.user)
        if profile.role == 'driver' or request.user.is_superuser:
            return view_func(request, *args, **kwargs)
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('index')
    return wrapper
