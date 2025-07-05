import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, Sparkles } from 'lucide-react';

// Pure static chat demo - no React hooks, no interactivity, renders immediately
const StaticChatDemo = () => {
  const demoMessages = [
    {
      sender: 'user',
      text: "Hi, I'm feeling anxious about a job interview tomorrow.",
      timestamp: '2:30 PM'
    },
    {
      sender: 'ai',
      text: "I understand how nerve-wracking interviews can be. It's completely normal to feel anxious before important moments. Let's work through this together.",
      timestamp: '2:30 PM'
    },
    {
      sender: 'user', 
      text: "I keep imagining worst-case scenarios. What if I freeze up?",
      timestamp: '2:32 PM'
    },
    {
      sender: 'ai',
      text: "Those 'what if' thoughts can be overwhelming. This is called catastrophic thinking, and it's very common. Let me teach you a grounding technique that can help calm your mind.",
      timestamp: '2:33 PM'
    },
    {
      sender: 'ai',
      text: "Try the 5-4-3-2-1 technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This brings you back to the present moment.",
      timestamp: '2:34 PM'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden animate-scale-in">
        <CardHeader className="text-center p-6 border-b">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">AI Therapy Demo</CardTitle>
            <Sparkles className="h-5 w-5 text-therapy-500" />
          </div>
          <p className="text-sm text-gray-600">
            Experience personalized AI therapy conversations
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Chat Messages */}
          <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 space-y-4">
            {demoMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-slate-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            
            {/* AI Typing Indicator */}
            <div className="flex justify-start animate-fade-in" style={{ animationDelay: '2.5s' }}>
              <div className="bg-slate-100 p-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-slate-600">AI Therapist is typing</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Static Input Area */}
          <div className="border-t p-4 bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-500">
                Try our interactive demo...
              </div>
              <Button 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-6 py-3 font-semibold hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  const element = document.querySelector('[data-demo-upgrade]');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mt-2 text-center">
              This is a preview • Full interactive chat available after signup
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* CTA Section */}
      <div className="mt-6 text-center" data-demo-upgrade>
        <p className="text-sm text-slate-600 mb-3">
          Ready to start your personalized therapy journey?
        </p>
        <Button 
          className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-8 py-3 font-bold hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => window.location.href = '/onboarding'}
        >
          <Heart className="h-4 w-4 mr-2" />
          Get Started Free
        </Button>
      </div>
    </div>
  );
};

export default StaticChatDemo;