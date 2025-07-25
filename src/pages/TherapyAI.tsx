import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Brain, Zap, Heart, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TherapyAIPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-400 via-therapy-500 to-harmony-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading TherapySync AI Core...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="min-h-screen bg-gradient-to-br from-therapy-400 via-therapy-500 to-harmony-600">
        {/* Hero Section with Navigation-Matched Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-therapy-400 via-therapy-500 to-harmony-600 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse-neural shadow-2xl">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-3">TherapySync AI Core</h1>
                <p className="text-white/90 text-xl max-w-2xl">
                  Core AI therapy platform with integrated wellness tracking and personalized care
                </p>
              </div>
            </div>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Zap className="h-8 w-8 text-white mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered Sessions</h3>
                <p className="text-white/80">Advanced AI therapists trained in multiple therapeutic approaches</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Heart className="h-8 w-8 text-white mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Wellness Tracking</h3>
                <p className="text-white/80">Integrated mood and progress monitoring for comprehensive care</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Settings className="h-8 w-8 text-white mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                <p className="text-white/80">Adaptive AI that learns and evolves with your therapeutic journey</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>AI Sessions</span>
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Wellness Tracking</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-therapy-50 to-harmony-100 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4 text-therapy-800">Welcome to TherapySync AI</h3>
                    <p className="text-therapy-700 mb-4">
                      Our core AI platform combines cutting-edge artificial intelligence with evidence-based therapeutic approaches 
                      to provide you with personalized mental health support.
                    </p>
                    <ul className="space-y-2 text-therapy-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                        24/7 AI therapist availability
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                        Multiple therapeutic modalities
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                        Integrated wellness tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                        Personalized treatment plans
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-harmony-50 to-balance-100 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4 text-harmony-800">Your Therapeutic Journey</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-harmony-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-harmony-800">Initial Assessment</h4>
                          <p className="text-harmony-600 text-sm">AI analyzes your needs and preferences</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-harmony-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-harmony-800">Personalized Plan</h4>
                          <p className="text-harmony-600 text-sm">Custom therapeutic approach designed for you</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-harmony-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-harmony-800">Ongoing Support</h4>
                          <p className="text-harmony-600 text-sm">Continuous AI guidance and progress tracking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
                  <h3 className="text-xl font-semibold mb-2">AI Therapy Sessions</h3>
                  <p className="text-muted-foreground">
                    Start your personalized AI therapy session with our advanced therapeutic AI
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tracking">
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
                  <h3 className="text-xl font-semibold mb-2">Wellness Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor your mental health progress with integrated wellness tracking
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
                  <h3 className="text-xl font-semibold mb-2">AI Core Settings</h3>
                  <p className="text-muted-foreground">
                    Configure your AI therapy preferences and personalization options
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default TherapyAIPage;