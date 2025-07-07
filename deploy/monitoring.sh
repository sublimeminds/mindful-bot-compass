#!/bin/bash

# TherapySync Monitoring Script
# Add to crontab: */5 * * * * /opt/therapysync/deploy/monitoring.sh

LOG_FILE="/var/log/therapysync-monitoring.log"
APP_URL="http://localhost"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# Check if application is responding
check_health() {
    if curl -f -s $APP_URL/health > /dev/null; then
        log "✅ Health check passed"
        return 0
    else
        log "❌ Health check failed"
        return 1
    fi
}

# Check PM2 status
check_pm2() {
    if pm2 jlist | grep -q '"status":"online"'; then
        log "✅ PM2 status: online"
        return 0
    else
        log "❌ PM2 status: offline"
        return 1
    fi
}

# Check Nginx status
check_nginx() {
    if systemctl is-active --quiet nginx; then
        log "✅ Nginx status: active"
        return 0
    else
        log "❌ Nginx status: inactive"
        return 1
    fi
}

# Check disk space
check_disk() {
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ $DISK_USAGE -lt 80 ]; then
        log "✅ Disk usage: ${DISK_USAGE}%"
        return 0
    else
        log "⚠️  Disk usage: ${DISK_USAGE}% (Warning)"
        return 1
    fi
}

# Check memory usage
check_memory() {
    MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
    if [ $MEMORY_USAGE -lt 80 ]; then
        log "✅ Memory usage: ${MEMORY_USAGE}%"
        return 0
    else
        log "⚠️  Memory usage: ${MEMORY_USAGE}% (Warning)"
        return 1
    fi
}

# Restart services if needed
restart_services() {
    log "🔄 Attempting to restart services..."
    
    # Restart PM2
    pm2 restart therapysync
    sleep 5
    
    # Restart Nginx if needed
    sudo systemctl restart nginx
    sleep 5
    
    # Check if services are back online
    if check_health && check_pm2 && check_nginx; then
        log "✅ Services restarted successfully"
        return 0
    else
        log "❌ Service restart failed"
        return 1
    fi
}

# Main monitoring logic
main() {
    log "🔍 Starting health check..."
    
    health_ok=true
    
    # Run all checks
    check_health || health_ok=false
    check_pm2 || health_ok=false
    check_nginx || health_ok=false
    check_disk || health_ok=false
    check_memory || health_ok=false
    
    # If any check failed, try to restart services
    if [ "$health_ok" = false ]; then
        log "⚠️  Issues detected, attempting automatic recovery..."
        restart_services
    else
        log "✅ All systems healthy"
    fi
}

# Run monitoring
main