
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { AnalyticsService, AnalyticsData } from "@/services/analyticsService";
import { MoodTrackingService, MoodEntry } from "@/services/moodTrackingService";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import GoalProgress from "@/components/analytics/GoalProgress";
import MoodChart from "@/components/analytics/MoodChart";
import SessionInsights from "@/components/analytics/SessionInsights";
import ProgressReport from "@/components/analytics/ProgressReport";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sessions, loadSessions } = useSession();
  const { onboardingData } = useOnboardingData();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load sessions
        await loadSessions();
        
        // Load mood entries
        const entries = await MoodTrackingService.getMoodEntries(user.id);
        setMoodEntries(entries);
        
        // Generate analytics
        const goals = onboardingData?.goals || [];
        const analytics = AnalyticsService.generateAnalytics(sessions, entries, goals);
        setAnalyticsData(analytics);
        
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [user, sessions, onboardingData, loadSessions]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      toast({
        title: "Analytics Updated",
        description: "Your analytics data has been refreshed.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 3 months';
      case 'all': return 'All time';
      default: return 'Last 30 days';
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your analytics...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
              <p className="text-muted-foreground mb-6">
                Start using the app to see your analytics and progress insights.
              </p>
              <Button onClick={() => navigate('/chat')}>
                Start Your First Session
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-therapy-700">
                <BarChart3 className="h-8 w-8 mr-3" />
                Analytics & Progress
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Track your therapy journey and mental health progress
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <SessionInsights 
                sessionStats={analyticsData.sessionStats}
                insights={analyticsData.insights}
                patterns={analyticsData.patterns}
              />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <GoalProgress goalProgress={analyticsData.goalProgress} />
            </TabsContent>

            <TabsContent value="mood" className="space-y-6">
              <MoodChart 
                moodTrends={analyticsData.moodTrends}
                moodEntries={moodEntries}
              />
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <ProgressReport 
                analyticsData={analyticsData}
                dateRange={getTimeRangeLabel(selectedTimeRange)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Analytics;
