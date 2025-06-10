
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  Users, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  status: 'sent' | 'delivered' | 'read';
  sent_at: string;
  read_at?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

const UserCommunicationCenter = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    recipient_type: 'selected' as 'all' | 'selected' | 'filtered'
  });

  useEffect(() => {
    fetchMessages();
    fetchTemplates();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          id,
          user_id,
          title,
          message,
          priority,
          is_read,
          created_at
        `)
        .eq('type', 'admin_message')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = notifications?.map(notif => notif.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      const messageData: Message[] = notifications?.map(notif => {
        const userProfile = profiles?.find(p => p.id === notif.user_id);
        
        return {
          id: notif.id,
          recipient_id: notif.user_id,
          recipient_name: userProfile?.name || 'Unknown User',
          recipient_email: userProfile?.email || '',
          subject: notif.title,
          content: notif.message,
          priority: notif.priority as 'low' | 'medium' | 'high',
          status: notif.is_read ? 'read' : 'delivered',
          sent_at: notif.created_at,
        };
      }) || [];

      setMessages(messageData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchTemplates = async () => {
    // For now, we'll use static templates since we don't have a templates table
    const staticTemplates: MessageTemplate[] = [
      {
        id: '1',
        name: 'Welcome Message',
        subject: 'Welcome to our platform!',
        content: 'Hi {{name}},\n\nWelcome to our mental wellness platform. We\'re excited to have you on board!\n\nBest regards,\nThe Team',
        category: 'onboarding'
      },
      {
        id: '2',
        name: 'Session Reminder',
        subject: 'Don\'t forget your therapy session',
        content: 'Hi {{name}},\n\nThis is a friendly reminder about your upcoming therapy session. Taking care of your mental health is important!\n\nBest regards,\nThe Team',
        category: 'reminder'
      },
      {
        id: '3',
        name: 'Premium Upgrade',
        subject: 'Unlock premium features',
        content: 'Hi {{name}},\n\nUpgrade to premium to access advanced features and personalized content.\n\nBest regards,\nThe Team',
        category: 'promotional'
      }
    ];
    
    setTemplates(staticTemplates);
  };

  const sendMessage = async () => {
    if (!messageForm.subject.trim() || !messageForm.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message content.",
        variant: "destructive",
      });
      return;
    }

    if (messageForm.recipient_type === 'selected' && selectedUsers.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select users to send the message to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let recipientIds: string[] = [];

      if (messageForm.recipient_type === 'all') {
        const { data: allUsers, error } = await supabase
          .from('profiles')
          .select('id');
        
        if (error) throw error;
        recipientIds = allUsers?.map(user => user.id) || [];
      } else {
        recipientIds = selectedUsers;
      }

      const notifications = recipientIds.map(userId => ({
        user_id: userId,
        type: 'admin_message',
        title: messageForm.subject,
        message: messageForm.content,
        priority: messageForm.priority,
        data: { source: 'admin_communication_center' }
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Message sent successfully",
        description: `Message sent to ${recipientIds.length} users.`,
      });

      // Reset form
      setMessageForm({
        subject: '',
        content: '',
        priority: 'medium',
        recipient_type: 'selected'
      });
      setSelectedUsers([]);
      
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useTemplate = (template: MessageTemplate) => {
    setMessageForm(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delivered': return <Mail className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Communication Center</h2>
          <p className="text-gray-400">Send messages and announcements to users</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="compose" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Recipients</label>
                  <Select
                    value={messageForm.recipient_type}
                    onValueChange={(value) => setMessageForm(prev => ({ ...prev, recipient_type: value as any }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="selected">Selected Users</SelectItem>
                      <SelectItem value="filtered">Filtered Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Priority</label>
                  <Select
                    value={messageForm.priority}
                    onValueChange={(value) => setMessageForm(prev => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Subject</label>
                <Input
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject..."
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Message</label>
                <Textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Your message content..."
                  rows={6}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {messageForm.recipient_type === 'all' && 'Will be sent to all users'}
                  {messageForm.recipient_type === 'selected' && `${selectedUsers.length} users selected`}
                </div>
                <Button onClick={sendMessage} disabled={isLoading}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{template.subject}</p>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {template.content.substring(0, 100)}...
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => useTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Message History</CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(message.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{message.subject}</span>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            To: {message.recipient_name} • {new Date(message.sent_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={message.status === 'read' ? 'default' : 'secondary'}>
                        {message.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserCommunicationCenter;
