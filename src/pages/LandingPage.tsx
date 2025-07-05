
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Shield, 
  Users,
  Sparkles,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
import GradientLogo from '@/components/ui/GradientLogo';
import InteractiveChatDemo from '@/components/demo/InteractiveChatDemo';

const LandingPage = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Start Your Mental Health Journey Today - TherapySync',
    description: 'Get instant access to AI-powered therapy. No waiting lists, no appointments needed. Join 100,000+ users who found healing with TherapySync.',
    keywords: 'online therapy, AI therapy, mental health support, instant therapy, depression help, anxiety treatment'
  });

  const benefits = [
    "Instant access - No waiting lists",
    "Available 24/7 in 29 languages", 
    "Scientifically proven AI therapy",
    "100% private and secure",
    "Start free, upgrade anytime",
    "Crisis support included"
  ];

  const testimonials = [
    {
      text: "I was skeptical about AI therapy, but TherapySync changed my life. It's like having a therapist in my pocket 24/7.",
      author: "Sarah M., Marketing Manager",
      rating: 5
    },
    {
      text: "The voice feature is incredible. It feels so natural, and the AI really understands my struggles with anxiety.",
      author: "David L., College Student", 
      rating: 5
    },
    {
      text: "As a working mom, I love that I can get therapy support anytime. It's been a game-changer for my mental health.",
      author: "Maria R., Mother of 2",
      rating: 5
    }
  ];

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GradientLogo size="sm" />
              <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <GradientButton onClick={() => navigate('/onboarding')}>
                Get Started Free
              </GradientButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 therapy-gradient-bg text-white px-6 py-2 text-sm font-semibold shadow-lg border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 100,000+ Users
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="therapy-text-gradient-animated">
                Get Mental Health Support
              </span>
              <br />
              <span className="text-slate-700">That Actually Works</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Start your healing journey with AI-powered therapy that's available 24/7. 
              No waiting lists, no insurance hassles. Just instant support when you need it most.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <GradientButton 
                size="lg" 
                className="px-8 py-4 text-lg font-bold"
                onClick={() => navigate('/onboarding')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Free Today
              </GradientButton>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold"
                onClick={scrollToDemo}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-left">
                  <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Trusted by People Just Like You</h2>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold therapy-text-gradient">4.9/5</div>
                <div className="text-sm text-slate-600">User Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold therapy-text-gradient">2M+</div>
                <div className="text-sm text-slate-600">Sessions Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold therapy-text-gradient">24/7</div>
                <div className="text-sm text-slate-600">Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                See AI Therapy in Action
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Watch a real conversation with our AI therapist. See how it provides personalized, 
              empathetic support just like a human therapist would.
            </p>
          </div>
          
          <InteractiveChatDemo autoStart={false} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Everything You Need for Better Mental Health</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Therapy",
                description: "Advanced AI trained in proven therapeutic methods"
              },
              {
                icon: Shield,
                title: "Crisis Support",
                description: "24/7 crisis intervention and emergency resources"
              },
              {
                icon: Clock,
                title: "Always Available",
                description: "Get support anytime, anywhere, in 29 languages"
              },
              {
                icon: Users,
                title: "Family Plans", 
                description: "Support for your entire family with adaptive pricing"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Real Stories from Real People</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-therapy-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Start Your Journey Today</h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands who have transformed their mental health with TherapySync. 
              Start free and upgrade only when you're ready.
            </p>
            
            <Card className="max-w-md mx-auto mb-8">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold therapy-text-gradient mb-2">Free</div>
                <div className="text-slate-600 mb-4">Start with 3 sessions per month</div>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />
                    3 AI therapy sessions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />
                    Basic mood tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />
                    Crisis resources access
                  </li>
                </ul>
                <GradientButton 
                  className="w-full"
                  onClick={() => navigate('/onboarding')}
                >
                  Start Free Now
                </GradientButton>
              </CardContent>
            </Card>
            
            <p className="text-sm text-slate-500">
              No credit card required • Upgrade anytime • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="therapy-gradient-bg text-white text-center p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Your Mental Health Journey Starts Here
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't wait for your mental health to improve on its own. 
              Get the support you deserve, starting today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold"
                onClick={() => navigate('/onboarding')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-sm"
                onClick={() => navigate('/contact')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Talk to Someone
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GradientLogo size="sm" />
            <span className="font-bold therapy-text-gradient">TherapySync</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2024 TherapySync. All rights reserved. Your mental health, our priority.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
