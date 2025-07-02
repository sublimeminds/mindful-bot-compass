import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: any) => string;
}

class PerformanceService {
  private performanceObserver?: PerformanceObserver;
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  // Performance Monitoring
  startPerformanceMonitoring() {
    // Web Vitals monitoring
    this.observeWebVitals();
    
    // Navigation timing
    this.trackNavigationTiming();
    
    // Resource timing
    this.trackResourceTiming();
    
    // Error tracking
    this.setupErrorTracking();
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, {
          element: lastEntry.element?.tagName,
          url: lastEntry.url
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime, {
            target: entry.target?.tagName
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('CLS', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private trackNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        
        this.recordMetric('TTFB', nav.responseStart - nav.fetchStart);
        this.recordMetric('DOMContentLoaded', nav.domContentLoadedEventEnd - nav.fetchStart);
        this.recordMetric('LoadComplete', nav.loadEventEnd - nav.fetchStart);
        this.recordMetric('DNSLookup', nav.domainLookupEnd - nav.domainLookupStart);
        this.recordMetric('TCPConnect', nav.connectEnd - nav.connectStart);
      }
    }
  }

  private trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('ResourceLoadTime', entry.duration, {
            resource: entry.name,
            type: (entry as any).initiatorType,
            size: (entry as any).transferSize
          });
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  private setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordMetric('JSError', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('UnhandledPromiseRejection', 1, {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });
  }

  async recordMetric(name: string, value: number, metadata: Record<string, any> = {}) {
    try {
      const metric: Omit<PerformanceMetric, 'id'> = {
        metric_name: name,
        metric_value: value,
        page_url: window.location.href,
        timestamp: new Date(),
        metadata
      };

      // Store locally for immediate access
      const localMetrics = this.getLocalMetrics();
      localMetrics.push({ id: Date.now().toString(), ...metric });
      
      // Keep only last 100 metrics locally
      if (localMetrics.length > 100) {
        localMetrics.splice(0, localMetrics.length - 100);
      }
      
      localStorage.setItem('performance_metrics', JSON.stringify(localMetrics));

      // Send to Supabase (non-blocking)
      this.sendMetricToSupabase(metric);
    } catch (error) {
      console.warn('Failed to record performance metric:', error);
    }
  }

  private async sendMetricToSupabase(metric: Omit<PerformanceMetric, 'id'>) {
    try {
      await supabase
        .from('performance_monitoring')
        .insert({
          service_name: 'frontend',
          endpoint: metric.page_url,
          response_time_ms: Math.round(metric.metric_value),
          user_id: metric.user_id,
          timestamp: metric.timestamp.toISOString()
        });
    } catch (error) {
      // Silently fail - don't impact user experience
      console.warn('Failed to send metric to Supabase:', error);
    }
  }

  getLocalMetrics(): PerformanceMetric[] {
    try {
      const stored = localStorage.getItem('performance_metrics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Rate Limiting
  checkRateLimit(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const limit = this.rateLimitMap.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset or create new limit
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    if (limit.count >= config.maxRequests) {
      return false;
    }

    limit.count++;
    return true;
  }

  // Cache Management
  private cache = new Map<string, { data: any; expiry: number }>();

  setCache(key: string, data: any, ttlMs: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }

  getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clearCache(keyPattern?: string) {
    if (keyPattern) {
      const regex = new RegExp(keyPattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Resource Optimization
  preloadRoute(routePath: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = routePath;
    document.head.appendChild(link);
  }

  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  // Memory Management
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  monitorMemoryUsage(threshold: number = 80) {
    setInterval(() => {
      const memory = this.getMemoryUsage();
      if (memory && memory.usage > threshold) {
        this.recordMetric('HighMemoryUsage', memory.usage, memory);
        console.warn('High memory usage detected:', memory);
      }
    }, 30000); // Check every 30 seconds
  }

  // Performance Budget
  checkPerformanceBudget() {
    const metrics = this.getLocalMetrics();
    const budget = {
      LCP: 2500, // 2.5s
      FID: 100,  // 100ms
      CLS: 0.1,  // 0.1
      TTFB: 600  // 600ms
    };

    const violations = [];
    for (const [metric, threshold] of Object.entries(budget)) {
      const latestMetric = metrics
        .filter(m => m.metric_name === metric)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      if (latestMetric && latestMetric.metric_value > threshold) {
        violations.push({
          metric,
          value: latestMetric.metric_value,
          threshold,
          severity: latestMetric.metric_value > threshold * 1.5 ? 'high' : 'medium'
        });
      }
    }

    return violations;
  }
}

export const performanceService = new PerformanceService();
