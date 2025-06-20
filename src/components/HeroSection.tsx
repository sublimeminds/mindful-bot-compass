
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 via-white to-calm-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-100/20 via-transparent to-calm-100/20 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-700 bg-clip-text text-transparent leading-tight">
            Your Journey to Mental Wellness Starts Here
          </h1>
          
          <p className="text-xl md:text-2xl text-therapy-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience personalized therapy sessions, mood tracking, and wellness tools designed to support your mental health journey with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-therapy-700 hover:from-therapy-600 hover:via-therapy-700 hover:to-therapy-800 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105"
              onClick={handleGetStarted}
            >
              Start Your Journey
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 rounded-full px-8 py-4 text-lg transition-all duration-300"
              onClick={() => {
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-therapy-100">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-therapy-800 mb-2">AI-Powered Therapy</h3>
              <p className="text-therapy-600">Personalized sessions with intelligent insights tailored to your unique needs.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-therapy-100">
              <div className="w-12 h-12 bg-gradient-to-r from-calm-500 to-calm-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-therapy-800 mb-2">Mood Tracking</h3>
              <p className="text-therapy-600">Track your emotional patterns and gain insights into your mental wellness journey.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-therapy-100">
              <div className="w-12 h-12 bg-gradient-to-r from-harmony-500 to-harmony-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-therapy-800 mb-2">Goal Setting</h3>
              <p className="text-therapy-600">Set and achieve meaningful wellness goals with guided support and progress tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
