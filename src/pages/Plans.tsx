
import React from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import PlanSelector from '@/components/subscription/PlanSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, Zap } from 'lucide-react';

const Plans = () => {
  useSEO({
    title: 'Pricing Plans - TherapySync',
    description: 'Choose the perfect TherapySync plan for your mental wellness journey. Free and premium options available.',
    keywords: 'therapy pricing, mental health plans, AI therapy cost, wellness subscription'
  });

  const handleSelectPlan = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    console.log('Selected plan:', planId, billingCycle);
    // Handle plan selection logic here
  };

  return (
    <MobileOptimizedLayout>
      <div className="py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-harmony-100 dark:bg-harmony-900/50 text-harmony-700 dark:text-harmony-300 text-sm font-medium">
            <Star className="h-4 w-4 mr-2" />
            Choose Your Wellness Plan
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 dark:from-harmony-400 dark:to-flow-400 bg-clip-text text-transparent">
            Flexible Plans for<br />Every Journey
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From basic wellness support to comprehensive mental health care, 
            find the perfect plan that grows with your needs.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-harmony-600 dark:text-harmony-400" />
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption and HIPAA compliant security
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 mx-auto mb-4 text-flow-600 dark:text-flow-400" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI technology for personalized therapy
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Check className="h-12 w-12 mx-auto mb-4 text-balance-600 dark:text-balance-400" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Round-the-clock crisis support and assistance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plan Selector */}
        <div className="max-w-6xl mx-auto">
          <PlanSelector onSelectPlan={handleSelectPlan} />
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect at your next billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. We use end-to-end encryption and comply with 
                  HIPAA regulations to protect your privacy.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the free plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The free plan includes 3 AI therapy sessions per month, 
                  basic mood tracking, and community access.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee for all paid plans. 
                  No questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-harmony-50 dark:bg-harmony-950/50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">Trusted by Thousands</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <Badge variant="outline" className="text-lg px-4 py-2">HIPAA Compliant</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">ISO 27001</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">SOC 2 Type II</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">256-bit SSL</Badge>
            </div>
          </div>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default Plans;
