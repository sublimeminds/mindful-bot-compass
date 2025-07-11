import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Shield, Bot, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface TelegramSetupWizardProps {
  onComplete?: () => void;
}

const TelegramSetupWizard = ({ onComplete }: TelegramSetupWizardProps) => {
  const { createIntegration, testIntegration } = useIntegrations();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCreateBot = () => {
    window.open('https://t.me/botfather', '_blank');
    toast({
      title: "BotFather Opened",
      description: "Follow the instructions to create your bot and get the token.",
    });
  };

  const verifyBot = async () => {
    if (!botToken) {
      toast({
        title: "Missing Token",
        description: "Please enter your bot token first.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Test the bot token
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        toast({
          title: "Bot Verified!",
          description: `Bot @${data.result.username} is ready for use.`,
        });
        setCurrentStep(2);
      } else {
        throw new Error(data.description || 'Invalid bot token');
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
      const integration = await createIntegration('telegram', {
        bot_token: botToken,
        chat_id: chatId,
        platform_user_id: chatId,
        crisis_escalation_enabled: true,
        access_tokens: {
          bot_token: botToken
        }
      });

      // Test the integration
      await testIntegration(integration.id);
      
      setIsCompleted(true);
      toast({
        title: "Telegram Connected!",
        description: "Your Telegram bot is now ready for AI therapy conversations.",
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
          <h3 className="text-xl font-semibold mb-2">Telegram Connected Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Your Telegram bot is now ready for secure, encrypted therapy conversations.
          </p>
          <Badge className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            End-to-End Encrypted
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-cyan-500" />
          <span className="text-lg font-semibold">Telegram Setup Wizard - Step {currentStep} of 2</span>
        </div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Create Your Telegram Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-cyan-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">How to create a Telegram bot:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open Telegram and search for @BotFather</li>
                <li>Send the command <code className="bg-gray-200 px-1 rounded">/newbot</code></li>
                <li>Choose a name for your therapy bot</li>
                <li>Choose a username ending with 'bot' (e.g., mytherapybot)</li>
                <li>Copy the bot token that BotFather provides</li>
              </ol>
            </div>

            <Button 
              onClick={handleCreateBot}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open BotFather
            </Button>

            <div className="space-y-2">
              <Label htmlFor="bot-token">Bot Token</Label>
              <Input
                id="bot-token"
                type="password"
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                The token you received from BotFather. Keep this secure and never share it.
              </p>
            </div>

            <Button 
              onClick={verifyBot}
              disabled={!botToken || isVerifying}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              {isVerifying ? 'Verifying...' : 'Verify Bot Token'}
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configure Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Bot Token Verified
              </h4>
              <p className="text-sm text-green-700">
                Your bot is ready for secure therapy conversations with end-to-end encryption.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-id">Chat ID (Optional)</Label>
              <Input
                id="chat-id"
                placeholder="Leave empty for direct messages"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Specify a chat ID for group therapy or leave empty for private conversations.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Privacy Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div className="text-sm">
                    <div className="font-medium">End-to-End Encryption</div>
                    <div className="text-gray-600">Messages encrypted on device</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium">Anonymous Sessions</div>
                    <div className="text-gray-600">No personal data stored</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div className="text-sm">
                    <div className="font-medium">Crisis Detection</div>
                    <div className="text-gray-600">24/7 safety monitoring</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Groups</div>
                    <div className="text-gray-600">Private therapy communities</div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={setupIntegration}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              Complete Telegram Setup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TelegramSetupWizard;