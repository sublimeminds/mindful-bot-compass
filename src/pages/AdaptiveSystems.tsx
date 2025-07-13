import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Target, ArrowRight, CheckCircle, Star, TrendingUp, Activity, Lightbulb, BarChart3 } from 'lucide-react';

const AdaptiveSystemsPage = () => {
  return (
    <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-therapy-50/30">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-therapy-glow">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 bg-therapy-100 text-therapy-700 border-therapy-200">
                Advanced AI Technology
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-therapy-600 via-therapy-500 to-therapy-700 bg-clip-text text-transparent mb-6">
                Adaptive AI Systems
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Revolutionary AI that learns, adapts, and evolves with you. Our adaptive systems automatically 
                update therapy approaches, personalize content, and optimize treatment plans based on your unique 
                progress and responses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-therapy-600 hover:bg-therapy-700 shadow-therapy-glow">
                  Experience Adaptive AI <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Adaptive AI */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What Makes Our AI Adaptive?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Unlike static AI systems, our adaptive AI continuously learns from your interactions, responses, 
                  and progress to provide increasingly personalized and effective therapy experiences. It's like 
                  having a therapist who remembers everything and gets to know you better with each session.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  The system dynamically adjusts therapy approaches, conversation styles, content difficulty, 
                  and intervention timing based on real-time analysis of your emotional state, engagement patterns, 
                  and therapeutic progress.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-therapy-600 flex-shrink-0" />
                    <span>Continuous learning from your unique patterns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-therapy-600 flex-shrink-0" />
                    <span>Real-time adaptation to your emotional state</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-therapy-600 flex-shrink-0" />
                    <span>Predictive insights for proactive support</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-therapy-50 to-therapy-100 p-8 rounded-2xl border border-therapy-200">
                <h3 className="text-xl font-semibold mb-4 text-therapy-800">Adaptive AI Capabilities</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-therapy-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-therapy-700">Pattern Recognition</h4>
                      <p className="text-sm text-muted-foreground">Identifies your unique therapeutic needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-therapy-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-therapy-700">Dynamic Personalization</h4>
                      <p className="text-sm text-muted-foreground">Adjusts approach in real-time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-6 w-6 text-therapy-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-therapy-700">Predictive Optimization</h4>
                      <p className="text-sm text-muted-foreground">Anticipates your therapeutic needs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Adapts */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our AI Adapts to You</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every interaction teaches our AI more about what works best for you, creating a continuously improving therapeutic experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Response Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Analyzes your responses, engagement levels, and emotional reactions to optimize conversation flow and content.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Monitors your therapeutic progress and adjusts treatment intensity, pacing, and approach accordingly.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mood Detection</h3>
                <p className="text-muted-foreground text-sm">
                  Real-time emotion detection adjusts conversation tone, intervention timing, and support level.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Preference Learning</h3>
                <p className="text-muted-foreground text-sm">
                  Learns your communication style, preferred therapists, and effective intervention types over time.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Content Personalization</h3>
                <p className="text-muted-foreground text-sm">
                  Customizes therapy content, exercises, and resources based on your learning style and interests.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Predictive Insights</h3>
                <p className="text-muted-foreground text-sm">
                  Anticipates your needs and proactively suggests interventions, resources, and support strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Adaptive Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Adaptive Features in Action</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how our adaptive AI enhances every aspect of your therapy experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <Zap className="h-12 w-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Dynamic Therapy Approaches</h3>
                <p className="text-muted-foreground mb-6">
                  The AI automatically switches between CBT, DBT, mindfulness, and other approaches based on what's 
                  most effective for your current state and goals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Real-time approach optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Seamless technique blending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Evidence-based adaptations</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <Brain className="h-12 w-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Intelligent Session Planning</h3>
                <p className="text-muted-foreground mb-6">
                  Each session is automatically planned based on your progress, current challenges, and therapeutic 
                  goals, ensuring maximum effectiveness.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Personalized session agendas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Optimal pacing and intensity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Progress-driven content</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <Target className="h-12 w-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Adaptive Crisis Support</h3>
                <p className="text-muted-foreground mb-6">
                  The system learns your unique crisis patterns and triggers, providing increasingly accurate 
                  early detection and personalized intervention strategies.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Personalized early warning system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Tailored coping strategies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Proactive support activation</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <TrendingUp className="h-12 w-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Learning-Based Optimization</h3>
                <p className="text-muted-foreground mb-6">
                  The AI continuously learns from successful interventions and outcomes, becoming more effective 
                  at helping you achieve your therapeutic goals.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Outcome-based improvements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Success pattern recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Continuous effectiveness enhancement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Ethics */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Privacy-First Adaptive Learning</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our adaptive AI learns about you while maintaining the highest standards of privacy and data protection.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-3">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All learning data is encrypted and processed securely, ensuring your personal information remains private.
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-3">Federated Learning</h3>
                <p className="text-sm text-muted-foreground">
                  AI improvements happen locally on your device, with no personal data leaving your secure environment.
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-3">Ethical AI Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Our adaptive systems follow strict ethical guidelines to ensure fair, unbiased, and beneficial outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Adaptive AI Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The AI learned exactly what type of support I need and when. It's like having a therapist 
                  who truly understands my patterns and knows how to help me effectively."
                </p>
                <div>
                  <p className="font-semibold">Rachel T.</p>
                  <p className="text-muted-foreground">Anxiety & Personalization</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The system adapted to my learning style and preferences so well that each session felt 
                  perfectly tailored to what I needed that day. It's incredible technology."
                </p>
                <div>
                  <p className="font-semibold">Alex K.</p>
                  <p className="text-muted-foreground">Depression & Adaptive Learning</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of Therapy</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover how adaptive AI can revolutionize your mental health journey with truly personalized, 
              evolving support that grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Try Adaptive AI Today <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AdaptiveSystemsPage;