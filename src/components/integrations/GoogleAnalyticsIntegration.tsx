import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BarChart3, Settings, Globe, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GoogleAnalyticsIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyticsId, setAnalyticsId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock loading Analytics ID and status
    setLoading(true);
    setTimeout(() => {
      setAnalyticsId('UA-123456789-1');
      setIsEnabled(true);
      setLoading(false);
    }, 500);
  }, []);

  const handleSaveConfiguration = () => {
    // Mock save configuration
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Configuration Saved",
        description: "Google Analytics integration has been configured successfully.",
      });
      setLoading(false);
    }, 1000);
  };

  const handleDisableIntegration = () => {
    // Mock disable integration
    setLoading(true);
    setTimeout(() => {
      setIsEnabled(false);
      toast({
        title: "Integration Disabled",
        description: "Google Analytics integration has been disabled.",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Google Analytics Integration</span>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="analytics-id">Analytics ID</Label>
          <Input
            id="analytics-id"
            type="text"
            placeholder="Enter your Google Analytics ID"
            value={analyticsId}
            onChange={(e) => setAnalyticsId(e.target.value)}
            disabled={!isEnabled}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleSaveConfiguration}
            disabled={loading || !isEnabled}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
          
          {isEnabled && (
            <Button 
              variant="outline" 
              onClick={handleDisableIntegration}
              disabled={loading}
            >
              Disable
            </Button>
          )}
        </div>

        {isEnabled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Integration Active</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Google Analytics is now tracking website traffic and user behavior.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAnalyticsIntegration;
