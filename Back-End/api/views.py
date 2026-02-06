from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer


from .models import Table, MenuItem, Order, OrderItem, Category
from .serializers import MenuItemSerializer, OrderSerializer, TableSerializer, CategorySerializer

@api_view(['GET'])
def menu_list(request):
    menu = MenuItem.objects.filter(available=True)
    serializer = MenuItemSerializer(menu, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_order(request):
    data = request.data
    table_id = data.get("table_id")
    table_number = data.get("table_number")
    user_id = data.get("user_id")
    items = data.get("items", [])

    if not table_id and not table_number:
        return Response({"error": "table_id or table_number required"}, status=status.HTTP_400_BAD_REQUEST)

    if not items:
        return Response({"error": "Order must contain items"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if table_id:
            table = Table.objects.get(id=table_id)
        else:
            table = Table.objects.get(table_number=table_number,user_id=user_id)
    except Table.DoesNotExist:
        return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)

    total_amount = 0
    for it in items:
        try:
            menu_item = MenuItem.objects.get(id=it['id'])
        except MenuItem.DoesNotExist:
            return Response({"error": f"MenuItem {it['id']} not found"}, status=status.HTTP_400_BAD_REQUEST)
        qty = int(it.get('quantity', 1))
        total_amount += menu_item.price * qty

    # Create order
    order = Order.objects.create(table=table, total_amount=total_amount,user=table.user)
    est_minutes = int(data.get('estimated_minutes', 15))
    order.estimated_ready_at = timezone.now() + timedelta(minutes=est_minutes)
    order.save()

    # Create order items
    for it in items:
        menu_item = MenuItem.objects.get(id=it['id'])
        qty = int(it.get('quantity', 1))
        OrderItem.objects.create(order=order, menu_item=menu_item, quantity=qty, price=menu_item.price)

    serializer = OrderSerializer(order)
    return Response({"message": "Order placed", "order": serializer.data}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def order_status(request, order_id):
   
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(['POST'])
def add_menu_item(request):
    user_id = request.data.get("user_id")
    category_id = request.data.get("category_id")
    
    if not category_id:
        return Response({"error": "category_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        category = Category.objects.get(id=category_id, user_id=user_id)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = MenuItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_id=user_id, category=category)
        return Response({
            "message": "Menu item added successfully",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Category Management
@api_view(['GET'])
def get_categories(request, user_id):
    categories = Category.objects.filter(user_id=user_id)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_category(request):
    user_id = request.data.get("user_id")
    name = request.data.get("name")
    icon = request.data.get("icon", "🍽️")
    
    if not user_id or not name:
        return Response({"error": "user_id and name are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if Category.objects.filter(user=user, name=name).exists():
        return Response({"error": "Category already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    category = Category.objects.create(user=user, name=name, icon=icon)
    serializer = CategorySerializer(category)
    return Response({
        "message": "Category added successfully",
        "data": serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def delete_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if category has menu items
    if category.menu_items.exists():
        return Response({"error": "Cannot delete category with existing menu items"}, status=status.HTTP_400_BAD_REQUEST)
    
    category.delete()
    return Response({"message": "Category deleted successfully"})





# ---admin_side--

@api_view(['GET'])
def all_menu_items(request,user_id):
    menu = MenuItem.objects.filter(user_id=user_id)
    serializer = MenuItemSerializer(menu, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_menu_item(request, item_id):
    try:
        menu_item = MenuItem.objects.get(id=item_id)
    except MenuItem.DoesNotExist:
        return Response({"error": "Menu item not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_menu_item(request, item_id):
    try:
        menu_item = MenuItem.objects.get(id=item_id)
    except MenuItem.DoesNotExist:
        return Response({"error": "Menu item not found"}, status=status.HTTP_404_NOT_FOUND)

    menu_item.delete()
    return Response({"message": "Menu item deleted successfully"})



# --Table--

@api_view(['POST'])
def add_table(request):
    user_id = request.data.get("user_id")
    table_number = request.data.get("table_number")

    if not user_id or not table_number:
        return Response({"error": "user_id and table_number are required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Prevent duplicate table
    if Table.objects.filter(user=user, table_number=table_number).exists():
        return Response(
            {"table_number": ["Table number already exists for this user"]},
            status=400
        )

    table = Table.objects.create(
        user=user,
        table_number=table_number
    )

    return Response({
        "id": table.id,
        "table_number": table.table_number,
        "qr_code": table.qr_code.url
    }, status=201)


@api_view(['GET'])
def all_tables(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    tables = Table.objects.filter(user_id=user_id)
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_table(request, table_id):
    try:
        table = Table.objects.get(id=table_id)
    except Table.DoesNotExist:
        return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)

    table.delete()
    return Response({"message": "Table deleted successfully"}, status=status.HTTP_200_OK)





# ----Kitchenside--

# --- Kitchen Side ---

@api_view(['GET'])
def all_orders(request):
    user_id = request.query_params.get('user_id')  
    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    orders = Order.objects.filter(user_id=user_id).exclude(status='Completed').order_by('-created_at')   
    serializer = OrderSerializer(orders, many=True) 
    return Response(serializer.data)


@api_view(['PATCH'])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get("status")
    if new_status not in ["Pending", "Preparing", "Ready", "Served", "Completed"]:
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save()
    return Response({"message": "Order status updated", "status": order.status})


# -- hall screen

@api_view(['GET'])
def hall_orders(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    active_orders = Order.objects.filter(user_id=user_id).exclude(status='Completed').order_by('-created_at')
    serializer = OrderSerializer(active_orders, many=True)
    return Response(serializer.data)



# ---Auth---
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "message": "User registered successfully!",
            "token": token.key,
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    
    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)

    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "message": "Login successful!",
            "token": token.key,
            "user": UserSerializer(user).data
        })
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)



#razorpay

import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def create_payment_order(request):
    amount = request.data.get("amount")

    if not amount:
        return Response({"error": "Amount is required"}, status=400)

    amount_paise = int(float(amount) * 100)

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    payment = client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "payment_capture": 1
    })

    return Response(payment)

# download bill pdf using reportlab
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table as PDFTable, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from django.http import HttpResponse

@api_view(['GET'])
def download_bill(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="bill_{order_id}.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # -------------------- HEADER --------------------
    title = Paragraph("<b><font size=20>CliqEat Restaurant</font></b>", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 20))

    # ---------------- ORDER INFO --------------------
    order_info = f"""
        <b>Order ID:</b> {order.id}<br/>
        <b>Table Number:</b> {order.table.table_number}<br/>
        <b>Date:</b> {order.created_at.strftime('%Y-%m-%d')}
    """
    elements.append(Paragraph(order_info, styles["Normal"]))
    elements.append(Spacer(1, 20))

    # ---------------- ITEMS TABLE -------------------
    items = OrderItem.objects.filter(order=order)

    table_data = [
        ["Item", "Qty", "Price", "Total"]  # table headings
    ]

    for item in items:
        total_price = item.quantity * item.price
        table_data.append([
            item.menu_item.name,
            str(item.quantity),
            f"₹{item.price}",
            f"₹{total_price}"
        ])

    # Add final total row
    table_data.append(["", "", "Total", f"₹{order.total_amount}"])

    table = PDFTable(table_data, colWidths=[200, 50, 70, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),

        ('BOX', (0, 0), (-1, -1), 1, colors.black),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),

        ('BACKGROUND', (0, 1), (-1, -2), colors.whitesmoke),
        ('FONTNAME', (-2, -1), (-1, -1), 'Helvetica-Bold'),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 30))

    # ------------- FOOTER -----------------
    footer = Paragraph(
        "<b>Thank you for dining with us! 🍽️</b><br/>Visit Again!",
        styles["Normal"]
    )
    elements.append(footer)

    doc.build(elements)
    return response


