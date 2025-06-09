
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'positive' | 'negative' | 'neutral';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI therapy companion. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'positive'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeEmotion = (text: string): 'positive' | 'negative' | 'neutral' => {
    // Simple emotion analysis - in production this would use AI
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful'];
    const negativeWords = ['sad', 'angry', 'depressed', 'anxious', 'worried', 'afraid'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic therapeutic responses - in production this would use actual AI
    const emotion = analyzeEmotion(userMessage);
    
    if (emotion === 'negative') {
      return "I hear that you're going through a difficult time. It takes courage to share these feelings. Can you tell me more about what's been weighing on your mind?";
    } else if (emotion === 'positive') {
      return "I'm glad to hear there are positive moments in your life. It's important to acknowledge and celebrate these feelings. What specifically has been going well for you?";
    } else {
      return "Thank you for sharing that with me. I'm here to listen and support you. What would be most helpful for you to explore right now?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      emotion: analyzeEmotion(inputMessage)
    };

    setMessages(prev => [...prev, userMessage]);
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
