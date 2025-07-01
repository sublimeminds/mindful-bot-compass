import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  TrendingUp, 
  BarChart3, 
  Brain,
  Calendar,
  Activity
} from 'lucide-react';
import MoodAnalyticsDashboard from '@/components/mood/MoodAnalyticsDashboard';
import AdvancedMoodTracker from '@/components/mood/AdvancedMoodTracker';
import MoodInsightsPanel from '@/components/mood/MoodInsightsPanel';
import MoodHistoryView from '@/components/mood/MoodHistoryView';

const MoodDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Mood Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6 text-therapy-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mood Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track, analyze, and understand your emotional well-being
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            
            <TabsTrigger value="tracker" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Log Mood</span>
            </TabsTrigger>

            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <MoodAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="tracker" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <AdvancedMoodTracker />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <MoodInsightsPanel />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <MoodHistoryView />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default MoodDashboard;