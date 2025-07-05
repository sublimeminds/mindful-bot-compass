import React, { lazy, Suspense, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Lazy load dashboard widgets for code splitting
const WelcomeWidget = lazy(() => 
  performanceMonitor.measureRenderTime('WelcomeWidget-Load', () =>
    import('./WelcomeWidget')
  )
);

const QuickActionsWidget = lazy(() => 
  performanceMonitor.measureRenderTime('QuickActionsWidget-Load', () =>
    import('./QuickActionsWidget')
  )
);

const MoodTrackerWidget = lazy(() => 
  performanceMonitor.measureRenderTime('MoodTrackerWidget-Load', () =>
    import('./MoodTrackerWidget')
  )
);

const ProgressOverviewWidget = lazy(() => 
  performanceMonitor.measureRenderTime('ProgressOverviewWidget-Load', () =>
    import('./ProgressOverviewWidget')
  )
);

const SessionHistoryWidget = lazy(() => 
  performanceMonitor.measureRenderTime('SessionHistoryWidget-Load', () =>
    import('./SessionHistoryWidget')
  )
);

const GoalsWidget = lazy(() => 
  performanceMonitor.measureRenderTime('GoalsWidget-Load', () =>
    import('./GoalsWidget')
  )
);

const AnalyticsWidget = lazy(() => 
  performanceMonitor.measureRenderTime('AnalyticsWidget-Load', () =>
    import('./AnalyticsWidget')
  )
);

const EnhancedMoodWidget = lazy(() => 
  performanceMonitor.measureRenderTime('EnhancedMoodWidget-Load', () =>
    import('./EnhancedMoodWidget')
  )
);

// Loading fallback component with performance tracking
const WidgetSkeleton = ({ name }: { name: string }) => (
  <SafeComponentWrapper name={`${name}Skeleton`}>
    <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  </SafeComponentWrapper>
);

// Enhanced lazy wrapper with performance monitoring
const LazyWidget = ({ 
  component: Component, 
  name, 
  onLoadComplete 
}: { 
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  name: string;
  onLoadComplete?: () => void;
}) => {
  useEffect(() => {
    if (onLoadComplete) {
      const timer = setTimeout(onLoadComplete, 0);
      return () => clearTimeout(timer);
    }
  }, [onLoadComplete]);

  return (
    <Suspense fallback={<WidgetSkeleton name={name} />}>
      <SafeComponentWrapper 
        name={`Lazy${name}`}
        fallback={<WidgetSkeleton name={name} />}
      >
        <Component />
      </SafeComponentWrapper>
    </Suspense>
  );
};

// Individual lazy widget exports
export const LazyWelcomeWidget = () => (
  <LazyWidget 
    component={WelcomeWidget} 
    name="WelcomeWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('WelcomeWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyQuickActionsWidget = () => (
  <LazyWidget 
    component={QuickActionsWidget} 
    name="QuickActionsWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('QuickActionsWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyMoodTrackerWidget = () => (
  <LazyWidget 
    component={MoodTrackerWidget} 
    name="MoodTrackerWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('MoodTrackerWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyProgressOverviewWidget = () => (
  <LazyWidget 
    component={ProgressOverviewWidget} 
    name="ProgressOverviewWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('ProgressOverviewWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazySessionHistoryWidget = () => (
  <LazyWidget 
    component={SessionHistoryWidget} 
    name="SessionHistoryWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('SessionHistoryWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyGoalsWidget = () => (
  <LazyWidget 
    component={GoalsWidget} 
    name="GoalsWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('GoalsWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyAnalyticsWidget = () => (
  <LazyWidget 
    component={AnalyticsWidget} 
    name="AnalyticsWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('AnalyticsWidget', 'lazyLoadComplete', performance.now())}
  />
);

export const LazyEnhancedMoodWidget = () => (
  <LazyWidget 
    component={EnhancedMoodWidget} 
    name="EnhancedMoodWidget"
    onLoadComplete={() => performanceMonitor.recordMetric('EnhancedMoodWidget', 'lazyLoadComplete', performance.now())}
  />
);

export default {
  WelcomeWidget: LazyWelcomeWidget,
  QuickActionsWidget: LazyQuickActionsWidget,
  MoodTrackerWidget: LazyMoodTrackerWidget,
  ProgressOverviewWidget: LazyProgressOverviewWidget,
  SessionHistoryWidget: LazySessionHistoryWidget,
  GoalsWidget: LazyGoalsWidget,
  AnalyticsWidget: LazyAnalyticsWidget,
  EnhancedMoodWidget: LazyEnhancedMoodWidget,
};