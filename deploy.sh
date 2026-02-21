#!/bin/bash
# ============================================================
# The Bake Story - VPS Deployment Script
# For Hostinger VPS or any Ubuntu/Debian VPS
# Run as: sudo bash deploy.sh
# ============================================================

set -e  # Exit immediately on error

echo "============================================"
echo "  The Bake Story - VPS Deployment Script"
echo "============================================"

# ─── Configuration Variables ──────────────────────────────────
# NOTE: Adjust APP_USER if your username is different (e.g., 'ubuntuu')
REPO_DIR="/home/ubuntu/bakery_repo"
APP_DIR="/home/ubuntu/bakery_repo/bakery_project"
APP_USER="ubuntu"
APP_NAME="bakery"
GIT_REPO="https://github.com/MYPROJECTSbandelaajay360-gmail-com/frontendededed.git"
GIT_BRANCH="main"

echo ""
echo "Configuration:"
echo "  Repository: $REPO_DIR"
echo "  Django App: $APP_DIR"
echo "  App User: $APP_USER"
echo "  App Name: $APP_NAME"
echo ""

# ─── 1. Update System Packages ───────────────────────────────
echo "[1/10] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y python3 python3-pip python3-venv nginx git curl ufw certbot python3-certbot-nginx

# ─── 2. Clone or Pull Project ────────────────────────────────
echo "[2/10] Setting up project directory..."

if [ -d "$REPO_DIR/.git" ]; then
    echo "  → Pulling latest changes..."
    cd "$REPO_DIR"
    sudo -u $APP_USER git pull origin $GIT_BRANCH
else
    echo "  → Cloning repository..."
    if [ ! -d "$REPO_DIR" ]; then
        sudo -u $APP_USER git clone $GIT_REPO "$REPO_DIR"
        cd "$REPO_DIR"
        sudo -u $APP_USER git checkout $GIT_BRANCH
    else
        echo "  → Directory exists but is not a git repo. Please check manually."
        exit 1
    fi
fi

cd "$REPO_DIR"

# ─── 3. Create Virtual Environment ───────────────────────────
echo "[3/10] Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    sudo -u $APP_USER python3 -m venv venv
fi

# ─── 4. Install Dependencies ──────────────────────────────────
echo "[4/10] Installing Python dependencies..."
sudo -u $APP_USER bash -c "source $REPO_DIR/venv/bin/activate && pip install --upgrade pip && pip install -r $REPO_DIR/requirements.txt"

# ─── 5. Configure Environment ────────────────────────────────
echo "[5/10] Configuring environment..."
cd "$APP_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
    echo "  → Creating .env from .env.production template..."
    sudo -u $APP_USER cp "$REPO_DIR/.env.production" "$APP_DIR/.env"
    echo ""
    echo "  ⚠  IMPORTANT: Edit .env and fill in your real credentials!"
    echo "     nano $APP_DIR/.env"
    echo ""
    echo "  Press Enter to continue or Ctrl+C to exit and configure now..."
    read
fi

# ─── 6. Django Setup ──────────────────────────────────────────
echo "[6/10] Running Django setup..."
sudo -u $APP_USER bash -c "source $REPO_DIR/venv/bin/activate && cd $APP_DIR && python3 manage.py migrate --noinput"
sudo -u $APP_USER bash -c "source $REPO_DIR/venv/bin/activate && cd $APP_DIR && python3 manage.py collectstatic --noinput"
sudo -u $APP_USER mkdir -p "$APP_DIR/logs" "$APP_DIR/media"
sudo chown -R $APP_USER:www-data "$REPO_DIR"
sudo chmod -R 755 "$REPO_DIR"

# Create Django superuser (optional - run manually if needed)
# sudo -u $APP_USER bash -c "source venv/bin/activate && cd $APP_DIR && python manage.py createsuperuser"

# ─── 7. Create Systemd Service ───────────────────────────────
echo "[7/10] Creating systemd service for gunicorn..."
cat > /etc/systemd/system/${APP_NAME}.service <<EOF
[Unit]
Description=The Bake Story - Gunicorn Daemon
After=network.target

