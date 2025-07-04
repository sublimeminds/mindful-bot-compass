import React, { useState, useEffect, useCallback } from 'react';

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

interface Props {
  autoStart?: boolean;
}

const FunctionalChatDemo: React.FC<Props> = ({ autoStart = false }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [displayedMessages, setDisplayedMessages] = useState<typeof demoConversation>([]);
  const [isTyping, setIsTyping] = useState(false);

  const clearDemo = useCallback(() => {
    setCurrentMessage(0);
    setDisplayedMessages([]);
    setIsTyping(false);
  }, []);

  const resetDemo = useCallback(() => {
    clearDemo();
    setIsPlaying(true);
  }, [clearDemo]);

  const toggleDemo = useCallback(() => {
    if (displayedMessages.length === 0) {
      resetDemo();
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [displayedMessages.length, isPlaying, resetDemo]);

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
    if (currentMessage >= demoConversation.length) {
      setIsPlaying(false);
    }
  }, [currentMessage]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="text-center pb-4 p-6 border-b">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <svg className="h-6 w-6 text-therapy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-bold">AI Therapy Demo</h3>
          </div>
          <p className="text-sm text-gray-600">
            Experience how our AI provides personalized mental health support
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            <button 
              onClick={toggleDemo}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center"
            >
              {isPlaying ? (
                <>
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                  Pause
                </>
              ) : displayedMessages.length === 0 ? (
                <>
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Start Demo
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Resume
                </>
              )}
            </button>
            {displayedMessages.length > 0 && (
              <button 
                onClick={resetDemo} 
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Restart
              </button>
            )}
          </div>
        </div>
        
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-6">
          <div className="space-y-4">
            {displayedMessages.map((msg, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 animate-fade-in ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
                style={{
                  animation: 'fadeIn 0.5s ease-in'
                }}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-r from-therapy-500 to-calm-500'
                }`}>
                  {msg.role === 'user' ? (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20M8.5,7A0.5,0.5 0 0,0 8,7.5A0.5,0.5 0 0,0 8.5,8A0.5,0.5 0 0,0 9,7.5A0.5,0.5 0 0,0 8.5,7M15.5,7A0.5,0.5 0 0,0 15,7.5A0.5,0.5 0 0,0 15.5,8A0.5,0.5 0 0,0 16,7.5A0.5,0.5 0 0,0 15.5,7M12,17C14,17 15.5,15.5 15.5,13.5H8.5C8.5,15.5 10,17 12,17Z"/>
                    </svg>
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
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20M8.5,7A0.5,0.5 0 0,0 8,7.5A0.5,0.5 0 0,0 8.5,8A0.5,0.5 0 0,0 9,7.5A0.5,0.5 0 0,0 8.5,7M15.5,7A0.5,0.5 0 0,0 15,7.5A0.5,0.5 0 0,0 15.5,8A0.5,0.5 0 0,0 16,7.5A0.5,0.5 0 0,0 15.5,7M12,17C14,17 15.5,15.5 15.5,13.5H8.5C8.5,15.5 10,17 12,17Z"/>
                  </svg>
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
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Demo Complete
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Ready to start your own therapy journey?
              </p>
              <button 
                className="mt-3 bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 px-6 py-2 rounded-md font-medium transition-all duration-200"
                onClick={() => window.open('/auth', '_blank')}
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FunctionalChatDemo;