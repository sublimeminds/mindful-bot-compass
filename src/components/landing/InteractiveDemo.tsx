
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, User, Play, Pause } from 'lucide-react';

const demoConversation = [
  {
    role: 'user',
    message: "I've been feeling really anxious lately about work.",
    delay: 0
  },
  {
    role: 'ai',
    message: "I understand that work anxiety can be overwhelming. Can you tell me more about what specific aspects of work are causing you the most stress?",
    delay: 2000
  },
  {
    role: 'user',
    message: "I have a big presentation next week and I keep worrying about messing up.",
    delay: 4000
  },
  {
    role: 'ai',
    message: "That's a very common concern. Let's work through some techniques to help manage presentation anxiety. First, let's try a grounding exercise. Can you name 5 things you can see around you right now?",
    delay: 6000
  }
];

const InteractiveDemo = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<typeof demoConversation>([]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentMessage < demoConversation.length) {
        setDisplayedMessages(prev => [...prev, demoConversation[currentMessage]]);
        setCurrentMessage(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, currentMessage === 0 ? 500 : demoConversation[currentMessage]?.delay || 2000);

    return () => clearTimeout(timer);
  }, [currentMessage, isPlaying]);

  const resetDemo = () => {
    setCurrentMessage(0);
    setDisplayedMessages([]);
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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">See MindfulAI in Action</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience how our AI therapist provides personalized, empathetic support
          </p>
          <Button 
            onClick={toggleDemo}
            size="lg"
            className="bg-therapy-500 hover:bg-therapy-600"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {displayedMessages.length === 0 ? 'Start Demo' : isPlaying ? 'Pause Demo' : 'Resume Demo'}
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="min-h-[400px]">
            <CardContent className="p-6">
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
                    <div className={`flex-1 max-w-xs md:max-w-md p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                
                {isPlaying && currentMessage < demoConversation.length && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {displayedMessages.length === demoConversation.length && (
                <div className="text-center mt-6 pt-6 border-t">
                  <Button onClick={resetDemo} variant="outline">
                    Restart Demo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
