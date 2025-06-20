
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Globe, Award, CheckCircle, FileText } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

const complianceStandards = [
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Full Health Insurance Portability and Accountability Act compliance for protected health information',
    badge: 'Healthcare',
    features: ['Encrypted data transmission', 'Secure data storage', 'Access controls', 'Audit logging']
  },
  {
    icon: Lock,
    title: 'GDPR Ready',
    description: 'General Data Protection Regulation compliance for European users with complete data privacy',
    badge: 'Privacy',
    features: ['Right to erasure', 'Data portability', 'Consent management', 'Privacy by design']
  },
  {
    icon: Globe,
    title: 'SOC 2 Type II',
    description: 'Service Organization Control certification for security, availability, and confidentiality',
    badge: 'Security',
    features: ['Annual audits', 'Security controls', 'Availability monitoring', 'Confidentiality measures']
  },
  {
    icon: Award,
    title: 'ISO 27001',
    description: 'International standard for information security management systems and data protection',
    badge: 'Quality',
    features: ['Risk management', 'Security policies', 'Incident response', 'Continuous improvement']
  },
  {
    icon: FileText,
    title: 'FDA Guidelines',
    description: 'Adherence to FDA digital therapeutics guidelines for mental health applications',
    badge: 'Medical',
    features: ['Clinical validation', 'Evidence-based approaches', 'Safety protocols', 'Quality assurance']
  },
  {
    icon: CheckCircle,
    title: 'WCAG 2.1 AA',
    description: 'Web Content Accessibility Guidelines compliance for inclusive user experience',
    badge: 'Accessibility',
    features: ['Screen reader support', 'Keyboard navigation', 'Color contrast', 'Alternative text']
  }
];

const certifications = [
  { name: 'HIPAA', verified: true },
  { name: 'GDPR', verified: true },
  { name: 'SOC 2', verified: true },
  { name: 'ISO 27001', verified: true },
  { name: 'WCAG 2.1', verified: true },
  { name: 'COPPA', verified: true }
];

const ComplianceSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-therapy-900 to-calm-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm filter brightness-0 invert"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Enterprise-Grade Security & Compliance
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
            Your privacy and security are our top priorities. TherapySync meets the highest industry standards 
            for healthcare, data protection, and accessibility compliance.
          </p>
          
          {/* Certification Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {certifications.map((cert, index) => (
              <Badge 
                key={index}
                className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2"
              >
                <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                {cert.name} Certified
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {complianceStandards.map((standard, index) => {
            const IconComponent = standard.icon;
            return (
              <Card 
                key={index}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-therapy-500 via-harmony-500 to-calm-500 rounded-lg group-hover:animate-swirl-breathe">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {standard.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {standard.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {standard.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {standard.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span className="text-slate-400 text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Data, Your Control</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              We believe in complete transparency about how your data is handled, stored, and protected.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-therapy-400 mb-2">256-bit</div>
              <div className="text-sm text-slate-400">Encryption Standard</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-therapy-400 mb-2">99.9%</div>
              <div className="text-sm text-slate-400">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-therapy-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Security Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-therapy-400 mb-2">Zero</div>
              <div className="text-sm text-slate-400">Data Breaches</div>
            </div>
          </div>
        </div>

        {/* Contact for Compliance */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            Need compliance documentation or have security questions? 
            <br />
            Contact our compliance team at{' '}
            <span className="text-therapy-400 font-medium">compliance@therapysync.ai</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
