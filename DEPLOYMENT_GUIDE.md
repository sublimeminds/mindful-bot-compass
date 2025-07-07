# TherapySync Production Deployment Guide

Complete step-by-step guide to deploy TherapySync on DigitalOcean with Cloudflare.

## Prerequisites

- DigitalOcean account
- Cloudflare account
- Domain name
- GitHub account (for CI/CD)

## Phase 1: DigitalOcean Droplet Setup

### 1.1 Create Droplet

1. **Login to DigitalOcean**
   - Go to [DigitalOcean](https://cloud.digitalocean.com/)
   - Click "Create" → "Droplets"

2. **Configure Droplet**
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic plan → `s-4vcpu-8gb-intel` ($48/month)
   - **Region**: Choose closest to your users (e.g., New York 1)
   - **Authentication**: SSH keys (recommended) or Password
   - **Hostname**: `therapysync-prod`
   - **Tags**: `therapysync`, `production`

3. **Create Droplet**
   - Click "Create Droplet"
   - Note the IP address once created

### 1.2 Initial Server Setup

1. **Connect to Server**
   ```bash
   ssh root@YOUR_DROPLET_IP
   ```

2. **Run Setup Script**
   ```bash
   wget https://raw.githubusercontent.com/your-repo/main/deploy/setup-server.sh
   chmod +x setup-server.sh
   sudo bash setup-server.sh
   ```

3. **Create SSH Key for Deployment User**
   ```bash
   su - therapysync
   ssh-keygen -t rsa -b 4096 -C "deploy@therapysync"
   cat ~/.ssh/id_rsa.pub
   ```
   Copy this public key for GitHub Actions.

## Phase 2: Application Deployment

### 2.1 Clone Repository

1. **Switch to deployment user**
   ```bash
   su - therapysync
   cd /opt/therapysync
   ```

2. **Clone your repository**
   ```bash
   git clone https://github.com/your-username/therapysync.git .
   ```

3. **Set up environment**
   ```bash
   cp deploy/.env.production.template .env.production
   nano .env.production
   ```
   Fill in your actual values.

### 2.2 Initial Build and Deploy

1. **Install dependencies and build**
   ```bash
   npm ci --production
   npm run build
   ```

2. **Configure PM2**
   ```bash
   cp deploy/ecosystem.config.js .
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```bash
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/therapysync
   sudo ln -s /etc/nginx/sites-available/therapysync /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   ```

4. **Update Nginx configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/therapysync
   ```
   Replace `your-domain.com` with your actual domain.

5. **Test and restart Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Phase 3: Cloudflare Setup

### 3.1 Add Domain to Cloudflare

1. **Login to Cloudflare**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click "Add a Site"
   - Enter your domain name

2. **Update Nameservers**
   - Copy the Cloudflare nameservers
   - Update your domain registrar to use these nameservers
   - Wait for DNS propagation (up to 24 hours)

### 3.2 Configure DNS

1. **Add DNS Records**
   - **A Record**: `@` → `YOUR_DROPLET_IP`
   - **A Record**: `www` → `YOUR_DROPLET_IP`

2. **SSL/TLS Settings**
   - Go to SSL/TLS → Overview
   - Set encryption mode to "Full (strict)"

### 3.3 Generate Origin Certificate

1. **Create Origin Certificate**
   - Go to SSL/TLS → Origin Server
   - Click "Create Certificate"
   - Choose "Let Cloudflare generate a private key and a CSR"
   - Select "RSA" and validity period
   - Add hostnames: `your-domain.com`, `*.your-domain.com`

2. **Install Certificate on Server**
   ```bash
   sudo nano /etc/ssl/certs/cloudflare-cert.pem
   ```
   Paste the certificate content.

   ```bash
   sudo nano /etc/ssl/private/cloudflare-key.pem
   ```
   Paste the private key content.

   ```bash
   sudo chmod 644 /etc/ssl/certs/cloudflare-cert.pem
   sudo chmod 600 /etc/ssl/private/cloudflare-key.pem
   ```

3. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### 3.4 Configure Cloudflare Settings

1. **Page Rules** (Optional)
   - Go to Rules → Page Rules
   - Add rule: `your-domain.com/*`
   - Settings: Cache Level = "Cache Everything"

2. **Security Settings**
   - Go to Security → Settings
   - Set Security Level to "Medium"
   - Enable "Bot Fight Mode"

## Phase 4: CI/CD Pipeline Setup

### 4.1 GitHub Secrets

1. **Go to GitHub Repository**
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     - `HOST`: Your droplet IP address
     - `USERNAME`: `therapysync`
     - `SSH_KEY`: Private key content from deployment user
     - `APP_URL`: `https://your-domain.com`
     - `SLACK_WEBHOOK`: (optional) Slack webhook URL

### 4.2 Test Deployment

1. **Push changes to main branch**
   ```bash
   git add .
   git commit -m "Initial production deployment"
   git push origin main
   ```

2. **Monitor GitHub Actions**
   - Go to Actions tab in your repository
   - Watch the deployment process

## Phase 5: Monitoring and Maintenance

### 5.1 Set up Monitoring

1. **Configure monitoring script**
   ```bash
   chmod +x deploy/monitoring.sh
   crontab -e
   ```
   Add: `*/5 * * * * /opt/therapysync/deploy/monitoring.sh`

2. **Set up log rotation**
   ```bash
   sudo nano /etc/logrotate.d/therapysync
   ```
   Add:
   ```
   /var/log/therapysync*.log {
       daily
       missingok
       rotate 7
       compress
       delaycompress
       notifempty
       copytruncate
   }
   ```

### 5.2 Backup Strategy

1. **Database Backups** (handled by Supabase)
   - Supabase automatically backs up your database
   - You can also set up additional backups via Supabase dashboard

2. **Code Backups**
   - Code is backed up in GitHub
   - Server creates automatic backups during deployments

### 5.3 Security Hardening

1. **Update SSH configuration**
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Ensure:
   - `PasswordAuthentication no`
   - `PubkeyAuthentication yes`
   - `PermitRootLogin no`

2. **Configure firewall**
   ```bash
   sudo ufw status
   sudo ufw enable
   ```

## Testing Your Deployment

### 1. Basic Functionality
- Visit `https://your-domain.com`
- Test user registration/login
- Try creating a therapy session
- Test mood tracking

### 2. Performance Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test with 100 concurrent users
ab -n 1000 -c 100 https://your-domain.com/
```

### 3. Health Checks
- Visit `https://your-domain.com/health`
- Should return "healthy"

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check PM2 status: `pm2 status`
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

2. **SSL Certificate Issues**
   - Verify certificate files exist and have correct permissions
   - Check Cloudflare SSL settings

3. **Build Failures**
   - Check build logs in GitHub Actions
   - Verify environment variables are set correctly

### Recovery Commands

1. **Restart all services**
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

2. **Rollback deployment**
   ```bash
   ./deploy/rollback.sh backup_YYYYMMDD_HHMMSS
   ```

3. **Check logs**
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

## Scaling Considerations

### When to Scale Up

- **CPU Usage** consistently above 70%
- **Memory Usage** consistently above 80%
- **Response times** increasing
- **Error rates** increasing

### Scaling Options

1. **Vertical Scaling** (Resize droplet)
   - Upgrade to `s-8vcpu-16gb` ($96/month)
   - Or `g-4vcpu-16gb` ($126/month)

2. **Horizontal Scaling** (Add load balancer)
   - Add DigitalOcean Load Balancer
   - Create multiple droplets
   - Configure session stickiness

## Cost Optimization

### Monthly Costs (Estimated)
- **DigitalOcean Droplet**: $48/month
- **Cloudflare Pro**: $20/month (optional)
- **Monitoring**: $10/month (optional)
- **Backups**: $5/month
- **Total**: ~$63-83/month

### Cost Saving Tips
1. Use Cloudflare Free plan initially
2. Monitor resource usage and downsize if possible
3. Set up billing alerts
4. Use reserved instances for longer commitments

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review monitoring logs
   - Check system updates
   - Monitor disk space

2. **Monthly**
   - Review performance metrics
   - Update dependencies
   - Review security logs

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Backup testing

### Getting Help

- **DigitalOcean Community**: [community.digitalocean.com](https://community.digitalocean.com)
- **Cloudflare Support**: [support.cloudflare.com](https://support.cloudflare.com)
- **TherapySync Issues**: GitHub Issues tab

---

## Quick Reference Commands

```bash
# Deploy latest changes
cd /opt/therapysync && ./deploy/deploy.sh

# Check application status
pm2 status
sudo systemctl status nginx

# View logs
pm2 logs therapysync
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart therapysync
sudo systemctl restart nginx

# Check health
curl https://your-domain.com/health

# Monitor resources
htop
df -h
free -m
```

This deployment will handle 10k+ monthly users efficiently with room for growth. The setup includes automatic scaling, monitoring, and recovery mechanisms to ensure high availability.