import React, { useState } from 'react';
import { Check, X, Crown, Users, Zap, Shield, Star, ArrowRight, Brain, Heart, Sparkles, Globe, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdaptivePlanBuilder from '@/components/family/AdaptivePlanBuilder';

interface PricingFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
  category: 'core' | 'ai' | 'wellness' | 'analytics' | 'support' | 'family' | 'limits';
}

const PRICING_FEATURES: PricingFeature[] = [
  // Core AI Features
  { name: 'TherapySync AI', free: 'GPT-4o Mini', pro: 'Claude 4 Opus', premium: 'Claude 4 Opus', category: 'core' },
  { name: 'Quick Chat Sessions', free: true, pro: true, premium: true, category: 'core' },
  { name: 'Full Therapy Sessions', free: '8/month', pro: 'Unlimited', premium: 'Unlimited', category: 'limits' },
  { name: 'Therapy Plans', free: '1 plan', pro: '3 plans', premium: '10 plans', category: 'limits' },
  { name: 'AI Messages per Day', free: '100 messages', pro: 'Unlimited', premium: 'Unlimited', category: 'limits' },
  { name: 'AI Therapist Personalities', free: '2 therapists', pro: '8 specialized therapists', premium: '12+ expert therapists', category: 'core' },
  { name: 'Mood Tracking', free: true, pro: true, premium: true, category: 'core' },
  { name: 'Basic Goals', free: '2 goals', pro: '10 goals', premium: 'Unlimited goals', category: 'core' },
  { name: 'Crisis Support (24/7)', free: true, pro: true, premium: true, category: 'support' },
  
  // Advanced AI Features
  { name: 'Predictive Insights', free: false, pro: 'Advanced ML insights', premium: 'Advanced ML insights', category: 'ai' },
  { name: 'Personalized Interventions', free: false, pro: 'Advanced', premium: 'Hyper-personalized', category: 'ai' },
  { name: 'Cultural Adaptation', free: 'Basic', pro: '30+ cultures + dialects', premium: '30+ cultures + dialects', category: 'ai' },
  { name: 'Voice Therapy', free: false, pro: 'Full access', premium: 'Full access', category: 'ai' },
  
  // Wellness Resources
  { name: 'Mindfulness Exercises', free: '5 exercises', pro: '25+ exercises', premium: '100+ premium exercises', category: 'wellness' },
  { name: 'Breathing Exercises', free: false, pro: '15+ techniques', premium: '50+ advanced techniques', category: 'wellness' },
  { name: 'Meditation Library', free: false, pro: '50+ guided sessions', premium: '200+ premium + offline', category: 'wellness' },
  { name: 'Podcasts & Audio Content', free: false, pro: 'Full library access', premium: 'Full library access', category: 'wellness' },
  
  // Analytics & Insights
  { name: 'Progress Tracking', free: 'Basic charts', pro: 'Advanced analytics', premium: 'Predictive analytics', category: 'analytics' },
  { name: 'AI Insights', free: false, pro: 'Weekly insights', premium: 'Real-time insights', category: 'analytics' },
  { name: 'Advanced Dashboard', free: false, pro: false, premium: 'Comprehensive overview', category: 'analytics' },
  { name: 'Personalized Reports', free: false, pro: 'Monthly reports', premium: 'Weekly + custom reports', category: 'analytics' },
  { name: 'Data Export', free: false, pro: 'CSV export', premium: 'Full data portability', category: 'analytics' },
  
  // Community & Support
  { name: 'Community Access', free: true, pro: true, premium: true, category: 'support' },
  { name: 'Priority Support', free: 'Email support', pro: 'Priority support', premium: 'Phone support', category: 'support' },
  { name: 'API Access', free: false, pro: false, premium: '1,000 calls/month', category: 'analytics' },
  { name: 'White-label Options', free: false, pro: false, premium: 'Available', category: 'analytics' },
  { name: 'Compliance Reporting', free: false, pro: false, premium: 'Advanced reports', category: 'analytics' },
];

