
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Heart, 
  Brain, 
  Settings, 
  Eye, 
  Bell, 
  BookOpen, 
  Phone, 
  Lock,
  UserCheck,
  Activity,
  MessageSquare,
  TrendingUp,
  Calendar,
  FileText,
  Globe,
  Crown,
  Sparkles
} from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import FamilyAccessGate from '@/components/family/FamilyAccessGate';
import FamilyFeaturesLanding from '@/components/family/FamilyFeaturesLanding';

const FamilyFeaturesPage = () => {
  return (
    <FamilyAccessGate>
      <FamilyFeaturesContent />
    </FamilyAccessGate>
  );
};

const FamilyFeaturesContent = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const planSelection = {
      name: 'Family',
      price: 39.99,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planSelection));
    navigate('/onboarding');
  };

  const familyFeatures = [
    {
      icon: Users,
      title: 'Multi-User Family Accounts',
      description: 'Support up to 4 family members with individual profiles, privacy settings, and personalized therapy experiences.',
      gradient: 'from-harmony-500 to-balance-500'
    },
    {
      icon: Shield,
      title: 'Parental Controls & Monitoring',
      description: 'Comprehensive parental oversight with age-appropriate content filtering, session monitoring, and safety controls.',
      gradient: 'from-therapy-500 to-calm-500'
    },
    {
      icon: Eye,
      title: 'Progress Sharing & Insights',
      description: 'Secure family dashboard showing aggregated progress while maintaining individual privacy boundaries.',
      gradient: 'from-calm-500 to-flow-500'
    },
    {
      icon: Brain,
      title: 'Family Therapy Sessions',
      description: 'AI-powered family therapy sessions addressing family dynamics, communication, and collective healing.',
      gradient: 'from-flow-500 to-balance-500'
    },
    {
      icon: Bell,
      title: 'Crisis Alert System',
      description: 'Automatic crisis detection with immediate family notifications and emergency resource activation.',
      gradient: 'from-therapy-600 to-harmony-600'
    },
    {
      icon: Lock,
      title: 'Individual Privacy Protection',
      description: 'Advanced privacy controls ensuring each family member maintains confidential therapeutic space.',
      gradient: 'from-balance-500 to-therapy-500'
    }
  ];

  const therapistFeatures = [
    {
      icon: UserCheck,
      title: 'Professional Account Management',
      description: 'Manage multiple client families with coordinated care plans and shared therapeutic objectives.',
      gradient: 'from-harmony-500 to-calm-500'
    },
    {
      icon: Activity,
      title: 'Family Dynamics Analytics',
      description: 'Advanced analytics showing family interaction patterns, progress correlations, and therapeutic insights.',
      gradient: 'from-therapy-500 to-flow-500'
    },
    {
      icon: MessageSquare,
      title: 'Coordinated Communication',
      description: 'Secure messaging system for family therapy coordination with HIPAA-compliant group communications.',
      gradient: 'from-calm-500 to-balance-500'
    },
    {
      icon: Calendar,
      title: 'Family Session Scheduling',
      description: 'Integrated scheduling for individual and family sessions with automated reminders and coordination.',
      gradient: 'from-flow-500 to-harmony-500'
    }
  ];

  const additionalFeatures = [
    {
      icon: BookOpen,
      title: 'Family Wellness Library',
      description: 'Curated educational resources on family mental health, parenting strategies, and relationship building.',
      gradient: 'from-balance-500 to-calm-500'
    },
    {
      icon: TrendingUp,
      title: 'Shared Progress Tracking',
      description: 'Family goal setting and progress tracking with collaborative achievements and milestone celebrations.',
      gradient: 'from-harmony-500 to-therapy-500'
    },
    {
      icon: Phone,
      title: 'Priority Family Support',
      description: '24/7 priority phone support for family plan members with dedicated family mental health specialists.',
      gradient: 'from-therapy-500 to-calm-500'
    },
    {
      icon: FileText,
      title: 'Family Reports & Documentation',
      description: 'Comprehensive family mental health reports for healthcare providers and family meetings.',
      gradient: 'from-calm-500 to-harmony-500'
    }
  ];

  const IconWrapper = ({ icon: Icon, gradient }: { icon: any, gradient: string }) => (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${gradient} shadow-lg`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-25 to-calm-25">
      <div className="p-6">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-harmony-500 to-balance-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <GradientLogo size="xl" className="drop-shadow-sm" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Family & Account Sharing
            </h1>
            <p className="text-xl text-harmony-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Comprehensive mental health support designed for families, with advanced sharing capabilities, parental controls, and therapist collaboration features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-harmony-700 hover:bg-harmony-50 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={handleGetStarted}
              >
                Start Family Plan
                <Crown className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-harmony-700 px-10 py-6 text-lg rounded-full transition-all duration-300"
                onClick={() => navigate('/pricing')}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Family Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Core Family Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to support your family's mental wellness journey together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {familyFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <IconWrapper icon={feature.icon} gradient={feature.gradient} />
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Therapist Collaboration */}
      <section className="py-20 bg-gradient-to-r from-therapy-50 to-calm-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Therapist Collaboration Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced tools for mental health professionals working with families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {therapistFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <IconWrapper icon={feature.icon} gradient={feature.gradient} />
                    <CardTitle className="text-xl font-semibold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Additional Family Benefits
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive support resources and enhanced features for family mental wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <IconWrapper icon={feature.icon} gradient={feature.gradient} />
                    <CardTitle className="text-xl font-semibold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-therapy-600 to-calm-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Support Your Family's Mental Wellness?
            </h2>
            <p className="text-xl text-therapy-100 mb-8 max-w-2xl mx-auto">
              Join thousands of families who have found healing, growth, and stronger connections through our family-focused platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-therapy-700 hover:bg-therapy-50 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={handleGetStarted}
              >
                Start Family Plan Today
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-therapy-700 px-10 py-6 text-lg rounded-full transition-all duration-300"
                onClick={() => navigate('/support')}
              >
                Contact Support
              </Button>
            </div>
            <p className="text-therapy-200 text-sm mt-6">
              🔒 HIPAA Compliant • Family Privacy Protected • 24/7 Crisis Support
            </p>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};

export default FamilyFeaturesPage;
