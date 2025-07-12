import React, { useState } from 'react';
import { Check, X, Crown, Users, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PricingFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
  category: 'core' | 'wellness' | 'analytics' | 'support' | 'family' | 'limits';
}

const PRICING_FEATURES: PricingFeature[] = [
  // Core Features
  { name: 'AI Therapy Chat', free: '10 messages/session', pro: 'Unlimited', premium: 'Unlimited', category: 'core' },
  { name: 'Quick Chat Sessions', free: true, pro: true, premium: true, category: 'core' },
  { name: 'Full Therapy Sessions', free: '1/week, 4/month', pro: 'Unlimited', premium: 'Unlimited', category: 'limits' },
  { name: 'Therapy Plans', free: '1 plan', pro: '5 plans', premium: '10 plans', category: 'limits' },
  { name: 'Mood Tracking', free: true, pro: true, premium: true, category: 'core' },
  { name: 'Basic Goals', free: true, pro: true, premium: true, category: 'core' },
  { name: 'Crisis Support (24/7)', free: true, pro: true, premium: true, category: 'support' },
  
  // Wellness Resources
  { name: 'Mindfulness Exercises', free: true, pro: true, premium: true, category: 'wellness' },
  { name: 'Breathing Exercises', free: false, pro: true, premium: true, category: 'wellness' },
  { name: 'Meditation Library', free: false, pro: 'Basic', premium: 'Premium + Offline', category: 'wellness' },
  { name: 'Audio Content Library', free: 'Limited', pro: 'Extended', premium: 'Full Access', category: 'wellness' },
  
  // Analytics & Insights
  { name: 'Progress Tracking', free: 'Basic', pro: 'Advanced', premium: 'Advanced', category: 'analytics' },
  { name: 'AI Insights', free: false, pro: true, premium: true, category: 'analytics' },
  { name: 'Advanced Analytics', free: false, pro: false, premium: true, category: 'analytics' },
  { name: 'Personalized Reports', free: false, pro: 'Monthly', premium: 'Weekly', category: 'analytics' },
  
  // Community & Support
  { name: 'Community Hub', free: false, pro: true, premium: true, category: 'support' },
  { name: 'Priority Support', free: false, pro: false, premium: true, category: 'support' },
  { name: 'Direct Therapist Referrals', free: false, pro: false, premium: true, category: 'support' },
  
  // Family Features
  { name: 'Family Dashboard', free: false, pro: false, premium: 'Add-on Available', category: 'family' },
  { name: 'Member Monitoring', free: false, pro: false, premium: 'Add-on Available', category: 'family' },
  { name: 'Progress Sharing', free: false, pro: false, premium: 'Add-on Available', category: 'family' },
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
    icon: Shield,
    color: 'from-gray-500 to-gray-600',
    features: [
      'Basic AI therapy chat',
      'Mood tracking',
      'Crisis support access',
      'Limited sessions (1/week)',
      'Basic goal setting',
      'Mindfulness exercises'
    ],
    limitations: [
      '10 messages per session',
      '1 therapy plan only',
      'Limited meditation content'
    ]
  },
  pro: {
    name: 'Pro',
    price: { monthly: 29, yearly: 290 },
    description: 'Advanced features for serious mental wellness',
    icon: Crown,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Unlimited therapy sessions',
      'Advanced AI insights',
      'Breathing exercises',
      'Extended meditation library',
      'Community hub access',
      'Up to 5 therapy plans',
      'Progress tracking',
      'Monthly reports'
    ],
    popular: true
  },
  premium: {
    name: 'Premium',
    price: { monthly: 79, yearly: 790 },
    description: 'Complete mental health solution with premium support',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Everything in Pro',
      'Advanced analytics dashboard',
      'Premium meditation library',
      'Priority customer support',
      'Direct therapist referrals',
      'Up to 10 therapy plans',
      'Weekly detailed reports',
      'Offline meditation downloads',
      'Family plan add-on available'
    ]
  }
};

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);
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
    core: 'Core Features',
    limits: 'Usage Limits',
    wellness: 'Wellness Resources',
    analytics: 'Analytics & Insights',
    support: 'Support & Community',
    family: 'Family Features'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your mental health journey. All plans include our core AI therapy features with no hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
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
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900">
                        ${price}
                        {price > 0 && (
                          <span className="text-lg font-normal text-gray-600">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      
                      {isYearly && savings > 0 && (
                        <div className="text-sm text-green-600 font-medium">
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
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => {
                        if (key === 'free') {
                          navigate('/register');
                        } else {
                          navigate('/register', { state: { selectedPlan: key, isYearly } });
                        }
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detailed Feature Comparison</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setExpandedFeatures(!expandedFeatures)}
                >
                  {expandedFeatures ? 'Show Less' : 'Show All Features'}
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categoryLabels).map(([categoryKey, categoryLabel]) => (
                    <React.Fragment key={categoryKey}>
                      {(expandedFeatures || ['core', 'limits'].includes(categoryKey)) && (
                        <>
                          <tr className="bg-therapy-25">
                            <td colSpan={4} className="py-3 px-6 font-semibold text-therapy-800 border-t">
                              {categoryLabel}
                            </td>
                          </tr>
                          {categorizedFeatures[categoryKey]?.map((feature, index) => (
                            <tr key={index} className="border-t hover:bg-gray-50">
                              <td className="py-4 px-6 font-medium text-gray-900">{feature.name}</td>
                              <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'free')}</td>
                              <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'pro')}</td>
                              <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'premium')}</td>
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

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Our Free plan gives you access to core features permanently. No credit card required.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">What happens to my data if I cancel?</h3>
                <p className="text-gray-600">Your data remains secure and accessible. You can export it anytime or reactivate your account.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
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