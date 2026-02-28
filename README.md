# The Bake Story — Bakery Management Platform

A full-stack bakery ordering and management system built with **Django** (Python), featuring role-based access control, QR-code table ordering, a live-tracking delivery module, and an AI-powered chatbot.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Role-Based Login Credentials](#role-based-login-credentials)
- [Role Permissions & Access](#role-permissions--access)
- [Key URLs](#key-urls)
- [Quick Start (Local Setup)](#quick-start-local-setup)
- [Environment Variables](#environment-variables)
- [Features Overview](#features-overview)

---

## Project Structure

```
/
├── bakery_project/          # Django application (The Bake Story)
│   ├── bakery/              # Core app (models, views, templates)
│   ├── bakery_project/      # Django settings & root URLs
│   ├── manage.py
│   └── requirements.txt
├── extrahand-platform-livetracking-feature/   # Next.js live-tracking module
├── nginx.conf               # Nginx reverse-proxy config
├── bakery.service           # Systemd service file
├── requirements.txt         # Python dependencies
└── README.md
```

---

## Role-Based Login Credentials

> **Note:** The application uses **email address as the username** for login (`/login/`).  
> Django Admin (`/admin/`) uses the username field directly.

### Default Test Credentials

| Role         | Email / Username        | Password    | Login URL            |
|--------------|-------------------------|-------------|----------------------|
| **Admin**    | `admin@bakery.com`      | `admin123`  | `/login/`            |
| **Customer** | `test@bakery.com`       | `test123`   | `/login/`            |
| **Driver**   | *(create via admin)*    | *(set on creation)* | `/login/`  |

### Django Admin Panel Credentials

| Username | Password   | URL       |
|----------|------------|-----------|
| `admin`  | `admin123` | `/admin/` |

> ⚠️ **Security Notice:** These are default development credentials.  
> **Always change passwords before deploying to production.**  
> You can override them using environment variables: `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

---

### Creating a Driver Account

Driver accounts must be created through the Admin Panel:

1. Log in as **Admin** → go to `/admin-panel/users/`
2. Create a new user account (register with any email/password)
3. Go to `/admin-panel/roles/` → assign the **Driver** role to that user
4. The driver can now log in at `/login/` and access `/driver/dashboard/`

---

## Role Permissions & Access

### Admin
Full platform control.

| Feature                    | URL                         |
|----------------------------|-----------------------------|
| Admin Dashboard            | `/admin-dashboard/`         |
| Menu Management            | `/admin-panel/menu/`        |
| User Management            | `/admin-panel/users/`       |
| Role Management            | `/admin-panel/roles/`       |
| Payment Management         | `/admin-panel/payments/`    |
| Kitchen Portal             | `/kitchen/`                 |
| Django Admin Panel         | `/admin/`                   |

### Driver
Delivery management access.

| Feature             | URL                     |
|---------------------|-------------------------|
| Driver Dashboard    | `/driver/dashboard/`    |
| Assigned Orders     | `/driver/orders/`       |
| Live Map            | `/driver/map/`          |
| Earnings            | `/driver/earnings/`     |
| Settings            | `/driver/settings/`     |

### Customer
Browse, order, pay, and track.

| Feature             | URL                             |
|---------------------|---------------------------------|
| Home                | `/`                             |
| Menu                | `/menu/`                        |
| Cart / Checkout     | `/cart/`                        |
| My Orders           | `/orders/`                      |
| Order Detail        | `/orders/<order_id>/`           |
| Live Order Tracking | `/orders/<order_id>/track/`     |
| AI Order Assistant  | `/order-assistant/`             |
| Payment             | `/payment/`                     |
| QR Table Ordering   | `/?table=<table_number>`        |

---

## Key URLs

| URL              | Description                                  |
|------------------|----------------------------------------------|
| `/`              | Home page                                    |
| `/login/`        | Login page (email + password)                |
| `/signup/`       | Customer self-registration                   |
| `/logout/`       | Logout                                       |
| `/forgot-password/` | Password reset via email                  |
| `/admin/`        | Django admin panel                           |
| `/api/`          | REST API endpoints                           |
| `/bot/`          | AI Chatbot interface                         |

---

## Quick Start (Local Setup)

### Backend (Django)

```bash
# 1. Navigate to the Django project
cd bakery_project

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r ../requirements.txt

# 4. Copy environment config
cp .env.example .env
# Edit .env with your values

# 5. Apply database migrations
python manage.py migrate

# 6. Create default admin user
python manage.py init_admin

# 7. (Optional) Load sample menu & test data
python manage.py init_menu
python manage.py create_sample_data

# 8. Run the development server
python manage.py runserver
```

Access the app at: **http://127.0.0.1:8000**

---

### Frontend Live-Tracking Module (Next.js)

```bash
# Navigate to the sub-project
cd extrahand-platform-livetracking-feature

# Install dependencies
npm install

# Copy environment config
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Access at: **http://localhost:3000**

---

## Environment Variables

Copy `bakery_project/.env.example` to `bakery_project/.env` and set the following:

| Variable              | Description                              | Default            |
|-----------------------|------------------------------------------|--------------------|
| `SECRET_KEY`          | Django secret key                        | *(required)*       |
| `DEBUG`               | Enable debug mode                        | `True`             |
| `ALLOWED_HOSTS`       | Comma-separated allowed hostnames        | `localhost,127.0.0.1` |
| `DATABASE_URL`        | PostgreSQL URL (leave empty for SQLite)  | *(SQLite)*         |
| `ADMIN_USERNAME`      | Default admin username                   | `admin`            |
| `ADMIN_EMAIL`         | Default admin email                      | `admin@bakery.com` |
| `ADMIN_PASSWORD`      | Default admin password                   | `admin123`         |
| `RAZORPAY_KEY_ID`     | Razorpay API key                         | *(required)*       |
| `RAZORPAY_KEY_SECRET` | Razorpay secret                          | *(required)*       |
| `GROQ_API_KEY`        | Groq API key for AI chatbot              | *(required)*       |

---

## Features Overview

- **QR Code Table Ordering** — Customers scan a table QR code to place dine-in orders
- **AI Chatbot Assistant** — Powered by Groq LLM for natural language ordering
- **Razorpay Payment Gateway** — UPI, card, net banking & cash on delivery
- **Live Driver Tracking** — Real-time GPS location with WebSocket updates
- **Role-Based Access Control** — Admin, Driver, Customer with dedicated dashboards
- **Order Status Tracking** — Full lifecycle: pending → confirmed → preparing → delivered
- **Multi-Stop Delivery** — Extrahand live-tracking module for advanced routing
- **REST API** — Full API layer for mobile/frontend integration
