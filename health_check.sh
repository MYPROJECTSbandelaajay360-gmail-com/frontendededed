#!/bin/bash
# ============================================================
# The Bake Story - Health Check Script
# Monitor application health and send alerts if issues detected
# ============================================================

set -e

# Configuration
APP_NAME="bakery"
APP_DIR="/home/ubuntu/bakery_project"
ALERT_EMAIL="btechmuthyam@gmail.com"  # Update with your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "  The Bake Story - Health Check"
echo "  $(date)"
echo "============================================"
echo ""

# Track issues
ISSUES_FOUND=0

# ─── 1. Check if Gunicorn Service is Running ─────────────────
echo -n "Checking Gunicorn service... "
if systemctl is-active --quiet ${APP_NAME}; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ NOT Running${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    echo "  → Try: sudo systemctl restart ${APP_NAME}"
fi

# ─── 2. Check if Nginx is Running ────────────────────────────
echo -n "Checking Nginx service... "
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ NOT Running${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    echo "  → Try: sudo systemctl restart nginx"
fi

# ─── 3. Check if Application is Responding ───────────────────
echo -n "Checking application response... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 2>/dev/null || echo "000")
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
    echo -e "${GREEN}✓ Responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ Not responding (HTTP $HTTP_CODE)${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── 4. Check Disk Space ──────────────────────────────────────
echo -n "Checking disk space... "
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ ${DISK_USAGE}% used${NC}"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ ${DISK_USAGE}% used (Warning)${NC}"
else
    echo -e "${RED}✗ ${DISK_USAGE}% used (Critical)${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── 5. Check Memory Usage ────────────────────────────────────
echo -n "Checking memory usage... "
MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
if [ "$MEM_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ ${MEM_USAGE}% used${NC}"
elif [ "$MEM_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠ ${MEM_USAGE}% used (Warning)${NC}"
else
    echo -e "${RED}✗ ${MEM_USAGE}% used (Critical)${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── 6. Check Log Files for Recent Errors ────────────────────
echo -n "Checking recent errors in logs... "
if [ -f "$APP_DIR/logs/error.log" ]; then
    ERROR_COUNT=$(tail -100 "$APP_DIR/logs/error.log" 2>/dev/null | grep -i "error" | wc -l)
    if [ "$ERROR_COUNT" -eq 0 ]; then
        echo -e "${GREEN}✓ No recent errors${NC}"
    elif [ "$ERROR_COUNT" -lt 5 ]; then
        echo -e "${YELLOW}⚠ $ERROR_COUNT errors in last 100 lines${NC}"
    else
        echo -e "${RED}✗ $ERROR_COUNT errors in last 100 lines${NC}"
        echo "  → Recent errors:"
        tail -20 "$APP_DIR/logs/error.log" | grep -i "error" | tail -3
    fi
else
    echo -e "${YELLOW}⚠ Log file not found${NC}"
fi

# ─── 7. Check Database File ───────────────────────────────────
echo -n "Checking database... "
if [ -f "$APP_DIR/db.sqlite3" ]; then
    DB_SIZE=$(du -h "$APP_DIR/db.sqlite3" | cut -f1)
    echo -e "${GREEN}✓ Exists (${DB_SIZE})${NC}"
else
    echo -e "${RED}✗ Database file not found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── 8. Check SSL Certificate (if exists) ────────────────────
echo -n "Checking SSL certificate... "
DOMAIN=$(grep "server_name" /etc/nginx/sites-available/${APP_NAME} 2>/dev/null | awk '{print $2}' | head -1 | tr -d ';')
if [ -n "$DOMAIN" ] && [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
    
    if [ "$DAYS_LEFT" -gt 30 ]; then
        echo -e "${GREEN}✓ Valid ($DAYS_LEFT days left)${NC}"
    elif [ "$DAYS_LEFT" -gt 7 ]; then
        echo -e "${YELLOW}⚠ Expiring soon ($DAYS_LEFT days left)${NC}"
    else
        echo -e "${RED}✗ Expiring very soon ($DAYS_LEFT days left)${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${YELLOW}⚠ Not configured or not found${NC}"
fi

# ─── 9. Check Gunicorn Workers ───────────────────────────────
echo -n "Checking Gunicorn workers... "
WORKER_COUNT=$(ps aux | grep "gunicorn.*workers" | grep -v grep | wc -l)
if [ "$WORKER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ $WORKER_COUNT processes${NC}"
else
    echo -e "${RED}✗ No workers found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── 10. Check Port 8000 Listening ───────────────────────────
echo -n "Checking if port 8000 is listening... "
if netstat -tuln 2>/dev/null | grep -q ":8000 "; then
    echo -e "${GREEN}✓ Listening${NC}"
else
    echo -e "${RED}✗ Not listening${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# ─── Summary ──────────────────────────────────────────────────
echo ""
echo "============================================"
if [ "$ISSUES_FOUND" -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Application is healthy.${NC}"
    exit 0
else
    echo -e "${RED}✗ Found $ISSUES_FOUND issue(s)!${NC}"
    echo ""
    echo "To view logs:"
    echo "  sudo journalctl -u ${APP_NAME} -n 50"
    echo "  tail -50 $APP_DIR/logs/error.log"
    echo ""
    echo "To restart services:"
    echo "  sudo systemctl restart ${APP_NAME}"
    echo "  sudo systemctl restart nginx"
    echo "============================================"
    exit 1
fi
