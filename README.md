# 🥖 The Bake Story - Online Bakery Platform

A full-featured Django-based bakery e-commerce platform with online ordering, payment integration, real-time order management, and AI-powered customer service chatbot.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Django](https://img.shields.io/badge/Django-4.2-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Features

### Customer Features
- 🛒 **Online Menu & Ordering** - Browse categories, view items, add to cart
- 💳 **Secure Payment** - Razorpay integration for online payments
- 📸 **Payment Proof Upload** - For offline payment methods
- 🤖 **AI Chatbot** - RAG-based customer service powered by GROQ
- 📱 **Responsive Design** - Works on all devices
- 📋 **Order Tracking** - Real-time order status updates
- 🔐 **User Authentication** - Secure login and registration

### Admin Features
- 📊 **Order Management Dashboard** - View and manage all orders
- ✅ **Order Status Control** - Update order statuses in real-time
- 🍰 **Menu Management** - Add, edit, delete menu items
- 💰 **Payment Verification** - Review payment screenshots
- 📈 **Analytics** - Order statistics and insights
- 📧 **Notifications** - Email notifications for new orders

### Technical Features
- 🚀 **RESTful API** - Full API with Django REST Framework
- 🔒 **Security** - CSRF protection, secure cookies, SSL support
- 📦 **Static Files** - WhiteNoise for efficient static file serving
- 🐳 **Production Ready** - Gunicorn, Nginx, systemd configuration
- 🔄 **Database Flexibility** - SQLite (default) or PostgreSQL support
- 🔑 **Environment Variables** - Secure configuration management
- 📝 **Comprehensive Logging** - Error tracking and monitoring

---

## 📋 Tech Stack

### Backend
- **Framework:** Django 4.2
- **API:** Django REST Framework
- **Server:** Gunicorn
- **Database:** SQLite3 (PostgreSQL ready)
- **Caching:** Django Cache Framework

### Frontend
- **Templates:** Django Templates
- **Styling:** CSS3, Responsive Design
- **JavaScript:** Vanilla JS

### AI/ML
- **Chatbot:** LangChain + GROQ API
- **Embeddings:** HuggingFace Sentence Transformers
- **Vector Store:** FAISS (CPU optimized)

### DevOps
- **Web Server:** Nginx
- **Process Manager:** Systemd
- **SSL:** Let's Encrypt (Certbot)
- **Deployment:** Bash automation scripts

### Payment
- **Gateway:** Razorpay

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip and virtualenv
- Git

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/bakery_project.git
   cd bakery_project
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   cd bakery_project
   cp .env.example .env
   
   # Edit .env with your settings
   # At minimum, set:
   # - SECRET_KEY
   # - DEBUG=True
   # - GROQ_API_KEY (for chatbot)
   # - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (for payments)
   ```

5. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

9. **Access Application**
   - Main site: http://localhost:8000
   - Admin panel: http://localhost:8000/admin

---

## 🌐 Production Deployment

### For Hostinger VPS or Any Ubuntu/Debian VPS

#### Quick Deploy (Recommended)
```bash
# Upload project to VPS
cd /home/ubuntu
git clone https://github.com/your-username/bakery_project.git
cd bakery_project

# Configure environment
cp .env.production .env
nano .env  # Edit with your values

# Update deployment script
nano deploy.sh
# Set GIT_REPO to your repository URL

# Update nginx config
nano nginx.conf
# Replace 'your-domain.com' and 'your-vps-ip'

# Run deployment
sudo bash deploy.sh
```

#### Detailed Deployment Guide
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive step-by-step instructions including:
- Server setup and configuration
- SSL certificate installation
- Database migration
- Troubleshooting common issues
- Maintenance and monitoring

---

## 📁 Project Structure

```
bakery_project/
├── bakery/                      # Main Django app
│   ├── models.py               # Database models
│   ├── views.py                # View functions
│   ├── api_views.py            # REST API views
│   ├── urls.py                 # URL routing
│   ├── serializers.py          # API serializers
│   ├── rag_chatbot.py          # AI chatbot
│   ├── templates/              # HTML templates
│   ├── static/                 # CSS, JS, images
│   └── migrations/             # Database migrations
├── bakery_project/             # Project settings
│   ├── settings.py             # Django configuration
│   ├── urls.py                 # Root URL config
│   └── wsgi.py                 # WSGI application
├── staticfiles/                # Collected static files
├── media/                      # User uploads
├── logs/                       # Application logs
├── requirements.txt            # Python dependencies
├── deploy.sh                   # Deployment script
├── nginx.conf                  # Nginx configuration
├── bakery.service              # Systemd service file
├── .env.example                # Environment template
├── .env.production             # Production env template
└── DEPLOYMENT_GUIDE.md         # Deployment documentation
```

---

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```bash
# Django
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-ip

# Database (optional)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Payment
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Chatbot
GROQ_API_KEY=your_groq_api_key

# CORS/CSRF
CORS_ALLOWED_ORIGINS=https://your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com
```

See [.env.example](bakery_project/.env.example) for complete list.

---

## 🛠️ Development

### Running Tests
```bash
python manage.py test
```

### Code Style
```bash
# Install development dependencies
pip install black flake8

# Format code
black .

# Lint code
flake8 .
```

### Database Management
```bash
# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Database shell
python manage.py dbshell

# Django shell
python manage.py shell
```

---

## 📊 API Endpoints

### Menu
- `GET /api/menu/` - List all menu items
- `GET /api/menu/<id>/` - Get menu item details
- `POST /api/menu/` - Create menu item (admin)
- `PUT /api/menu/<id>/` - Update menu item (admin)
- `DELETE /api/menu/<id>/` - Delete menu item (admin)

### Orders
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/<id>/` - Get order details
- `PATCH /api/orders/<id>/` - Update order status (admin)

### Tables
- `GET /api/tables/` - List all tables
- `GET /api/tables/<id>/` - Get table details

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/register/` - User registration

### Payment
- `POST /api/payment/create/` - Create Razorpay order
- `POST /api/payment/verify/` - Verify payment
- `POST /api/razorpay/webhook/` - Razorpay webhook

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues & Limitations

- Chatbot requires ~2GB RAM - can be disabled on low-memory systems
- SQLite not recommended for high-traffic production (use PostgreSQL)
- Real-time notifications require additional setup (WebSockets)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- Email: btechmuthyam@gmail.com

---

## 🙏 Acknowledgments

- Django Framework
- Django REST Framework
- LangChain & GROQ
- Razorpay
- All open-source contributors

---

## 📞 Support

For support and questions:
- 📧 Email: btechmuthyam@gmail.com
- 📖 Documentation: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/bakery_project/issues)

---

## 🔄 Version History

### v1.0.0 (2026-02-21)
- Initial release
- Full order management system
- Razorpay payment integration
- AI chatbot with RAG
- Production-ready deployment scripts

---

**Made with ❤️ for bakery businesses**
