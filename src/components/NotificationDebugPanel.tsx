
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const NotificationDebugPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [notificationType, setNotificationType] = useState('session_reminder');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const notificationTypes = [
    { value: 'session_reminder', label: 'Session Reminder' },
    { value: 'milestone_achieved', label: 'Milestone Achieved' },
    { value: 'insight_generated', label: 'Insight Generated' },
    { value: 'mood_check', label: 'Mood Check' },
    { value: 'progress_update', label: 'Progress Update' },
  ];

  const handleSendNotification = async () => {
    if (!recipientEmail) {
      toast({
        title: 'Missing Recipient',
        description: 'Please enter a recipient email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);

    try {
      // Mock notification sending for debug purposes
      const result = { success: true };

      if (result.success) {
        toast({
          title: 'Notification Sent',
          description: `Test notification sent to ${recipientEmail}.`,
        });
      } else {
        toast({
          title: 'Send Failed',
          description: 'Failed to send notification. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while sending notification.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="notification-type">Notification Type</Label>
          <Select
            value={notificationType}
            onValueChange={setNotificationType}
          >
            <SelectTrigger id="notification-type" className="w-full">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              {notificationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="recipient-email">Recipient Email</Label>
          <Input
            id="recipient-email"
            type="email"
            placeholder="user@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="custom-message">Custom Message (optional)</Label>
          <Textarea
            id="custom-message"
            placeholder="Add a custom message to include in the notification"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={handleSendNotification}
          disabled={isSending}
          className="w-full"
        >
          {isSending ? 'Sending...' : 'Send Test Notification'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationDebugPanel;
