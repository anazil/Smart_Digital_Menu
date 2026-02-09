from django.db import models
from django.utils import timezone
from datetime import timedelta
import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10, default='🍽️')  # Emoji icon
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ("user", "name")
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Table(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tables")
    table_number = models.PositiveIntegerField()
    qr_code = models.ImageField(upload_to='qr_codes', blank=True)
    class Meta:
        unique_together = ("user", "table_number")
    def save(self, *args, **kwargs):
        if not self.qr_code:
            qr_data = f"https://cliqeat.vercel.app/table/{self.table_number}/{self.user.id}"  
            qr_img = qrcode.make(qr_data)
            buffer = BytesIO()
            qr_img.save(buffer, format='PNG')
            filename = f"table_{self.table_number}_qr.png"
            self.qr_code.save(filename, File(buffer), save=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Table {self.table_number}"

class MenuItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="menu_items") 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="menu_items", null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.FloatField()
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Ready', 'Ready'),
        ('Served', 'Served'),
        ('Completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_amount = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    estimated_ready_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Order {self.id} - Table {self.table.table_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField()  

    def __str__(self):
        return f"{self.menu_item.name} x{self.quantity}"
