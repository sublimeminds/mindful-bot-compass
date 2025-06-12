
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlanSelector from '@/components/subscription/PlanSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, Users, CheckCircle } from 'lucide-react';

const Plans = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Mental Health Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From free basic support to premium unlimited access, find the perfect plan 
              to support your mental wellness goals.
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <PlanSelector />
        </div>

        {/* Features Section */}
        <div className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose MindfulAI?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">100% Confidential</h3>
                  <p className="text-sm text-muted-foreground">
                    End-to-end encryption and HIPAA-compliant security
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">24/7 Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Access therapy support whenever you need it most
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Expert-Designed</h3>
                  <p className="text-sm text-muted-foreground">
                    AI trained by licensed therapists and psychologists
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Evidence-Based</h3>
                  <p className="text-sm text-muted-foreground">
                    Techniques proven effective by clinical research
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access 
                to premium features until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                New users get 3 free sessions to try our platform. You can upgrade to a paid plan 
                anytime to unlock more features and unlimited access.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What's the difference between plans?</h3>
              <p className="text-muted-foreground">
                Each plan offers more sessions, advanced features, and better support. The Free plan 
                is great for trying our service, Basic adds more sessions and features, while Premium 
                gives you unlimited access to everything.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Absolutely. We use bank-level encryption and are HIPAA-compliant. Your therapy 
                sessions and personal data are completely confidential and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Plans;
