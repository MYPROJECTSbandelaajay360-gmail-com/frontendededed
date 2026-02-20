# The Bake Story - Production Deployment Guide

## Overview
Complete guide for deploying The Bake Story bakery Django application to Hostinger VPS (or any Ubuntu/Debian VPS).

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Server Requirements](#server-requirements)
3. [Initial Server Setup](#initial-server-setup)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Maintenance & Monitoring](#maintenance--monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### 1. Domain Setup
- [ ] Purchase/configure domain name
- [ ] Point domain DNS A records to VPS IP
- [ ] Configure www subdomain (optional)
- [ ] Wait for DNS propagation (up to 48 hours)

### 2. Hostinger VPS Access
- [ ] VPS created and running
- [ ] SSH credentials received
- [ ] Root or sudo access confirmed
- [ ] VPS IP address noted

### 3. Application Configuration
- [ ] Update `.env.production` with actual values
- [ ] Generate strong Django SECRET_KEY
- [ ] Configure Razorpay LIVE keys (not TEST keys)
- [ ] Set up GROQ API key for chatbot
- [ ] Update `deploy.sh` with Git repository URL
- [ ] Update `nginx.conf` with domain and IP

---

## Server Requirements

### Minimum Specifications
- **OS:** Ubuntu 20.04/22.04 LTS or Debian 11+
- **RAM:** 2GB minimum (4GB recommended with chatbot)
- **Storage:** 20GB minimum
- **CPU:** 1+ cores
- **Python:** 3.8+
- **Bandwidth:** As needed for traffic

### Software Requirements
- Python 3.8+
- Nginx
- Git
- UFW (firewall)
- Certbot (for SSL)

---

## Initial Server Setup

### 1. Connect to VPS via SSH
```bash
# From your local machine
ssh root@your-vps-ip

# Or if using ubuntu user
ssh ubuntu@your-vps-ip
```

### 2. Update System
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot  # Recommended after updates
```

### 3. Create Non-Root User (if not exists)
```bash
# As root
adduser ubuntu
usermod -aG sudo ubuntu
su - ubuntu  # Switch to ubuntu user
```

### 4. Configure SSH Key Authentication (Recommended)
```bash
# On your local machine
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id ubuntu@your-vps-ip

# Test connection
ssh ubuntu@your-vps-ip
```

### 5. Set Up Basic Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Deployment Steps

### Method 1: Automated Deployment (Recommended)

1. **Upload Project to VPS**
   ```bash
   # Option A: Clone from Git (recommended)
   cd /home/ubuntu
   git clone https://github.com/your-username/bakery_project.git
   cd bakery_project
   
   # Option B: Upload via SCP from local machine
   scp -r "path/to/local/project" ubuntu@your-vps-ip:/home/ubuntu/bakery_project
   ```

2. **Configure Environment**
   ```bash
   cd /home/ubuntu/bakery_project
   cp .env.production .env
   nano .env  # Edit with actual values
   ```

3. **Update Deployment Script**
   ```bash
   nano deploy.sh
   # Update GIT_REPO variable with your repository URL
   # Update APP_DIR if different
   # Save and exit
   ```

4. **Update Nginx Configuration**
   ```bash
   nano nginx.conf
   # Replace 'your-domain.com' with actual domain
   # Replace 'your-vps-ip' with actual VPS IP
   # Save and exit
   ```

5. **Run Deployment Script**
   ```bash
   sudo bash deploy.sh
   # Follow prompts and configure as needed
   ```

6. **Create Django Superuser**
   ```bash
   cd /home/ubuntu/bakery_project
   source venv/bin/activate
   python manage.py createsuperuser
   ```

### Method 2: Manual Deployment

If you prefer step-by-step manual deployment, follow these steps:

1. **Install System Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y python3 python3-pip python3-venv nginx git curl ufw certbot python3-certbot-nginx
   ```

2. **Clone Project**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/your-username/bakery_project.git
   cd bakery_project
   ```

3. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Python Dependencies**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   ```bash
   cp .env.production .env
   nano .env  # Edit with actual values
   ```

6. **Run Django Setup**
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py createsuperuser
   mkdir -p logs media
   ```

7. **Create Systemd Service**
   ```bash
   sudo cp bakery.service /etc/systemd/system/bakery.service
   sudo systemctl daemon-reload
   sudo systemctl enable bakery
   sudo systemctl start bakery
   sudo systemctl status bakery
   ```

8. **Configure Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/bakery
   sudo ln -s /etc/nginx/sites-available/bakery /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Post-Deployment Configuration

### 1. Verify Application is Running
```bash
# Check gunicorn service
sudo systemctl status bakery

# Check nginx
sudo systemctl status nginx

# Test from browser
http://your-vps-ip
http://your-domain.com
```

### 2. Check Logs
```bash
# Application logs
tail -f /home/ubuntu/bakery_project/logs/error.log
tail -f /home/ubuntu/bakery_project/logs/access.log

# Systemd logs
sudo journalctl -u bakery -f

# Nginx logs
sudo tail -f /var/log/nginx/bakery_error.log
sudo tail -f /var/log/nginx/bakery_access.log
```

### 3. Test Admin Panel
```bash
# Access Django admin
http://your-domain.com/admin
```

### 4. Configure Razorpay Webhooks
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/razorpay/webhook/`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `.env` → `RAZORPAY_WEBHOOK_SECRET`

---

## SSL Certificate Setup

### Using Let's Encrypt (Free SSL)

1. **Ensure DNS is Configured**
   ```bash
   # Test DNS resolution
   nslookup your-domain.com
   ```

2. **Run Certbot**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Follow Prompts**
   - Enter email address
   - Agree to Terms of Service
   - Choose redirect option (recommended)

4. **Update Environment Variables**
   ```bash
   nano /home/ubuntu/bakery_project/.env
   
   # Set these to True
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   SECURE_HSTS_SECONDS=31536000
   ```

5. **Update CORS/CSRF Origins**
   ```bash
   # In .env, update to use https://
   CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
   CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com
   ```

6. **Restart Services**
   ```bash
   sudo systemctl restart bakery
   sudo systemctl restart nginx
   ```

7. **Test HTTPS**
   ```bash
   https://your-domain.com
   ```

8. **Set Up Auto-Renewal**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run
   
   # Certbot automatically sets up cron job
   # Verify with:
   sudo systemctl status certbot.timer
   ```

---

## Maintenance & Monitoring

### Regular Maintenance Tasks

#### Daily
- Monitor logs for errors
- Check disk space usage
- Verify application availability

#### Weekly
- Review access patterns
- Check for security updates
- Backup database

#### Monthly
- Update system packages
- Review and rotate logs
- Performance optimization

### Essential Commands

#### Service Management
```bash
# Restart application
sudo systemctl restart bakery

# Restart nginx
sudo systemctl restart nginx

# View service status
sudo systemctl status bakery
sudo systemctl status nginx

# View real-time logs
sudo journalctl -u bakery -f
```

#### Application Updates
```bash
cd /home/ubuntu/bakery_project

# Backup database (SQLite)
cp db.sqlite3 db.sqlite3.backup.$(date +%Y%m%d)

# Pull latest code
git pull origin main

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart application
sudo systemctl restart bakery
```

#### Database Backup
```bash
# SQLite backup
cd /home/ubuntu/bakery_project
cp db.sqlite3 ~/backups/db.sqlite3.$(date +%Y%m%d_%H%M%S)

# Automated backup script (create ~/backup.sh)
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
cp /home/ubuntu/bakery_project/db.sqlite3 $BACKUP_DIR/db.sqlite3.$(date +%Y%m%d_%H%M%S)
# Keep only last 7 days
find $BACKUP_DIR -name "db.sqlite3.*" -mtime +7 -delete
```

#### Log Rotation
```bash
# Create logrotate config
sudo nano /etc/logrotate.d/bakery

# Add:
/home/ubuntu/bakery_project/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu www-data
    sharedscripts
    postrotate
        systemctl reload bakery > /dev/null 2>&1 || true
    endscript
}
```

### Monitoring

#### Disk Space
```bash
df -h
du -sh /home/ubuntu/bakery_project/*
```

#### Memory Usage
```bash
free -h
ps aux | grep gunicorn
```

#### Network Connections
```bash
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :80
```

#### Application Health
```bash
# Check if gunicorn is responding
curl http://localhost:8000

# Check nginx
curl http://localhost
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check service status
sudo systemctl status bakery

# Check detailed logs
sudo journalctl -u bakery -n 50

# Common fixes:
# - Check .env file exists and has correct values
# - Verify virtual environment path in service file
# - Check file permissions: sudo chown -R ubuntu:www-data /home/ubuntu/bakery_project
# - Check Python path: which python (inside venv)
```

#### 2. 502 Bad Gateway
```bash
# Usually means gunicorn is not running
sudo systemctl status bakery
sudo systemctl restart bakery

# Check if port 8000 is listening
sudo netstat -tulpn | grep :8000

# Check gunicorn logs
tail -f /home/ubuntu/bakery_project/logs/error.log
```

#### 3. Static Files Not Loading
```bash
# Re-collect static files
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py collectstatic --noinput

# Check nginx config
sudo nginx -t

# Verify static files path in nginx.conf
ls -la /home/ubuntu/bakery_project/staticfiles/

# Check permissions
sudo chown -R ubuntu:www-data /home/ubuntu/bakery_project/staticfiles/
sudo chmod -R 755 /home/ubuntu/bakery_project/staticfiles/
```

#### 4. Database Migration Errors
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate

# Check migration status
python manage.py showmigrations

# Fake migration if needed (careful!)
python manage.py migrate --fake

# Create new migration
python manage.py makemigrations
python manage.py migrate
```

#### 5. Permission Denied Errors
```bash
# Fix ownership
sudo chown -R ubuntu:www-data /home/ubuntu/bakery_project

# Fix permissions
sudo chmod -R 755 /home/ubuntu/bakery_project
sudo chmod 600 /home/ubuntu/bakery_project/.env
sudo chmod -R 775 /home/ubuntu/bakery_project/logs
sudo chmod -R 775 /home/ubuntu/bakery_project/media
```

#### 6. SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test nginx SSL config
sudo nginx -t

# Check SSL expiry
openssl s_client -connect your-domain.com:443 -servername your-domain.com | openssl x509 -noout -dates
```

#### 7. High Memory Usage
```bash
# Check memory
free -h

# Reduce gunicorn workers
nano /etc/systemd/system/bakery.service
# Change --workers 3 to --workers 2

sudo systemctl daemon-reload
sudo systemctl restart bakery

# Consider disabling chatbot if memory constrained
# Comment out chatbot loading in views
```

### Getting Help

#### Check Logs First
```bash
# All logs at once
sudo journalctl -u bakery -n 100
tail -100 /home/ubuntu/bakery_project/logs/error.log
sudo tail -100 /var/log/nginx/bakery_error.log
```

#### Debug Mode (Temporarily)
```bash
# NEVER use in production long-term!
nano /home/ubuntu/bakery_project/.env
# Change DEBUG=False to DEBUG=True
sudo systemctl restart bakery

# View detailed error in browser
# Remember to set DEBUG=False after debugging!
```

---

## Security Best Practices

### 1. Strong Credentials
- Use strong, unique passwords
- Change default passwords immediately
- Use SSH keys instead of passwords
- Store credentials securely

### 2. Keep Software Updated
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Configure Firewall
```bash
sudo ufw status
# Only allow necessary ports: 22, 80, 443
```

### 4. Regular Backups
- Database backups daily
- Full system backups weekly
- Store backups off-server

### 5. Monitor Logs
- Check logs regularly for suspicious activity
- Set up alerting for critical errors

### 6. Disable Root Login
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 7. Use Environment Variables
- Never commit secrets to Git
- Keep .env file secure (chmod 600)
- Use different keys for dev/prod

---

## Performance Optimization

### 1. Enable Gzip Compression
Already configured in nginx.conf

### 2. Database Optimization
```bash
# For PostgreSQL (if using)
# Regularly vacuum and analyze
# Configure connection pooling
```

### 3. Caching
```python
# Add to settings.py for production
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

### 4. CDN for Static Files
- Consider using CloudFlare or AWS CloudFront
- Reduces server load
- Improves global performance

---

## Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Hostinger VPS Tutorials](https://www.hostinger.com/tutorials/vps)

---

## Support

For issues specific to this application:
- Check application logs first
- Review this troubleshooting guide
- Contact your system administrator

---

**Last Updated:** 2026-02-21
**Version:** 1.0
