import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEliteSystemIntegration } from '@/hooks/useEliteSystemIntegration';
import { useEliteSystemActivation } from '@/hooks/useEliteSystemActivation';
import { useRealTimeEliteIntegration } from '@/hooks/useRealTimeEliteIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Heart, 
  Activity, 
  Zap, 
  Globe, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Settings,
  RefreshCw,
  Users
} from 'lucide-react';

const EliteSystemDashboard = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    totalSessions: 0,
    adaptiveInsights: 0,
    culturalAdaptations: 0,
    crisisInterventions: 0
  });

  // Elite System Integration
  const {
    messages,
    systemStatus: integrationStatus,
    processMessage,
    analyzeSession
  } = useEliteSystemIntegration();

  // Elite System Activation & Monitoring
  const {
    systemStatus,
    isActivating,
    activateEliteSystem,
    checkSystemStatus,
    getSystemMetrics
  } = useEliteSystemActivation();

  // Real-time Elite Integration
  const realTimeElite = useRealTimeEliteIntegration();

  useEffect(() => {
    if (user) {
      loadDashboardStats();
      checkSystemStatus();
    }
  }, [user, checkSystemStatus]);

  const loadDashboardStats = async () => {
    // Simulate loading dashboard statistics
    setDashboardStats({
      totalSessions: Math.floor(Math.random() * 50) + 10,
      adaptiveInsights: Math.floor(Math.random() * 25) + 5,
      culturalAdaptations: Math.floor(Math.random() * 15) + 3,
      crisisInterventions: Math.floor(Math.random() * 3)
    });
  };

  const handleActivateEliteSystem = async () => {
    console.log('🚀 Manually activating Elite System from dashboard');
    await activateEliteSystem();
    await loadDashboardStats();
  };

  const getSystemHealthColor = () => {
    if (systemStatus.systemHealth === 'optimal') return 'text-green-600';
    if (systemStatus.systemHealth === 'degraded') return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSystemHealthBadge = () => {
    if (systemStatus.systemHealth === 'optimal') return 'bg-green-600 text-white';
    if (systemStatus.systemHealth === 'degraded') return 'bg-yellow-500 text-black';
    return 'bg-red-600 text-white';
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <Brain className="h-12 w-12 mx-auto mb-4 text-therapy-400" />
        <p className="text-lg font-medium text-gray-600">Please sign in to access Elite System Dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Elite AI System</h1>
            <p className="text-gray-600">Advanced therapy intelligence & cultural adaptation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            className={`${getSystemHealthBadge()} flex items-center space-x-1`}
          >
            <Activity className="h-3 w-3" />
            <span>{systemStatus.systemHealth?.toUpperCase()}</span>
          </Badge>
          
          <Button
            onClick={handleActivateEliteSystem}
            disabled={isActivating || systemStatus.isActivated}
            className="bg-therapy-600 hover:bg-therapy-700"
          >
            {isActivating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : systemStatus.isActivated ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Active
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Activate Elite System
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">AI Routing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus.isActivated ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Cultural AI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus.culturalAiActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Adaptive Learning</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus.adaptiveLearningActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Crisis Detection</p>
                <p className="text-2xl font-bold text-gray-900">
                  {systemStatus.cronJobsActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Performance Metrics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Elite System Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Therapy Sessions</span>
                    <span className="font-semibold">{dashboardStats.totalSessions}</span>
                  </div>
                  <Progress value={(dashboardStats.totalSessions / 100) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Adaptive Insights Generated</span>
                    <span className="font-semibold">{dashboardStats.adaptiveInsights}</span>
                  </div>
                  <Progress value={(dashboardStats.adaptiveInsights / 50) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cultural Adaptations</span>
                    <span className="font-semibold">{dashboardStats.culturalAdaptations}</span>
                  </div>
                  <Progress value={(dashboardStats.culturalAdaptations / 30) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Crisis Interventions</span>
                    <span className="font-semibold text-red-600">{dashboardStats.crisisInterventions}</span>
                  </div>
                  <Progress value={(dashboardStats.crisisInterventions / 10) * 100} className="h-2" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Recent System Activity</h4>
                <div className="space-y-2">
                  {systemStatus.lastActivation && (
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Last Elite System activation: {new Date(systemStatus.lastActivation).toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span>Real-time monitoring: Active</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span>Adaptive learning: Continuously improving</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status</span>
                <Badge className={getSystemHealthBadge()}>
                  {systemStatus.systemHealth?.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Routing</span>
                  <Badge variant={systemStatus.isActivated ? "default" : "secondary"}>
                    {systemStatus.isActivated ? "Online" : "Offline"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Cultural AI</span>
                  <Badge variant={systemStatus.culturalAiActive ? "default" : "secondary"}>
                    {systemStatus.culturalAiActive ? "Online" : "Offline"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Adaptive Learning</span>
                  <Badge variant={systemStatus.adaptiveLearningActive ? "default" : "secondary"}>
                    {systemStatus.adaptiveLearningActive ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={checkSystemStatus}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh System Status
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={analyzeSession}
                disabled={messages.length === 0}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analyze Current Session
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/therapy-settings'}
              >
                <Users className="mr-2 h-4 w-4" />
                Configure Therapist AI
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          {!systemStatus.isActivated && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Elite System Inactive</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Activate Elite System for enhanced AI therapy, cultural adaptation, and adaptive learning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {systemStatus.isActivated && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Elite System Active</h4>
                    <p className="text-sm text-green-700 mt-1">
                      All Elite AI features are operational and continuously learning from your interactions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* System Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Elite System Architecture</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">Intelligent Router Hub</h3>
              <p className="text-sm text-gray-600">
                Routes user interactions to the most appropriate AI model based on context, cultural background, and therapeutic needs.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Cultural AI Integration</h3>
              <p className="text-sm text-gray-600">
                Adapts therapeutic approaches in real-time based on cultural context, language preferences, and cultural competency needs.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">Adaptive Feedback Loop</h3>
              <p className="text-sm text-gray-600">
                Continuously learns from user interactions and therapeutic outcomes to improve future sessions and recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EliteSystemDashboard;