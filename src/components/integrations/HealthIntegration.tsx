
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Smartphone, Watch } from 'lucide-react';

const HealthIntegration = () => {
  const [connectedApps, setConnectedApps] = useState<string[]>([]);

  const healthApps = [
    {
      id: 'apple-health',
      name: 'Apple HealthKit',
      icon: Smartphone,
      platform: 'iOS',
      description: 'Sync health data from your iPhone and Apple Watch',
      metrics: ['Heart Rate', 'Sleep', 'Steps', 'Mood']
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: Activity,
      platform: 'Android',
      description: 'Connect your Android fitness and health data',
      metrics: ['Activity', 'Heart Rate', 'Sleep', 'Weight']
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Watch,
      platform: 'Cross-platform',
      description: 'Track activity, sleep, and wellness metrics',
      metrics: ['Steps', 'Sleep Quality', 'Heart Rate', 'Stress']
    }
  ];

  return (
    <div className="space-y-4">
      {healthApps.map((app) => {
        const Icon = app.icon;
        const isConnected = connectedApps.includes(app.id);
        
        return (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <p className="text-sm text-therapy-600">{app.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{app.platform}</Badge>
                  <Badge variant={isConnected ? "default" : "outline"}>
                    {isConnected ? 'Connected' : 'Available'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-therapy-900 mb-2">Available Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <Heart className="h-12 w-12 text-therapy-400 mx-auto" />
            <h3 className="font-medium text-therapy-900">Health Data Correlation</h3>
            <p className="text-sm text-therapy-600 max-w-md mx-auto">
              Once connected, we'll analyze correlations between your health metrics and mood patterns 
              to provide personalized insights and recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthIntegration;
