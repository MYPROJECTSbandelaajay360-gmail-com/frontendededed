
import os
import django
from django.urls import get_resolver

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bakery_project.settings')
django.setup()

def list_urls(patterns, prefix=''):
    for entry in patterns:
        path = prefix + str(entry.pattern)
        if hasattr(entry, 'url_patterns'):
            list_urls(entry.url_patterns, path)
        else:
            print(f"{path} -> {entry.name}")

list_urls(get_resolver().url_patterns)
