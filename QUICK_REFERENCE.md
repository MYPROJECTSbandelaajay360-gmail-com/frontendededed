# The Bake Story - Quick Reference Guide

Quick reference for common commands and operations.

---

## 🚀 Service Management

### Check Service Status
```bash
sudo systemctl status bakery      # Application status
sudo systemctl status nginx        # Web server status
```

### Restart Services
```bash
sudo systemctl restart bakery      # Restart application
sudo systemctl restart nginx       # Restart web server
sudo systemctl restart bakery nginx  # Restart both
```

### Stop/Start Services
```bash
sudo systemctl stop bakery
sudo systemctl start bakery
```

### Enable/Disable Auto-Start
```bash
sudo systemctl enable bakery       # Start on boot
sudo systemctl disable bakery      # Don't start on boot
```

---

## 📝 View Logs

### Application Logs
```bash
# Error logs
tail -f /home/ubuntu/bakery_project/logs/error.log

# Access logs
tail -f /home/ubuntu/bakery_project/logs/access.log

# Last 50 lines
tail -50 /home/ubuntu/bakery_project/logs/error.log
```

### System Logs
```bash
# Application service logs (live)
sudo journalctl -u bakery -f

# Last 100 lines
sudo journalctl -u bakery -n 100

# Today's logs only
sudo journalctl -u bakery --since today

# Nginx logs
sudo tail -f /var/log/nginx/bakery_error.log
sudo tail -f /var/log/nginx/bakery_access.log
```

---

## 🔄 Update Application

### Pull Latest Code
```bash
cd /home/ubuntu/bakery_project
git pull origin main
```

### Update Dependencies
```bash
source venv/bin/activate
pip install -r requirements.txt --upgrade
```

### Run Migrations
```bash
source venv/bin/activate
python manage.py migrate
```

### Collect Static Files
```bash
source venv/bin/activate
python manage.py collectstatic --noinput
```

### Restart After Update
```bash
sudo systemctl restart bakery
```

### Complete Update Script
```bash
cd /home/ubuntu/bakery_project
git pull origin main
source venv/bin/activate
pip install -r requirements.txt --upgrade
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart bakery
```

---

## 💾 Database Management

### Create Backup
```bash
# SQLite backup
cd /home/ubuntu/bakery_project
cp db.sqlite3 ~/backups/db.sqlite3.$(date +%Y%m%d_%H%M%S)
```

### Restore Backup
```bash
cd /home/ubuntu/bakery_project
sudo systemctl stop bakery
cp ~/backups/db.sqlite3.YYYYMMDD_HHMMSS db.sqlite3
sudo systemctl start bakery
```

### Run Migrations
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py migrate
```

### Create Migrations
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

### Django Shell
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py shell
```

---

## 👤 User Management

### Create Superuser
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py createsuperuser
```

### Change Password
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py changepassword username
```

---

## 🌐 Nginx Commands

### Test Configuration
```bash
sudo nginx -t
```

### Reload Configuration
```bash
sudo systemctl reload nginx
```

### View Configuration
```bash
sudo nano /etc/nginx/sites-available/bakery
```

---

## 🔒 SSL Certificate

### Install/Renew Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Renew Certificate
```bash
sudo certbot renew
```

### Test Renewal
```bash
sudo certbot renew --dry-run
```

### Check Certificate Status
```bash
sudo certbot certificates
```

### Check Expiry Date
```bash
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com | openssl x509 -noout -dates
```

---

## 📊 System Monitoring

### Disk Space
```bash
df -h                              # All disks
du -sh /home/ubuntu/bakery_project/*  # Project size
```

### Memory Usage
```bash
free -h                            # Memory overview
ps aux --sort=-%mem | head         # Top memory users
```

### CPU Usage
```bash
top                                # Live monitoring
htop                               # Better UI (if installed)
```

### Network Connections
```bash
sudo netstat -tulpn | grep :80     # Port 80 connections
sudo netstat -tulpn | grep :8000   # Port 8000 connections
```

### Process Information
```bash
ps aux | grep gunicorn             # Gunicorn processes
ps aux | grep nginx                # Nginx processes
```

---

