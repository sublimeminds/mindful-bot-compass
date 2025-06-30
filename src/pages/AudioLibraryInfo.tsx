
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  Crown, 
  Volume2, 
  Brain, 
  Heart,
  Star,
  Clock,
  Users,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AudioLibraryInfo = () => {
  const navigate = useNavigate();

  useSafeSEO({
    title: 'Therapeutic Audio Library - Meditation, Podcasts & Guided Sessions | TherapySync',
    description: 'Discover our comprehensive library of therapeutic audio content including guided meditations, educational podcasts, and therapy sessions powered by AI voice technology.',
    keywords: 'therapeutic audio, meditation library, therapy podcasts, guided meditations, mental health audio, AI voice therapy'
  });

  const contentCategories = [
    {
      title: "Guided Meditations",
      icon: Heart,
      count: "200+",
      description: "From 5-minute mindfulness breaks to 45-minute deep sessions",
      features: ["Anxiety relief", "Sleep preparation", "Focus enhancement", "Emotional regulation"]
    },
    {
      title: "Educational Podcasts",
      icon: Volume2,
      count: "150+",
      description: "Expert insights on mental health topics and therapeutic approaches",
      features: ["CBT techniques", "Relationship advice", "Trauma healing", "Personal growth"]
    },
    {
      title: "Therapy Techniques",
      icon: Brain,
      count: "100+",
      description: "Step-by-step guided exercises for various therapeutic modalities",
      features: ["DBT skills", "Grounding exercises", "Exposure therapy", "EMDR guidance"]
    },
    {
      title: "Sleep Stories",
      icon: Clock,
      count: "75+",
      description: "Calming narratives designed to help you drift into restful sleep",
      features: ["Nature sounds", "Progressive relaxation", "Visualization", "Body scan"]
    }
  ];

  const voiceFeatures = [
    {
      title: "29 Languages",
      icon: Globe,
      description: "Access content in your preferred language"
    },
    {
      title: "AI-Powered Voices",
      icon: Zap,
      description: "Natural, empathetic voices powered by ElevenLabs"
    },
    {
      title: "Personalized Content",
      icon: Users,
      description: "Recommendations based on your therapy goals"
    },
    {
      title: "Offline Access",
      icon: Shield,
      description: "Download and listen anytime, anywhere"
    }
  ];

  const sampleContent = [
    {
      title: "Morning Mindfulness",
      duration: "15:00",
      category: "Meditation",
      tier: "Premium",
      description: "Start your day with intention and calm awareness"
    },
    {
      title: "Understanding Anxiety",
      duration: "35:00",
      category: "Podcast",
      tier: "Premium",
      description: "Deep dive into anxiety causes and evidence-based treatments"
    },
    {
      title: "DBT Distress Tolerance",
      duration: "25:00",
      category: "Technique",
      tier: "Pro",
      description: "Master advanced emotional regulation skills"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center space-x-2 bg-therapy-100 rounded-full px-4 py-2 mb-6">
              <Headphones className="h-4 w-4 text-therapy-600" />
              <span className="text-therapy-700 font-medium">Therapeutic Audio Library</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent mb-6">
              Healing Through Sound
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Access hundreds of therapeutic audio sessions, guided meditations, and educational podcasts 
              crafted by mental health professionals and powered by cutting-edge AI voice technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Content Categories */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Audio Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contentCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <Badge variant="secondary" className="mx-auto">{category.count}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{category.description}</p>
                      <ul className="space-y-1">
                        {category.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-500">
                            <CheckCircle className="h-3 w-3 text-therapy-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Voice Features */}
        <section className="py-16 px-4 bg-gradient-to-r from-therapy-50 to-calm-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Powered by Advanced AI Voice Technology</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {voiceFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <IconComponent className="h-6 w-6 text-therapy-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sample Content */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleContent.map((content, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{content.category}</Badge>
                      <Badge className="bg-therapy-100 text-therapy-700">
                        <Crown className="h-3 w-3 mr-1" />
                        {content.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{content.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {content.duration}
                      </span>
                      <Button size="sm" variant="outline" disabled>
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-therapy-600 to-calm-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Audio Journey?</h2>
            <p className="text-xl text-therapy-100 mb-8">
              Join thousands who have transformed their mental health with our therapeutic audio library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-therapy-700 hover:bg-therapy-50"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-therapy-700"
                onClick={() => navigate('/pricing')}
              >
                View All Plans
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AudioLibraryInfo;
