# Pre-Deployment Checklist for The Bake Story

Use this checklist before deploying to production on Hostinger VPS.

---

## 🎯 Pre-Deployment Overview

- **Estimated Time:** 2-3 hours (first-time deployment)
- **Difficulty:** Intermediate
- **Prerequisites:** VPS access, domain name (optional), basic Linux knowledge

---

## ✅ Checklist

### 1. Infrastructure Preparation

#### VPS (Hostinger or any provider)
- [ ] VPS is created and running
- [ ] VPS has at least 2GB RAM (4GB recommended with chatbot)
- [ ] VPS has at least 20GB storage
- [ ] SSH access is configured
- [ ] VPS IP address is noted: `________________`
- [ ] Root or sudo access is confirmed

#### Domain & DNS (if using custom domain)
- [ ] Domain is purchased/available
- [ ] DNS A record points to VPS IP
- [ ] DNS www subdomain configured (optional)
- [ ] DNS propagation is complete (check: `nslookup your-domain.com`)
- [ ] Domain name noted: `________________`

### 2. Local Project Configuration

#### Environment Files
- [ ] `.env.production` file reviewed
- [ ] `DEBUG=False` confirmed
- [ ] Strong `SECRET_KEY` generated
  ```bash
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```
- [ ] `ALLOWED_HOSTS` updated with domain and VPS IP
- [ ] `CORS_ALLOWED_ORIGINS` updated with your domain
- [ ] `CSRF_TRUSTED_ORIGINS` updated with your domain

#### Payment Gateway (Razorpay)
- [ ] Razorpay account created
- [ ] Business verification completed (for LIVE mode)
- [ ] LIVE API keys obtained (NOT test keys!)
- [ ] `RAZORPAY_KEY_ID` (LIVE) noted: `rzp_live_________________`
- [ ] `RAZORPAY_KEY_SECRET` (LIVE) noted: `________________`
- [ ] Website/callback URL registered in Razorpay dashboard

#### AI Chatbot (GROQ)
- [ ] GROQ account created at console.groq.com
- [ ] API key generated
- [ ] `GROQ_API_KEY` noted: `________________`
- [ ] Chatbot tested locally (optional)
- [ ] OR chatbot disabled if not needed (remove from views)

#### Admin Credentials
- [ ] Admin email configured: `________________`
- [ ] Admin username decided: `________________`
- [ ] Strong admin password ready: `________________`

### 3. Code Repository

#### Git Setup
- [ ] GitHub/GitLab repository created
- [ ] Repository is private (recommended)
- [ ] All sensitive files in `.gitignore`
- [ ] `.env` files NOT committed (verify!)
- [ ] Code pushed to repository
- [ ] Repository URL noted: `________________`
- [ ] Deploy key or access token created (if private repo)

#### Code Review
- [ ] All development debug code removed
- [ ] console.log() and print() statements removed/minimized
- [ ] Test data removed from database
- [ ] No hardcoded credentials in code
- [ ] All TODO comments addressed or documented

### 4. Deployment Files Configuration

#### deploy.sh
- [ ] `GIT_REPO` variable updated with your repository URL
- [ ] `GIT_BRANCH` set correctly (usually `main`)
- [ ] `APP_DIR` path confirmed (default: `/home/ubuntu/bakery_project`)
- [ ] `APP_USER` confirmed (default: `ubuntu`)
- [ ] Script has execute permissions: `chmod +x deploy.sh`

#### nginx.conf
- [ ] `server_name` updated with your domain/IP
- [ ] Static files path matches your `APP_DIR`
- [ ] Media files path matches your `APP_DIR`
- [ ] Port 8000 confirmed for gunicorn backend

#### bakery.service
- [ ] `WorkingDirectory` path matches your `APP_DIR`
- [ ] `Environment PATH` matches your venv location
- [ ] `EnvironmentFile` path matches your .env location
- [ ] `ExecStart` paths are correct
- [ ] Log file paths are correct

### 5. Security Considerations

#### Application Security
- [ ] `DEBUG=False` in production .env
- [ ] Strong `SECRET_KEY` (50+ random characters)
- [ ] `ALLOWED_HOSTS` restricted (not `*`)
- [ ] CORS origins restricted to your domain only
- [ ] All passwords are strong and unique
- [ ] No sensitive data in Git history

#### Server Security
- [ ] SSH key authentication set up (recommended)
- [ ] Password authentication disabled for SSH (recommended)
- [ ] Non-root user created (ubuntu)
- [ ] Firewall rules planned (ports 22, 80, 443 only)
- [ ] Regular update schedule planned

### 6. SSL/HTTPS Planning

#### Let's Encrypt Setup
- [ ] Domain DNS is pointing to VPS (required for SSL)
- [ ] Port 80 and 443 will be open
- [ ] Email for certificate notifications: `________________`
- [ ] Understand certbot will auto-configure nginx
- [ ] Know to update .env after SSL:
  - `SECURE_SSL_REDIRECT=True`
  - `SESSION_COOKIE_SECURE=True`
  - `CSRF_COOKIE_SECURE=True`

### 7. Backup Strategy

#### Before Deployment
- [ ] Local project backup created
- [ ] Database backup plan documented
- [ ] Backup storage location decided: `________________`
- [ ] Backup frequency planned (recommendation: daily)

#### Backup Script
- [ ] Backup script reviewed (see DEPLOYMENT_GUIDE.md)
- [ ] Cron job for automated backups planned
- [ ] Off-server backup location configured (optional)

### 8. Testing Plan

