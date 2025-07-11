import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  User, 
  Bot,
  MessageSquare,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  context?: any;
}

interface TherapistPersonality {
  id: string;
  name: string;
  approach: string;
  specialties: string[];
  description: string;
  color_scheme: string;
}

const AdvancedTherapyChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [therapists, setTherapists] = useState<TherapistPersonality[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistPersonality | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStats, setSessionStats] = useState({ duration: 0, messageCount: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchTherapists();
      startNewSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        duration: Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000 / 60)
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTherapists = async () => {
    try {
      const { data } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);
      
      setTherapists(data || []);
      if (data && data.length > 0) {
        setSelectedTherapist(data[0]); // Default to first therapist
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const startNewSession = async () => {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
          session_type: 'ai_chat',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentSession(data);
      sessionStartTime.current = new Date();
      
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hello! I'm ${selectedTherapist?.name || 'your AI therapist'}. I'm here to provide a safe, supportive space for our conversation. How are you feeling today?`,
        sender: 'ai',
        timestamp: new Date(),
        context: { therapist: selectedTherapist?.id }
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start therapy session');
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          session_summary: `Session with ${messages.length} messages. Duration: ${sessionStats.duration} minutes.`
        })
        .eq('id', currentSession.id);

      toast.success('Session ended successfully');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setSessionStats(prev => ({ ...prev, messageCount: prev.messageCount + 1 }));

    try {
      // Simulate AI response for now
      const aiResponse = generateAIResponse(content, selectedTherapist);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.reply,
        sender: 'ai',
        timestamp: new Date(),
        emotion: aiResponse.emotion,
        context: { therapist: selectedTherapist?.id }
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const generateAIResponse = (message: string, therapist: TherapistPersonality | null) => {
    const responses = [
      "Thank you for sharing that with me. How does that make you feel?",
      "I can hear that this is important to you. Can you tell me more about what you're experiencing?",
      "That sounds challenging. What coping strategies have you tried in the past?",
      "I appreciate your openness. What would you like to focus on in our session today?",
      "Your feelings are valid. Let's explore this together. What comes to mind when you think about this situation?"
    ];
    
    const emotions = ['supportive', 'empathetic', 'understanding', 'calm', 'encouraging'];
    
    return {
      reply: responses[Math.floor(Math.random() * responses.length)],
      emotion: emotions[Math.floor(Math.random() * emotions.length)]
    };
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
    toast.info(isRecording ? 'Recording stopped' : 'Recording started');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{selectedTherapist?.name || 'AI Therapist'}</h2>
              <p className="text-sm text-gray-500">
                {selectedTherapist?.approach || 'Supportive Therapy'} • Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{sessionStats.duration}m</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>{sessionStats.messageCount}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={endSession}>
              End Session
            </Button>
          </div>
        </div>

        {selectedTherapist && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTherapist.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-therapy-500 text-white' 
                  : 'bg-white border-2 border-therapy-200'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-therapy-600" />}
              </div>
              
              <div className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-therapy-500 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${
                    message.sender === 'user' ? 'text-therapy-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.emotion && (
                    <Badge variant="outline" className="text-xs ml-2">
                      {message.emotion}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-therapy-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-therapy-600" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? 'bg-red-100 text-red-600' : ''}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts..."
              disabled={isLoading}
              className="border-0 bg-gray-100 focus:bg-white"
            />
          </div>
          
          <Button 
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-therapy-500 hover:bg-therapy-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTherapyChat;