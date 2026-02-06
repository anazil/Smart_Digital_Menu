# Smart Digital Menu System

A comprehensive restaurant management system with QR code-based digital menus, order management, and payment integration.

## 🚀 Features

- **Digital Menu**: QR code-based menu access for customers
- **Order Management**: Real-time order tracking from kitchen to table
- **Multi-User Support**: Restaurant owners can manage multiple establishments
- **Payment Integration**: Razorpay payment gateway integration
- **PDF Bills**: Automated bill generation and download
- **Kitchen Display**: Real-time order status updates for kitchen staff
- **Hall Screen**: Order tracking for service staff
- **Admin Dashboard**: Complete restaurant management interface

## 🏗️ Project Structure

```
Smart_Digital_Menu/
├── Back-End/                 # Django REST API
│   ├── api/                  # Main API application
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py    # Data serializers
│   │   ├── urls.py           # URL routing
│   │   └── migrations/       # Database migrations
│   ├── Back_End/             # Django project settings
│   │   ├── settings.py       # Configuration
│   │   └── urls.py           # Main URL routing
│   ├── media/                # Uploaded files
│   │   ├── menu_images/      # Menu item images
│   │   └── qr_codes/         # Generated QR codes
│   └── manage.py             # Django management script
└── Front-End/
    └── digital-menu/         # React application
        ├── src/
        │   ├── pages/        # React components/pages
        │   └── assets/       # Static assets
        └── package.json      # Dependencies
```

## 🛠️ Technology Stack

### Backend
- **Django 5.2.7** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database
- **Razorpay** - Payment processing
- **ReportLab** - PDF generation
- **QRCode** - QR code generation
- **Pillow** - Image processing

### Frontend
- **React 18.3.1** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Bootstrap 5.3.8** - CSS framework

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## ⚡ Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Back-End
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers
   pip install djangorestframework-simplejwt pillow qrcode razorpay reportlab
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```
   Backend will run on `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Front-End/digital-menu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Payment Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `settings.py`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - User profile

### Menu Management
- `GET /api/menu/` - Get menu items
- `POST /api/add-menu-item/` - Add menu item
- `GET /api/menu-all/{user_id}/` - Get all menu items for user
- `PATCH /api/update-menu-item/{item_id}/` - Update menu item
- `DELETE /api/delete-menu-item/{item_id}/` - Delete menu item

### Table Management
- `POST /api/add-table/` - Add table
- `GET /api/all-tables/` - Get all tables
- `DELETE /api/delete-table/{table_id}/` - Delete table

### Order Management
- `POST /api/create-order/` - Create new order
- `GET /api/order-status/{order_id}/` - Get order status
- `GET /api/kitchen/orders/` - Get kitchen orders
- `PATCH /api/kitchen/order/{order_id}/status/` - Update order status
- `GET /api/hall/orders/` - Get hall orders

### Payment & Billing
- `POST /api/create-payment-order/` - Create payment order
- `GET /api/download-bill/{order_id}/` - Download PDF bill

## 🎯 Usage Flow

1. **Restaurant Setup**
   - Register restaurant account
   - Add menu items with images and prices
   - Create tables and generate QR codes

2. **Customer Experience**
   - Scan QR code at table
   - Browse digital menu
   - Place order
   - Make payment via Razorpay
   - Receive order confirmation

3. **Kitchen Operations**
   - View incoming orders
   - Update order status (Pending → Preparing → Ready → Served)
   - Track order completion

4. **Service Management**
   - Monitor orders on hall screen
   - Track table-wise order status
   - Generate and download bills

## 🔒 Security Features

- JWT token authentication
- CORS configuration
- Input validation and sanitization
- Secure payment processing
- User-specific data isolation

## 📊 Database Models

- **User**: Restaurant owners/staff
- **Table**: Restaurant tables with QR codes
- **MenuItem**: Menu items with images and pricing
- **Order**: Customer orders with status tracking
- **OrderItem**: Individual items within orders

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings.py
2. Configure allowed hosts
3. Set up production database
4. Configure static/media file serving
5. Deploy to your preferred platform (AWS, Heroku, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ for modern restaurant management**