#### Post-Deployment Tests
- [ ] Homepage loads correctly
- [ ] Admin panel accessible: `/admin`
- [ ] User can register/login
- [ ] Menu items display correctly
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Payment gateway integration works (test with Re 1)
- [ ] Order appears in admin panel
- [ ] Chatbot responds (if enabled)
- [ ] Static files load (CSS, images)
- [ ] Mobile responsive design works

### 9. Monitoring Setup

#### Logging
- [ ] Understand log locations:
  - App: `/home/ubuntu/bakery_project/logs/`
  - Systemd: `journalctl -u bakery`
  - Nginx: `/var/log/nginx/`
- [ ] Log rotation configured (in deployment script)

#### Health Monitoring
- [ ] Health check script reviewed: `health_check.sh`
- [ ] Plan to run health checks regularly
- [ ] Uptime monitoring service decided (optional, e.g., UptimeRobot)

### 10. Documentation Review

#### Read These Documents
- [ ] README.md - Project overview
- [ ] DEPLOYMENT_GUIDE.md - Step-by-step deployment
- [ ] QUICK_REFERENCE.md - Common commands
- [ ] CHANGELOG.md - Version history
- [ ] This checklist (you're here!)

### 11. Razorpay Configuration

#### Dashboard Setup
- [ ] Login to Razorpay Dashboard
- [ ] Go to Settings → API Keys → Live Mode
- [ ] Generate Live API keys
- [ ] Note down Key ID and Secret
- [ ] Go to Settings → Webhooks
- [ ] Add webhook URL: `https://your-domain.com/api/razorpay/webhook/`
- [ ] Select events: `payment.captured`, `payment.failed`
- [ ] Copy webhook secret to .env
- [ ] Set brand colors and logo (optional)
- [ ] Configure payment methods (UPI, Cards, etc.)
- [ ] Test payment in live mode (Re 1 test transaction)

### 12. Final Pre-Flight Checks

#### Double Check
- [ ] All credentials are secured
- [ ] No .env file in Git repository
- [ ] DEBUG=False in production
- [ ] Using LIVE payment keys (not test)
- [ ] Domain DNS has propagated (if using)
- [ ] VPS is accessible via SSH
- [ ] You have backups of everything
- [ ] Deployment time window scheduled (low traffic time)

#### Ready to Deploy
- [ ] All above items checked
- [ ] Team notified (if applicable)
- [ ] Rollback plan understood
- [ ] Support contact information ready
- [ ] Coffee/tea prepared ☕

---

## 🚀 Deployment Steps Summary

Once all checklist items are complete:

1. **Connect to VPS**
   ```bash
   ssh ubuntu@your-vps-ip
   ```

2. **Upload/Clone Project**
   ```bash
   cd /home/ubuntu
   git clone your-repo-url bakery_project
   cd bakery_project
   ```

3. **Configure Environment**
   ```bash
   cp .env.production .env
   nano .env  # Edit with actual values
   ```

4. **Update Configuration Files**
   ```bash
   nano deploy.sh     # Update GIT_REPO
   nano nginx.conf    # Update server_name
   ```

5. **Run Deployment**
   ```bash
   sudo bash deploy.sh
   ```

6. **Create Superuser**
   ```bash
   cd /home/ubuntu/bakery_project
   source venv/bin/activate
   python manage.py createsuperuser
   ```

7. **Test Application**
   - Access: `http://your-vps-ip` or `http://your-domain.com`
   - Admin: `http://your-domain.com/admin`

8. **Set up SSL (after DNS is working)**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

9. **Update .env for HTTPS**
   ```bash
   nano /home/ubuntu/bakery_project/.env
   # Set SSL settings to True
   sudo systemctl restart bakery
   ```

10. **Run Health Check**
    ```bash
    sudo bash health_check.sh
    ```

---

## 📋 Post-Deployment Tasks

After successful deployment:

- [ ] Test all functionality thoroughly
- [ ] Make a test order (with Re 1)
- [ ] Verify payment webhook works
- [ ] Check all logs for errors
- [ ] Set up automated backups
- [ ] Configure uptime monitoring
- [ ] Document any issues encountered
- [ ] Update team/stakeholders
- [ ] Schedule first maintenance window
- [ ] Add server to monitoring dashboard
- [ ] Test backup restore procedure

---

## 🆘 If Something Goes Wrong

1. **Don't Panic** 🧘‍♂️
2. **Check logs**: `tail -f /home/ubuntu/bakery_project/logs/error.log`
3. **Check service**: `sudo systemctl status bakery`
4. **Restart services**: `sudo systemctl restart bakery nginx`
5. **Consult**: DEPLOYMENT_GUIDE.md → Troubleshooting section
6. **Ask for help** with specific error messages

---

## 📞 Support Resources

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Django Docs**: https://docs.djangoproject.com/
- **Hostinger Support**: https://www.hostinger.com/tutorials/
- **Email**: btechmuthyam@gmail.com

---

## ✨ Tips for Successful Deployment

1. **Test locally first** - Ensure everything works on your machine
2. **Deploy during low traffic** - Minimize user impact
3. **Have a backup** - Always have a rollback plan
4. **Document everything** - Note down any issues and solutions
5. **Take your time** - Don't rush through steps
6. **Read error messages** - They usually tell you what's wrong
7. **Test after each step** - Don't wait until the end
8. **Keep credentials safe** - Never share or commit them
9. **Monitor after deployment** - Watch logs for first few hours
10. **Celebrate success** 🎉 - You've earned it!

---

**Good luck with your deployment! 🚀**

Save this checklist and check off items as you complete them.
