#!/bin/bash

# TherapySync Rollback Script
# Usage: ./rollback.sh [backup_name]

set -e

APP_DIR="/opt/therapysync"
BACKUP_DIR="/opt/therapysync-backups"

if [ -z "$1" ]; then
    echo "Available backups:"
    ls -la $BACKUP_DIR/
    echo ""
    echo "Usage: ./rollback.sh <backup_name>"
    echo "Example: ./rollback.sh backup_20241207_143022"
    exit 1
fi

BACKUP_NAME=$1
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Backup $BACKUP_NAME not found"
    exit 1
fi

echo "🔄 Rolling back to $BACKUP_NAME..."

# Create current backup before rollback
CURRENT_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
if [ -d "$APP_DIR/dist" ]; then
    cp -r $APP_DIR/dist $BACKUP_DIR/current_$CURRENT_TIMESTAMP
fi

# Restore backup
rm -rf $APP_DIR/dist
cp -r $BACKUP_PATH $APP_DIR/dist

# Reload services
pm2 reload therapysync
sudo systemctl reload nginx

# Health check
sleep 5
if curl -f http://localhost/health; then
    echo "✅ Rollback completed successfully"
else
    echo "❌ Rollback health check failed"
    exit 1
fi