## 🔧 Configuration

### Edit Environment Variables
```bash
nano /home/ubuntu/bakery_project/.env
sudo systemctl restart bakery      # Restart after changes
```

### Edit Django Settings
```bash
nano /home/ubuntu/bakery_project/bakery_project/settings.py
sudo systemctl restart bakery      # Restart after changes
```

### Edit Nginx Config
```bash
sudo nano /etc/nginx/sites-available/bakery
sudo nginx -t                      # Test configuration
sudo systemctl reload nginx        # Apply changes
```

### Edit Systemd Service
```bash
sudo nano /etc/systemd/system/bakery.service
sudo systemctl daemon-reload       # Reload systemd
sudo systemctl restart bakery      # Restart service
```

---

## 🔥 Firewall

### Check Status
```bash
sudo ufw status
```

### Allow Port
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Deny Port
```bash
sudo ufw deny 8000/tcp
```

### Reset Firewall
```bash
sudo ufw reset
```

---

## 🐛 Debugging

### Enable Debug Mode (Temporarily)
```bash
nano /home/ubuntu/bakery_project/.env
# Change: DEBUG=True
sudo systemctl restart bakery
# REMEMBER TO SET DEBUG=False AFTER DEBUGGING!
```

### Check If Application is Responding
```bash
curl http://localhost:8000
curl http://localhost
```

### Test Gunicorn Directly
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
gunicorn bakery_project.wsgi:application --bind 127.0.0.1:8000
# Ctrl+C to stop
```

### Run Django Development Server
```bash
cd /home/ubuntu/bakery_project
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001
# Use different port than production
```

---

## 🏥 Health Check

### Run Health Check Script
```bash
cd /home/ubuntu/bakery_project
sudo bash health_check.sh
```

### Quick Health Check
```bash
# Check services
sudo systemctl is-active bakery nginx

# Check response
curl -I http://localhost:8000

# Check recent errors
tail -20 /home/ubuntu/bakery_project/logs/error.log
```

---

## 📦 File Permissions

### Fix Ownership
```bash
sudo chown -R ubuntu:www-data /home/ubuntu/bakery_project
```

### Fix Permissions
```bash
sudo chmod -R 755 /home/ubuntu/bakery_project
sudo chmod 600 /home/ubuntu/bakery_project/.env
sudo chmod -R 775 /home/ubuntu/bakery_project/logs
sudo chmod -R 775 /home/ubuntu/bakery_project/media
```

---

## 🔄 Maintenance Automation

### Automated Backup Script
Create `~/backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
cp /home/ubuntu/bakery_project/db.sqlite3 $BACKUP_DIR/db.sqlite3.$(date +%Y%m%d_%H%M%S)
find $BACKUP_DIR -name "db.sqlite3.*" -mtime +7 -delete
```

Make executable and add to cron:
```bash
chmod +x ~/backup.sh
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

---

## 🆘 Emergency Procedures

### Application Not Responding
```bash
sudo systemctl restart bakery
sudo systemctl restart nginx
```

### Database Corrupted
```bash
cd /home/ubuntu/bakery_project
sudo systemctl stop bakery
cp ~/backups/db.sqlite3.latest db.sqlite3
sudo systemctl start bakery
```

### Out of Disk Space
```bash
# Clean old logs
sudo journalctl --vacuum-time=7d
find /home/ubuntu/bakery_project/logs -name "*.log.*" -delete

# Clean apt cache
sudo apt clean
```

### High Memory Usage
```bash
# Reduce workers
sudo nano /etc/systemd/system/bakery.service
# Change --workers 3 to --workers 2
sudo systemctl daemon-reload
sudo systemctl restart bakery
```

---

## 📞 Get Help

### View All Error Logs
```bash
sudo journalctl -u bakery -n 100
tail -100 /home/ubuntu/bakery_project/logs/error.log
sudo tail -100 /var/log/nginx/bakery_error.log
```

### System Information
```bash
# OS version
lsb_release -a

# Python version
python3 --version

# Django version
cd /home/ubuntu/bakery_project
source venv/bin/activate
python -m django --version
```

---

**For detailed deployment and troubleshooting, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
