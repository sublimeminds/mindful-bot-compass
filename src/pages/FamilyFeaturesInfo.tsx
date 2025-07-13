import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, UserCheck, Activity, Clock, CheckCircle, Star, ArrowRight, Lock } from 'lucide-react';

const FamilyFeaturesInfo = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Family Mental Health Features
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6">
                Mental Health Support for Every Family Member
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive family mental health tools with shared progress tracking, parental controls, 
                and coordinated care that strengthens family bonds while respecting individual privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore Family Features <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Families, Designed for Privacy</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Each family member gets personalized support while maintaining privacy and age-appropriate access.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <UserCheck className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Individual Progress Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Personal dashboards for each family member with customizable privacy settings and shared milestones.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Parental Controls</h3>
                <p className="text-muted-foreground mb-4">
                  Age-appropriate content filtering, session monitoring, and privacy controls for minor family members.
                </p>
                <Badge variant="outline">Family Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibeld mb-3">Family Therapy Sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Joint therapy sessions with AI moderation and family dynamics analysis for better communication.
                </p>
                <Badge variant="outline">Premium</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Activity className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Crisis Support Network</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 crisis intervention with automatic family notifications and emergency contact protocols.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Shared Wellness Goals</h3>
                <p className="text-muted-foreground mb-4">
                  Create and track family wellness challenges that encourage healthy habits and mutual support.
                </p>
                <Badge variant="outline">Premium</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Lock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Privacy Protection</h3>
                <p className="text-muted-foreground mb-4">
                  Granular privacy controls ensure individual therapy remains confidential while enabling family insights.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Family Features Work</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3">Set Up Family Account</h3>
                <p className="text-muted-foreground">
                  Create individual profiles for each family member with appropriate age and privacy settings.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3">Personalized Support</h3>
                <p className="text-muted-foreground">
                  Each member receives AI-powered therapy tailored to their age, needs, and family dynamics.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-3">Track & Celebrate</h3>
                <p className="text-muted-foreground">
                  Monitor progress together, celebrate milestones, and strengthen family bonds through shared wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Age-Appropriate Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Age-Appropriate Mental Health Support</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4 text-primary">Children (6-12)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Interactive games and activities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Emotion recognition tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Parent supervision controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Simplified progress tracking
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4 text-primary">Teens (13-17)</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Private therapy sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Peer support groups
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Crisis intervention protocols
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Parent communication tools
                  </li>
                </ul>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4 text-primary">Adults</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Full therapy access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Family dashboard access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Parenting support tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional consultations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl font-medium text-foreground mb-6">
              "TherapySync's family features helped us navigate our teenager's anxiety while maintaining her privacy. 
              The shared wellness goals brought our family closer together."
            </blockquote>
            <cite className="text-muted-foreground">
              — Sarah M., Mother of 3
            </cite>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Support Your Family's Mental Health?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your family's journey to better mental health with tools designed for every family member.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Family Plan <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More About Plans
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default FamilyFeaturesInfo;