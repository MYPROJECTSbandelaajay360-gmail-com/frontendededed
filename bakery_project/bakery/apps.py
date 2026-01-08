from django.apps import AppConfig
from django.db.models.signals import post_migrate
import os

def initialize_chatbot(sender, **kwargs):
    """Initialize the chatbot after migrations"""
    from .chatbot_views import get_chatbot
    
    # Check for a flag to prevent re-initialization during tests or other commands
    if os.environ.get('RUN_MAIN') or os.environ.get('WEBSERVER_WORKER'):
        print("🚀 Initializing chatbot...")
        try:
            get_chatbot()
            print("✅ Chatbot initialized successfully.")
        except Exception as e:
            print(f"⚠️ Error initializing chatbot: {e}")
            # Depending on the severity, you might want to raise the exception
            # raise e


class BakeryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bakery'

    def ready(self):
        # Connect the signal handler for post_migrate
        post_migrate.connect(initialize_chatbot, sender=self)
