import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Heart, CheckCircle } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import SecurityShieldIcon from '@/components/icons/custom/SecurityShieldIcon';
import securityIconsImage from '@/assets/security-icons.png';

const CompactSecuritySection = () => {
  const securityPillars = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your conversations remain completely private with zero-knowledge architecture",
      metric: "100%",
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: Lock,
      title: "Military-Grade Encryption", 
      description: "AES-256 encryption protects every word you share",
      metric: "256-bit",
      color: "from-harmony-500 to-therapy-500"
    },
    {
      icon: Eye,
      title: "HIPAA Compliant",
      description: "Full healthcare data protection standards met and exceeded",
      metric: "Certified",
      color: "from-calm-500 to-balance-500"
    },
    {
      icon: Heart,
      title: "Trust & Safety",
      description: "24/7 monitoring with crisis detection and immediate support",
      metric: "24/7",
      color: "from-balance-500 to-harmony-500"
    }
  ];

  const trustIndicators = [
    { label: "SOC 2 Type II", status: "Certified" },
    { label: "HIPAA", status: "Compliant" },
    { label: "GDPR", status: "Ready" },
    { label: "Zero Downtime", status: "99.99%" }
  ];

  return (
    <SafeComponentWrapper name="CompactSecuritySection">
      <div className="py-20 px-4 bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise-Grade Security
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Privacy is
              <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Sacred to Us
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We've built the most secure therapy platform on Earth. Your mental health journey 
              deserves the highest level of protection.
            </p>
          </div>

          {/* Main Security Showcase */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            
            {/* Central Security Visual */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative">
                <SecurityShieldIcon size={200} className="drop-shadow-2xl" />
                
                {/* Floating security indicators */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <Lock className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Security Features */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {securityPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${pillar.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <pillar.icon className="w-7 h-7 text-white" />
                        </div>
                        <Badge className="bg-therapy-50 text-therapy-700 border-therapy-200 font-semibold">
                          {pillar.metric}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Indicators Bar */}
          <div className="bg-white rounded-2xl p-8 border border-therapy-100 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Security Certifications</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">All systems secure</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustIndicators.map((indicator, index) => (
                <div key={indicator.label} className="text-center">
                  <div className="text-2xl font-bold text-therapy-600 mb-1">{indicator.status}</div>
                  <div className="text-sm text-muted-foreground">{indicator.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Promise */}
          <div className="mt-16 text-center bg-gradient-to-r from-therapy-600 to-calm-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">Our Security Promise</h3>
              <p className="text-xl mb-6 opacity-90 leading-relaxed">
                "We treat your mental health data with the same care we'd want for our own family. 
                Every conversation is encrypted, every session is private, and every interaction is protected."
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm opacity-75">
                <span>🔒 End-to-End Encrypted</span>
                <span>•</span>
                <span>🛡️ Zero Knowledge Architecture</span>
                <span>•</span>
                <span>⚡ Real-time Security Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default CompactSecuritySection;