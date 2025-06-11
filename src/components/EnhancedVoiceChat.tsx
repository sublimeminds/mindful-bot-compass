
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mic, Type, Volume2, Settings } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { useToast } from '@/hooks/use-toast';

interface EnhancedVoiceChatProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const EnhancedVoiceChat: React.FC<EnhancedVoiceChatProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [voiceSettings, setVoiceSettings] = useState({
    autoSend: false,
    responseAudio: true
  });
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent to the AI therapist.",
      });
    }
  };

  const handleVoiceTranscriptChange = (transcript: string) => {
    setMessage(transcript);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Chat with AI Therapist</span>
            <Badge variant="secondary" className="bg-therapy-100">
              {inputMode === 'voice' ? 'Voice Mode' : 'Text Mode'}
            </Badge>
          </CardTitle>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMode('text')}
              className={inputMode === 'text' ? 'bg-therapy-100' : ''}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMode('voice')}
              className={inputMode === 'voice' ? 'bg-therapy-100' : ''}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as 'text' | 'voice')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Type</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Speak</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Share your thoughts and feelings..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={disabled}
                className="min-h-[120px] resize-none"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={disabled || !message.trim()}
                  className="bg-therapy-600 hover:bg-therapy-700"
                >
                  Send Message
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <VoiceInput
              onTranscriptChange={handleVoiceTranscriptChange}
              onSend={handleSendMessage}
              disabled={disabled}
            />
            
            {message && (
              <div className="space-y-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={disabled}
                  className="min-h-[80px] resize-none"
                  placeholder="Edit your transcribed message if needed..."
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Audio responses enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Voice settings</span>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            Secure & Private
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedVoiceChat;