[Service]
User=$APP_USER
Group=www-data
WorkingDirectory=$APP_DIR
Environment="PATH=$REPO_DIR/venv/bin"
EnvironmentFile=$APP_DIR/.env
ExecStart=$REPO_DIR/venv/bin/gunicorn \\
    bakery_project.wsgi:application \\
    --bind 127.0.0.1:8000 \\
    --workers 3 \\
    --threads 2 \\
    --timeout 120 \\
    --log-level warning \\
    --access-logfile $APP_DIR/logs/access.log \\
    --error-logfile $APP_DIR/logs/error.log \\
    --capture-output \\
    --enable-stdio-inheritance
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF
    --timeout 120 \\
    --log-level warning \\
    --access-logfile $APP_DIR/logs/access.log \\
    --error-logfile $APP_DIR/logs/error.log \\
    --capture-output \\
    --enable-stdio-inheritance
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${APP_NAME}
systemctl restart ${APP_NAME}
echo "  ✓ Gunicorn service started"

# ─── 8. Configure Nginx ───────────────────────────────────────
echo "[8/10] Configuring Nginx..."

# Backup existing nginx config if it exists
if [ -f "/etc/nginx/sites-available/${APP_NAME}" ]; then
    cp /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-available/${APP_NAME}.backup.$(date +%s)
fi

cp "$REPO_DIR/nginx.conf" "/etc/nginx/sites-available/${APP_NAME}"
ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default   # Remove default site

echo ""
echo "  ⚠  IMPORTANT: Edit the nginx config and replace placeholders:"
echo "     nano /etc/nginx/sites-available/${APP_NAME}"
echo "     Replace 'your-domain.com' with your actual domain"
echo "     Replace 'your-vps-ip' with your VPS IP address"
echo "     Replace paths if APP_DIR is different"
echo ""
echo "  Press Enter after editing to test nginx config..."
read

# Test nginx config
nginx -t

if [ $? -eq 0 ]; then
    systemctl restart nginx
    systemctl enable nginx
    echo "  ✓ Nginx configured and started"
else
    echo "  ✗ Nginx configuration test failed. Please fix errors and run: sudo nginx -t"
    exit 1
fi

# ─── 9. Firewall Configuration ───────────────────────────────
echo "[9/10] Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable
echo "  ✓ Firewall rules set"

# ─── 10. SSL Certificate (Optional) ───────────────────────────
echo "[10/10] SSL Certificate Setup (Optional)..."
echo ""
echo "  To enable HTTPS with free SSL certificate from Let's Encrypt:"
echo "  1. Make sure your domain DNS is pointing to this server"
echo "  2. Run: sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo "  3. Follow the prompts"
echo "  4. Certbot will automatically configure nginx for HTTPS"
echo "  5. Update .env: SECURE_SSL_REDIRECT=True, SESSION_COOKIE_SECURE=True, CSRF_COOKIE_SECURE=True"
echo "  6. Restart services: sudo systemctl restart ${APP_NAME} nginx"
echo ""
echo "  5. Update .env: SECURE_SSL_REDIRECT=True, SESSION_COOKIE_SECURE=True, CSRF_COOKIE_SECURE=True"
echo "  6. Restart services: sudo systemctl restart ${APP_NAME} nginx"
echo ""

echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo "  Repository: $REPO_DIR"
echo "  Django App: $APP_DIR"
echo "  App URL:    http://thebakestory.store"
echo ""
echo "  Useful commands:"
echo "  • Check gunicorn:    sudo systemctl status ${APP_NAME}"
echo "  • Restart gunicorn:  sudo systemctl restart ${APP_NAME}"
echo "  • Check nginx:       sudo systemctl status nginx"
echo "  • Restart nginx:     sudo systemctl restart nginx"
echo "  • View app logs:     tail -f $APP_DIR/logs/error.log"
echo "  • View access logs:  tail -f $APP_DIR/logs/access.log"
echo "  • Edit environment:  nano $APP_DIR/.env"
echo "============================================"
echo ""
echo "Next Steps:"
echo "  1. Configure your .env file with actual values"
echo "  2. Create Django superuser:"
echo "     cd $APP_DIR && source $REPO_DIR/venv/bin/activate && python3 manage.py createsuperuser"
echo "  3. Set up SSL with certbot (see step 10 above)"
echo "============================================"

