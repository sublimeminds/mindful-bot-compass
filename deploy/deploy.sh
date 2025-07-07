#!/bin/bash

# TherapySync Deployment Script
# Run as therapysync user

set -e

APP_DIR="/opt/therapysync"
BACKUP_DIR="/opt/therapysync-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting TherapySync deployment..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current version
if [ -d "$APP_DIR/dist" ]; then
    echo "📦 Creating backup..."
    cp -r $APP_DIR/dist $BACKUP_DIR/backup_$TIMESTAMP
fi

cd $APP_DIR

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build application
echo "🔨 Building application..."
npm run build

# Test build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - index.html not found"
    exit 1
fi

# Reload PM2
echo "🔄 Reloading PM2..."
pm2 reload therapysync --update-env

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Health check
echo "🏥 Running health check..."
sleep 5
if curl -f http://localhost/health; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed - rolling back..."
    
    # Rollback
    if [ -d "$BACKUP_DIR/backup_$TIMESTAMP" ]; then
        rm -rf $APP_DIR/dist
        cp -r $BACKUP_DIR/backup_$TIMESTAMP $APP_DIR/dist
        pm2 reload therapysync
        sudo systemctl reload nginx
        echo "🔄 Rollback completed"
    fi
    exit 1
fi

# Cleanup old backups (keep last 5)
cd $BACKUP_DIR
ls -t | tail -n +6 | xargs -r rm -rf

echo "✅ Deployment completed successfully!"
echo "🌐 Application is live at your domain"