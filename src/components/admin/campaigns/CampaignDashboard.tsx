import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, BarChart3, Users, Mail, MessageSquare, 
  Target, TrendingUp, Settings, Plus, Eye, Edit, Bell
} from 'lucide-react';
import { NotificationCampaignService, NotificationCampaign } from '@/services/notificationCampaignService';
import { useToast } from '@/hooks/use-toast';

const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const notificationCampaignService = new NotificationCampaignService();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const allCampaigns = notificationCampaignService.getAllCampaigns();
      setCampaigns(allCampaigns);
      
      if (allCampaigns.length > 0) {
        const campaignAnalytics = await notificationCampaignService.getCampaignAnalytics(allCampaigns[0].id);
        setAnalytics(campaignAnalytics);
        setSelectedCampaign(allCampaigns[0].id);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCampaign = async (campaignId: string, isActive: boolean) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const updatedCampaign = { ...campaign, isActive };
    await notificationCampaignService.updateCampaign(updatedCampaign);
    
    setCampaigns(prev => 
      prev.map(c => c.id === campaignId ? updatedCampaign : c)
    );

    toast({
      title: `Campaign ${isActive ? 'Activated' : 'Paused'}`,
      description: `${campaign.name} has been ${isActive ? 'activated' : 'paused'}`,
    });
  };

  const loadCampaignAnalytics = async (campaignId: string) => {
    const campaignAnalytics = await notificationCampaignService.getCampaignAnalytics(campaignId);
    setAnalytics(campaignAnalytics);
    setSelectedCampaign(campaignId);
  };

  const getCampaignStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Bell className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Campaign Management</h1>
          <p className="text-gray-600">Create and manage automated notification campaigns</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          <Button onClick={loadCampaigns} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Play className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {campaigns.filter(c => c.isActive).length}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of {campaigns.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {campaigns.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Notifications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-therapy-500 mr-2" />
              <span className="text-2xl font-bold">
                {campaigns.length > 0 ? 
                  ((campaigns.reduce((sum, c) => sum + c.stats.engaged, 0) / 
                    campaigns.reduce((sum, c) => sum + c.stats.sent, 0)) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Average engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Target className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">
                {campaigns.length > 0 ? 
                  ((campaigns.reduce((sum, c) => sum + c.stats.completed, 0) / 
                    campaigns.reduce((sum, c) => sum + c.stats.sent, 0)) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Campaign completions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaign List</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="abtest">A/B Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{campaign.name}</span>
                        <Badge className={getCampaignStatusColor(campaign.isActive)}>
                          {campaign.isActive ? 'Active' : 'Paused'}
                        </Badge>
                        {campaign.abTestConfig?.enabled && (
                          <Badge variant="outline">A/B Testing</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{campaign.description}</CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadCampaignAnalytics(campaign.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCampaign(campaign.id, !campaign.isActive)}
                      >
                        {campaign.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Trigger</p>
                      <p className="font-medium capitalize">{campaign.triggerType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Steps</p>
                      <p className="font-medium">{campaign.steps.length} steps</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Channels</p>
                      <div className="flex space-x-1 mt-1">
                        {[...new Set(campaign.steps.flatMap(s => s.channels))].map(channel => (
                          <div key={channel} className="p-1 bg-gray-100 rounded">
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Performance</p>
                      <p className="font-medium">
                        {campaign.stats.sent > 0 ? 
                          ((campaign.stats.completed / campaign.stats.sent) * 100).toFixed(1) : 0}% complete
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Campaign Progress</span>
                      <span>{campaign.stats.completed} / {campaign.stats.sent}</span>
                    </div>
                    <Progress 
                      value={campaign.stats.sent > 0 ? (campaign.stats.completed / campaign.stats.sent) * 100 : 0} 
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Analytics</CardTitle>
                <CardDescription>Performance breakdown for {analytics.campaign.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.stepAnalytics.map((step: any, index: number) => (
                    <div key={step.stepId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Step {index + 1}: {step.title}</h4>
                        <div className="text-sm text-gray-600">
                          {step.sent} sent • {step.delivered} delivered • {step.opened} opened
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Delivery Rate</span>
                            <span>{step.deliveryRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={step.deliveryRate} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Open Rate</span>
                            <span>{step.openRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={step.openRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="abtest" className="space-y-6">
          {analytics?.abTestResults && (
            <Card>
              <CardHeader>
                <CardTitle>A/B Test Results</CardTitle>
                <CardDescription>Comparing performance across variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analytics.abTestResults.map((result: any) => (
                    <div key={result.variant} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 capitalize">Variant: {result.variant}</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Users</span>
                          <span className="font-medium">{result.users}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium">{result.completed}</span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-medium">{result.completionRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={result.completionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDashboard;