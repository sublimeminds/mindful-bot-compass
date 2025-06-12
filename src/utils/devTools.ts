
import { reactHookValidator } from './reactHookValidator';
import { importValidator } from './importValidator';
import { DebugLogger } from './debugLogger';

interface DevToolsReport {
  reactValidation: any;
  importValidation: any;
  performanceMetrics: any;
  timestamp: string;
}

class DevTools {
  private static instance: DevTools;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): DevTools {
    if (!DevTools.instance) {
      DevTools.instance = new DevTools();
    }
    return DevTools.instance;
  }

  startMonitoring(intervalMs: number = 10000): void {
    if (import.meta.env.DEV && !this.monitoringInterval) {
      DebugLogger.info('DevTools: Starting React hook monitoring', {
        component: 'DevTools',
        intervalMs
      });

      this.monitoringInterval = setInterval(() => {
        this.generateHealthReport();
      }, intervalMs);
    }
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      DebugLogger.info('DevTools: Stopped React hook monitoring', {
        component: 'DevTools'
      });
    }
  }

  generateHealthReport(): DevToolsReport {
    const report: DevToolsReport = {
      reactValidation: reactHookValidator.getDiagnostics(),
      importValidation: importValidator.getValidationReport(),
      performanceMetrics: {
        memoryUsage: (window.performance as any).memory ? {
          used: (window.performance as any).memory.usedJSHeapSize,
          total: (window.performance as any).memory.totalJSHeapSize,
          limit: (window.performance as any).memory.jsHeapSizeLimit
        } : null,
        timing: window.performance.timing
      },
      timestamp: new Date().toISOString()
    };

    // Log warnings for any issues
    if (!report.reactValidation.reactAvailable || !report.reactValidation.hooksAvailable) {
      DebugLogger.warn('DevTools: React availability issues detected', {
        component: 'DevTools',
        reactAvailable: report.reactValidation.reactAvailable,
        hooksAvailable: report.reactValidation.hooksAvailable
      });
    }

    if (!report.importValidation.isValid) {
      DebugLogger.warn('DevTools: Import validation issues detected', {
        component: 'DevTools',
        issues: report.importValidation.issues
      });
    }

    return report;
  }

  exportDiagnostics(): void {
    const report = this.generateHealthReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `react-diagnostics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Add to window for easy access in dev console
  attachToWindow(): void {
    if (import.meta.env.DEV) {
      (window as any).reactDevTools = {
        validator: reactHookValidator,
        importValidator: importValidator,
        generateReport: () => this.generateHealthReport(),
        exportDiagnostics: () => this.exportDiagnostics(),
        startMonitoring: (interval?: number) => this.startMonitoring(interval),
        stopMonitoring: () => this.stopMonitoring()
      };
      
      DebugLogger.info('DevTools: Attached to window.reactDevTools', {
        component: 'DevTools'
      });
    }
  }
}

export const devTools = DevTools.getInstance();

// Auto-start monitoring in development
if (import.meta.env.DEV) {
  devTools.attachToWindow();
  devTools.startMonitoring();
}
