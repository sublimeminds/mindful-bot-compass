
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Users, 
  Brain, 
  Globe, 
  Sparkles,
  MessageSquare,
  Headphones,
  Lock,
  Award,
  UserCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LGBTQTherapy = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'LGBTQ+ Therapy - Inclusive AI Mental Health Support',
    description: 'Culturally sensitive AI therapy designed for LGBTQ+ individuals. Safe, affirming, and personalized mental health support.',
    keywords: 'LGBTQ+ therapy, inclusive mental health, AI therapy, queer affirming therapy, transgender support'
  });

  const lgbtqFeatures = [
    {
      icon: Shield,
      title: "Safe & Affirming Space",
      description: "A judgment-free environment where you can be your authentic self without fear of discrimination or misunderstanding.",
      details: ["Identity-affirming language", "Respectful pronoun usage", "No conversion therapy approaches", "Trauma-informed care"]
    },
    {
      icon: Brain,
      title: "Culturally Competent AI",
      description: "Our AI is trained on LGBTQ+ specific mental health research and therapeutic approaches.",
      details: ["LGBTQ+ cultural competency", "Minority stress awareness", "Identity development support", "Intersectionality understanding"]
    },
    {
      icon: Lock,
      title: "Complete Privacy & Confidentiality",
      description: "Your identity, conversations, and personal information are protected with the highest security standards.",
      details: ["End-to-end encryption", "Anonymous usage options", "HIPAA compliance", "No data sharing with third parties"]
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Connect with other LGBTQ+ individuals in a supportive and understanding community environment.",
      details: ["LGBTQ+ support groups", "Peer mentorship programs", "Safe social spaces", "Resource sharing"]
    }
  ];

  const specializations = [
    {
      title: "Coming Out Support",
      description: "Navigate the coming out process at your own pace with personalized guidance.",
      icon: "🌈"
    },
    {
      title: "Gender Identity",
      description: "Explore and affirm your gender identity with specialized support.",
      icon: "⚧️"
    },
    {
      title: "Relationship Counseling",
      description: "LGBTQ+ relationship dynamics and challenges addressed with understanding.",
      icon: "💕"
    },
    {
      title: "Family Acceptance",
      description: "Navigate family relationships and build bridges with culturally aware guidance.",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Workplace Issues",
      description: "Address discrimination, harassment, and workplace challenges with confidence.",
      icon: "💼"
    },
    {
      title: "Mental Health",
      description: "Depression, anxiety, and other mental health concerns with LGBTQ+-informed care.",
      icon: "🧠"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-harmony-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 therapy-gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-harmony-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Heart className="h-4 w-4 mr-2" />
              LGBTQ+ Affirming Therapy
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 via-harmony-600 to-therapy-600 bg-clip-text text-transparent">
                Inclusive AI Therapy for LGBTQ+ Individuals
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Experience mental health support that truly understands and affirms your identity. 
              Our AI is specifically trained to provide culturally competent, inclusive therapy for the LGBTQ+ community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Safe Therapy
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Why Choose LGBTQ+ Affirming AI Therapy?
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform is designed with the unique needs and experiences of LGBTQ+ individuals in mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lgbtqFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full"></div>
                          <span className="text-sm text-slate-600">{detail}</span>
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

      {/* Specializations */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-harmony-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Specialized Support Areas
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive care for the diverse experiences within the LGBTQ+ community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{spec.icon}</div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{spec.title}</h3>
                  <p className="text-sm text-slate-600">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Your Safety & Privacy Matter
              </span>
            </h2>
          </div>
          
          <Card className="bg-gradient-to-br from-therapy-500 to-harmony-500 text-white p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Protected Identity</h3>
                <p className="text-therapy-100">Your personal information and identity are safeguarded with military-grade encryption.</p>
              </div>
              <div>
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Confidential Sessions</h3>
                <p className="text-therapy-100">All therapy sessions are completely private and confidential, following strict ethical guidelines.</p>
              </div>
              <div>
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Affirming Care</h3>
                <p className="text-therapy-100">Every interaction is designed to validate and support your authentic self and identity.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="bg-gradient-to-br from-therapy-50 to-harmony-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Join thousands of LGBTQ+ individuals who have found support, understanding, and healing through our inclusive AI therapy platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Headphones className="h-5 w-5 mr-2" />
                  Begin Therapy Session
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/pricing')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  View Pricing
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LGBTQTherapy;
