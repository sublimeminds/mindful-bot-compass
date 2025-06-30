
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Focus, Clock, Target, Zap, CheckCircle, Timer, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ADHDTherapy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useSafeSEO({
    title: 'ADHD Therapy & Support - Focus Enhancement | TherapySync',
    description: 'Specialized AI therapy for ADHD management, focus improvement, and executive function support. Personalized strategies available 24/7.',
    keywords: 'ADHD therapy, attention deficit, focus training, executive function, time management, ADHD support'
  });

  const features = [
    {
      icon: Focus,
      title: t('adhdTherapy.features.focus.title', 'Focus Enhancement'),
      description: t('adhdTherapy.features.focus.description', 'Techniques to improve concentration and reduce distractibility')
    },
    {
      icon: Timer,
      title: t('adhdTherapy.features.timeManagement.title', 'Time Management'),
      description: t('adhdTherapy.features.timeManagement.description', 'Strategies for better time awareness and organization')
    },
    {
      icon: Target,
      title: t('adhdTherapy.features.executiveFunction.title', 'Executive Function'),
      description: t('adhdTherapy.features.executiveFunction.description', 'Support for planning, prioritizing, and task completion')
    },
    {
      icon: Zap,
      title: t('adhdTherapy.features.hyperactivity.title', 'Hyperactivity Management'),
      description: t('adhdTherapy.features.hyperactivity.description', 'Techniques to channel energy productively and manage restlessness')
    }
  ];

  const strategies = [
    {
      title: t('adhdTherapy.strategies.pomodoro.title', 'Pomodoro Technique'),
      description: t('adhdTherapy.strategies.pomodoro.description', 'Break work into focused intervals with breaks'),
      icon: Timer
    },
    {
      title: t('adhdTherapy.strategies.mindfulness.title', 'Mindfulness Training'),
      description: t('adhdTherapy.strategies.mindfulness.description', 'Develop present-moment awareness and emotional regulation'),
      icon: Brain
    },
    {
      title: t('adhdTherapy.strategies.organization.title', 'Organization Systems'),
      description: t('adhdTherapy.strategies.organization.description', 'Create structure and systems for daily tasks'),
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Brain className="h-4 w-4 mr-2" />
              {t('adhdTherapy.badge', 'ADHD Support')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('adhdTherapy.title', 'ADHD-Focused Therapy & Support')}
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              {t('adhdTherapy.subtitle', 'Specialized AI therapy designed specifically for ADHD minds. Improve focus, manage time better, and develop executive function skills.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/therapy-chat')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 px-8 py-6 text-lg"
              >
                <Focus className="h-5 w-5 mr-2" />
                {t('adhdTherapy.cta.start', 'Start ADHD Session')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/how-it-works')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              >
                {t('adhdTherapy.cta.learn', 'Learn More')}
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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ADHD Strategies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('adhdTherapy.strategies.title', 'ADHD Management Strategies')}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {strategies.map((strategy, index) => {
                const IconComponent = strategy.icon;
                return (
                  <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-blue-600">{strategy.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{strategy.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ADHD-Specific Benefits */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t('adhdTherapy.benefits.title', 'Why Our ADHD Support Works')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {[
                    t('adhdTherapy.benefits.immediate', 'Immediate access during hyperfocus or distraction'),
                    t('adhdTherapy.benefits.repetition', 'Repetition-friendly learning approach'),
                    t('adhdTherapy.benefits.visual', 'Visual and interactive therapy elements'),
                    t('adhdTherapy.benefits.pacing', 'Self-paced sessions that match your energy')
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[
                    t('adhdTherapy.benefits.noJudgment', 'Non-judgmental AI understands ADHD challenges'),
                    t('adhdTherapy.benefits.techniques', 'Evidence-based ADHD management techniques'),
                    t('adhdTherapy.benefits.tracking', 'Track focus patterns and improvements'),
                    t('adhdTherapy.benefits.reminders', 'Built-in reminders and scheduling support')
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
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

export default ADHDTherapy;
