# AWS EC2 Free Tier Deployment Guide - TheBakeStory

## Complete Step-by-Step Guide to Deploy Django App on AWS EC2 (Free Tier)

### Prerequisites
- AWS Account (Free Tier eligible)
- Domain: bakestory.store (GoDaddy)
- Local project ready to deploy
- GitHub repository: https://github.com/ajaykumarbandela/TheBakeStory

---

## Part 1: AWS EC2 Instance Setup

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Go to https://aws.amazon.com/console/
   - Navigate to EC2 Dashboard

2. **Launch Instance**
   - Click "Launch Instance" button
   - **Name**: `bakestory-production`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: `t2.micro` (1 vCPU, 1GB RAM - Free tier)
   - **Key Pair**: Create new or use existing
     - Name: `bakestory-key`
     - Type: RSA
     - Format: `.pem` (for Linux/Mac) or `.ppk` (for Windows/PuTTY)
     - **IMPORTANT**: Download and save the key file securely

3. **Configure Network Settings**
   - Create security group: `bakestory-sg`
   - **Allow these ports**:
     ```
     SSH (22)         - Your IP only (for security)
     HTTP (80)        - Anywhere (0.0.0.0/0)
     HTTPS (443)      - Anywhere (0.0.0.0/0)
     Custom TCP 8000  - Anywhere (for testing, remove later)
     ```

4. **Configure Storage**
   - Root volume: 30 GB (Free tier allows up to 30GB)
   - Type: gp2 (General Purpose SSD)

5. **Launch Instance**
   - Wait 2-3 minutes for instance to be in "Running" state
   - Note down the **Public IPv4 address**

---

## Part 2: Connect to EC2 Instance

### For Windows (using PowerShell/CMD):

```powershell
# Navigate to where your key is saved
cd ~\Downloads

# Set key permissions (if needed)
icacls "bakestory-key.pem" /inheritance:r
icacls "bakestory-key.pem" /grant:r "%username%:R"

# Connect to EC2
ssh -i bakestory-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### For Mac/Linux:

```bash
# Set key permissions
chmod 400 bakestory-key.pem

# Connect to EC2
ssh -i bakestory-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Part 3: Server Setup & Software Installation

Once connected to EC2, run these commands:

### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Python & Required Packages

```bash
# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install system dependencies
sudo apt install build-essential libssl-dev libffi-dev python3-dev -y
sudo apt install nginx -y
sudo apt install git -y
sudo apt install postgresql postgresql-contrib -y  # Optional: if you want to use PostgreSQL
```

### Step 3: Install and Configure PostgreSQL (Optional but Recommended)

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE bakestory_db;
CREATE USER bakestory_user WITH PASSWORD 'your_secure_password_here';
ALTER ROLE bakestory_user SET client_encoding TO 'utf8';
ALTER ROLE bakestory_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE bakestory_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE bakestory_db TO bakestory_user;
\q
EOF
```

---

## Part 4: Deploy Application

### Step 1: Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/ajaykumarbandela/TheBakeStory.git
cd TheBakeStory
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Install additional production packages
pip install gunicorn psycopg2-binary whitenoise
```

### Step 3: Configure Environment Variables

```bash
# Create .env file
nano bakery_project/.env
```

**Add this content** (replace with your actual values):

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-change-this-to-random-string
ALLOWED_HOSTS=YOUR_EC2_PUBLIC_IP,bakestory.store,www.bakestory.store

# Database (if using PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=bakestory_db
DB_USER=bakestory_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# GROQ API
GROQ_API_KEY=your_groq_api_key

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION_NAME=ap-south-1
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 4: Update Django Settings

```bash
nano bakery_project/bakery_project/settings.py
```

Add/Update these settings:

```python
import os
from pathlib import Path

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.environ.get('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', ''),
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

### Step 5: Prepare Django Application

```bash
# Navigate to Django project directory
cd ~/TheBakeStory/bakery_project

# Activate virtual environment
source ~/TheBakeStory/venv/bin/activate

# Load environment variables
export $(cat .env | xargs)

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Follow prompts to create admin account

# Test the application
python manage.py runserver 0.0.0.0:8000
```

Test by visiting: `http://YOUR_EC2_PUBLIC_IP:8000`

If it works, press Ctrl+C to stop the test server.

---

## Part 5: Configure Gunicorn

### Step 1: Test Gunicorn

```bash
cd ~/TheBakeStory/bakery_project
source ~/TheBakeStory/venv/bin/activate

gunicorn --bind 0.0.0.0:8000 bakery_project.wsgi:application
```

Visit `http://YOUR_EC2_PUBLIC_IP:8000` to test. Press Ctrl+C to stop.

### Step 2: Create Gunicorn Systemd Service

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

**Add this content**:

```ini
[Unit]
Description=Gunicorn daemon for TheBakeStory Django Application
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/TheBakeStory/bakery_project
EnvironmentFile=/home/ubuntu/TheBakeStory/bakery_project/.env
ExecStart=/home/ubuntu/TheBakeStory/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/home/ubuntu/TheBakeStory/bakery_project/gunicorn.sock \
          bakery_project.wsgi:application

[Install]
WantedBy=multi-user.target
```

Save and exit (Ctrl+X, Y, Enter)

### Step 3: Start and Enable Gunicorn

```bash
# Start Gunicorn
sudo systemctl start gunicorn

# Enable Gunicorn to start on boot
sudo systemctl enable gunicorn

# Check status
sudo systemctl status gunicorn

# If there are issues, check logs
sudo journalctl -u gunicorn
```

---

## Part 6: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bakestory
```

**Add this content**:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP bakestory.store www.bakestory.store;
    
    client_max_body_size 20M;
    
    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /home/ubuntu/TheBakeStory/bakery_project/staticfiles/;
    }
    
    location /media/ {
        alias /home/ubuntu/TheBakeStory/bakery_project/media/;
    }
    
    location / {
        include proxy_params;
        proxy_pass http://unix:/home/ubuntu/TheBakeStory/bakery_project/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and exit.

### Step 2: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bakestory /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Part 7: Configure Domain (GoDaddy)

### Step 1: Get AWS Elastic IP (Recommended)

**Why?** EC2 instances get new IP addresses when stopped/started. Elastic IP is permanent and free (when attached to running instance).

```bash
# In AWS Console:
1. Go to EC2 Dashboard
2. Click "Elastic IPs" in left menu
3. Click "Allocate Elastic IP address"
4. Click "Allocate"
5. Select the new IP → Actions → Associate Elastic IP address
6. Select your instance: bakestory-production
7. Click "Associate"
```

Note down your **Elastic IP address**.

### Step 2: Configure DNS in GoDaddy

1. **Login to GoDaddy**
   - Go to https://www.godaddy.com/
   - Navigate to "My Products"
   - Click "DNS" next to bakestory.store

2. **Add/Update DNS Records**

   | Type  | Name | Value              | TTL  |
   |-------|------|--------------------|------|
   | A     | @    | YOUR_ELASTIC_IP    | 600  |
   | A     | www  | YOUR_ELASTIC_IP    | 600  |
   | CNAME | *    | bakestory.store    | 1hr  |

3. **Save Changes**
   - DNS propagation takes 5-30 minutes

### Step 3: Test Domain

Wait 10-15 minutes, then visit:
- http://bakestory.store
- http://www.bakestory.store

---

## Part 8: Setup SSL Certificate (HTTPS)

### Install Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d bakestory.store -d www.bakestory.store

# Follow prompts:
# 1. Enter email address
# 2. Agree to terms
# 3. Choose to redirect HTTP to HTTPS (option 2)

# Test automatic renewal
sudo certbot renew --dry-run
```

Your site is now secured with HTTPS! 🎉

Visit: https://bakestory.store

---

## Part 9: Update Django Settings for Production

