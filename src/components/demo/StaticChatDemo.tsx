import React from 'react';

const staticConversation = [
  {
    role: 'user',
    message: "I've been feeling really anxious about work lately.",
  },
  {
    role: 'ai',
    message: "I understand that work anxiety can be overwhelming. It's completely normal to feel this way, and I'm here to help you work through it. Can you tell me what specific aspects of work are causing you the most stress?",
  },
  {
    role: 'user',
    message: "I have a big presentation next week and I keep worrying about messing up in front of my colleagues.",
  },
  {
    role: 'ai',
    message: "Presentation anxiety is very common - you're definitely not alone in feeling this way. Let's work through some techniques to help manage these feelings. First, let's try a quick grounding exercise. Can you name 3 things you can see around you right now?",
  }
];

// Hook-free static demo that shows conversation immediately
const StaticChatDemo: React.FC = () => {
  const startInteractiveDemo = () => {
    // Try to navigate to a dedicated demo page or show interactive version
    console.log('Starting interactive demo...');
    
    // For now, just scroll to encourage user engagement
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
          <div className="flex justify-center mt-4">
            <button 
              onClick={startInteractiveDemo}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Try Interactive Demo
            </button>
          </div>
        </div>
        
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-6">
          <div className="space-y-4">
            {staticConversation.map((msg, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
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
          </div>

          <div className="text-center mt-6 pt-6 border-t">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-therapy-100 text-therapy-800 border border-therapy-200">
              Static Preview
            </span>
            <p className="text-sm text-gray-600 mt-2">
              Ready to start your own therapy journey?
            </p>
            <button 
              className="mt-3 bg-gradient-to-r from-therapy-500 to-calm-500 text-white hover:from-therapy-600 hover:to-calm-600 px-6 py-2 rounded-md font-medium transition-all duration-200"
              onClick={() => {
                try {
                  window.open('/auth', '_blank');
                } catch (error) {
                  // Fallback navigation
                  window.location.href = '/auth';
                }
              }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticChatDemo;