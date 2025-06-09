
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationAnalyticsDashboard from "@/components/analytics/NotificationAnalyticsDashboard";
import ABTestDashboard from "@/components/abTesting/ABTestDashboard";
import PushNotificationManager from "@/components/mobile/PushNotificationManager";
import TimingOptimizationDashboard from "@/components/ai/TimingOptimizationDashboard";
import NotificationTemplateManager from "@/components/templates/NotificationTemplateManager";

const NotificationAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notification Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive notification analytics, optimization, and management tools
        </p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Push</TabsTrigger>
          <TabsTrigger value="ai">AI Timing</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <NotificationAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="abtesting">
          <ABTestDashboard />
        </TabsContent>

        <TabsContent value="mobile">
          <PushNotificationManager />
        </TabsContent>

        <TabsContent value="ai">
          <TimingOptimizationDashboard />
        </TabsContent>

        <TabsContent value="templates">
          <NotificationTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationAnalytics;
