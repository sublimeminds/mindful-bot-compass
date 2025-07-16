import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TestTube, 
  Settings, 
  Activity, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AITestingHub from './AITestingHub';
import AIModelRoutingConfig from './AIModelRoutingConfig';
import AIUsageMonitoring from './AIUsageMonitoring';
import AIPerformanceMonitor from './AIPerformanceMonitor';
import CulturalAIMonitoring from './CulturalAIMonitoring';
import OnboardingTestingHub from './OnboardingTestingHub';
import { AITestingService, TestResult } from '@/services/aiTestingService';

const AdminAIOverview = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    overallHealth: 95,
    activeModels: 8,
    testsRun: 24,
    testsPassed: 22,
    avgResponseTime: 1240,
    totalCost: 127.45,
    activeUsers: 2847,
    crisisAlertsToday: 3
  });
  const [recentTests, setRecentTests] = useState<TestResult[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load recent test results
      const testResults = AITestingService.getTestResults();
      setRecentTests(testResults.slice(-5));

      // Load system health metrics (would come from real API)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const runQuickHealthCheck = async () => {
    setLoading(true);
    toast({
      title: "Running Health Check",
      description: "Testing all AI systems...",
    });

    try {
      // Run quick tests on all systems
      const chatTest = await AITestingService.testTherapyChatAI('empathetic', 'Hello, how are you?');
      const emotionTest = await AITestingService.testEmotionDetection('I am feeling anxious');
      const backgroundTests = await AITestingService.testBackgroundAI();

      const allTests = [chatTest, emotionTest, ...backgroundTests];
      const passedTests = allTests.filter(test => test.status === 'passed').length;

      setSystemHealth(prev => ({
        ...prev,
        testsRun: prev.testsRun + allTests.length,
        testsPassed: prev.testsPassed + passedTests,
        overallHealth: Math.round((passedTests / allTests.length) * 100)
      }));

      setRecentTests(allTests);

      toast({
        title: "Health Check Complete",
        description: `${passedTests}/${allTests.length} tests passed`,
        variant: passedTests === allTests.length ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: "Error running system health check",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI System Administration</h1>
            <p className="text-muted-foreground">Monitor, test, and configure AI functionality</p>
          </div>
        </div>
        <Button onClick={runQuickHealthCheck} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Run Health Check
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-green-400">{systemHealth.overallHealth}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold text-blue-400">{systemHealth.activeModels}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Test Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round((systemHealth.testsPassed / systemHealth.testsRun) * 100)}%
                </p>
              </div>
              <TestTube className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-400">{systemHealth.avgResponseTime}ms</p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Test Results */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Recent Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent tests. Run a health check to see results.
            </p>
          ) : (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium">{test.testName}</p>
                      <p className="text-sm text-muted-foreground">{test.testType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {test.metrics.responseTime}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Management Tabs */}
      <Tabs defaultValue="testing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testing Hub
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Model Routing
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Usage Monitoring
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="cultural" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Cultural AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testing">
          <AITestingHub />
        </TabsContent>

        <TabsContent value="routing">
          <AIModelRoutingConfig />
        </TabsContent>

        <TabsContent value="usage">
          <AIUsageMonitoring />
        </TabsContent>

        <TabsContent value="performance">
          <AIPerformanceMonitor />
        </TabsContent>

        <TabsContent value="cultural">
          <CulturalAIMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIOverview;