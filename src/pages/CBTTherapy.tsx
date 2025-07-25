import React from 'react';
import { BookOpen, Brain, Target, CheckCircle, TrendingUp, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CBTTherapy = () => {
  const features = [
    {
      icon: Brain,
      title: "Thought Pattern Analysis",
      description: "Identify and challenge negative thought patterns that impact your well-being",
      gradient: "from-therapy-50 to-balance-50",
      iconColor: "text-therapy-600"
    },
    {
      icon: Target,
      title: "Behavioral Interventions",
      description: "Develop healthier behaviors and coping strategies for daily challenges",
      gradient: "from-balance-50 to-calm-50",
      iconColor: "text-balance-600"
    },
    {
      icon: CheckCircle,
      title: "Goal-Oriented Treatment",
      description: "Structured approach with clear objectives and measurable outcomes",
      gradient: "from-calm-50 to-flow-50",
      iconColor: "text-calm-700"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor improvements in mood, behavior, and thought patterns over time",
      gradient: "from-flow-50 to-harmony-50",
      iconColor: "text-flow-600"
    },
    {
      icon: Lightbulb,
      title: "Cognitive Restructuring",
      description: "Learn to reframe negative thoughts into more balanced, realistic perspectives",
      gradient: "from-harmony-50 to-therapy-50",
      iconColor: "text-harmony-600"
    },
    {
      icon: BookOpen,
      title: "Evidence-Based",
      description: "Proven therapeutic approach with extensive research supporting its effectiveness",
      gradient: "from-therapy-50 to-calm-50",
      iconColor: "text-therapy-700"
    }
  ];

  const benefits = [
    "Evidence-based CBT techniques",
    "Structured thought challenges",
    "Behavioral activation strategies",
    "Personalized treatment plans",
    "Progress monitoring tools",
    "Long-term skill development"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy/5 via-transparent to-balance/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-therapy-600 to-balance-400 text-white border-0">
                <Brain className="h-4 w-4 mr-2" />
                Cognitive Behavioral Therapy
              </Badge>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-therapy-700 to-balance-400 bg-clip-text text-transparent leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-therapy-600 to-balance-400 bg-clip-text text-transparent">
                  Thinking
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Evidence-based approach focusing on thought patterns and behavioral changes. 
                Learn practical tools to reshape your thinking and improve your mental well-being.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-therapy-600 to-therapy-500 hover:from-therapy-700 hover:to-therapy-600">
                Begin CBT Therapy
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
              Core CBT Components
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scientifically proven techniques for identifying and changing unhelpful thought patterns and behaviors
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
                      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-therapy-600 transition-colors">
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
                  Evidence-Based Treatment
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose CBT?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  CBT is one of the most researched and effective forms of psychotherapy. 
                  It provides practical, actionable tools for changing thoughts and behaviors that contribute to emotional distress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-therapy-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-therapy-50 to-balance-50 border-therapy-200">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8 text-therapy-600" />
                      <h3 className="text-xl font-semibold">Thought Records</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Interactive tools to track and analyze your thoughts, emotions, and behavioral patterns in real-time.
                    </p>
                    <Button variant="outline" className="w-full">
                      Access CBT Tools
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
          <Card className="p-12 bg-gradient-to-r from-therapy-50 via-balance-50 to-therapy-50 border-therapy-200 animate-fade-in">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Start Your CBT Journey
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Transform your thoughts and behaviors with evidence-based CBT techniques. 
                  Build lasting skills for better mental health and well-being.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-therapy-600 to-therapy-500 hover:from-therapy-700 hover:to-therapy-600">
                  Begin CBT Therapy
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Schedule Assessment
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Start with a personalized assessment to create your CBT treatment plan.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CBTTherapy;