
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Heart, MessageCircle, TrendingUp, Mic, Shield, 
  Clock, Smartphone, Users, Target, Activity, Zap 
} from 'lucide-react';

const featureCategories = [
  {
    id: 'therapy',
    label: 'AI Therapy',
    icon: Brain,
    features: [
      {
        icon: Brain,
        title: 'Cognitive Behavioral Therapy (CBT)',
        description: 'Evidence-based CBT techniques adapted for AI delivery',
        badge: 'Most Popular'
      },
      {
        icon: Heart,
        title: 'Mindfulness & Meditation',
        description: 'Guided mindfulness exercises and breathing techniques',
        badge: 'Stress Relief'
      },
      {
        icon: MessageCircle,
        title: 'Conversational Therapy',
        description: 'Natural, empathetic conversations that adapt to your needs',
        badge: 'Real-time'
      },
      {
        icon: Shield,
        title: 'Trauma-Informed Care',
        description: 'Specialized approaches for processing difficult experiences',
        badge: 'Specialized'
      }
    ]
  },
  {
    id: 'tracking',
    label: 'Progress Tracking',
    icon: TrendingUp,
    features: [
      {
        icon: Activity,
        title: 'Advanced Mood Tracking',
        description: 'Track emotional patterns with detailed analytics and insights',
        badge: 'AI Insights'
      },
      {
        icon: Target,
        title: 'Goal Setting & Progress',
        description: 'Set personalized goals and track your mental health journey',
        badge: 'Personalized'
      },
      {
        icon: TrendingUp,
        title: 'Progress Analytics',
        description: 'Comprehensive reports on your therapeutic progress',
        badge: 'Data-Driven'
      },
      {
        icon: Clock,
        title: 'Session History',
        description: 'Complete transcripts and insights from all your sessions',
        badge: 'Searchable'
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
        title: 'Voice Interaction',
        description: 'Natural voice conversations with advanced speech recognition',
        badge: 'Hands-free'
      },
      {
        icon: Zap,
        title: 'Crisis Detection',
        description: 'AI-powered safety monitoring with immediate support resources',
        badge: 'Safety First'
      },
      {
        icon: Users,
        title: 'Multiple Therapist Personalities',
        description: 'Choose from different AI therapist styles that match your preferences',
        badge: 'Customizable'
      },
      {
        icon: Smartphone,
        title: 'Mobile & Offline Support',
        description: 'Full mobile experience with offline mode for uninterrupted care',
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
            Comprehensive Mental Health Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform combines proven therapeutic approaches with cutting-edge technology 
            to provide personalized mental health care that adapts to your unique needs.
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
                            <div className="p-2 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg">
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
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;