interface PlanDetails {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  popular?: boolean;
  limitations?: string[];
}

const PLAN_DETAILS: Record<string, PlanDetails> = {
  free: {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Essential mental health support for everyone',
    icon: Heart,
    color: 'from-therapy-400 to-therapy-500',
    features: [
      'AI therapy chat (GPT-4o)',
      'Crisis support (24/7)',
      'Basic mood tracking',
      '8 sessions/month',
      '100 AI messages/day',
      '2 AI therapist personalities',
      'Basic mindfulness exercises'
    ],
    limitations: [
      '1 therapy plan only',
      'Limited session history',
      'Basic analytics only'
    ]
  },
  pro: {
    name: 'Premium',
    price: { monthly: 14.90, yearly: 149 },
    description: 'Enhanced therapy features for regular users',
    icon: Brain,
    color: 'from-harmony-500 to-harmony-600',
    features: [
      'Claude 4 Opus AI model',
      'Unlimited AI messages',
      'Unlimited therapy sessions',
      '8 specialized AI therapists',
      'Voice interaction',
      'Predictive insights',
      'Cultural adaptation (30+ cultures)',
      'Advanced breathing exercises',
      'Extended meditation library (50+)',
      'Community access',
      'Up to 3 therapy plans',
      'Priority support'
    ],
    popular: true
  },
  premium: {
    name: 'Professional',
    price: { monthly: 24.90, yearly: 249 },
    description: 'Complete therapy platform with advanced features for power users',
    icon: Sparkles,
    color: 'from-flow-500 to-flow-600',
    features: [
      'Everything in Premium',
      'Claude 4 Opus AI model',
      'Unlimited AI messages',
      '12+ expert AI therapists',
      '10 therapy plans',
      'Advanced dashboard',
      'API access (1,000 calls/month)',
      'Phone support',
      'Data export',
      'Premium content',
      'Advanced compliance reporting',
      'White-label options'
    ]
  }
};

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([2]);
  const [showFamilyCalculator, setShowFamilyCalculator] = useState(false);
  const navigate = useNavigate();

  useSafeSEO({
    title: 'Pricing Plans - Affordable Mental Health Support | TherapySync',
    description: 'Choose the perfect mental health plan for you. From free basic support to premium therapy features. Transparent pricing with no hidden fees.',
    keywords: 'therapy pricing, mental health plans, subscription, affordable therapy, AI therapy cost'
  });

  const getFeatureValue = (feature: PricingFeature, plan: 'free' | 'pro' | 'premium') => {
    const value = feature[plan];
    if (value === true) return <Check className="h-5 w-5 text-green-600" />;
    if (value === false) return <X className="h-5 w-5 text-gray-400" />;
    return <span className="text-sm text-gray-600">{value}</span>;
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    return Math.round(((monthlyTotal - yearly) / monthlyTotal) * 100);
  };

  const categorizedFeatures = PRICING_FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, PricingFeature[]>);

  const categoryLabels = {
    core: 'Core AI Features',
    ai: 'Advanced AI Capabilities',
    limits: 'Usage Limits',
    wellness: 'Wellness Resources',
    analytics: 'Analytics & Insights',
    support: 'Support & Community',
    family: 'Family Features'
  };

  const calculateFamilyPrice = (members: number, plan: 'pro' | 'premium') => {
    const basePrice = PLAN_DETAILS[plan].price;
    const memberPrice = plan === 'pro' ? 12 : 25;
    const additionalMembers = Math.max(0, members - 1);
    
    return {
      monthly: basePrice.monthly + (additionalMembers * memberPrice),
      yearly: basePrice.yearly + (additionalMembers * memberPrice * 10) // 2 months free
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold therapy-text-gradient mb-6">
              AI-Powered Mental Wellness
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Choose the plan that fits your mental health journey. All plans include our advanced TherapySync AI powered by Claude 4 Opus, with specialized therapists trained in different approaches.
            </p>
            
            {/* AI Technology Highlight */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-therapy-50 to-harmony-50 rounded-2xl p-6 border border-therapy-200">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-therapy-600 mr-3" />
                  <h3 className="text-xl font-semibold text-therapy-800">Advanced TherapySync AI</h3>
                </div>
                <p className="text-therapy-700 mb-4">
                  Our AI uses Claude 4 Opus with specialized therapy training across CBT, DBT, Mindfulness, and Trauma-Focused approaches.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-therapy-600 mr-2" />
                    <span>Clinically Validated</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-therapy-600 mr-2" />
                    <span>30+ Cultural Adaptations</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-therapy-600 mr-2" />
                    <span>24/7 Availability</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Billing Toggle & Family Option */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <span className={`text-lg ${!isYearly ? 'font-semibold text-therapy-600' : 'text-gray-600'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-therapy-600"
                />
                <span className={`text-lg ${isYearly ? 'font-semibold text-therapy-600' : 'text-gray-600'}`}>
                  Yearly
                </span>
                {isYearly && (
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    Save up to 17%
                  </Badge>
                )}
              </div>
              
            <Button
                variant="outline"
                onClick={() => setShowFamilyCalculator(!showFamilyCalculator)}
                className="text-therapy-600 border-therapy-200 hover:bg-therapy-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Advanced Family Plan Builder
                {showFamilyCalculator ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              
              {showFamilyCalculator && (
                <div className="w-full max-w-4xl">
                  <AdaptivePlanBuilder 
                    isOpen={true}
                    onClose={() => setShowFamilyCalculator(false)}
                    onPlanSelect={(planId, seats, billingCycle) => {
                      console.log('Selected plan:', { planId, seats, billingCycle });
                      navigate('/signup');
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
            {Object.entries(PLAN_DETAILS).map(([key, plan]) => {
              const IconComponent = plan.icon;
              const price = isYearly ? plan.price.yearly : plan.price.monthly;
              const savings = isYearly && plan.price.monthly > 0 ? calculateSavings(plan.price.monthly, plan.price.yearly) : 0;
              
              return (
                <Card key={key} className={`relative overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-therapy-500 shadow-xl' : 'shadow-lg'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 to-therapy-600 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.popular ? 'pt-8' : ''}`}>
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="h-10 w-10" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-base">{plan.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold therapy-text-gradient">
                        ${price}
                        {price > 0 && (
                          <span className="text-lg font-normal text-gray-600">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      
                      {isYearly && savings > 0 && (
                        <div className="text-sm text-green-600 font-medium flex items-center justify-center">
                          <Award className="h-4 w-4 mr-1" />
                          Save {savings}% with yearly billing
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations:</h4>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <X className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-600">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full py-3 text-lg font-semibold ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-harmony-500 to-harmony-600 hover:from-harmony-600 hover:to-harmony-700' 
                          : key === 'free'
                          ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700'
                          : 'bg-gradient-to-r from-flow-500 to-flow-600 hover:from-flow-600 hover:to-flow-700'
                      }`}
                      onClick={() => {
                        // Store selected plan
                        localStorage.setItem('selectedPlan', JSON.stringify({
                          name: plan.name,
                          price: `$${price}`,
                          period: `/${isYearly ? 'year' : 'month'}`,
                          tier: key
                        }));
                        
                        navigate('/auth');
                      }}
                    >
                      {key === 'free' ? 'Get Started Free' : `Choose ${plan.name}`}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Feature Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
            <div className="p-8 border-b bg-gradient-to-r from-therapy-50 to-harmony-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold therapy-text-gradient mb-2">Complete Feature Comparison</h2>
                  <p className="text-gray-600">See exactly what's included in each plan</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setExpandedFeatures(!expandedFeatures)}
                  className="border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                >
                  {expandedFeatures ? 'Show Essential' : 'Show All Features'}
                  {expandedFeatures ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-therapy-100 to-harmony-100">
                  <tr>
                    <th className="text-left py-6 px-8 font-bold text-gray-900 text-lg">Features</th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <Heart className="h-6 w-6 text-therapy-600 mb-2" />
                        <span className="font-bold text-therapy-800">Free</span>
                      </div>
                    </th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <Brain className="h-6 w-6 text-harmony-600 mb-2" />
                        <span className="font-bold text-harmony-800">Premium</span>
                        <Badge className="mt-1 bg-harmony-100 text-harmony-700">Popular</Badge>
                      </div>
                    </th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <Sparkles className="h-6 w-6 text-flow-600 mb-2" />
                        <span className="font-bold text-flow-800">Professional</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => (
                    <React.Fragment key={categoryKey}>
                      {(expandedFeatures || ['core', 'ai', 'limits', 'support'].includes(categoryKey)) && (
                        <>
                          <tr className="bg-gradient-to-r from-therapy-25 to-harmony-25">
                            <td colSpan={4} className="py-4 px-8 font-bold text-therapy-900 border-t-2 border-therapy-200 text-lg">
                              {categoryLabel}
                            </td>
                          </tr>
                          {categorizedFeatures[categoryKey]?.map((feature, index) => (
                            <tr key={index} className="border-t hover:bg-gradient-to-r hover:from-therapy-25/50 hover:to-harmony-25/50 transition-all">
                              <td className="py-5 px-8 font-medium text-gray-900 text-base">{feature.name}</td>
                              <td className="py-5 px-6 text-center">{getFeatureValue(feature, 'free')}</td>
                              <td className="py-5 px-6 text-center">{getFeatureValue(feature, 'pro')}</td>
                              <td className="py-5 px-6 text-center">{getFeatureValue(feature, 'premium')}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Technology Deep Dive */}
          <div className="mt-20 bg-gradient-to-r from-therapy-900 to-harmony-900 rounded-3xl p-12 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <Brain className="h-16 w-16 mx-auto mb-6 text-therapy-300" />
              <h2 className="text-4xl font-bold mb-6">Why TherapySync AI is Different</h2>
              <p className="text-xl text-therapy-100 mb-8">
                Our AI isn't just a chatbot—it's a sophisticated therapeutic companion trained on decades of clinical research.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Brain className="h-8 w-8 text-therapy-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">GPT-4 + Clinical Training</h3>
                  <p className="text-therapy-100">
                    Advanced language model enhanced with therapeutic protocols, validated interventions, and cultural sensitivity training.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Heart className="h-8 w-8 text-harmony-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Specialized Therapists</h3>
                  <p className="text-therapy-100">
                    12+ AI therapist personalities, each specialized in different approaches: CBT, DBT, Mindfulness, Trauma-Focused, and more.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Globe className="h-8 w-8 text-flow-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Cultural Intelligence</h3>
                  <p className="text-therapy-100">
                    Adapted for 30+ cultures and dialects, understanding cultural context in mental health approaches and communication styles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold therapy-text-gradient mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">How advanced is your AI compared to other therapy apps?</h3>
                <p className="text-gray-700">TherapySync uses GPT-4 enhanced with specialized therapy training, not basic chatbots. Our AI understands therapeutic context, remembers your progress, and adapts to your cultural background—capabilities most apps lack.</p>
              </div>
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">Can I change plans anytime?</h3>
                <p className="text-gray-700">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
              </div>
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">Is the Free plan really free forever?</h3>
                <p className="text-gray-700">Absolutely! Our Free plan includes crisis support and basic AI therapy features permanently. No credit card required, no hidden fees.</p>
              </div>
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">How does family plan monitoring work?</h3>
                <p className="text-gray-700">Family plans include privacy-respecting insights and optional progress sharing. Members control what they share, and emergency alerts only trigger for crisis situations.</p>
              </div>
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">What happens to my data if I cancel?</h3>
                <p className="text-gray-700">Your data remains secure and accessible for 90 days. You can export everything or reactivate anytime. We never delete therapeutic progress without your explicit consent.</p>
              </div>
              <div className="text-left p-6 bg-white rounded-xl border border-therapy-100 shadow-sm">
                <h3 className="font-bold text-therapy-800 mb-3 text-lg">Do you offer refunds?</h3>
                <p className="text-gray-700">Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund you completely, no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage;