import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Target, Shield, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const Individuals = () => {
  const navigate = useNavigate();

  return (
    <SafeComponentWrapper name="Individuals">
      <Helmet>
        <title>AI Therapy for Individuals - Personal Mental Health Support</title>
        <meta name="description" content="Personal AI therapy tailored for individuals. 24/7 support, mood tracking, crisis intervention, and personalized treatment plans." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-therapy-100 text-therapy-700 border-therapy-200">
                Personal AI Therapy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold therapy-text-gradient mb-6">
                Your Personal Mental Health Journey
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                AI-powered therapy that adapts to your unique needs, with 24/7 support, personalized treatment plans, and continuous progress tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="px-8 py-3 therapy-gradient text-white shadow-therapy-glow"
                  onClick={() => navigate('/auth')}
                >
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-therapy-200 text-therapy-700 hover:bg-therapy-50">
                  Explore Features
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border shadow-therapy-subtle">
                <Heart className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">24/7 AI Support</h3>
                <p className="text-muted-foreground">
                  Always-available AI companion that understands your unique mental health journey and provides personalized support.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border shadow-therapy-subtle">
                <Brain className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Adaptive Treatment Plans</h3>
                <p className="text-muted-foreground">
                  Dynamic therapy approaches that evolve based on your progress, preferences, and real-time mood tracking.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border shadow-therapy-subtle">
                <Target className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Progress Insights</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and insights about your mental health journey with evidence-based progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-therapy-50/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold therapy-text-gradient mb-4">Complete Personal Wellness Platform</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need for your mental health journey, powered by advanced AI and personalized care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border shadow-therapy-subtle">
                <Shield className="h-8 w-8 text-therapy-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Crisis Intervention</h3>
                <p className="text-muted-foreground mb-4">
                  Immediate support during mental health crises with emergency protocols and professional escalation.
                </p>
                <Badge variant="outline" className="border-therapy-200 text-therapy-700">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-therapy-subtle">
                <CheckCircle className="h-8 w-8 text-therapy-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Mood Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced mood monitoring with AI-powered insights and pattern recognition for better self-awareness.
                </p>
                <Badge variant="outline" className="border-therapy-200 text-therapy-700">Premium</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-therapy-subtle">
                <Heart className="h-8 w-8 text-therapy-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Personalized Therapy</h3>
                <p className="text-muted-foreground mb-4">
                  Customized therapy sessions using CBT, DBT, mindfulness, and other evidence-based approaches.
                </p>
                <Badge variant="outline" className="border-therapy-200 text-therapy-700">All Plans</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold therapy-text-gradient mb-4">Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border shadow-therapy-subtle">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "TherapySync's AI companion helped me navigate my anxiety like no traditional therapy ever could. 
                  The 24/7 support made all the difference during my recovery."
                </p>
                <div>
                  <p className="font-semibold">Alex M.</p>
                  <p className="text-muted-foreground">Marketing Professional</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border shadow-therapy-subtle">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The personalized treatment plans and progress tracking helped me understand my mental health 
                  patterns and develop effective coping strategies."
                </p>
                <div>
                  <p className="font-semibold">Jamie R.</p>
                  <p className="text-muted-foreground">Graduate Student</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-therapy-50/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold therapy-text-gradient mb-6">Ready to Begin Your Healing Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands who have found personalized mental health support that truly understands their needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="therapy-gradient text-white shadow-therapy-glow"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-therapy-200 text-therapy-700 hover:bg-therapy-50">
                Learn More About Plans
              </Button>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default Individuals;