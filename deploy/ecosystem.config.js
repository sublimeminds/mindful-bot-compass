// PM2 configuration for TherapySync
module.exports = {
  apps: [{
    name: 'therapysync',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Monitoring
    monitoring: true,
    pmx: true,
    
    // Auto restart
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Logs
    log_file: '/var/log/pm2/therapysync-combined.log',
    out_file: '/var/log/pm2/therapysync-out.log',
    error_file: '/var/log/pm2/therapysync-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    
    // Graceful reload
    kill_timeout: 5000,
    listen_timeout: 10000,
    
    // Health check
    health_check_grace_period: 3000
  }]
};