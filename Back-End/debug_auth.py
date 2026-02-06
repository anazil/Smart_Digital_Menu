#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Back_End.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Check if there are any users
print("=== Users in database ===")
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}, Email: {user.email}, Active: {user.is_active}")

print(f"\nTotal users: {users.count()}")

# Test authentication with a sample user
if users.exists():
    sample_user = users.first()
    print(f"\n=== Testing authentication for: {sample_user.username} ===")
    
    # Try to authenticate (this will fail because we don't know the password)
    # But we can check if the user exists and is active
    print(f"User is active: {sample_user.is_active}")
    print(f"User has usable password: {sample_user.has_usable_password()}")
    
    # Let's try creating a test user with known credentials
    test_username = "testuser"
    test_password = "testpass123"
    
    # Delete if exists
    User.objects.filter(username=test_username).delete()
    
    # Create test user
    test_user = User.objects.create_user(
        username=test_username,
        password=test_password,
        email="test@example.com"
    )
    print(f"\nCreated test user: {test_username}")
    
    # Test authentication
    auth_result = authenticate(username=test_username, password=test_password)
    if auth_result:
        print("✅ Authentication successful!")
    else:
        print("❌ Authentication failed!")
        
    # Test with wrong password
    auth_result_wrong = authenticate(username=test_username, password="wrongpass")
    if auth_result_wrong:
        print("❌ Wrong password authenticated (this shouldn't happen)")
    else:
        print("✅ Wrong password correctly rejected")

else:
    print("No users found in database. Creating a test user...")
    test_user = User.objects.create_user(
        username="admin",
        password="admin123",
        email="admin@example.com"
    )
    print("Created test user: admin / admin123")