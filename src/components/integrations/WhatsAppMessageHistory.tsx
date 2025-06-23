
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, User, Bot, RefreshCw } from 'lucide-react';

interface WhatsAppMessageHistoryProps {
  integrationId: string;
}

const WhatsAppMessageHistory = ({ integrationId }: WhatsAppMessageHistoryProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [integrationId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('integration_id', integrationId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Message History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Message History</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadMessages}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Send your first message on WhatsApp to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex items-start space-x-3 ${
                  message.sender_type === 'ai' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-lg ${
                    message.sender_type === 'ai' 
                      ? 'bg-therapy-100' 
                      : 'bg-gray-100'
                  }`}>
                    {message.sender_type === 'ai' ? (
                      <Bot className="h-4 w-4 text-therapy-600" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`flex-1 ${
                    message.sender_type === 'ai' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      message.sender_type === 'ai'
                        ? 'bg-therapy-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {message.message_type}
                      </Badge>
                      {message.delivery_status && (
                        <Badge 
                          variant={message.delivery_status === 'sent' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {message.delivery_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppMessageHistory;