```bash
cd ~/TheBakeStory/bakery_project
nano bakery_project/settings.py
```

Update ALLOWED_HOSTS:

```python
ALLOWED_HOSTS = [
    'YOUR_ELASTIC_IP',
    'bakestory.store',
    'www.bakestory.store',
]
```

Update CSRF and CORS settings:

```python
CSRF_TRUSTED_ORIGINS = [
    'https://bakestory.store',
    'https://www.bakestory.store',
]

CORS_ALLOWED_ORIGINS = [
    'https://bakestory.store',
    'https://www.bakestory.store',
]
```

Save and restart services:

```bash
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

---

## Part 10: Maintenance Commands

### Restart Services

```bash
# Restart Gunicorn
sudo systemctl restart gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### View Logs

```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Django logs (if configured)
tail -f ~/TheBakeStory/bakery_project/logs/django.log
```

### Update Code

```bash
cd ~/TheBakeStory
source venv/bin/activate

# Pull latest changes
git pull origin Ajay

# Install any new dependencies
pip install -r requirements.txt

# Collect static files
cd bakery_project
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Restart services
sudo systemctl restart gunicorn
```

### Database Backup

```bash
# Backup PostgreSQL database
sudo -u postgres pg_dump bakestory_db > ~/backup_$(date +%Y%m%d).sql

# Backup SQLite database (if using)
cp ~/TheBakeStory/bakery_project/db.sqlite3 ~/backup_$(date +%Y%m%d).sqlite3
```

---

## Part 11: Set Up Automatic Backups

```bash
# Create backup script
nano ~/backup.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump bakestory_db > $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql"
```

Make executable and add to cron:

```bash
chmod +x ~/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/backup.log 2>&1
```

---

## Part 12: Monitor & Optimize

### Set Up Monitoring

```bash
# Install htop for resource monitoring
sudo apt install htop -y

# Check resource usage
htop

# Check disk space
df -h

# Check memory usage
free -h
```

### Enable Firewall

```bash
# Configure UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Troubleshooting

### If site is not accessible:

1. **Check Security Group** - Ensure ports 80, 443 are open
2. **Check Gunicorn** - `sudo systemctl status gunicorn`
3. **Check Nginx** - `sudo systemctl status nginx`
4. **Check logs** - `sudo journalctl -u gunicorn -n 50`

### If static files not loading:

```bash
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### If database errors:

```bash
cd ~/TheBakeStory/bakery_project
source ~/TheBakeStory/venv/bin/activate
python manage.py migrate
python manage.py makemigrations
python manage.py migrate
```

---

## Cost Estimate (Free Tier)

✅ **FREE for 12 months:**
- EC2 t2.micro instance (750 hours/month)
- 30 GB EBS storage
- Elastic IP (when attached)
- Data transfer out (15 GB/month)

⚠️ **Will incur charges after free tier or if exceeded:**
- Additional storage beyond 30GB
- Data transfer beyond 15GB/month
- Elastic IP when not attached to running instance

---

## Final Checklist

- [ ] EC2 instance running
- [ ] Elastic IP allocated and associated
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Site accessible via HTTPS
- [ ] Static files loading
- [ ] Database working
- [ ] Payment gateway working (test mode)
- [ ] Chatbot functioning
- [ ] Orders displaying correctly
- [ ] Admin panel accessible
- [ ] Backups configured

---

## Security Best Practices

1. ✅ Keep software updated: `sudo apt update && sudo apt upgrade`
2. ✅ Use strong passwords
3. ✅ Enable firewall (UFW)
4. ✅ Restrict SSH access to your IP only
5. ✅ Regular backups
6. ✅ Monitor logs regularly
7. ✅ Keep secret keys in environment variables
8. ✅ Use HTTPS only (SSL certificate)

---

## Support & Resources

- **AWS Free Tier**: https://aws.amazon.com/free/
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Certbot**: https://certbot.eff.org/

---

**Congratulations! Your Django application is now live on AWS! 🎉**

Visit: https://bakestory.store
