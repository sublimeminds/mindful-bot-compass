
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BarChart3, TrendingUp, Users } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const NotificationAnalyticsDashboard = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock notification analytics data
      const mockData = [
        {
          id: '1',
          type: 'session_reminder',
          sent: 150,
          opened: 120,
          clicked: 45,
          openRate: 0.8,
          clickRate: 0.3
        }
      ];
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification analytics.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Notification Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading analytics...</div>
          ) : (
            <div className="space-y-4">
              {analyticsData.map((data) => (
                <div key={data.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium">{data.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    Open Rate: {Math.round(data.openRate * 100)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationAnalyticsDashboard;
