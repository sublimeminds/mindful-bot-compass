import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Heart, 
  Zap, 
  BarChart3,
  CheckCircle,
  Activity,
  Lightbulb,
  ArrowRight,
  Shield
} from 'lucide-react';

const AIPersonalization = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered Personalization
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Experience therapy that adapts to you. Our advanced AI learns your unique patterns, preferences, and needs to create a truly personalized healing journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/ai-hub">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore AI Hub <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/therapy">
                <Button variant="outline" size="lg">
                  Start Therapy Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Advanced AI Technology</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              How AI Personalizes Your Therapy
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our AI continuously learns from your interactions, patterns, and preferences to deliver increasingly effective and personalized therapeutic support.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Adaptive Learning</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Our AI learns your unique communication patterns, emotional responses, and therapeutic preferences to tailor each session specifically for you.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Precision Targeting</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Advanced algorithms identify your specific needs and challenges, ensuring therapy focuses on areas where you'll see the most improvement.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Real-time Adaptation</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  AI adjusts conversation style, pacing, and techniques in real-time based on your emotional state and engagement levels.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Heart className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Emotional Intelligence</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Sophisticated emotion recognition helps AI respond with appropriate empathy and support, creating a genuinely caring therapeutic relationship.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <BarChart3 className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Progress Analytics</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Comprehensive analytics track your progress across multiple dimensions, providing insights into your therapeutic journey and areas of growth.
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Shield className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold leading-8">Privacy & Security</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Your data is protected with enterprise-grade security while AI personalization happens locally and privately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Power of Personalized AI Therapy</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Experience therapy that truly understands you. Our AI personalization delivers measurable improvements in therapeutic outcomes.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
            <div className="relative lg:order-last lg:col-span-5">
              <div className="absolute -inset-y-6 -inset-x-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10"></div>
              <div className="relative space-y-6 rounded-2xl bg-background p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">73% faster breakthrough moments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">89% improved session engagement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">2.4x better goal achievement rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">95% user satisfaction with AI adaptation</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-xl text-base leading-7 lg:col-span-7">
              <p className="text-muted-foreground">
                Traditional therapy follows a one-size-fits-all approach, but every individual's mental health journey is unique. Our AI personalization technology recognizes this fundamental truth and adapts accordingly.
              </p>
              <ul role="list" className="mt-8 space-y-8 text-muted-foreground">
                <li className="flex gap-x-3">
                  <Brain className="mt-1 h-5 w-5 flex-none text-primary" />
                  <span>
                    <strong className="font-semibold text-foreground">Intelligent Pattern Recognition:</strong> AI identifies subtle patterns in your behavior, communication style, and emotional responses that human therapists might miss.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <Lightbulb className="mt-1 h-5 w-5 flex-none text-primary" />
                  <span>
                    <strong className="font-semibold text-foreground">Personalized Interventions:</strong> Based on your unique profile, AI suggests specific therapeutic techniques and approaches most likely to resonate with you.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <Activity className="mt-1 h-5 w-5 flex-none text-primary" />
                  <span>
                    <strong className="font-semibold text-foreground">Continuous Optimization:</strong> Every interaction improves the AI's understanding of your needs, creating an increasingly effective therapeutic experience.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Experience Personalized AI Therapy?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
              Join thousands who have discovered the power of AI-personalized therapy. Start your journey toward better mental health today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/ai-hub">
                <Button size="lg" variant="secondary">
                  Access AI Hub
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIPersonalization;