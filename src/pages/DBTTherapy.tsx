import React from 'react';
import { Settings, Heart, Shield, Users, Target, Star, ArrowRight, CheckCircle, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DBTTherapy = () => {
  const features = [
    {
      icon: Heart,
      title: "Emotion Regulation",
      description: "Learn to understand, accept, and manage intense emotions effectively",
      gradient: "from-harmony-50 to-therapy-50",
      iconColor: "text-harmony-600"
    },
    {
      icon: Users,
      title: "Interpersonal Skills",
      description: "Develop healthy relationship skills and effective communication strategies",
      gradient: "from-calm-50 to-flow-50",
      iconColor: "text-calm-600"
    },
    {
      icon: Shield,
      title: "Distress Tolerance",
      description: "Build resilience and cope with crisis situations without making them worse",
      gradient: "from-flow-50 to-balance-50",
      iconColor: "text-flow-700"
    },
    {
      icon: Target,
      title: "Mindfulness Skills",
      description: "Cultivate present-moment awareness and non-judgmental acceptance",
      gradient: "from-balance-50 to-harmony-50",
      iconColor: "text-balance-600"
    },
    {
      icon: Star,
      title: "Skills Training",
      description: "Practical skills you can use in daily life to improve emotional well-being",
      gradient: "from-therapy-50 to-calm-50",
      iconColor: "text-therapy-600"
    },
    {
      icon: Settings,
      title: "Behavioral Changes",
      description: "Develop healthier patterns of behavior and response to challenging situations",
      gradient: "from-calm-50 to-harmony-50",
      iconColor: "text-calm-700"
    }
  ];

  const benefits = [
    "Evidence-based DBT therapy",
    "Skills-focused approach",
    "Group and individual sessions",
    "Personalized skill development",
    "Crisis coaching available",
    "Long-term behavioral change"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-harmony/5 via-transparent to-calm/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <Settings className="h-4 w-4 mr-2" />
                Dialectical Behavior Therapy
              </Badge>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-harmony-600 to-foreground bg-clip-text text-transparent leading-tight">
                Master Your
                <span className="block bg-gradient-to-r from-harmony-600 to-calm-600 bg-clip-text text-transparent">
                  Emotions
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Skills-based therapy for emotional regulation and interpersonal effectiveness. 
                Build practical tools for managing intense emotions and improving relationships.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-harmony-600 to-harmony-500 hover:from-harmony-700 hover:to-harmony-600">
                Start DBT Training
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Four Core DBT Skills
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive skill modules designed to help you build emotional resilience and interpersonal effectiveness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`group hover-scale border border-primary/10 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-300 hover:shadow-therapy-glow animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-card shadow-therapy-subtle ${feature.iconColor}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-harmony-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Brain className="h-4 w-4 mr-2" />
                  Skills-Based Approach
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose DBT?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  DBT provides practical, evidence-based skills that you can immediately apply to your daily life. 
                  Learn to navigate intense emotions with confidence and build healthier relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-harmony-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-harmony-50 to-calm-50 border-harmony-200">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8 text-harmony-600" />
                      <h3 className="text-xl font-semibold">Skills Coaching</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Between-session coaching calls to help you apply DBT skills in real-life situations.
                    </p>
                    <Button variant="outline" className="w-full">
                      Get Skills Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="p-12 bg-gradient-to-r from-harmony-50 via-calm-50 to-harmony-50 border-harmony-200 animate-fade-in">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Master DBT Skills?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Develop emotional regulation and interpersonal effectiveness through proven DBT techniques. 
                  Build skills that last a lifetime.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-harmony-600 to-harmony-500 hover:from-harmony-700 hover:to-harmony-600">
                  Start DBT Training
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Schedule Assessment
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Evidence-based skills training with certified DBT therapists.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DBTTherapy;