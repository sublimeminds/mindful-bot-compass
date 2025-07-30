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
    <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Security & Privacy
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Your Privacy is Our Priority
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade security meets healthcare compliance. Your therapy sessions 
            are protected by the highest standards in the industry.
          </p>
        </div>

        {/* Certifications - Mobile: 2x2 grid, Desktop: horizontal */}
        <div className="grid grid-cols-2 lg:flex lg:justify-center lg:space-x-6 gap-4 lg:gap-0">
          {certifications.map((cert, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 mb-2 border border-white/20">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">{cert.name}</div>
              <div className="text-xs text-green-400">{cert.status}</div>
            </div>
          ))}
        </div>

        {/* Security Features Grid - Mobile: Single column, Desktop: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="p-2 sm:p-3 bg-green-500/20 rounded-xl text-green-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-base sm:text-lg break-words">{feature.title}</h3>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-white/70">{detail}</span>
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