import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, ArrowRight, CheckCircle, Star, Lightbulb, Activity, TrendingUp, Users, Timer, BookOpen } from 'lucide-react';

const CBTPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-primary/10">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                #1 Evidence-Based Therapy
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Cognitive Behavioral
                <span className="block bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  Therapy (CBT)
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
                Transform negative thinking patterns and behaviors with our AI-powered CBT approach. 
                Evidence-based techniques adapted to your unique needs, learning style, and personal goals 
                through advanced therapeutic intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl border-0 h-14 px-8 text-lg font-semibold">
                  Start CBT Journey <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg">
                  Explore CBT Techniques
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Users className="h-8 w-8 text-cyan-200 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">2M+ Users</h3>
                  <p className="text-blue-100 text-sm">Successfully transformed their lives</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Star className="h-8 w-8 text-cyan-200 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">94% Success Rate</h3>
                  <p className="text-blue-100 text-sm">Clinically proven effectiveness</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Timer className="h-8 w-8 text-cyan-200 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">6-12 Weeks</h3>
                  <p className="text-blue-100 text-sm">Average treatment duration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is CBT */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-600 border-blue-200">
                The Science Behind CBT
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Understanding Cognitive 
                <span className="block text-blue-600">Behavioral Therapy</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                CBT is the gold standard of psychotherapy, backed by decades of research and 
                proven effective for treating depression, anxiety, PTSD, and many other conditions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">How CBT Works</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    CBT is based on the understanding that our thoughts, feelings, and behaviors are interconnected. 
                    By identifying and changing negative thought patterns, we can break the cycle of distress and 
                    develop healthier ways of thinking and behaving.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Our AI-powered platform makes CBT more accessible and personalized than ever before, 
                    adapting techniques to your specific needs and providing real-time guidance and support.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                    <p className="text-sm text-blue-700">Improvement in anxiety symptoms</p>
                  </div>
                  <div className="bg-cyan-50 p-6 rounded-xl">
                    <div className="text-3xl font-bold text-cyan-600 mb-2">85%</div>
                    <p className="text-sm text-cyan-700">Reduction in depressive episodes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-3xl text-white">
                <h3 className="text-2xl font-bold mb-6">CBT Core Principles</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Thought Awareness</h4>
                      <p className="text-blue-100">Identify automatic negative thoughts and cognitive distortions that impact your mood</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Behavioral Change</h4>
                      <p className="text-blue-100">Replace unhelpful behaviors with positive actions that support your goals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Skill Building</h4>
                      <p className="text-blue-100">Master practical coping strategies and problem-solving techniques</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-3xl">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Evidence-Based</h4>
                  <p className="text-sm text-muted-foreground">Scientifically proven for 50+ conditions</p>
                </div>
                <div>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Goal-Focused</h4>
                  <p className="text-sm text-muted-foreground">Structured approach with clear objectives</p>
                </div>
                <div>
                  <Timer className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Time-Limited</h4>
                  <p className="text-sm text-muted-foreground">Efficient therapy with lasting results</p>
                </div>
                <div>
                  <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Skills-Based</h4>
                  <p className="text-sm text-muted-foreground">Learn tools you can use forever</p>
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