
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  Shield, 
  MessageCircle, 
  BarChart3, 
  Heart, 
  Sparkles,
  Clock,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Eye,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientLogo from '@/components/ui/GradientLogo';

const TherapySyncAI = () => {
  const navigate = useNavigate();

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Advanced Natural Language Processing',
      description: 'Our AI understands context, emotions, and therapeutic nuances with 98% accuracy',
      capabilities: ['Emotional context understanding', 'Therapeutic response generation', 'Crisis detection'],
      gradient: 'from-therapy-500 to-therapy-600'
    },
    {
      icon: Target,
      title: 'Personalized Intervention Engine',
      description: 'AI adapts to your unique needs and preferences in real-time',
      capabilities: ['Dynamic therapy approach selection', 'Personalized coping strategies', 'Goal-oriented sessions'],
      gradient: 'from-harmony-500 to-harmony-600'
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics & Insights',
      description: 'Identifies patterns and predicts therapeutic outcomes for better care',
      capabilities: ['Mood pattern recognition', 'Progress prediction', 'Risk assessment'],
      gradient: 'from-balance-500 to-balance-600'
    },
    {
      icon: Shield,
      title: 'Safety & Crisis Prevention',
      description: 'Proactive mental health monitoring with immediate intervention capabilities',
      capabilities: ['24/7 crisis detection', 'Automated safety protocols', 'Emergency resource access'],
      gradient: 'from-flow-500 to-flow-600'
    },
    {
      icon: MessageCircle,
      title: 'Contextual Memory System',
      description: 'Remembers your journey and builds upon previous sessions seamlessly',
      capabilities: ['Session continuity', 'Long-term progress tracking', 'Relationship building'],
      gradient: 'from-calm-500 to-calm-600'
    },
    {
      icon: Lightbulb,
      title: 'Intelligent Recommendation Engine',
      description: 'Suggests optimal therapeutic techniques and interventions',
      capabilities: ['Evidence-based recommendations', 'Technique optimization', 'Resource suggestions'],
      gradient: 'from-therapy-400 to-harmony-500'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Advanced NLP with Emotional Intelligence', therapySync: true, others: false },
    { feature: 'Real-time Crisis Detection & Prevention', therapySync: true, others: false },
    { feature: 'Personalized Therapeutic Approach Selection', therapySync: true, others: false },
    { feature: 'Contextual Memory Across Sessions', therapySync: true, others: 'Limited' },
    { feature: 'HIPAA Compliant Security', therapySync: true, others: true },
    { feature: 'Evidence-based Therapeutic Techniques', therapySync: true, others: 'Basic' },
    { feature: 'Predictive Mental Health Analytics', therapySync: true, others: false },
    { feature: '24/7 Availability', therapySync: true, others: true },
    { feature: 'Multi-modal Interaction (Voice + Text)', therapySync: true, others: false },
    { feature: 'Cultural Sensitivity & Awareness', therapySync: true, others: false }
  ];

  const stats = [
    { value: '98%', label: 'Accuracy in Emotion Recognition', icon: Eye },
    { value: '<2s', label: 'Average Response Time', icon: Clock },
    { value: '95%', label: 'User Satisfaction Rate', icon: Star },
    { value: '24/7', label: 'Availability', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-therapy-600 via-harmony-600 to-balance-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <GradientLogo size="xl" className="mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold">
              TherapySync AI
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white/90">
            The most advanced AI therapy companion powered by cutting-edge machine learning, 
            natural language processing, and evidence-based therapeutic methodologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Advanced NLP
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Processing
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise Security
            </Badge>
          </div>
          <Button 
            size="lg"
            className="bg-white text-therapy-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={() => navigate('/register')}
          >
            Experience TherapySync AI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Advanced AI Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI goes beyond simple chatbots with sophisticated understanding and therapeutic expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-slate-200">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className="flex items-center text-sm text-slate-700">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {capability}
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

      {/* Comparison Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-therapy-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How We Compare
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See why TherapySync AI leads the industry in therapeutic AI technology
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-slate-200">
                <div className="font-semibold text-slate-900">Feature</div>
                <div className="font-semibold text-therapy-600 text-center">TherapySync AI</div>
                <div className="font-semibold text-slate-600 text-center">Other AI Therapy Apps</div>
              </div>
              {comparisonFeatures.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-6 border-b border-slate-100 hover:bg-slate-50">
                  <div className="text-slate-900">{item.feature}</div>
                  <div className="text-center">
                    {item.therapySync === true ? (
                      <CheckCircle className="h-5 w-5 text-therapy-500 mx-auto" />
                    ) : (
                      <span className="text-therapy-600 font-medium">{item.therapySync}</span>
                    )}
                  </div>
                  <div className="text-center">
                    {item.others === true ? (
                      <CheckCircle className="h-5 w-5 text-slate-400 mx-auto" />
                    ) : item.others === false ? (
                      <span className="text-slate-400">✗</span>
                    ) : (
                      <span className="text-slate-500">{item.others}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-therapy-600 via-harmony-600 to-balance-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Advanced AI Therapy?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of users who trust TherapySync AI for their mental wellness journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-therapy-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/register')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TherapySyncAI;
