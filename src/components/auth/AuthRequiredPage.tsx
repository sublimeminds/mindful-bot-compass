import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, ArrowRight, Brain, Sparkles } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import heroImage from '@/assets/hero-therapy-ai.jpg';

interface AuthRequiredPageProps {
  title?: string;
  description?: string;
  redirectTo?: string;
}

const AuthRequiredPage: React.FC<AuthRequiredPageProps> = ({ 
  title = "Join TherapySync",
  description = "Sign in to access your personalized therapy dashboard and AI-powered mental wellness tools.",
  redirectTo = "/dashboard"
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-harmony-50 to-flow-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-therapy-200/20 to-harmony-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-flow-200/20 to-calm-200/20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero content */}
          <div className="text-center md:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Shield className="h-4 w-4 text-therapy-600" />
              <span className="text-sm font-medium text-therapy-700">HIPAA Compliant & Secure</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="block">Welcome to</span>
              <span className="block therapy-text-gradient">TherapySync AI</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Experience personalized therapy sessions, mood tracking, and emotional support available 24/7. 
              Join thousands who have transformed their mental wellness with our AI-powered platform.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-600">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-therapy-500" />
                <span className="font-medium">50,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-therapy-500" />
                <span className="font-medium">24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-therapy-500" />
                <span className="font-medium">AI-Powered</span>
              </div>
            </div>

            {/* Hero image for mobile */}
            <div className="md:hidden">
              <img 
                src={heroImage} 
                alt="TherapySync AI - Mental wellness support" 
                className="w-full h-48 object-cover rounded-2xl shadow-xl"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <GradientButton 
                size="lg" 
                onClick={() => navigate('/auth', { state: { redirectTo, mode: 'signup' } })}
                className="px-8 py-4 text-lg font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth', { state: { redirectTo, mode: 'signin' } })}
                className="px-8 py-4 text-lg font-semibold border-2 border-therapy-200 hover:bg-therapy-50"
              >
                Sign In
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              No commitment required • Cancel anytime • HIPAA compliant
            </p>
          </div>

          {/* Right side - Auth card */}
          <div className="hidden md:block">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="TherapySync AI - Mental wellness support" 
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-lg font-semibold">AI-Powered Therapy</span>
                  </div>
                  <p className="text-sm opacity-90">Personalized mental health support</p>
                </div>
              </div>
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-4 bg-therapy-50 rounded-lg">
                    <Brain className="h-8 w-8 text-therapy-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">AI Therapy</p>
                  </div>
                  <div className="text-center p-4 bg-harmony-50 rounded-lg">
                    <Heart className="h-8 w-8 text-harmony-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Mood Tracking</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <GradientButton 
                    className="w-full py-3"
                    onClick={() => navigate('/auth', { state: { redirectTo, mode: 'signup' } })}
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-3 border-therapy-200 hover:bg-therapy-50"
                    onClick={() => navigate('/auth', { state: { redirectTo, mode: 'signin' } })}
                  >
                    Sign In to Existing Account
                  </Button>
                </div>
                
                <div className="text-center text-xs text-slate-500 space-y-1">
                  <p>✓ Free 14-day trial • ✓ No credit card required</p>
                  <p>✓ HIPAA compliant • ✓ Cancel anytime</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredPage;