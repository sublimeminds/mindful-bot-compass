import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, User, Play, MessageCircle } from 'lucide-react';

const demoMessages = [
  {
    role: 'user',
    message: "I've been feeling anxious about work lately.",
    delay: 0
  },
  {
    role: 'ai',
    message: "I understand that work anxiety can feel overwhelming. Can you tell me what specific aspects are causing you the most stress?",
    delay: 1000
  },
  {
    role: 'user',
    message: "I have a big presentation next week and keep worrying about messing up.",
    delay: 2000
  },
  {
    role: 'ai',
    message: "That's completely natural. Let's work through some techniques to help manage presentation anxiety. First, let's try a grounding exercise.",
    delay: 3000
  }
];

const InstantDemoPreview = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState([demoMessages[0]]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || currentMessage >= demoMessages.length - 1) return;

    const timer = setTimeout(() => {
      const nextMessage = currentMessage + 1;
      setDisplayedMessages(prev => [...prev, demoMessages[nextMessage]]);
      setCurrentMessage(nextMessage);
      
      if (nextMessage >= demoMessages.length - 1) {
        setIsPlaying(false);
      }
    }, demoMessages[currentMessage + 1]?.delay || 2000);

    return () => clearTimeout(timer);
  }, [currentMessage, isPlaying]);

  const startFullDemo = () => {
    // Reset and start full interactive demo
    setCurrentMessage(0);
    setDisplayedMessages([demoMessages[0]]);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          See AI Therapy in Action
        </h3>
        <p className="text-white/80 mb-6">
          Watch how our AI provides personalized, empathetic support in real-time conversations.
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="space-y-4 min-h-[300px]">
            {displayedMessages.map((msg, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 animate-fade-in ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-therapy-500 to-harmony-500'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-xs md:max-w-md p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white/20 text-white backdrop-blur-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {isPlaying && currentMessage < demoMessages.length - 1 && (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-therapy-500 to-harmony-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-8 pt-6 border-t border-white/20">
            <Button 
              onClick={startFullDemo}
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white px-8 py-3 group"
            >
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Start Full Interactive Demo
              <MessageCircle className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-3">
              Experience the complete AI therapy conversation flow
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstantDemoPreview;