import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, FileCheck, Globe, Zap } from 'lucide-react';

const SecurityPrivacySection = () => {
  const securityFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy regulations and standards",
      details: ["End-to-end encryption", "Secure data storage", "Audit logging"]
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Zero-Knowledge Architecture",
      description: "Your data is encrypted so only you can access your information",
      details: ["Client-side encryption", "Private keys", "No data access by staff"]
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Privacy by Design",
      description: "Built from the ground up with your privacy as the core principle",
      details: ["Minimal data collection", "Anonymous analytics", "Data minimization"]
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "SOC 2 Certified",
      description: "Independently audited for security, availability, and confidentiality",
      details: ["Annual audits", "Continuous monitoring", "Industry standards"]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Compliance",
      description: "Meets international privacy standards including GDPR and CCPA",
      details: ["Data residency options", "Right to deletion", "Consent management"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Secure Infrastructure",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      details: ["AWS/Azure hosting", "DDoS protection", "24/7 monitoring"]
    }
  ];

  const certifications = [
    { name: "HIPAA", status: "Compliant" },
    { name: "SOC 2 Type II", status: "Certified" },
    { name: "GDPR", status: "Compliant" },
    { name: "ISO 27001", status: "In Progress" }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
            Security & Privacy
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Privacy is Our Priority
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Enterprise-grade security meets healthcare compliance. Your therapy sessions 
            are protected by the highest standards in the industry.
          </p>
        </div>

        {/* Certifications */}
        <div className="flex justify-center space-x-6 mb-16">
          {certifications.map((cert, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-2 border border-white/20">
                <Shield className="h-8 w-8 text-green-400 mx-auto" />
              </div>
              <div className="text-sm font-semibold text-white">{cert.name}</div>
              <div className="text-xs text-green-400">{cert.status}</div>
            </div>
          ))}
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-white/70">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Privacy Commitment */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Our Privacy Commitment</h3>
              <p className="text-white/90 text-lg leading-relaxed">
                We never sell your data, never share your information with third parties, 
                and never use your therapy sessions for training our AI models. Your privacy 
                is not just a policy—it's our fundamental promise to you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacySection;