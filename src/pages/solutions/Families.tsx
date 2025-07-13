import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, UserCheck, Activity, Brain, CheckCircle, Star, ArrowRight, FileText, Clock, TrendingUp, Lightbulb, Mic, BarChart3, MessageSquare, Target, Zap } from 'lucide-react';

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
                Intelligent Family Mental Health
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Advanced AI systems that automatically adapt therapy approaches for each family member, 
                with session transcripts, progress insights, and coordinated care that evolves with your family's needs.
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

        {/* Family Features Overview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Family Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Family Mental Health Platform</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive mental health support designed specifically for families, with shared accounts, parental controls, and coordinated care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Family Accounts</h3>
                <p className="text-muted-foreground">
                  Shared family accounts with individual profiles, privacy controls, and coordinated care plans for all family members.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Parental Controls</h3>
                <p className="text-muted-foreground">
                  Age-appropriate content, session monitoring, and safety controls to ensure a secure environment for children and teens.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Family Therapy Sessions</h3>
                <p className="text-muted-foreground">
                  Dedicated family therapy sessions that bring everyone together to work on shared goals and improve communication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Family Pricing & Configurator */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700 border-green-200">
                Family Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Plans for Every Family</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your family size and needs, with options for individuals, couples, and large families.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <h3 className="text-2xl font-bold mb-4">Family Starter</h3>
                <div className="text-4xl font-bold mb-4">$49<span className="text-lg text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground mb-6">Perfect for small families (up to 4 members)</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Individual therapy for all members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Basic parental controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Shared progress dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Crisis support</span>
                  </li>
                </ul>
                <Button className="w-full">Choose Plan</Button>
              </div>
              
              <div className="bg-primary text-primary-foreground p-8 rounded-xl border relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground">Most Popular</Badge>
                <h3 className="text-2xl font-bold mb-4">Family Pro</h3>
                <div className="text-4xl font-bold mb-4">$89<span className="text-lg opacity-70">/month</span></div>
                <p className="opacity-80 mb-6">Best for growing families (up to 6 members)</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Family therapy sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full">Choose Plan</Button>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <h3 className="text-2xl font-bold mb-4">Family Enterprise</h3>
                <div className="text-4xl font-bold mb-4">$149<span className="text-lg text-muted-foreground">/month</span></div>
                <p className="text-muted-foreground mb-6">For large families (unlimited members)</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Unlimited family members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
            
            {/* Family Configurator */}
            <div className="mt-16 bg-card p-8 rounded-xl border">
              <h3 className="text-2xl font-bold mb-6 text-center">Family Plan Configurator</h3>
              <p className="text-muted-foreground text-center mb-8">
                Customize your family plan based on your specific needs and family size
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Family Members</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>2-4 members</option>
                    <option>5-6 members</option>
                    <option>7+ members</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ages of Children (if any)</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>No children</option>
                    <option>Under 13</option>
                    <option>13-17 (teens)</option>
                    <option>Mixed ages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Concerns</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>Family communication</option>
                    <option>Child/teen anxiety</option>
                    <option>Family conflict resolution</option>
                    <option>General mental wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Therapy Style</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>Individual + family sessions</option>
                    <option>Primarily individual</option>
                    <option>Primarily family-focused</option>
                    <option>Flexible approach</option>
                  </select>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button size="lg" className="px-8">
                  Get Personalized Recommendation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Coordinated Family Care</h3>
                <p className="text-muted-foreground">
                  Family members support each other through AI-coordinated therapy sessions with shared insights and progress milestones.
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
                <h3 className="text-xl font-semibold mb-3">AI Family Therapist Matching</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms match your family with specialized therapists who understand your unique dynamics and cultural background.
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