import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Award, Clock, Users, CheckCircle } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade healthcare security',
      status: 'Certified',
      color: 'text-therapy-600'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'Military-grade data protection',
      status: 'Active',
      color: 'text-calm-600'
    },
    {
      icon: Award,
      title: 'Clinical Excellence',
      description: 'Evidence-based AI therapy protocols',
      status: 'Verified',
      color: 'text-harmony-600'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Always here when you need support',
      status: 'Online',
      color: 'text-mindful-600'
    },
    {
      icon: Users,
      title: 'Professional Standards',
      description: 'Licensed therapist oversight',
      status: 'Supervised',
      color: 'text-balance-600'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'Continuous monitoring & improvement',
      status: 'Monitored',
      color: 'text-healing-600'
    }
  ];

  return (
    <SafeComponentWrapper name="TrustIndicators">
      <div className="py-16 px-4 bg-gradient-to-r from-therapy-50/30 via-white to-calm-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-therapy-100 text-therapy-800 border-therapy-200">
              Trusted by Thousands
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Safety & Privacy Come First
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade security and clinical standards ensure your therapy journey 
              is safe, private, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator, index) => (
              <Card key={index} className="group bg-white border border-therapy-100/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ${indicator.color} group-hover:scale-110 transition-transform duration-300`}>
                      <indicator.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{indicator.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${indicator.color} border-current bg-white/50 text-xs`}
                        >
                          {indicator.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {indicator.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-6 px-8 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">All Systems Secure</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium text-gray-700">99.9% Uptime</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-harmony-600" />
                <span className="text-sm font-medium text-gray-700">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default TrustIndicators;