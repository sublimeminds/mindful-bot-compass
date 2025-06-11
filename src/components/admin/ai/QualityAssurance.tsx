
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Eye, Settings } from 'lucide-react';
import { AIConfigurationService } from '@/services/aiConfigurationService';

const QualityAssurance = () => {
  const [qualityMetrics, setQualityMetrics] = useState([]);
  const [safetySettings, setSafetySettings] = useState({
    contentFiltering: [0.8],
    responseMonitoring: true,
    humanReviewThreshold: [0.7],
    autoFlagSensitive: true,
    realTimeScanning: true,
    ethicalGuidelines: true
  });

  const [recentAlerts] = useState([
    {
      id: 1,
      type: 'content_concern',
      severity: 'medium',
      message: 'Potentially sensitive response detected in session #1247',
      timestamp: '5 min ago',
      status: 'under_review'
    },
    {
      id: 2,
      type: 'quality_drop',
      severity: 'low',
      message: 'Response quality below threshold (0.65) for GPT-4o Mini',
      timestamp: '12 min ago',
      status: 'resolved'
    }
  ]);

  useEffect(() => {
    loadQualityMetrics();
  }, []);

  const loadQualityMetrics = async () => {
    try {
      const metrics = await AIConfigurationService.getQualityMetrics('7d');
      setQualityMetrics(metrics);
    } catch (error) {
      console.error('Error loading quality metrics:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'content_concern': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'quality_drop': return <TrendingUp className="h-4 w-4 text-red-400" />;
      default: return <Shield className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Safety Score</p>
                <p className="text-2xl font-bold text-green-400">99.8%</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Content Flags</p>
                <p className="text-2xl font-bold text-orange-400">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Quality</p>
                <p className="text-2xl font-bold text-blue-400">8.7/10</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Reviews Pending</p>
                <p className="text-2xl font-bold text-purple-400">12</p>
              </div>
              <Eye className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-green-400" />
            Safety & Quality Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Content Filtering Sensitivity: {safetySettings.contentFiltering[0]}
                </label>
                <Slider
                  value={safetySettings.contentFiltering}
                  onValueChange={(value) => setSafetySettings(prev => ({ ...prev, contentFiltering: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Higher values = more strict filtering</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Human Review Threshold: {safetySettings.humanReviewThreshold[0]}
                </label>
                <Slider
                  value={safetySettings.humanReviewThreshold}
                  onValueChange={(value) => setSafetySettings(prev => ({ ...prev, humanReviewThreshold: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Quality threshold for human review</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Response Monitoring</span>
                  <Switch
                    checked={safetySettings.responseMonitoring}
                    onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, responseMonitoring: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Auto-flag Sensitive Content</span>
                  <Switch
                    checked={safetySettings.autoFlagSensitive}
                    onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, autoFlagSensitive: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Real-time Scanning</span>
                  <Switch
                    checked={safetySettings.realTimeScanning}
                    onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, realTimeScanning: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Ethical Guidelines Enforcement</span>
                  <Switch
                    checked={safetySettings.ethicalGuidelines}
                    onCheckedChange={(checked) => setSafetySettings(prev => ({ ...prev, ethicalGuidelines: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Quality Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-white text-sm">{alert.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics Trend */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quality Metrics Trend (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Response Quality</span>
                  <span className="text-sm font-medium text-green-400">↗ +2.3%</span>
                </div>
                <Progress value={87} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">87% average this week</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Therapeutic Value</span>
                  <span className="text-sm font-medium text-green-400">↗ +1.8%</span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">84% average this week</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">User Satisfaction</span>
                  <span className="text-sm font-medium text-yellow-400">↘ -0.5%</span>
                </div>
                <Progress value={91} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">91% average this week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssurance;
