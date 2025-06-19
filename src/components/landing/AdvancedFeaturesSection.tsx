
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Heart, MessageCircle, TrendingUp, Mic, Shield, 
  Clock, Smartphone, Users, Target, Activity, Zap,
  AlertTriangle, Globe, BarChart3, Bell
} from 'lucide-react';

const featureCategories = [
  {
    id: 'therapy',
    label: 'AI Therapy',
    icon: Brain,
    features: [
      {
        icon: Brain,
        title: 'Advanced CBT & DBT Techniques',
        description: 'Evidence-based cognitive and dialectical behavioral therapy adapted for AI delivery',
        badge: 'Most Popular'
      },
      {
        icon: Globe,
        title: 'Cultural Awareness',
        description: 'AI that understands and adapts to different cultural contexts and communication styles',
        badge: 'Inclusive'
      },
      {
        icon: AlertTriangle,
        title: 'Crisis Detection & Response',
        description: 'Real-time monitoring with immediate crisis intervention and safety planning',
        badge: 'Safety First'
      },
      {
        icon: Heart,
        title: 'Trauma-Informed Care',
        description: 'Specialized approaches for processing trauma with sensitivity and expertise',
        badge: 'Specialized'
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Smart Analytics',
    icon: BarChart3,
    features: [
      {
        icon: Activity,
        title: 'Predictive Mental Health Analytics',
        description: 'AI-powered insights that predict potential mental health challenges before they occur',
        badge: 'Predictive'
      },
      {
        icon: Target,
        title: 'Personalized Goal Tracking',
        description: 'Dynamic goal setting with adaptive recommendations based on your progress patterns',
        badge: 'Adaptive'
      },
      {
        icon: TrendingUp,
        title: 'Comprehensive Progress Reports',
        description: 'Detailed analytics showing mood patterns, therapy effectiveness, and growth metrics',
        badge: 'Data-Driven'
      },
      {
        icon: BarChart3,
        title: 'Real-Time Insights Dashboard',
        description: 'Live monitoring of your mental health metrics with actionable recommendations',
        badge: 'Real-time'
      }
    ]
  },
  {
    id: 'technology',
    label: 'Smart Features',
    icon: Zap,
    features: [
      {
        icon: Mic,
        title: 'Advanced Voice Interaction',
        description: 'Natural voice conversations with emotion recognition and speech analysis',
        badge: 'Voice AI'
      },
      {
        icon: Bell,
        title: 'Intelligent Notifications',
        description: 'Smart reminders and check-ins that adapt to your schedule and mental state',
        badge: 'Smart Timing'
      },
      {
        icon: Users,
        title: 'Community Integration',
        description: 'Safe peer support groups with moderated discussions and shared experiences',
        badge: 'Social Support'
      },
      {
        icon: Smartphone,
        title: 'Offline-Ready Mobile App',
        description: 'Full mobile experience with offline mode and seamless sync across devices',
        badge: '24/7 Access'
      }
    ]
  }
];

const AdvancedFeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('therapy');

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Next-Generation Mental Health Technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Our platform integrates advanced AI therapy, predictive analytics, cultural awareness, 
            crisis management, and community support to provide the most comprehensive mental health care available.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            {featureCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center space-x-2 p-4"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {featureCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card 
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600 rounded-lg">
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* New features highlight */}
        <div className="mt-16 bg-gradient-to-r from-harmony-50 via-balance-50 to-flow-100 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Recently Added Features</h3>
            <p className="text-muted-foreground">
              We continuously enhance our platform with cutting-edge capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-harmony-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Enhanced Crisis Detection</h4>
              <p className="text-sm text-muted-foreground">AI-powered safety monitoring with immediate intervention capabilities</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-balance-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Cultural Intelligence</h4>
              <p className="text-sm text-muted-foreground">Culturally-aware AI that adapts to diverse backgrounds and contexts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-flow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Predictive Analytics</h4>
              <p className="text-sm text-muted-foreground">Advanced insights that anticipate and prevent mental health challenges</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;
