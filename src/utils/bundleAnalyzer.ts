
interface BundleStats {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  performance: PerformanceMetrics;
}

interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  isAsync: boolean;
}

interface DependencyInfo {
  name: string;
  size: number;
  version: string;
  isDevDependency: boolean;
}

interface PerformanceMetrics {
  loadTime: number;
  parseTime: number;
  executeTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

class BundleAnalyzer {
  private stats: BundleStats | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] 
      });
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'resource':
        this.processResourceEntry(entry as PerformanceResourceTiming);
        break;
      case 'paint':
        this.processPaintEntry(entry);
        break;
      case 'largest-contentful-paint':
        this.processLCPEntry(entry);
        break;
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming) {
    const loadTime = entry.loadEventEnd - entry.loadEventStart;
    const parseTime = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const executeTime = entry.domComplete - entry.domContentLoadedEventEnd;

    console.log('Navigation Metrics:', {
      loadTime,
      parseTime,
      executeTime,
      totalTime: entry.loadEventEnd - entry.navigationStart
    });
  }

  private processResourceEntry(entry: PerformanceResourceTiming) {
    if (entry.name.includes('.js') || entry.name.includes('.css')) {
      const transferSize = entry.transferSize || 0;
      const encodedSize = entry.encodedBodySize || 0;
      const decodedSize = entry.decodedBodySize || 0;

      console.log('Resource Metrics:', {
        name: entry.name,
        transferSize,
        encodedSize,
        decodedSize,
        compressionRatio: encodedSize > 0 ? (decodedSize / encodedSize) : 1
      });
    }
  }

  private processPaintEntry(entry: PerformanceEntry) {
    console.log(`${entry.name}: ${entry.startTime}ms`);
  }

  private processLCPEntry(entry: PerformanceEntry) {
    console.log(`Largest Contentful Paint: ${entry.startTime}ms`);
  }

  // Analyze bundle composition
  analyzeBundleComposition(): Promise<BundleStats> {
    return new Promise((resolve) => {
      // Simulate bundle analysis
      // In a real implementation, this would analyze the actual bundle
      const mockStats: BundleStats = {
        totalSize: 2.4 * 1024 * 1024, // 2.4MB
        gzippedSize: 0.8 * 1024 * 1024, // 800KB
        chunks: [
          {
            name: 'main',
            size: 1.2 * 1024 * 1024,
            modules: ['src/App.tsx', 'src/main.tsx'],
            isAsync: false
          },
          {
            name: 'vendor',
            size: 0.8 * 1024 * 1024,
            modules: ['react', 'react-dom', 'lucide-react'],
            isAsync: false
          },
          {
            name: 'dashboard',
            size: 0.4 * 1024 * 1024,
            modules: ['src/components/dashboard/*'],
            isAsync: true
          }
        ],
        dependencies: [
          { name: 'react', size: 42.2 * 1024, version: '18.3.1', isDevDependency: false },
          { name: 'react-dom', size: 133.4 * 1024, version: '18.3.1', isDevDependency: false },
          { name: 'lucide-react', size: 156.8 * 1024, version: '0.462.0', isDevDependency: false }
        ],
        performance: this.getCurrentPerformanceMetrics()
      };

      this.stats = mockStats;
      resolve(mockStats);
    });
  }

  private getCurrentPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      parseTime: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      executeTime: navigation ? navigation.domComplete - navigation.domContentLoadedEventEnd : 0,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: lcpEntries[lcpEntries.length - 1]?.startTime || 0
    };
  }

  // Get optimization recommendations
  getOptimizationRecommendations(): string[] {
    if (!this.stats) return [];

    const recommendations: string[] = [];

    // Check bundle size
    if (this.stats.totalSize > 3 * 1024 * 1024) {
      recommendations.push('Consider code splitting to reduce initial bundle size');
    }

    // Check compression ratio
    const compressionRatio = this.stats.gzippedSize / this.stats.totalSize;
    if (compressionRatio > 0.5) {
      recommendations.push('Enable better compression (Brotli) for smaller transfer sizes');
    }

    // Check performance metrics
    if (this.stats.performance.loadTime > 3000) {
      recommendations.push('Optimize loading performance - consider lazy loading components');
    }

    if (this.stats.performance.largestContentfulPaint > 2500) {
      recommendations.push('Improve Largest Contentful Paint by optimizing critical resources');
    }

    // Check dependencies
    const largeDependencies = this.stats.dependencies.filter(dep => dep.size > 100 * 1024);
    if (largeDependencies.length > 0) {
      recommendations.push(`Consider alternatives for large dependencies: ${largeDependencies.map(d => d.name).join(', ')}`);
    }

    return recommendations;
  }

  // Get current bundle stats
  getBundleStats(): BundleStats | null {
    return this.stats;
  }

  // Monitor runtime performance
  startRuntimeMonitoring() {
    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        });
      }, 30000);
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long Task detected:', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  // Cleanup
  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// Create singleton instance
export const bundleAnalyzer = new BundleAnalyzer();

export default BundleAnalyzer;
