from django.urls import path
from . import views

urlpatterns = [
    path('menu/', views.menu_list,name='menu_list'),
    path('create-order/', views.create_order,name='create_order'),
    path('order-status/<int:order_id>/', views.order_status,name='order_status'),

    #admin side
    path('add-menu-item/', views.add_menu_item, name='add_menu_item'),
    path('menu-all/<int:user_id>/', views.all_menu_items, name='all_menu_items'),
     path('update-menu-item/<int:item_id>/', views.update_menu_item, name='update_menu_item'),
    path('delete-menu-item/<int:item_id>/', views.delete_menu_item, name='delete_menu_item'),
    
    # Category management
    path('categories/<int:user_id>/', views.get_categories, name='get_categories'),
    path('add-category/', views.add_category, name='add_category'),
    path('delete-category/<int:category_id>/', views.delete_category, name='delete_category'),

    path('add-table/', views.add_table, name='add-table'),
    path('all-tables/', views.all_tables, name='all-tables'),
    path('delete-table/<int:table_id>/',views.delete_table, name='delete_table'),



    #kitchen side
    path('kitchen/orders/', views.all_orders, name='all_orders'),
    path('kitchen/order/<int:order_id>/status/', views.update_order_status, name='update_order_status'),

    #hall screen
    path('hall/orders/', views.hall_orders, name='hall_orders'),

    # Auth



    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/profile/', views.user_profile, name='profile'),

    #razorpay
    path("create-payment-order/",views.create_payment_order,name='create_payment_order'),
    #reportlab
    path("download-bill/<int:order_id>/", views.download_bill,name='download_bill'),




]
