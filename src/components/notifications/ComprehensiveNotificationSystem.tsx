import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Settings, BarChart3, Target, Calendar } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ComprehensiveNotificationSystem = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [upsellRecommendations, setUpsellRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      loadPreferences();
      loadAnalytics();
      loadCampaigns();
      loadUpsellRecommendations();
    }
  }, [user]);

  const loadPreferences = async () => {
    const { data } = await supabase
      .from('enhanced_notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setPreferences(data);
  };

  const loadAnalytics = async () => {
    const { data } = await supabase
      .from('email_analytics')
      .select('event_type, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    
    setAnalytics(data);
  };

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    setCampaigns(data || []);
  };

  const loadUpsellRecommendations = async () => {
    const { data } = await supabase.functions.invoke('intelligent-upselling', {
      body: { action: 'get_recommendations', userId: user.id }
    });
    
    setUpsellRecommendations(data?.recommendations || []);
  };

  const updatePreferences = async (field, value) => {
    const { error } = await supabase
      .from('enhanced_notification_preferences')
      .upsert({
        user_id: user.id,
        [field]: value
      });

    if (!error) {
      toast({ title: "Preferences updated", description: "Your notification settings have been saved." });
      loadPreferences();
    }
  };

  const triggerLifecycleCheck = async () => {
    const { data } = await supabase.functions.invoke('subscription-lifecycle-manager');
    toast({ 
      title: "Lifecycle check completed", 
      description: `Processed ${data?.processed?.expirationWarnings || 0} notifications` 
    });
  };

  const processUpsellTriggers = async () => {
    const { data } = await supabase.functions.invoke('intelligent-upselling', {
      body: { action: 'check_triggers' }
    });
    toast({ 
      title: "Upsell check completed", 
      description: `Triggered ${data?.triggered || 0} campaigns` 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Comprehensive Notification System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="campaigns">
                <Mail className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="upselling">
                <Target className="h-4 w-4 mr-2" />
                Upselling
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <Label>Email Notifications</Label>
                          <Switch
                            checked={preferences.email_notifications}
                            onCheckedChange={(value) => updatePreferences('email_notifications', value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Subscription Warnings</Label>
                          <Switch
                            checked={preferences.subscription_warnings}
                            onCheckedChange={(value) => updatePreferences('subscription_warnings', value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Newsletter</Label>
                          <Switch
                            checked={preferences.newsletter_subscribed}
                            onCheckedChange={(value) => updatePreferences('newsletter_subscribed', value)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Upsell Offers</Label>
                          <Switch
                            checked={preferences.upsell_offers}
                            onCheckedChange={(value) => updatePreferences('upsell_offers', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Language Preference</Label>
                        <Select
                          value={preferences.language_preference}
                          onValueChange={(value) => updatePreferences('language_preference', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {analytics.filter(a => a.event_type === 'sent').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Emails Sent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.filter(a => a.event_type === 'opened').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Opened</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.filter(a => a.event_type === 'clicked').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Clicked</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Newsletter Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                        </div>
                        <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upselling" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Intelligent Upselling</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upsellRecommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">Confidence: {(rec.confidence * 100).toFixed(0)}%</Badge>
                          <Button size="sm">Learn More</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex space-x-2 mt-6">
            <Button onClick={triggerLifecycleCheck} variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Check Lifecycle
            </Button>
            <Button onClick={processUpsellTriggers} variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Process Upsells
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveNotificationSystem;