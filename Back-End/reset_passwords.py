#!/usr/bin/env python
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Back_End.settings')
django.setup()

from django.contrib.auth.models import User

# Reset password for admin user
try:
    admin_user = User.objects.get(username='admin')
    admin_user.set_password('admin123')
    admin_user.save()
    print("Password reset for 'admin' user. New password: admin123")
except User.DoesNotExist:
    print("Admin user not found")

# Reset password for anazil user
try:
    anazil_user = User.objects.get(username='anazil')
    anazil_user.set_password('anazil123')
    anazil_user.save()
    print("Password reset for 'anazil' user. New password: anazil123")
except User.DoesNotExist:
    print("Anazil user not found")

print("\nYou can now login with:")
print("Username: admin, Password: admin123")
print("Username: anazil, Password: anazil123")
print("Username: debuguser, Password: debug123")