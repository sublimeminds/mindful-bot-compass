
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Users, Brain, Rainbow, MessageCircle, Target, 
  Clock, Lightbulb, CheckCircle, ArrowRight, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TherapyTypes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useSafeSEO({
    title: 'Therapy Types & Specializations - AI Mental Health Support | TherapySync',
    description: 'Explore our comprehensive range of AI therapy specializations including couples therapy, ADHD support, LGBTQ+ therapy, and more.',
    keywords: 'therapy types, AI therapy, couples therapy, ADHD therapy, LGBTQ therapy, mental health specializations'
  });

  const therapyTypes = [
    {
      title: 'General AI Therapy',
      description: 'Comprehensive mental health support for anxiety, depression, stress, and general wellness',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500',
      path: '/therapy-chat',
      topics: ['Anxiety', 'Depression', 'Stress Management', 'Life Transitions']
    },
    {
      title: 'Couples Therapy',
      description: 'Relationship counseling to improve communication and strengthen partnerships',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      path: '/couples-therapy',
      topics: ['Communication', 'Conflict Resolution', 'Intimacy', 'Trust Building']
    },
    {
      title: 'ADHD Support',
      description: 'Specialized support for focus, time management, and executive function',
      icon: Target,
      color: 'from-blue-500 to-indigo-500',
      path: '/adhd-therapy',
      topics: ['Focus Training', 'Time Management', 'Organization', 'Impulse Control']
    },
    {
      title: 'Autism Support',
      description: 'Autism-friendly therapy understanding sensory needs and social communication',
      icon: Users,
      color: 'from-purple-500 to-violet-500',
      path: '/autism-therapy',
      topics: ['Social Skills', 'Sensory Support', 'Routine Building', 'Communication']
    },
    {
      title: 'LGBTQ+ Therapy',
      description: 'Inclusive therapy supporting LGBTQ+ individuals and their unique experiences',
      icon: Rainbow,
      color: 'from-rainbow-500 to-pride-500',
      path: '/lgbtq-therapy',
      topics: ['Identity Support', 'Coming Out', 'Discrimination', 'Community']
    },
    {
      title: 'Crisis Support',
      description: '24/7 immediate support for mental health emergencies and crisis situations',
      icon: Clock,
      color: 'from-red-500 to-orange-500',
      path: '/crisis-support',
      topics: ['Emergency Support', 'Crisis Planning', 'Safety Resources', '24/7 Access']
    }
  ];

  const therapeuticApproaches = [
    {
      name: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Evidence-based approach focusing on thought patterns and behaviors'
    },
    {
      name: 'Dialectical Behavior Therapy (DBT)',
      description: 'Skills-based therapy for emotional regulation and distress tolerance'
    },
    {
      name: 'Mindfulness-Based Therapy',
      description: 'Present-moment awareness and acceptance-based interventions'
    },
    {
      name: 'Solution-Focused Therapy',
      description: 'Goal-oriented approach emphasizing strengths and solutions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Brain className="h-4 w-4 mr-2" />
              Therapy Specializations
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                All Types of Therapy We Offer
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover our comprehensive range of AI-powered therapy specializations, each designed to meet your unique mental health needs with personalized, evidence-based support.
            </p>
          </div>

          {/* Therapy Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {therapyTypes.map((therapy, index) => {
              const IconComponent = therapy.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(therapy.path)}>
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${therapy.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-therapy-600 group-hover:text-therapy-700 transition-colors">
                      {therapy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{therapy.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {therapy.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r ${therapy.color} text-white border-0 group-hover:shadow-lg transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(therapy.path);
                      }}
                    >
                      Start {therapy.title}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Therapeutic Approaches */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Evidence-Based Therapeutic Approaches
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapeuticApproaches.map((approach, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-therapy-600 mb-2">{approach.name}</h3>
                        <p className="text-slate-600 text-sm">{approach.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <Card className="bg-gradient-to-r from-therapy-50 to-indigo-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                  Why Choose AI Therapy?
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Clock, title: '24/7 Availability', description: 'Access support whenever you need it' },
                  { icon: Star, title: 'Personalized Care', description: 'Therapy adapted to your unique needs' },
                  { icon: Users, title: 'Diverse Specializations', description: 'Multiple therapy types in one platform' },
                  { icon: Lightbulb, title: 'Evidence-Based', description: 'Scientifically proven therapeutic methods' }
                ].map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-therapy-600 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TherapyTypes;
