
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Shield, 
  Zap, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Monitor,
  Lock,
  Heart,
  RefreshCw
} from 'lucide-react';
import { EnhancedSystemHealthService, AdvancedSystemMetrics, ProactiveRecommendation } from '@/services/enhancedSystemHealthService';
import { ToastService } from '@/services/toastService';

const EnhancedSystemHealthDashboard = () => {
  const [metrics, setMetrics] = useState<AdvancedSystemMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<ProactiveRecommendation[]>([]);
  const [overallHealth, setOverallHealth] = useState<'excellent' | 'good' | 'needs_attention' | 'critical'>('excellent');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await EnhancedSystemHealthService.runComprehensiveHealthCheck();
      setMetrics(result.metrics);
      setRecommendations(result.recommendations);
      setOverallHealth(result.overallHealth);
      setLastUpdate(new Date());
      ToastService.genericSuccess('Health Check Complete', 'System analysis updated successfully');
    } catch (error) {
      console.error('Health check failed:', error);
      ToastService.genericError('Health check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600">Running comprehensive health check...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-900">Enhanced System Health</h1>
          <p className="text-therapy-600 mt-2">
            Comprehensive monitoring and proactive optimization recommendations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-therapy-600">Last Updated</p>
            <p className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <Button 
            onClick={runHealthCheck} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge className={`px-4 py-2 text-lg ${getHealthColor(overallHealth)}`}>
              {overallHealth.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex-1">
              <div className="text-sm text-therapy-600 mb-2">
                {recommendations.length} recommendations • Last check: {lastUpdate.toLocaleString()}
              </div>
              <Progress 
                value={overallHealth === 'excellent' ? 100 : overallHealth === 'good' ? 80 : overallHealth === 'needs_attention' ? 60 : 30} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Load Time</span>
                <span className="text-xs font-medium">{metrics.detailedPerformance.loadTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Memory</span>
                <span className="text-xs font-medium">{metrics.detailedPerformance.memoryUsage}MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Network</span>
                <span className="text-xs font-medium">{metrics.detailedPerformance.networkLatency}ms</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">Encryption</span>
                {metrics.securityMetrics.encryptionStatus ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">Auth Health</span>
                {metrics.securityMetrics.authenticationHealth ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">Data Integrity</span>
                {metrics.securityMetrics.dataIntegrity ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
            </CardContent>
          </Card>

          {/* Therapeutic AI Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Response Time</span>
                <span className="text-xs font-medium">{metrics.therapeuticMetrics.aiResponseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Crisis Detection</span>
                <span className="text-xs font-medium">{metrics.therapeuticMetrics.crisisDetectionLatency}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-therapy-600">Satisfaction</span>
                <span className="text-xs font-medium">{metrics.therapeuticMetrics.userSatisfactionScore.toFixed(1)}/5</span>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">HIPAA</span>
                {metrics.complianceStatus.hipaaCompliance ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">Privacy</span>
                {metrics.complianceStatus.privacyControls ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-therapy-600">Audit Ready</span>
                {metrics.complianceStatus.auditReadiness ? 
                  <CheckCircle className="h-3 w-3 text-green-500" /> : 
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                }
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Proactive Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Proactive Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-therapy-900">{rec.title}</h3>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-therapy-600 mb-2">{rec.description}</p>
                      <p className="text-sm text-therapy-700 mb-2">
                        <strong>Action:</strong> {rec.actionRequired}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-therapy-500">
                        <span>Impact: {rec.estimatedImpact}</span>
                        <span>Time: {rec.implementationTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSystemHealthDashboard;
