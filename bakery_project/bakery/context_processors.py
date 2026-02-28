"""
Template context processors for role-based access.
Injects user_role and GOOGLE_MAPS_API_KEY into every template context.
"""
from django.conf import settings


def user_role(request):
    """Add user_role to template context."""
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            return {'user_role': profile.role}
        except Exception:
            # User has no profile yet — auto-create one
            from .models import UserProfile
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            return {'user_role': profile.role}
    return {'user_role': None}


def google_maps_key(request):
    """Expose Google Maps API key and bakery location to all templates."""
    return {
        'GOOGLE_MAPS_API_KEY': getattr(settings, 'GOOGLE_MAPS_API_KEY', ''),
        'BAKERY_LAT': getattr(settings, 'BAKERY_LOCATION_LAT', 17.3616),
        'BAKERY_LNG': getattr(settings, 'BAKERY_LOCATION_LNG', 78.5267),
        'BAKERY_ADDRESS': getattr(settings, 'BAKERY_BUSINESS_ADDRESS', 'Chaitanyapuri, Dilsukhnagar, Hyderabad'),
    }
