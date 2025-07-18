
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, Brain, Activity, Target, Users, Zap, Eye, MessageCircle, ArrowRight, CheckCircle, Star, Clock, Shield } from 'lucide-react';
import ConversationAnalyticsDashboard from '@/components/ai/ConversationAnalyticsDashboard';
import PredictiveInterventionEngine from '@/components/ai/PredictiveInterventionEngine';
import { useSEO } from '@/hooks/useSEO';
import PageLayout from '@/components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';

const AIAnalytics = () => {
  const navigate = useNavigate();
  
  // SEO optimization
  useSEO({
    title: 'AI Analytics Dashboard - Advanced Therapy Insights | TherapySync',
    description: 'Get detailed insights into your therapy progress with advanced AI analytics. Track conversations, mood patterns, and predictive interventions.',
    keywords: 'AI analytics, therapy insights, conversation analysis, mood tracking, predictive interventions, mental health analytics',
    type: 'website'
  });

  const analyticsFeatures = [
    {
      icon: BarChart,
      title: "Conversation Analysis",
      description: "Deep insights into your therapy conversations and progress patterns",
      stat: "Real-time",
      color: "from-therapy-500 to-therapy-600"
    },
    {
      icon: Brain,
      title: "Predictive Intelligence",
      description: "AI-powered predictions to prevent crises and optimize therapy outcomes",
      stat: "AI-Powered",
      color: "from-harmony-500 to-harmony-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Comprehensive tracking of your mental health journey and milestones",
      stat: "Continuous",
      color: "from-flow-500 to-flow-600"
    }
  ];

  const analyticsCapabilities = [
    {
      icon: MessageCircle,
      title: "Conversation Insights",
      description: "Analyze therapy conversations for emotional patterns, progress markers, and breakthrough moments",
      features: ["Sentiment analysis", "Topic trends", "Breakthrough detection", "Emotional patterns"]
    },
    {
      icon: Target,
      title: "Predictive Interventions",
      description: "AI predicts when you might need additional support and suggests proactive interventions",
      features: ["Crisis prediction", "Support recommendations", "Intervention timing", "Risk assessment"]
    },
    {
      icon: Activity,
      title: "Mood & Progress Analytics",
      description: "Track your emotional well-being with detailed mood analytics and progress visualization",
      features: ["Mood tracking", "Progress charts", "Trend analysis", "Goal achievement"]
    },
    {
      icon: Users,
      title: "Comparative Analytics",
      description: "See how your progress compares to others with similar conditions (anonymized data)",
      features: ["Peer comparisons", "Success patterns", "Best practices", "Anonymous insights"]
    }
  ];

  const analyticsStats = [
    {
      icon: BarChart,
      title: "99.2%",
      subtitle: "Prediction Accuracy",
      description: "Industry-leading accuracy in therapy outcome predictions"
    },
    {
      icon: Zap,
      title: "5x",
      subtitle: "Faster Progress",
      description: "Users see 5x faster therapy progress with analytics insights"
    },
    {
      icon: Shield,
      title: "95%",
      subtitle: "Crisis Prevention",
      description: "Successfully prevented crises through predictive analytics"
    },
    {
      icon: Star,
      title: "98%",
      subtitle: "User Satisfaction",
      description: "Users love the insights and progress visibility"
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-25 to-flow-25">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-therapy-700 to-flow-600 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mr-6 animate-pulse">
                  <BarChart className="h-10 w-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl font-bold mb-2">AI Analytics</h1>
                  <p className="text-2xl text-therapy-100">Advanced Therapy Insights</p>
                </div>
              </div>
              
              <p className="text-xl text-therapy-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                Harness the power of AI to gain deep insights into your therapy journey. Track progress, predict outcomes, and optimize your mental health with advanced analytics.
              </p>

              <div className="flex items-center justify-center space-x-8 text-therapy-100 mb-12">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Predictive Intelligence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Progress Tracking</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {analyticsFeatures.map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-lg font-bold mb-2">{feature.stat}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-therapy-100 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mr-4"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Your Analytics
                </Button>
                <Button 
                  onClick={() => navigate('/therapy-chat')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-therapy-600 text-lg px-8 py-4 rounded-xl font-semibold"
                >
                  Start Session
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16 space-y-20">
          {/* Analytics Statistics */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-therapy-600">
                Revolutionary Analytics Performance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI analytics provide unprecedented insights into therapy progress and outcomes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {analyticsStats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-therapy-600 mb-2">{stat.title}</div>
                    <div className="text-lg font-semibold text-gray-700 mb-3">{stat.subtitle}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Analytics Capabilities */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Comprehensive Analytics Suite
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get detailed insights into every aspect of your therapy journey with our advanced AI analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {analyticsCapabilities.map((capability, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-xl flex items-center justify-center">
                        <capability.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{capability.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{capability.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {capability.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Analytics Dashboard */}
          <section className="bg-white rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Your Analytics Dashboard
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore your personalized therapy analytics with real-time insights and predictive intelligence.
              </p>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Conversation Analytics
                </TabsTrigger>
                <TabsTrigger value="predictions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Brain className="h-4 w-4 mr-2" />
                  Predictive Interventions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-6">
                <ConversationAnalyticsDashboard />
              </TabsContent>

              <TabsContent value="predictions" className="space-y-6">
                <PredictiveInterventionEngine />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIAnalytics;
