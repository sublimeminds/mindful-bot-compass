
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Play, Pause, RotateCcw, MessageSquare } from 'lucide-react';

const demoConversation = [
  {
    role: 'user',
    message: "I've been feeling really anxious about work lately.",
    delay: 1000
  },
  {
    role: 'ai',
    message: "I understand that work anxiety can be overwhelming. It's completely normal to feel this way, and I'm here to help you work through it. Can you tell me what specific aspects of work are causing you the most stress?",
    delay: 2500
  },
  {
    role: 'user',
    message: "I have a big presentation next week and I keep worrying about messing up in front of my colleagues.",
    delay: 2000
  },
  {
    role: 'ai',
    message: "Presentation anxiety is very common - you're definitely not alone in feeling this way. Let's work through some techniques to help manage these feelings. First, let's try a quick grounding exercise. Can you name 3 things you can see around you right now?",
    delay: 3000
  },
  {
    role: 'user',
    message: "I can see my laptop, a coffee cup, and a plant on my desk.",
    delay: 1500
  },
  {
    role: 'ai',
    message: "Great! Now let's build on that success. Preparation is key to reducing presentation anxiety. Have you started preparing your presentation content yet? We can work together on a preparation strategy that will boost your confidence.",
    delay: 2800
  }
];

interface InteractiveChatDemoProps {
  autoStart?: boolean;
}

const InteractiveChatDemo: React.FC<InteractiveChatDemoProps> = ({ autoStart = false }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [displayedMessages, setDisplayedMessages] = useState<typeof demoConversation>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isPlaying || currentMessage >= demoConversation.length) return;

    const timer = setTimeout(() => {
      if (currentMessage === 0) {
        setDisplayedMessages([demoConversation[0]]);
        setCurrentMessage(1);
      } else {
        setIsTyping(true);
        
        setTimeout(() => {
          setDisplayedMessages(prev => [...prev, demoConversation[currentMessage]]);
          setIsTyping(false);
          setCurrentMessage(prev => prev + 1);
        }, 1000);
      }
    }, currentMessage === 0 ? 500 : demoConversation[currentMessage - 1]?.delay || 2000);

    return () => clearTimeout(timer);
  }, [currentMessage, isPlaying]);

  useEffect(() => {
    if (currentMessage >= demoConversation.length && isPlaying) {
      setIsPlaying(false);
    }
  }, [currentMessage, isPlaying]);

  const resetDemo = () => {
    setCurrentMessage(0);
    setDisplayedMessages([]);
    setIsTyping(false);
    setIsPlaying(true);
  };

  const toggleDemo = () => {
    if (displayedMessages.length === 0) {
      resetDemo();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MessageSquare className="h-6 w-6 text-therapy-500" />
            <CardTitle className="text-xl">AI Therapy Demo</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Experience how our AI provides personalized mental health support
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            <Button 
              onClick={toggleDemo}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600"
              size="sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : displayedMessages.length === 0 ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            {displayedMessages.length > 0 && (
              <Button onClick={resetDemo} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="min-h-[400px] max-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {displayedMessages.map((msg, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 animate-fade-in ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-therapy-500 to-calm-500'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-50 border'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-50 border p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {displayedMessages.length === demoConversation.length && (
            <div className="text-center mt-6 pt-6 border-t">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Demo Complete
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                Ready to start your own therapy journey?
              </p>
              <Button 
                className="mt-3 bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600"
                onClick={() => window.open('/auth', '_blank')}
              >
                Get Started Free
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveChatDemo;
