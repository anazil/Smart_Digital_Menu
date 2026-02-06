#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Back_End.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Test authentication with existing user
print("Testing authentication with existing user 'admin'...")

# Try different common passwords
test_passwords = ['admin', 'admin123', 'password', '123456', 'admin@123']

for password in test_passwords:
    auth_result = authenticate(username='admin', password=password)
    if auth_result:
        print(f"SUCCESS: admin authenticated with password: {password}")
        break
    else:
        print(f"FAILED: admin with password: {password}")

# Create a new test user with known credentials
print("\nCreating new test user...")
User.objects.filter(username='debuguser').delete()

test_user = User.objects.create_user(
    username='debuguser',
    password='debug123',
    email='debug@example.com'
)

# Test the new user
auth_result = authenticate(username='debuguser', password='debug123')
if auth_result:
    print("SUCCESS: debuguser authenticated correctly")
else:
    print("FAILED: debuguser authentication failed")

print("\nTest completed. Try logging in with:")
print("Username: debuguser")
print("Password: debug123")