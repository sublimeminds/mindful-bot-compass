import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle, 
  Server, 
  Globe, 
  Key, 
  FileCheck,
  Award,
  Zap,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SecurityShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    encryption: 0,
    compliance: 0,
    uptime: 0,
    audits: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate progress bars
    const timer = setTimeout(() => {
      setAnimatedValues({
        encryption: 100,
        compliance: 99.9,
        uptime: 99.99,
        audits: 100
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All conversations encrypted with AES-256",
      metric: "256-bit",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Full healthcare data protection",
      metric: "100%",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Eye,
      title: "Zero Knowledge",
      description: "We cannot read your conversations",
      metric: "0% Access",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "SOC 2 Type II certified servers",
      metric: "99.99%",
      color: "from-orange-500 to-red-500"
    }
  ];

  const certifications = [
    { name: "HIPAA", status: "Certified", icon: FileCheck },
    { name: "SOC 2 Type II", status: "Certified", icon: Award },
    { name: "ISO 27001", status: "In Progress", icon: Globe },
    { name: "GDPR", status: "Compliant", icon: Shield }
  ];

  const securityMetrics = [
    { label: "Data Encryption", value: animatedValues.encryption, icon: Lock },
    { label: "Compliance Score", value: animatedValues.compliance, icon: CheckCircle },
    { label: "System Uptime", value: animatedValues.uptime, icon: Zap },
    { label: "Security Audits", value: animatedValues.audits, icon: Eye }
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-light mb-6">
            Your privacy is our
            <span className="block font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              highest priority
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade security meets compassionate care. Every conversation is protected 
            with military-grade encryption and zero-knowledge architecture.
          </p>
        </div>

        {/* Security Metrics Dashboard */}
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {securityMetrics.map((metric, index) => (
            <Card key={metric.label} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {metric.value}%
                </div>
                <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
                <Progress 
                  value={metric.value} 
                  className="mt-3 h-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Features Grid */}
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {securityFeatures.map((feature, index) => (
            <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-r",
                    feature.color,
                    "group-hover:scale-110 transition-transform"
                  )}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                    {feature.metric}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-3 text-foreground">{feature.title}</CardTitle>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className={cn(
          "transition-all duration-1000 delay-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl lg:text-3xl text-foreground">
                Industry Certifications & Compliance
              </CardTitle>
              <p className="text-muted-foreground">
                Regularly audited and certified by leading security organizations
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications.map((cert, index) => (
                  <div key={cert.name} className="text-center group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-border/50">
                      <cert.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground mb-1">{cert.name}</div>
                    <Badge 
                      variant={cert.status === "Certified" ? "default" : cert.status === "Compliant" ? "secondary" : "outline"}
                      className={cert.status === "Certified" ? "bg-green-100 text-green-800 border-green-200" : ""}
                    >
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Security Status */}
        <div className={cn(
          "mt-16 transition-all duration-1000 delay-800",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Card className="bg-white/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Real-time Security Status</span>
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: Just now</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">All systems operational</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">No security incidents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Encryption active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SecurityShowcase;