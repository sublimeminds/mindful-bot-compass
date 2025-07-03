/**
 * Recovery Analytics - Tracks recovery events, success rates, and performance metrics
 */

interface RecoveryEvent {
  id: string;
  timestamp: number;
  type: 'attempt' | 'success' | 'failure' | 'escalation' | 'auto_fix';
  level: string;
  errorType?: string;
  errorMessage?: string;
  duration?: number;
  strategy?: string;
  userAgent: string;
  url: string;
}

interface RecoveryMetrics {
  totalAttempts: number;
  successRate: number;
  averageRecoveryTime: number;
  mostCommonErrors: Record<string, number>;
  levelUsageStats: Record<string, number>;
  autoFixSuccessRate: number;
  escalationRate: number;
  timeToRecovery: number[];
}

interface PerformanceSnapshot {
  timestamp: number;
  memoryUsage: number;
  loadTime: number;
  errorCount: number;
  recoveryActive: boolean;
  healthScore: number;
}

class RecoveryAnalytics {
  private events: RecoveryEvent[] = [];
  private performanceSnapshots: PerformanceSnapshot[] = [];
  private maxEvents = 1000;
  private maxSnapshots = 100;
  private listeners: Set<(metrics: RecoveryMetrics) => void> = new Set();
  private performanceInterval?: number;

  constructor() {
    console.log('RecoveryAnalytics: Initializing...');
    this.loadFromStorage();
    this.startPerformanceMonitoring();
  }

