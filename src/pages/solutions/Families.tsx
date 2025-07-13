import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, UserCheck, Activity, Brain, CheckCircle, Star, ArrowRight } from 'lucide-react';

const FamilySolutions = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Family Mental Health Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6">
                Healing Together as a Family
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive mental health support for every family member with shared progress tracking, 
                parental controls, and coordinated care plans that strengthen family bonds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Family Plan <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Family Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Shared Healing Journey</h3>
                <p className="text-muted-foreground">
                  Family members support each other through coordinated therapy sessions and shared progress milestones.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Parental Controls</h3>
                <p className="text-muted-foreground">
                  Age-appropriate content filters, session monitoring, and privacy controls for minor family members.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Family Therapist Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered matching with family therapy specialists who understand your unique family dynamics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Family Mental Health Ecosystem</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything your family needs for mental wellness, from individual therapy to family sessions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <UserCheck className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Individual Progress Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Personal dashboards for each family member with privacy controls and shared insights.
                </p>
                <Badge variant="outline">Premium</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Activity className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Family Crisis Support</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 crisis intervention with family notification protocols and emergency contacts.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Coordinated Care Plans</h3>
                <p className="text-muted-foreground mb-4">
                  Synchronized therapy approaches that consider family dynamics and relationships.
                </p>
                <Badge variant="outline">Pro</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Families Thriving Together</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "TherapySync helped our family navigate our teenager's anxiety together. The family sessions 
                  brought us closer and gave us tools to support each other."
                </p>
                <div>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-muted-foreground">Mother of 3</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The parental controls give me peace of mind while allowing my children age-appropriate 
                  access to mental health resources."
                </p>
                <div>
                  <p className="font-semibold">Michael R.</p>
                  <p className="text-muted-foreground">Father & Family Therapist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Family's Healing Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of families who have found strength, understanding, and healing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start 14-Day Family Trial <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Learn About Family Plans
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FamilySolutions;