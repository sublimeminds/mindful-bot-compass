import React from 'react';
import { Heart, Flower, Clock, Shield, Star, Lightbulb, ArrowRight, CheckCircle, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MindfulnessTherapy = () => {
  const features = [
    {
      icon: Clock,
      title: "Present-Moment Awareness",
      description: "Develop the ability to stay grounded in the present moment",
      gradient: "from-calm-50 to-flow-50",
      iconColor: "text-calm-600"
    },
    {
      icon: Shield,
      title: "Acceptance Practice",
      description: "Learn to accept difficult emotions and thoughts without judgment",
      gradient: "from-flow-50 to-balance-50",
      iconColor: "text-flow-700"
    },
    {
      icon: Flower,
      title: "Meditation Techniques",
      description: "Guided meditation practices tailored to your therapeutic needs",
      gradient: "from-balance-50 to-harmony-50",
      iconColor: "text-balance-600"
    },
    {
      icon: Star,
      title: "Stress Reduction",
      description: "Proven techniques for reducing stress and anxiety through mindfulness",
      gradient: "from-harmony-50 to-therapy-50",
      iconColor: "text-harmony-600"
    },
    {
      icon: Lightbulb,
      title: "Cognitive Flexibility",
      description: "Develop a more flexible relationship with your thoughts and emotions",
      gradient: "from-therapy-50 to-calm-50",
      iconColor: "text-therapy-600"
    },
    {
      icon: Heart,
      title: "Self-Compassion",
      description: "Cultivate kindness and understanding toward yourself and others",
      gradient: "from-calm-50 to-harmony-50",
      iconColor: "text-calm-700"
    }
  ];

  const benefits = [
    "Mindfulness-based interventions",
    "Stress reduction techniques",
    "Acceptance and commitment therapy",
    "Personalized meditation practices",
    "Daily mindfulness exercises",
    "Long-term mental well-being"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-calm/5 via-transparent to-flow/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <Heart className="h-4 w-4 mr-2" />
                Mindfulness-Based Therapy
              </Badge>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-calm-600 to-foreground bg-clip-text text-transparent leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-calm-600 to-flow-600 bg-clip-text text-transparent">
                  Mindful Path
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Present-moment awareness and acceptance-based therapeutic interventions. 
                Discover peace and clarity through mindfulness-based healing practices.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-calm-600 to-calm-500 hover:from-calm-700 hover:to-calm-600">
                Start Mindfulness Practice
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
              Mindfulness-Based Healing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Therapeutic approaches that integrate mindfulness meditation with evidence-based psychological interventions
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
                      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-calm-600 transition-colors">
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
                  Evidence-Based Mindfulness
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose Mindfulness Therapy?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Mindfulness-based therapy combines ancient wisdom with modern psychology to help you 
                  develop a healthier relationship with your thoughts and emotions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-calm-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-calm-50 to-flow-50 border-calm-200">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8 text-calm-600" />
                      <h3 className="text-xl font-semibold">Daily Practice Support</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Guided daily mindfulness exercises and meditation practices tailored to your needs.
                    </p>
                    <Button variant="outline" className="w-full">
                      Access Guided Practices
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
          <Card className="p-12 bg-gradient-to-r from-calm-50 via-flow-50 to-calm-50 border-calm-200 animate-fade-in">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Begin Your Mindfulness Journey
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover peace and clarity through mindfulness-based therapeutic practices. 
                  Develop lasting skills for mental well-being.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-calm-600 to-calm-500 hover:from-calm-700 hover:to-calm-600">
                  Start Mindfulness Practice
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Schedule Introduction
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Certified mindfulness-based therapy with experienced practitioners.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MindfulnessTherapy;