import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_LAYOUT } from '@/components/dashboard/widgets/WidgetRegistry';

export interface WidgetLayoutItem {
  id: string;
  size: 'small' | 'medium' | 'large';
  order: number;
}

export interface WidgetLayout {
  widgets: WidgetLayoutItem[];
  lastModified: string;
}

const STORAGE_KEY = 'dashboard-widget-layout';
const VIEW_STORAGE_KEY = 'dashboard-view-layouts';

// Dashboard view types
type DashboardView = 'home' | 'focus' | 'analytics' | 'wellness';

export const useWidgetLayout = () => {
  const [layout, setLayout] = useState<WidgetLayout>({
    widgets: DEFAULT_LAYOUT.map((id, index) => ({
      id,
      size: 'medium' as const,
      order: index
    })),
    lastModified: new Date().toISOString()
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Load layout from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedLayout = JSON.parse(saved);
        setLayout(parsedLayout);
      }
    } catch (error) {
      console.error('Failed to load widget layout:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save layout to localStorage
  const saveLayout = useCallback((newLayout: WidgetLayout) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
      setLayout(newLayout);
    } catch (error) {
      console.error('Failed to save widget layout:', error);
    }
  }, []);

  // Add widget to layout
  const addWidget = useCallback((widgetId: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const newLayout: WidgetLayout = {
      widgets: [
        ...layout.widgets,
        {
          id: widgetId,
          size,
          order: layout.widgets.length
        }
      ],
      lastModified: new Date().toISOString()
    };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Remove widget from layout
  const removeWidget = useCallback((widgetId: string) => {
    const newLayout: WidgetLayout = {
      widgets: layout.widgets
        .filter(widget => widget.id !== widgetId)
        .map((widget, index) => ({ ...widget, order: index })),
      lastModified: new Date().toISOString()
    };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Resize widget
  const resizeWidget = useCallback((widgetId: string, size: 'small' | 'medium' | 'large') => {
    const newLayout: WidgetLayout = {
      widgets: layout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, size } : widget
      ),
      lastModified: new Date().toISOString()
    };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Reorder widgets
  const reorderWidgets = useCallback((startIndex: number, endIndex: number) => {
    const newWidgets = Array.from(layout.widgets);
    const [removed] = newWidgets.splice(startIndex, 1);
    newWidgets.splice(endIndex, 0, removed);

    const newLayout: WidgetLayout = {
      widgets: newWidgets.map((widget, index) => ({ ...widget, order: index })),
      lastModified: new Date().toISOString()
    };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Reset to default layout
  const resetLayout = useCallback(() => {
    const defaultLayout: WidgetLayout = {
      widgets: DEFAULT_LAYOUT.map((id, index) => ({
        id,
        size: 'medium' as const,
        order: index
      })),
      lastModified: new Date().toISOString()
    };
    saveLayout(defaultLayout);
  }, [saveLayout]);

  // Get available widget IDs
  const getAvailableWidgetIds = useCallback(() => {
    return layout.widgets.map(widget => widget.id);
  }, [layout]);

  // Load dashboard view
  const loadDashboardView = useCallback((view: DashboardView) => {
    try {
      const savedViews = localStorage.getItem(VIEW_STORAGE_KEY);
      if (savedViews) {
        const viewLayouts = JSON.parse(savedViews);
        if (viewLayouts[view]) {
          setLayout(viewLayouts[view]);
          return;
        }
      }
      
      // Default layouts for each view
      const defaultViewLayouts = {
        home: DEFAULT_LAYOUT,
        focus: ['mood-tracker', 'quick-actions', 'notifications'],
        analytics: ['progress-overview', 'session-history', 'ai-insights', 'compliance-status'],
        wellness: ['mood-tracker', 'daily-goals', 'streak-tracker', 'mindfulness-reminders']
      };
      
      const defaultLayout: WidgetLayout = {
        widgets: defaultViewLayouts[view].map((id, index) => ({
          id,
          size: 'medium' as const,
          order: index
        })),
        lastModified: new Date().toISOString()
      };
      
      setLayout(defaultLayout);
    } catch (error) {
      console.error('Failed to load dashboard view:', error);
    }
  }, []);

  // Save dashboard view
  const saveDashboardView = useCallback((view: DashboardView) => {
    try {
      const savedViews = localStorage.getItem(VIEW_STORAGE_KEY);
      const viewLayouts = savedViews ? JSON.parse(savedViews) : {};
      
      viewLayouts[view] = layout;
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewLayouts));
    } catch (error) {
      console.error('Failed to save dashboard view:', error);
    }
  }, [layout]);

  return {
    layout,
    isLoading,
    addWidget,
    removeWidget,
    resizeWidget,
    reorderWidgets,
    resetLayout,
    getAvailableWidgetIds,
    loadDashboardView,
    saveDashboardView
  };
};