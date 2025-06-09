
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useOnboardingData } from "@/hooks/useOnboardingData";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'positive' | 'negative' | 'neutral';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentSession } = useSession();
  const { onboardingData } = useOnboardingData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session messages on mount
  useEffect(() => {
    if (currentSession) {
      loadSessionMessages();
    } else {
      // Start with welcome message if no session
      setMessages([{
        id: '1',
        content: generateWelcomeMessage(),
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'positive'
      }]);
    }
  }, [currentSession, onboardingData]);

  const generateWelcomeMessage = () => {
    if (!onboardingData) {
      return "Hello! I'm your AI therapy companion. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. How are you feeling today?";
    }

    let welcomeMessage = "Welcome back! I'm glad you're here for another session. ";
    
    if (onboardingData.goals.length > 0) {
      welcomeMessage += `I remember you're working on ${onboardingData.goals.slice(0, 2).join(' and ')}. `;
    }
    
    welcomeMessage += "How are you feeling today, and what would you like to focus on?";
    
    return welcomeMessage;
  };

  const loadSessionMessages = async () => {
    if (!currentSession) return;

    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', currentSession.id)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const loadedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'ai',
        timestamp: new Date(msg.timestamp),
        emotion: msg.emotion as 'positive' | 'negative' | 'neutral' | undefined
      }));

      if (loadedMessages.length === 0) {
        // Start with welcome message for new sessions
        const welcomeMessage: Message = {
          id: 'welcome',
          content: generateWelcomeMessage(),
          sender: 'ai',
          timestamp: new Date(),
          emotion: 'positive'
        };
        setMessages([welcomeMessage]);
        await saveMessage(welcomeMessage);
      } else {
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const saveMessage = async (message: Message) => {
    if (!currentSession) return;

    try {
      await supabase.from('session_messages').insert({
        session_id: currentSession.id,
        content: message.content,
        sender: message.sender,
        emotion: message.emotion,
        timestamp: message.timestamp.toISOString()
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const analyzeEmotion = (text: string): 'positive' | 'negative' | 'neutral' => {
    // Simple emotion analysis - could be enhanced with AI
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful', 'better', 'progress'];
    const negativeWords = ['sad', 'angry', 'depressed', 'anxious', 'worried', 'afraid', 'stressed', 'overwhelmed'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat', {
        body: { message: userMessage, userId: user.id }
      });

      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error('Error calling AI service:', error);
      // Fallback to basic response
      const emotion = analyzeEmotion(userMessage);
      
      if (emotion === 'negative') {
        return "I hear that you're going through a difficult time. It takes courage to share these feelings. Can you tell me more about what's been weighing on your mind?";
      } else if (emotion === 'positive') {
        return "I'm glad to hear there are positive moments in your life. It's important to acknowledge and celebrate these feelings. What specifically has been going well for you?";
      } else {
        return "Thank you for sharing that with me. I'm here to listen and support you. What would be most helpful for you to explore right now?";
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      emotion: analyzeEmotion(inputMessage)
    };

    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'neutral'
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveMessage(aiMessage);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-6 text-center">
          <CardContent>
            <Heart className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Active Session</h2>
            <p className="text-muted-foreground mb-4">Please start a therapy session from your dashboard to begin chatting.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">AI Therapy Session</h1>
          <p className="text-muted-foreground">A safe space to explore your thoughts and feelings</p>
        </div>

        <Card className="h-[600px] flex flex-col shadow-lg">
          <CardContent className="flex-1 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    message.sender === 'ai' 
                      ? 'bg-gradient-to-br from-therapy-500 to-calm-500' 
                      : 'bg-muted'
                  }`}>
                    {message.sender === 'ai' ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-therapy-500 text-white'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-therapy-500 to-calm-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This is AI-powered support. In crisis situations, please contact emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
