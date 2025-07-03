
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageCircle, Lightbulb, Heart, Zap, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const IntelligentAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadSuggestions();
    }
  }, [user]);

  const loadSuggestions = async () => {
    try {
      // Mock intelligent suggestions
      const mockSuggestions = [
        'How can I manage stress better?',
        'What are some relaxation techniques?',
        'Help me set a wellness goal'
      ];
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    try {
      // Mock AI response processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Message Processed',
        description: 'Your message has been processed by the AI assistant.',
      });
      setMessage('');
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Intelligent Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything about your mental wellness..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Send'}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggested Questions:</h4>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setMessage(suggestion)}
                className="text-left justify-start"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentAssistant;
