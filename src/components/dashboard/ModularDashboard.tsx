import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Edit3, Plus, RotateCcw, Save } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useWidgetLayout } from '@/hooks/useWidgetLayout';
import { getWidgetById } from './widgets/WidgetRegistry';
import WidgetContainer from './widgets/WidgetContainer';
import WidgetLibrary from './widgets/WidgetLibrary';

// Import existing widgets
import WelcomeWidget from './widgets/WelcomeWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';
import MoodTrackerWidget from './widgets/MoodTrackerWidget';
import XPProgressWidget from './widgets/XPProgressWidget';
import RecentAchievementsWidget from './widgets/RecentAchievementsWidget';
import SessionHistoryWidget from './widgets/SessionHistoryWidget';
import ProgressOverviewWidget from './widgets/ProgressOverviewWidget';
import AIInsightsWidget from './widgets/AIInsightsWidget';
import SmartRecommendationsWidget from './widgets/SmartRecommendationsWidget';
import TherapistAvatarWidget from './widgets/TherapistAvatarWidget';
import ComplianceStatusWidget from './widgets/ComplianceStatusWidget';
import NotificationWidget from './NotificationWidget';
import { cn } from '@/lib/utils';

const WIDGET_COMPONENTS = {
  WelcomeWidget,
  QuickActionsWidget,
  MoodTrackerWidget,
  XPProgressWidget,
  RecentAchievementsWidget,
  SessionHistoryWidget,
  ProgressOverviewWidget,
  AIInsightsWidget,
  SmartRecommendationsWidget,
  TherapistAvatarWidget,
  ComplianceStatusWidget,
  NotificationWidget,
  // Placeholder components for new widgets
  DailyGoalsWidget: () => <div className="p-4 text-center text-muted-foreground">Daily Goals - Coming Soon</div>,
  StreakTrackerWidget: () => <div className="p-4 text-center text-muted-foreground">Streak Tracker - Coming Soon</div>,
  MindfulnessWidget: () => <div className="p-4 text-center text-muted-foreground">Mindfulness Reminders - Coming Soon</div>,
  AnalyticsOverviewWidget: () => <div className="p-4 text-center text-muted-foreground">Analytics Overview - Coming Soon</div>,
};

const ModularDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const {
    layout,
    isLoading,
    addWidget,
    removeWidget,
    resizeWidget,
    resetLayout,
    getAvailableWidgetIds
  } = useWidgetLayout();

  const handleAddWidget = (widgetId: string) => {
    addWidget(widgetId);
    setIsLibraryOpen(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Layout is automatically saved through the hook
  };

  const renderWidget = (widgetItem: typeof layout.widgets[0]) => {
    const widgetConfig = getWidgetById(widgetItem.id);
    if (!widgetConfig) return null;

    const WidgetComponent = WIDGET_COMPONENTS[widgetConfig.component as keyof typeof WIDGET_COMPONENTS];
    if (!WidgetComponent) return null;

    return (
      <WidgetContainer
        key={widgetItem.id}
        id={widgetItem.id}
        title={widgetConfig.name}
        size={widgetItem.size}
        isEditing={isEditing}
        onRemove={removeWidget}
        onResize={resizeWidget}
      >
        <SafeComponentWrapper 
          name={widgetConfig.component}
          fallback={
            <div className="p-4 text-center text-muted-foreground">
              Widget temporarily unavailable
            </div>
          }
        >
          <WidgetComponent />
        </SafeComponentWrapper>
      </WidgetContainer>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SafeComponentWrapper name="ModularDashboard">
      <div className="p-6 space-y-6 bg-gradient-to-br from-therapy-25 to-calm-25 min-h-full">
        {/* Dashboard Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Customize your dashboard' : 'Your personalized therapy overview'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Sheet open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Widget
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-96">
                    <SheetHeader>
                      <SheetTitle>Add Widgets</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <WidgetLibrary
                        availableWidgets={getAvailableWidgetIds()}
                        onAddWidget={handleAddWidget}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button variant="outline" size="sm" onClick={resetLayout}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Customize
              </Button>
            )}
          </div>
        </div>

        {/* Widgets Grid */}
        <div className={cn(
          'grid gap-4 auto-rows-[200px]',
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          isEditing && 'border-2 border-dashed border-primary/20 rounded-lg p-4'
        )}>
          {layout.widgets.length === 0 ? (
            <Card className="col-span-full flex items-center justify-center p-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
                <p className="text-muted-foreground mb-4">Add widgets to customize your dashboard</p>
                <Button onClick={() => setIsEditing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Widgets
                </Button>
              </div>
            </Card>
          ) : (
            layout.widgets
              .sort((a, b) => a.order - b.order)
              .map(renderWidget)
          )}
        </div>

        {/* Editing Instructions */}
        {isEditing && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Edit3 className="h-4 w-4" />
              <span className="font-medium">Editing Mode:</span>
              <span>Click the "+" button to add widgets, use the menu on each widget to resize or remove it.</span>
            </div>
          </Card>
        )}
      </div>
    </SafeComponentWrapper>
  );
};

export default ModularDashboard;