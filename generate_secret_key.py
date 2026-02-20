#!/usr/bin/env python3
"""
Generate a new Django SECRET_KEY for production use.
Run: python generate_secret_key.py
"""

import secrets
import string

def generate_secret_key(length=50):
    """Generate a random secret key suitable for Django."""
    chars = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(chars) for _ in range(length))

if __name__ == '__main__':
    secret_key = generate_secret_key()
    print("=" * 60)
    print("Generated Django SECRET_KEY:")
    print("=" * 60)
    print(secret_key)
    print("=" * 60)
    print("\nCopy this key to your .env file:")
    print(f"SECRET_KEY={secret_key}")
    print("\nKeep this secret and never commit it to version control!")
    print("=" * 60)
