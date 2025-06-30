
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MessageCircle, Target, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CouplesTherapy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useSafeSEO({
    title: 'Couples Therapy - Strengthen Your Relationship | TherapySync',
    description: 'AI-powered couples therapy to improve communication, resolve conflicts, and build stronger relationships. Available 24/7 in 29 languages.',
    keywords: 'couples therapy, relationship counseling, marriage therapy, communication skills, conflict resolution'
  });

  const features = [
    {
      icon: MessageCircle,
      title: t('couplesTherapy.features.communication.title', 'Communication Enhancement'),
      description: t('couplesTherapy.features.communication.description', 'Learn effective communication techniques and practice active listening skills')
    },
    {
      icon: Target,
      title: t('couplesTherapy.features.conflictResolution.title', 'Conflict Resolution'),
      description: t('couplesTherapy.features.conflictResolution.description', 'Develop healthy ways to handle disagreements and find common ground')
    },
    {
      icon: Heart,
      title: t('couplesTherapy.features.intimacy.title', 'Intimacy Building'),
      description: t('couplesTherapy.features.intimacy.description', 'Strengthen emotional and physical connection between partners')
    },
    {
      icon: Users,
      title: t('couplesTherapy.features.teamwork.title', 'Partnership Strengthening'),
      description: t('couplesTherapy.features.teamwork.description', 'Build a stronger partnership through shared goals and mutual support')
    }
  ];

  const sessionTypes = [
    {
      title: t('couplesTherapy.sessions.joint.title', 'Joint Sessions'),
      description: t('couplesTherapy.sessions.joint.description', 'Work together with AI guidance on shared relationship goals'),
      duration: '60 minutes',
      price: 'Premium Plan'
    },
    {
      title: t('couplesTherapy.sessions.individual.title', 'Individual Preparation'),
      description: t('couplesTherapy.sessions.individual.description', 'Private sessions to prepare for couple discussions'),
      duration: '45 minutes',
      price: 'All Plans'
    },
    {
      title: t('couplesTherapy.sessions.crisis.title', 'Crisis Support'),
      description: t('couplesTherapy.sessions.crisis.description', 'Immediate support during relationship emergencies'),
      duration: 'As needed',
      price: 'Free'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Heart className="h-4 w-4 mr-2" />
              {t('couplesTherapy.badge', 'Couples Therapy')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {t('couplesTherapy.title', 'Strengthen Your Relationship Together')}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              {t('couplesTherapy.subtitle', 'AI-powered couples therapy designed to improve communication, resolve conflicts, and build deeper connection between partners.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/therapy-chat')}
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-8 py-6 text-lg"
              >
                <Users className="h-5 w-5 mr-2" />
                {t('couplesTherapy.cta.start', 'Start Couples Session')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/how-it-works')}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg"
              >
                {t('couplesTherapy.cta.learn', 'Learn More')}
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Session Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {t('couplesTherapy.sessions.title', 'Session Options')}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sessionTypes.map((session, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-rose-600">{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{session.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{session.duration}</span>
                      </div>
                      <Badge variant="outline" className="border-rose-200 text-rose-600">
                        {session.price}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  {t('couplesTherapy.benefits.title', 'Why Choose AI Couples Therapy?')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {[
                    t('couplesTherapy.benefits.available', '24/7 availability for crisis moments'),
                    t('couplesTherapy.benefits.privacy', 'Complete privacy and confidentiality'),
                    t('couplesTherapy.benefits.affordable', 'More affordable than traditional therapy'),
                    t('couplesTherapy.benefits.personalized', 'Personalized approaches for your relationship')
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[
                    t('couplesTherapy.benefits.multilingual', 'Available in 29+ languages'),
                    t('couplesTherapy.benefits.evidenceBased', 'Evidence-based therapeutic techniques'),
                    t('couplesTherapy.benefits.progress', 'Track relationship progress over time'),
                    t('couplesTherapy.benefits.flexible', 'Flexible scheduling for busy couples')
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CouplesTherapy;