  /**
   * Record a recovery event
   */
  recordEvent(
    type: RecoveryEvent['type'],
    data: Partial<Omit<RecoveryEvent, 'id' | 'timestamp' | 'type' | 'userAgent' | 'url'>> & { level: string }
  ): void {
    const event: RecoveryEvent = {
      id: `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      level: data.level,
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorType: data.errorType,
      errorMessage: data.errorMessage,
      duration: data.duration,
      strategy: data.strategy
    };

    this.events.unshift(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    console.log(`RecoveryAnalytics: Recorded ${type} event`, event);
    
    this.saveToStorage();
    this.notifyListeners();

    // Send to external analytics if available
    this.sendToExternalAnalytics(event);
  }

  /**
   * Start monitoring performance metrics
   */
  private startPerformanceMonitoring(): void {
    if (this.performanceInterval) return;

    this.performanceInterval = window.setInterval(() => {
      this.takePerformanceSnapshot();
    }, 10000); // Every 10 seconds

    console.log('RecoveryAnalytics: Started performance monitoring');
  }

  /**
   * Take a performance snapshot
   */
  private takePerformanceSnapshot(): void {
    try {
      const snapshot: PerformanceSnapshot = {
        timestamp: Date.now(),
        memoryUsage: this.getMemoryUsage(),
        loadTime: this.getPageLoadTime(),
        errorCount: this.getRecentErrorCount(),
        recoveryActive: this.isRecoveryActive(),
        healthScore: this.calculateHealthScore()
      };

      this.performanceSnapshots.unshift(snapshot);
      
      if (this.performanceSnapshots.length > this.maxSnapshots) {
        this.performanceSnapshots = this.performanceSnapshots.slice(0, this.maxSnapshots);
      }

      // Check for performance degradation
      this.checkPerformanceAlerts(snapshot);

    } catch (error) {
      console.warn('RecoveryAnalytics: Performance snapshot failed:', error);
    }
  }

  /**
   * Get memory usage in MB
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }

  /**
   * Get page load time
   */
  private getPageLoadTime(): number {
    const timing = performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  }

  /**
   * Get recent error count (last 5 minutes)
   */
  private getRecentErrorCount(): number {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    return this.events.filter(e => 
      e.timestamp > fiveMinutesAgo && 
      (e.type === 'failure' || e.type === 'attempt')
    ).length;
  }

  /**
   * Check if recovery is currently active
   */
  private isRecoveryActive(): boolean {
    const lastMinute = Date.now() - (60 * 1000);
    return this.events.some(e => 
      e.timestamp > lastMinute && 
      (e.type === 'attempt' || e.type === 'escalation')
    );
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(): number {
    const metrics = this.calculateMetrics();
    const recentSnapshots = this.performanceSnapshots.slice(0, 5);
    
    let score = 100;
    
    // Reduce score based on recent errors
    if (metrics.successRate < 90) score -= (90 - metrics.successRate);
    
    // Reduce score for high escalation rate
    if (metrics.escalationRate > 20) score -= (metrics.escalationRate - 20);
    
    // Reduce score for slow recovery times
    if (metrics.averageRecoveryTime > 5000) {
      score -= Math.min(20, (metrics.averageRecoveryTime - 5000) / 1000);
    }
    
    // Memory usage factor
    const avgMemory = recentSnapshots.reduce((sum, s) => sum + s.memoryUsage, 0) / Math.max(1, recentSnapshots.length);
    if (avgMemory > 100) score -= Math.min(15, (avgMemory - 100) / 10);
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Check for performance alerts
   */
  private checkPerformanceAlerts(snapshot: PerformanceSnapshot): void {
    const alerts: string[] = [];

    if (snapshot.memoryUsage > 150) {
      alerts.push(`High memory usage: ${snapshot.memoryUsage}MB`);
    }

    if (snapshot.errorCount > 5) {
      alerts.push(`High error rate: ${snapshot.errorCount} errors in 5 minutes`);
    }

    if (snapshot.healthScore < 50) {
      alerts.push(`Low health score: ${snapshot.healthScore}/100`);
    }

    if (alerts.length > 0) {
      console.warn('RecoveryAnalytics: Performance alerts:', alerts);
      this.triggerAlert(alerts);
    }
  }

  /**
   * Trigger performance alert
   */
  private triggerAlert(alerts: string[]): void {
    // Could integrate with external alerting systems
    const alertEvent: RecoveryEvent = {
      id: `alert_${Date.now()}`,
      timestamp: Date.now(),
      type: 'failure',
      level: 'system',
      errorType: 'performance',
      errorMessage: alerts.join('; '),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.events.unshift(alertEvent);
  }

  /**
   * Calculate comprehensive metrics
   */
  calculateMetrics(): RecoveryMetrics {
    const attempts = this.events.filter(e => e.type === 'attempt');
    const successes = this.events.filter(e => e.type === 'success');
    const failures = this.events.filter(e => e.type === 'failure');
    const escalations = this.events.filter(e => e.type === 'escalation');
    const autoFixes = this.events.filter(e => e.type === 'auto_fix');

    // Success rate
    const successRate = attempts.length > 0 
      ? (successes.length / attempts.length) * 100 
      : 100;

    // Average recovery time
    const recoveryTimes = successes
      .filter(e => e.duration !== undefined)
      .map(e => e.duration!);
    const averageRecoveryTime = recoveryTimes.length > 0
      ? recoveryTimes.reduce((sum, time) => sum + time, 0) / recoveryTimes.length
      : 0;

    // Most common errors
    const errorCounts: Record<string, number> = {};
    failures.forEach(e => {
      if (e.errorType) {
        errorCounts[e.errorType] = (errorCounts[e.errorType] || 0) + 1;
      }
    });

    // Level usage stats
    const levelCounts: Record<string, number> = {};
    attempts.forEach(e => {
      if (e.level) {
        levelCounts[e.level] = (levelCounts[e.level] || 0) + 1;
      }
    });

    // Auto-fix success rate
    const autoFixAttempts = this.events.filter(e => e.strategy);
    const autoFixSuccesses = autoFixAttempts.filter(e => e.type === 'success');
    const autoFixSuccessRate = autoFixAttempts.length > 0
      ? (autoFixSuccesses.length / autoFixAttempts.length) * 100
      : 0;

    // Escalation rate
    const escalationRate = attempts.length > 0
      ? (escalations.length / attempts.length) * 100
      : 0;

    return {
      totalAttempts: attempts.length,
      successRate: Math.round(successRate * 100) / 100,
      averageRecoveryTime: Math.round(averageRecoveryTime),
      mostCommonErrors: errorCounts,
      levelUsageStats: levelCounts,
      autoFixSuccessRate: Math.round(autoFixSuccessRate * 100) / 100,
      escalationRate: Math.round(escalationRate * 100) / 100,
      timeToRecovery: recoveryTimes
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 50): RecoveryEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Get performance snapshots
   */
  getPerformanceSnapshots(limit = 20): PerformanceSnapshot[] {
    return this.performanceSnapshots.slice(0, limit);
  }

  /**
   * Export data for analysis
   */
  exportData(): { events: RecoveryEvent[]; snapshots: PerformanceSnapshot[]; metrics: RecoveryMetrics } {
    return {
      events: [...this.events],
      snapshots: [...this.performanceSnapshots],
      metrics: this.calculateMetrics()
    };
  }

  /**
   * Add metrics listener
   */
  onMetricsUpdate(callback: (metrics: RecoveryMetrics) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    const metrics = this.calculateMetrics();
    this.listeners.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('RecoveryAnalytics: Listener error:', error);
      }
    });
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('recovery_analytics', JSON.stringify({
        events: this.events.slice(0, 100), // Save only recent events
        snapshots: this.performanceSnapshots.slice(0, 20)
      }));
    } catch (error) {
      console.warn('RecoveryAnalytics: Failed to save to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('recovery_analytics');
      if (data) {
        const parsed = JSON.parse(data);
        this.events = parsed.events || [];
        this.performanceSnapshots = parsed.snapshots || [];
        console.log(`RecoveryAnalytics: Loaded ${this.events.length} events from storage`);
      }
    } catch (error) {
      console.warn('RecoveryAnalytics: Failed to load from storage:', error);
    }
  }

  /**
   * Send to external analytics (placeholder)
   */
  private sendToExternalAnalytics(event: RecoveryEvent): void {
    // Could integrate with services like:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics endpoint
    // - Supabase edge functions
    
    if (process.env.NODE_ENV === 'development') {
      console.debug('RecoveryAnalytics: Would send to external analytics:', event);
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
      this.performanceInterval = undefined;
    }
    this.listeners.clear();
    this.saveToStorage();
    console.log('RecoveryAnalytics: Cleanup complete');
  }
}

export const recoveryAnalytics = new RecoveryAnalytics();
