import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Crown,
  Sparkles
} from 'lucide-react';

const FamilyFeaturesLanding = () => {
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
    }
  ];

  const IconWrapper = ({ icon: Icon, gradient }: { icon: any, gradient: string }) => (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${gradient} shadow-lg`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-harmony-500 to-balance-500 text-white rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Family Mental Health
          </h1>
          <p className="text-xl text-harmony-100 max-w-2xl mx-auto mb-8">
            Comprehensive mental health support designed for families, with advanced sharing capabilities and collaborative care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-harmony-700 hover:bg-harmony-50 px-8 py-4 text-lg rounded-full shadow-xl"
              onClick={handleGetStarted}
            >
              Start Family Plan
              <Crown className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-harmony-700 px-8 py-4 text-lg rounded-full"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Core Family Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyFeatures.map((feature, index) => (
            <Card key={index} className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
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
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-br from-therapy-600 to-calm-600 text-white rounded-2xl">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Support Your Family?
          </h2>
          <p className="text-xl text-therapy-100 mb-6">
            Join families who have found healing and stronger connections through our platform.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg rounded-full shadow-xl"
            onClick={handleGetStarted}
          >
            Get Started Today
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-therapy-200 text-sm mt-4">
            🔒 HIPAA Compliant • Privacy Protected • 24/7 Support
          </p>
        </div>
      </section>
    </div>
  );
};

export default FamilyFeaturesLanding;