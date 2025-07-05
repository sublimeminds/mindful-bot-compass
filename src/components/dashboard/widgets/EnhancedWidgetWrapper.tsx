import React, { useEffect } from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useMemoryLeakDetection } from '@/hooks/useMemoryLeakDetection';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface EnhancedWidgetWrapperProps {
  children: React.ReactNode;
  widgetName: string;
  fallback?: React.ReactNode;
  enablePerformanceMonitoring?: boolean;
  enableMemoryLeakDetection?: boolean;
}

const EnhancedWidgetWrapper = ({ 
  children, 
  widgetName,
  fallback,
  enablePerformanceMonitoring = true,
  enableMemoryLeakDetection = true
}: EnhancedWidgetWrapperProps) => {
  
  // Performance monitoring
  const { warnings, clearWarnings } = usePerformanceMonitor({
    enableMetrics: enablePerformanceMonitoring,
    sampleRate: 1,
    thresholds: {
      renderTime: 50, // More strict for widgets
      memoryUsage: 0.7, // 70% threshold for widgets
      fps: 30
    }
  });

  // Memory leak detection
  const { getCurrentMemoryUsage, memoryInfo } = useMemoryLeakDetection({
    componentName: widgetName,
    enableTracking: enableMemoryLeakDetection,
    memoryThreshold: 5, // 5MB threshold
    checkInterval: 10000 // Check every 10 seconds
  });

  // Handle performance warnings
  useEffect(() => {
    if (warnings.length > 0) {
      warnings.forEach(warning => 
        console.warn(`Widget Performance Warning [${widgetName}]: ${warning}`)
      );
      clearWarnings();
    }
  }, [warnings, clearWarnings, widgetName]);

  // Track widget render performance
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      performanceMonitor.trackMemoryUsage(widgetName);
      
      // Log widget load completion
      performanceMonitor.recordMetric(
        widgetName, 
        'widgetLoaded', 
        performance.now(),
        {
          memoryUsage: getCurrentMemoryUsage(),
          activeResources: memoryInfo
        }
      );
    }
  }, [widgetName, enablePerformanceMonitoring, getCurrentMemoryUsage, memoryInfo]);

  // Measure render time
  const renderWidget = () => (
    <SafeComponentWrapper 
      name={widgetName}
      fallback={fallback || (
        <div className="p-4 text-center text-muted-foreground">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-sm">Widget temporarily unavailable</p>
        </div>
      )}
    >
      {children}
    </SafeComponentWrapper>
  );

  return enablePerformanceMonitoring 
    ? performanceMonitor.measureRenderTime(widgetName, renderWidget)
    : renderWidget();
};

export default EnhancedWidgetWrapper;