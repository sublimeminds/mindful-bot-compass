
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Award, Users, Brain, Heart } from 'lucide-react';

const trustFactors = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your privacy is protected with the highest healthcare security standards",
    badge: "Verified"
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All conversations are encrypted and stored securely",
    badge: "256-bit SSL"
  },
  {
    icon: Award,
    title: "Evidence-Based Approaches",
    description: "Built on clinically proven therapeutic methodologies",
    badge: "Research-Backed"
  },
  {
    icon: Users,
    title: "Expert-Supervised",
    description: "AI models developed with licensed mental health professionals",
    badge: "Professional Team"
  },
  {
    icon: Brain,
    title: "AI Safety Certified",
    description: "Regular audits ensure safe and effective AI behavior",
    badge: "Continuously Monitored"
  },
  {
    icon: Heart,
    title: "Crisis Detection",
    description: "Advanced monitoring with immediate human support when needed",
    badge: "24/7 Safety Net"
  }
];

const certifications = [
  { name: "HIPAA", description: "Healthcare Privacy" },
  { name: "SOC 2", description: "Security Compliance" },
  { name: "ISO 27001", description: "Information Security" },
  { name: "GDPR", description: "Data Protection" }
];

const TrustSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Safety & Privacy Come First
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We understand that mental health is deeply personal. That's why we've built MindfulAI 
            with the highest standards of security, privacy, and clinical excellence.
          </p>
        </div>

        {/* Trust factors grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {trustFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-therapy-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-therapy-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{factor.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {factor.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-8">Certified & Compliant</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mb-2 border">
                  <span className="font-bold text-sm text-therapy-600">{cert.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{cert.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
