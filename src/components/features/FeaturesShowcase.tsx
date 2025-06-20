
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  Calendar, 
  Users, 
  Heart, 
  Lock, 
  Zap, 
  BarChart3, 
  Bell, 
  Monitor,
  CheckCircle,
  Star,
  Globe,
  Activity,
  HeartHandshake,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesShowcase = () => {
  const navigate = useNavigate();

  const features = [
    {
      category: "Advanced Crisis Management",
      icon: Shield,
      color: "from-red-500 to-red-600",
      features: [
        "Real-time AI crisis detection with 95% accuracy",
        "Automatic escalation to emergency services",
        "Personalized safety planning tools",
        "24/7 crisis intervention protocols",
        "Emergency contacts integration"
      ],
      compliance: ["HIPAA Compliant", "Crisis Standards", "Emergency Protocols"]
    },
    {
      category: "AI-Powered Therapy",
      icon: Brain,
      color: "from-therapy-500 to-therapy-600",
      features: [
        "Advanced therapeutic conversation analysis",
        "Personalized intervention recommendations",
        "Evidence-based therapy protocols",
        "Multi-language support with cultural awareness",
        "Continuous learning from session outcomes"
      ],
      compliance: ["Clinical Guidelines", "Evidence-Based", "Culturally Sensitive"]
    },
    {
      category: "Smart Scheduling & Optimization",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      features: [
        "AI-optimized session timing based on mood patterns",
        "Automated medication reminders",
        "Therapy homework tracking",
        "Mindfulness intervention alerts",
        "Predictive scheduling recommendations"
      ],
      compliance: ["Treatment Adherence", "Clinical Best Practices"]
    },
    {
      category: "Professional Dashboard",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      features: [
        "Comprehensive client progress analytics",
        "AI-generated session preparation insights",
        "Treatment plan optimization suggestions",
        "Secure therapist-client communication",
        "Outcome measurement tracking"
      ],
      compliance: ["Professional Standards", "Clinical Documentation"]
    },
    {
      category: "Privacy & Security",
      icon: Lock,
      color: "from-purple-500 to-purple-600",
      features: [
        "End-to-end encryption for all data",
        "Zero-knowledge architecture",
        "HIPAA-compliant infrastructure",
        "Advanced audit trails",
        "Granular consent management"
      ],
      compliance: ["HIPAA", "SOC 2", "ISO 27001", "GDPR"]
    },
    {
      category: "Community & Support",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      features: [
        "Anonymous peer support groups",
        "Moderated community discussions",
        "Mentor-buddy matching system",
        "Family involvement features",
        "Success story sharing platform"
      ],
      compliance: ["Community Guidelines", "Peer Support Standards"]
    }
  ];

  const systemHealth = [
    { metric: "Uptime", value: "99.9%", status: "excellent" },
    { metric: "Response Time", value: "<100ms", status: "excellent" },
    { metric: "Security Score", value: "A+", status: "excellent" },
    { metric: "Compliance", value: "100%", status: "excellent" }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-therapy-900 mb-6">
            Advanced Mental Health
            <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              Technology Platform
            </span>
          </h1>
          <p className="text-xl text-therapy-600 max-w-4xl mx-auto mb-8">
            Enterprise-grade AI-powered mental health platform with comprehensive crisis management, 
            smart scheduling, and professional-grade analytics. Built for safety, compliance, and therapeutic excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Enterprise Grade
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Global Scale
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>

        {/* System Health Dashboard */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-8">Live System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {systemHealth.map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-therapy-900 mb-1">{item.value}</div>
                  <div className="text-sm text-therapy-600">{item.metric}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-therapy-900">
                      {feature.category}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feature.compliance.map((cert, certIndex) => (
                      <Badge key={certIndex} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                        <span className="text-therapy-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration & Compliance Section */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-8">
            Compliance & Integration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-therapy-900 mb-2">Security First</h3>
              <p className="text-therapy-600 text-sm">
                Military-grade encryption, zero-knowledge architecture, and comprehensive audit trails
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-therapy-900 mb-2">Clinical Excellence</h3>
              <p className="text-therapy-600 text-sm">
                Evidence-based protocols, professional standards, and continuous outcome measurement
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-therapy-900 mb-2">AI Innovation</h3>
              <p className="text-therapy-600 text-sm">
                Advanced machine learning, predictive analytics, and personalized therapeutic AI
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gradient-to-r from-therapy-700 to-calm-700 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Technical Excellence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Monitor className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
              <p className="text-sm opacity-90">24/7 system health tracking</p>
            </div>
            <div className="text-center">
              <Bell className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smart Notifications</h3>
              <p className="text-sm opacity-90">AI-powered intervention alerts</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-sm opacity-90">Predictive insights & trends</p>
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Global Infrastructure</h3>
              <p className="text-sm opacity-90">99.9% uptime guarantee</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-therapy-900 mb-6">
            Experience the Future of Mental Health Technology
          </h2>
          <p className="text-xl text-therapy-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users and healthcare professionals who trust TherapySync 
            for comprehensive, secure, and effective mental health support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              onClick={() => navigate('/dashboard')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Brain className="h-5 w-5 mr-2" />
              Explore AI Features
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/crisis-management')}
            >
              <Shield className="h-5 w-5 mr-2" />
              Crisis Management
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
