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

        {/* Adaptive AI Systems */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
                Adaptive AI Technology
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI That Learns and Adapts to Your Family</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our revolutionary adaptive systems automatically update therapy plans and approaches based on each family member's progress, preferences, and changing needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Adaptation</h3>
                <p className="text-muted-foreground">
                  AI continuously analyzes session responses, mood patterns, and engagement to automatically adjust therapeutic approaches in real-time.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Personalized Therapy Plans</h3>
                <p className="text-muted-foreground">
                  Each family member receives a unique therapy plan that evolves - from CBT to DBT to mindfulness - based on what works best for them.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Predictive Insights</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms predict potential challenges and proactively suggest interventions before issues escalate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Session Transcription & Insights */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Session Intelligence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Session Transcripts & Insights</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every therapy session is intelligently transcribed and analyzed to provide actionable insights and track progress over time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border">
                <FileText className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Full Transcripts</h3>
                <p className="text-muted-foreground text-sm">
                  Complete, searchable transcripts of every session with intelligent highlighting of key insights and breakthroughs.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <MessageSquare className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Key Content Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  AI identifies the most important topics discussed, emotional patterns, and therapeutic breakthroughs in each session.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <BarChart3 className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Session Summaries</h3>
                <p className="text-muted-foreground text-sm">
                  Concise summaries highlighting progress made, techniques used, and goals achieved during each therapy session.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Lightbulb className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Action Items</h3>
                <p className="text-muted-foreground text-sm">
                  Personalized recommendations for things to work on, practice exercises, and follow-up activities between sessions.
                </p>
              </div>
            </div>
            
            {/* Sample Session Transcript */}
            <div className="mt-12 bg-card rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-600" />
                Sample Session Transcript
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium text-blue-700">Key Discussion Point</p>
                  <p className="text-muted-foreground">"We talked about managing anxiety before family gatherings..."</p>
                </div>
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="font-medium text-green-700">Breakthrough Moment</p>
                  <p className="text-muted-foreground">"I realized that my anxiety often comes from wanting to please everyone..."</p>
                </div>
                <div className="border-l-2 border-purple-500 pl-3">
                  <p className="font-medium text-purple-700">Technique Applied</p>
                  <p className="text-muted-foreground">"Practiced deep breathing and cognitive reframing techniques..."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Therapy Approaches */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence-Based Therapy Approaches</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI automatically selects and adapts the most effective therapeutic approaches for each family member.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Cognitive Behavioral Therapy (CBT)</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Identify and change negative thought patterns and behaviors for lasting positive change.
                </p>
                <Badge variant="outline" className="text-xs">Most Popular</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Dialectical Behavior Therapy (DBT)</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Develop emotional regulation skills and improve interpersonal relationships.
                </p>
                <Badge variant="outline" className="text-xs">Family Focused</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mindfulness-Based Therapy</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Cultivate present-moment awareness and reduce stress through mindfulness practices.
                </p>
                <Badge variant="outline" className="text-xs">Stress Relief</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Trauma-Focused Therapy</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Specialized support for processing and healing from traumatic experiences.
                </p>
                <Badge variant="outline" className="text-xs">Specialized</Badge>
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