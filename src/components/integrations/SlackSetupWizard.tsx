import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useToast } from '@/hooks/use-toast';
import { Slack, Users, Shield, CheckCircle, AlertTriangle, ExternalLink, Bot } from 'lucide-react';

interface SlackSetupWizardProps {
  onComplete?: () => void;
}

const SlackSetupWizard = ({ onComplete }: SlackSetupWizardProps) => {
  const { createIntegration, testIntegration } = useIntegrations();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSlackAuth = () => {
    // In a real implementation, this would redirect to Slack OAuth
    const clientId = 'your-slack-app-client-id';
    const redirectUri = encodeURIComponent(`${window.location.origin}/integrations/slack/callback`);
    const scope = 'bot,chat:write,channels:read,users:read';
    
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    window.open(authUrl, '_blank');
    
    toast({
      title: "Slack Authorization",
      description: "Complete the authorization in the new window to get your bot token.",
    });
  };

  const verifyWorkspace = async () => {
    if (!botToken) {
      toast({
        title: "Missing Token",
        description: "Please enter your Slack bot token first.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Test the bot token
      const response = await fetch('https://slack.com/api/auth.test', {
        headers: {
          'Authorization': `Bearer ${botToken}`
        }
      });
      const data = await response.json();
      
      if (data.ok) {
        setWorkspaceName(data.team);
        toast({
          title: "Workspace Verified!",
          description: `Connected to ${data.team} workspace.`,
        });
        setCurrentStep(2);
      } else {
        throw new Error(data.error || 'Invalid bot token');
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const setupIntegration = async () => {
    try {
      const integration = await createIntegration('slack', {
        bot_token: botToken,
        channel_id: channelId,
        workspace_name: workspaceName,
        platform_user_id: workspaceName,
        crisis_escalation_enabled: true,
        access_tokens: {
          bot_token: botToken
        }
      });

      // Test the integration
      await testIntegration(integration.id);
      
      setIsCompleted(true);
      toast({
        title: "Slack Connected!",
        description: "Your workspace is now ready for anonymous therapy support.",
      });

      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Slack Workspace Connected!</h3>
          <p className="text-gray-600 mb-4">
            Your team now has access to anonymous therapy support and wellness features.
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              Team Wellness
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Anonymous Support
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Slack className="h-6 w-6 text-purple-500" />
          <span className="text-lg font-semibold">Slack Setup Wizard - Step {currentStep} of 2</span>
        </div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Connect Your Slack Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Workplace Mental Health Benefits:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Anonymous therapy conversations during work hours</li>
                <li>Team wellness check-ins and mood tracking</li>
                <li>Break reminders and stress management tips</li>
                <li>Crisis support with immediate professional escalation</li>
                <li>Mental health resources and guided meditations</li>
              </ul>
            </div>

            <Button 
              onClick={handleSlackAuth}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Authorize with Slack
            </Button>

            <div className="space-y-2">
              <Label htmlFor="bot-token">Slack Bot Token</Label>
              <Input
                id="bot-token"
                type="password"
                placeholder="xoxb-your-bot-token-here"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Your bot token from the Slack app configuration. Starts with 'xoxb-'.
              </p>
            </div>

            <Button 
              onClick={verifyWorkspace}
              disabled={!botToken || isVerifying}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              {isVerifying ? 'Verifying...' : 'Verify Workspace Access'}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Configure Team Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Workspace Verified: {workspaceName}
              </h4>
              <p className="text-sm text-green-700">
                Your Slack workspace is ready for anonymous therapy support and team wellness features.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel-id">Primary Channel (Optional)</Label>
              <Input
                id="channel-id"
                placeholder="C1234567890 or #mental-health"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Specify a channel for team wellness announcements or leave empty for direct messages only.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Team Wellness Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div className="text-sm">
                    <div className="font-medium">Anonymous Therapy</div>
                    <div className="text-gray-600">Private, confidential support</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium">Team Check-ins</div>
                    <div className="text-gray-600">Group wellness monitoring</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div className="text-sm">
                    <div className="font-medium">Stress Alerts</div>
                    <div className="text-gray-600">Automated wellbeing support</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-purple-500" />
                  <div className="text-sm">
                    <div className="font-medium">Break Reminders</div>
                    <div className="text-gray-600">Healthy work-life balance</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Privacy Notice
              </h4>
              <p className="text-sm text-amber-700">
                All therapy conversations are private and anonymous. Employers cannot access individual therapy sessions or personal mental health data.
              </p>
            </div>

            <Button 
              onClick={setupIntegration}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              Complete Slack Setup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SlackSetupWizard;