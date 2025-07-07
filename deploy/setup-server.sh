#!/bin/bash

# TherapySync Server Setup Script
# Run as root: sudo bash setup-server.sh

set -e

echo "🚀 Setting up TherapySync Production Server..."

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential software-properties-common ufw fail2ban htop

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2 serve

# Install Nginx
apt install -y nginx

# Install Certbot (backup SSL solution)
apt install -y certbot python3-certbot-nginx

# Create deployment user
useradd -m -s /bin/bash therapysync
usermod -aG sudo therapysync

# Create application directory
mkdir -p /opt/therapysync
chown therapysync:therapysync /opt/therapysync

# Create log directories
mkdir -p /var/log/pm2
chown therapysync:therapysync /var/log/pm2

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configure fail2ban
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
systemctl enable fail2ban
systemctl start fail2ban

# Setup SSH key authentication (disable password auth)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
systemctl restart ssh

# Configure automatic security updates
apt install -y unattended-upgrades
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades

# Start and enable services
systemctl enable nginx
systemctl start nginx

echo "✅ Server setup complete!"
echo "📝 Next steps:"
echo "1. Copy your SSH public key to /home/therapysync/.ssh/authorized_keys"
echo "2. Configure Nginx with your domain"
echo "3. Set up Cloudflare SSL certificates"
echo "4. Deploy your application"