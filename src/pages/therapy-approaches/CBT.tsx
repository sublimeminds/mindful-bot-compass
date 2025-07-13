import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, ArrowRight, CheckCircle, Star, Lightbulb, Activity, TrendingUp } from 'lucide-react';

const CBTPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Evidence-Based Therapy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-6">
                Cognitive Behavioral Therapy (CBT)
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Transform negative thinking patterns and behaviors with our AI-powered CBT approach. 
                Evidence-based techniques adapted to your unique needs and learning style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start CBT Sessions <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More About CBT
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is CBT */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Cognitive Behavioral Therapy?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  CBT is a highly effective, evidence-based therapy that focuses on identifying and changing negative 
                  thought patterns and behaviors that contribute to emotional distress and mental health challenges.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our AI-powered CBT approach combines traditional CBT techniques with personalized insights, 
                  helping you develop practical skills to manage thoughts, emotions, and behaviors more effectively.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span>Scientifically proven effectiveness for anxiety and depression</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span>Practical tools you can use in daily life</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span>Short-term focused approach with lasting results</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">CBT Core Principles</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Thought Awareness</h4>
                      <p className="text-sm text-muted-foreground">Recognize negative thinking patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Behavioral Change</h4>
                      <p className="text-sm text-muted-foreground">Develop healthier behavioral responses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Skill Building</h4>
                      <p className="text-sm text-muted-foreground">Learn practical coping strategies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CBT Techniques */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Enhanced CBT Techniques</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform uses advanced AI to personalize these proven CBT techniques to your specific needs and progress.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Thought Records</h3>
                <p className="text-muted-foreground text-sm">
                  Track and analyze your thoughts to identify patterns and cognitive distortions that contribute to distress.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Behavioral Experiments</h3>
                <p className="text-muted-foreground text-sm">
                  Test negative beliefs through guided experiments that help you discover more balanced perspectives.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mood Monitoring</h3>
                <p className="text-muted-foreground text-sm">
                  Track mood patterns and triggers to better understand the connection between thoughts, feelings, and behaviors.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Cognitive Restructuring</h3>
                <p className="text-muted-foreground text-sm">
                  Learn to challenge and reframe negative thoughts with more balanced, realistic alternatives.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Graded Exposure</h3>
                <p className="text-muted-foreground text-sm">
                  Gradually face fears and anxieties in a controlled, supportive way to build confidence and reduce avoidance.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Homework Assignments</h3>
                <p className="text-muted-foreground text-sm">
                  Practice new skills between sessions with personalized exercises designed to reinforce learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Benefits from CBT?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                CBT is effective for a wide range of mental health conditions and life challenges.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Anxiety Disorders</h3>
                <p className="text-sm text-muted-foreground">Generalized anxiety, social anxiety, panic disorder, phobias</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Depression</h3>
                <p className="text-sm text-muted-foreground">Major depression, persistent depression, seasonal depression</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Stress Management</h3>
                <p className="text-sm text-muted-foreground">Work stress, life transitions, relationship challenges</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Self-Esteem Issues</h3>
                <p className="text-sm text-muted-foreground">Low confidence, negative self-talk, perfectionism</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">CBT Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The CBT techniques helped me identify my anxiety triggers and develop practical strategies. 
                  I now feel more in control of my thoughts and reactions."
                </p>
                <div>
                  <p className="font-semibold">Emma K.</p>
                  <p className="text-muted-foreground">Anxiety & Stress Management</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "CBT taught me to challenge my negative self-talk. The thought records were particularly 
                  helpful in breaking the cycle of depression."
                </p>
                <div>
                  <p className="font-semibold">James M.</p>
                  <p className="text-muted-foreground">Depression & Self-Esteem</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Thinking?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your CBT journey today and develop the skills to create lasting positive change in your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Begin CBT Program <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Take CBT Assessment
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CBTPage;