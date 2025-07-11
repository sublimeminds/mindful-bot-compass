import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, CheckCircle, Smartphone, Globe, Clock, RefreshCw } from 'lucide-react';

interface ICalSetupWizardProps {
  onComplete?: () => void;
}

const ICalSetupWizard = ({ onComplete }: ICalSetupWizardProps) => {
  const { user } = useAuth();
  const { createIntegration } = useIntegrations();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [timezone, setTimezone] = useState('UTC');
  const [calendarApp, setCalendarApp] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState('');

  const calendarApps = [
    { id: 'google', name: 'Google Calendar', instructions: 'Copy the calendar URL and paste it in your Google Calendar' },
    { id: 'outlook', name: 'Microsoft Outlook', instructions: 'Import the .ics file in Outlook calendar' },
    { id: 'apple', name: 'Apple Calendar', instructions: 'Subscribe to the calendar URL in Calendar app' },
    { id: 'thunderbird', name: 'Mozilla Thunderbird', instructions: 'Add as a remote calendar in Lightning' },
    { id: 'other', name: 'Other Calendar App', instructions: 'Most calendar apps support .ics imports' }
  ];

  const generateCalendarUrl = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/api/calendar/ical?user_id=${user?.id}&timezone=${encodeURIComponent(timezone)}`;
    setCalendarUrl(url);
    setCurrentStep(2);
  };

  const setupIntegration = async () => {
    try {
      const integration = await createIntegration('ical', {
        calendar_url: calendarUrl,
        timezone: timezone,
        calendar_app: calendarApp,
        platform_user_id: user?.id || '',
        sync_frequency: 'daily'
      });

      setIsCompleted(true);
      toast({
        title: "Calendar Integration Created!",
        description: "Your therapy sessions and goals will now sync with your calendar.",
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

  const downloadIcsFile = () => {
    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = 'therapysync-calendar.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Calendar Downloaded",
      description: "Import the .ics file into your calendar app.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(calendarUrl);
      toast({
        title: "URL Copied",
        description: "Calendar URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the URL.",
        variant: "destructive"
      });
    }
  };

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Calendar Integration Complete!</h3>
          <p className="text-gray-600 mb-4">
            Your therapy sessions, wellness goals, and check-in reminders will now appear in your calendar.
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Calendar className="h-3 w-3 mr-1" />
              Auto-Sync
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <RefreshCw className="h-3 w-3 mr-1" />
              Real-time Updates
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
          <Calendar className="h-6 w-6 text-orange-500" />
          <span className="text-lg font-semibold">Calendar Setup - Step {currentStep} of 2</span>
        </div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Configure Calendar Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What will be synced to your calendar:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Scheduled therapy sessions with AI therapists</li>
                <li>Goal deadlines and milestone reminders</li>
                <li>Weekly wellness check-in reminders</li>
                <li>Crisis support follow-up appointments</li>
                <li>Meditation and mindfulness session blocks</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Your Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (EST/EDT)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CST/CDT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MST/MDT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PST/PDT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin (CET/CEST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEST/AEDT)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                All calendar events will be displayed in your local timezone.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendar-app">Primary Calendar App</Label>
              <Select value={calendarApp} onValueChange={setCalendarApp}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your calendar app" />
                </SelectTrigger>
                <SelectContent>
                  {calendarApps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                We'll provide specific setup instructions for your calendar app.
              </p>
            </div>

            <Button 
              onClick={generateCalendarUrl}
              disabled={!timezone || !calendarApp}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Generate Calendar Integration
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Add to Your Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Calendar Feed Generated
              </h4>
              <p className="text-sm text-green-700">
                Your personalized calendar feed is ready. Choose how to add it to your calendar app.
              </p>
            </div>

            {calendarApp && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">
                  Setup Instructions for {calendarApps.find(app => app.id === calendarApp)?.name}:
                </h4>
                <p className="text-sm text-blue-700">
                  {calendarApps.find(app => app.id === calendarApp)?.instructions}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Calendar URL</Label>
                <div className="flex gap-2">
                  <Input 
                    value={calendarUrl} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={downloadIcsFile} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download .ics File
                </Button>
                <Button 
                  onClick={() => window.open(calendarUrl, '_blank')} 
                  variant="outline" 
                  className="w-full"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Subscribe to Feed
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Calendar Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div className="text-sm">
                    <div className="font-medium">Auto-Updates</div>
                    <div className="text-gray-600">Events sync automatically</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium">Cross-Platform</div>
                    <div className="text-gray-600">Works on all devices</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div className="text-sm">
                    <div className="font-medium">Smart Reminders</div>
                    <div className="text-gray-600">Pre-session notifications</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  <div className="text-sm">
                    <div className="font-medium">Real-time Sync</div>
                    <div className="text-gray-600">Instant updates</div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={setupIntegration}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Complete Calendar Setup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ICalSetupWizard;