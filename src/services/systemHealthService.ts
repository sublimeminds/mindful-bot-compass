
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetrics {
  database: {
    connectionStatus: 'healthy' | 'warning' | 'critical';
    responseTime: number;
    activeConnections: number;
    errorRate: number;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  application: {
    uptime: number;
    totalUsers: number;
    activeSessions: number;
    errorCount: number;
  };
  notifications: {
    deliveryRate: number;
    queueSize: number;
    failedDeliveries: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  component: string;
}

export class SystemHealthService {
  private static alerts: SystemAlert[] = [];

  static async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const startTime = Date.now();
      
      // Test database connectivity and response time
      const { data: dbTest, error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      const dbResponseTime = Date.now() - startTime;
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active sessions (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: activeSessions } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      // Get recent errors from notifications (using failed notifications as proxy)
      const { count: errorCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'error')
        .gte('created_at', yesterday.toISOString());

      // Calculate notification metrics
      const { count: totalNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      const { count: deliveredNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', true)
        .gte('created_at', yesterday.toISOString());

      const deliveryRate = totalNotifications ? (deliveredNotifications / totalNotifications) * 100 : 100;

      // Simulate performance metrics (in real app, these would come from monitoring tools)
      const performanceMetrics = this.generatePerformanceMetrics();

      return {
        database: {
          connectionStatus: dbError ? 'critical' : dbResponseTime > 1000 ? 'warning' : 'healthy',
          responseTime: dbResponseTime,
          activeConnections: Math.floor(Math.random() * 50) + 10, // Simulated
          errorRate: dbError ? 5.2 : Math.random() * 2
        },
        performance: performanceMetrics,
        application: {
          uptime: Date.now() - (Date.now() - 86400000), // 24 hours uptime simulation
          totalUsers: totalUsers || 0,
          activeSessions: activeSessions || 0,
          errorCount: errorCount || 0
        },
        notifications: {
          deliveryRate,
          queueSize: Math.floor(Math.random() * 100),
          failedDeliveries: Math.max(0, (totalNotifications || 0) - (deliveredNotifications || 0))
        }
      };
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      // Return default metrics on error
      return this.getDefaultMetrics();
    }
  }

  private static generatePerformanceMetrics() {
    return {
      cpuUsage: Math.random() * 80 + 10, // 10-90%
      memoryUsage: Math.random() * 70 + 20, // 20-90%
      diskUsage: Math.random() * 60 + 30, // 30-90%
      networkLatency: Math.random() * 100 + 50 // 50-150ms
    };
  }

  private static getDefaultMetrics(): SystemMetrics {
    return {
      database: {
        connectionStatus: 'warning',
        responseTime: 0,
        activeConnections: 0,
        errorRate: 0
      },
      performance: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0
      },
      application: {
        uptime: 0,
        totalUsers: 0,
        activeSessions: 0,
        errorCount: 0
      },
      notifications: {
        deliveryRate: 0,
        queueSize: 0,
        failedDeliveries: 0
      }
    };
  }

  static async getSystemAlerts(): Promise<SystemAlert[]> {
    // In a real implementation, these would come from a monitoring system
    const alerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High Database Response Time',
        message: 'Database response time has exceeded 500ms threshold',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        resolved: false,
        component: 'database'
      },
      {
        id: '2',
        type: 'info',
        title: 'System Backup Completed',
        message: 'Daily system backup completed successfully',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        resolved: true,
        component: 'backup'
      }
    ];

    return alerts;
  }

  static async createAlert(alert: Omit<SystemAlert, 'id' | 'timestamp'>): Promise<void> {
    const newAlert: SystemAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    this.alerts.push(newAlert);
    
    // In a real implementation, this would be stored in the database
    console.log('System alert created:', newAlert);
  }

  static async resolveAlert(alertId: string): Promise<void> {
    const alertIndex = this.alerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].resolved = true;
    }
  }

  static getHealthStatus(metrics: SystemMetrics): 'healthy' | 'warning' | 'critical' {
    const { database, performance, application } = metrics;
    
    // Critical conditions
    if (database.connectionStatus === 'critical' || 
        performance.cpuUsage > 90 || 
        performance.memoryUsage > 95 ||
        application.errorCount > 50) {
      return 'critical';
    }
    
    // Warning conditions
    if (database.connectionStatus === 'warning' || 
        performance.cpuUsage > 75 || 
        performance.memoryUsage > 80 ||
        database.responseTime > 1000 ||
        application.errorCount > 10) {
      return 'warning';
    }
    
    return 'healthy';
  }
}
