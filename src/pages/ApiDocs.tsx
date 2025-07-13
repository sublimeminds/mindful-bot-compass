import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Terminal,
  Box,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const ApiDocs = () => {
  const navigate = useNavigate();

  const apiFeatures = [
    {
      icon: Database,
      title: "REST API",
      description: "Complete REST API with OAuth 2.0 authentication for secure data access",
      endpoints: "120+ endpoints",
      badge: "Core"
    },
    {
      icon: Zap,
      title: "Real-time Webhooks",
      description: "Event-driven notifications for therapy sessions, mood changes, and alerts",
      endpoints: "15+ events",
      badge: "Pro"
    },
    {
      icon: Code,
      title: "SDKs & Libraries",
      description: "Official SDKs for Python, JavaScript, PHP, and React Native",
      endpoints: "4 languages",
      badge: "Popular"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "HIPAA-compliant API with encrypted data transmission and audit logs",
      endpoints: "Bank-grade",
      badge: "Enterprise"
    }
  ];

  const useCases = [
    {
      icon: Smartphone,
      title: "Mobile App Integration",
      description: "Build custom mobile apps with full TherapySync functionality",
      examples: ["Patient portals", "Provider apps", "Family dashboards"]
    },
    {
      icon: Globe,
      title: "Healthcare System Integration",
      description: "Connect with EMRs, practice management systems, and health platforms",
      examples: ["Epic integration", "Cerner connectivity", "Custom EMRs"]
    },
    {
      icon: Settings,
      title: "Workflow Automation",
      description: "Automate therapy workflows and create custom business processes",
      examples: ["Appointment scheduling", "Progress reporting", "Crisis workflows"]
    },
    {
      icon: Box,
      title: "Data Analytics",
      description: "Extract therapy data for research, reporting, and business intelligence",
      examples: ["Custom dashboards", "Research studies", "Population health"]
    }
  ];

  return (
    <SafeComponentWrapper name="ApiDocs">
      <Helmet>
        <title>API Documentation - TherapySync Developer Resources</title>
        <meta name="description" content="Comprehensive API documentation for TherapySync AI therapy platform. REST APIs, webhooks, SDKs for healthcare integration and custom applications." />
        <meta name="keywords" content="API documentation, healthcare API, therapy platform API, REST API, webhooks, SDKs" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-therapy-100 text-therapy-700 text-sm font-medium mb-6">
              <Code className="w-4 h-4 mr-2" />
              Developer-First Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Powerful API Platform
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build next-generation mental health applications with our comprehensive API. 
              HIPAA-compliant, enterprise-ready, and designed for healthcare innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Get API Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                onClick={() => navigate('/contact')}
              >
                <Terminal className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">120+</div>
                <div className="text-sm text-gray-600">API Endpoints</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">4</div>
                <div className="text-sm text-gray-600">Official SDKs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">24/7</div>
                <div className="text-sm text-gray-600">Developer Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Complete API Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to build, integrate, and scale mental health applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {apiFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                          {feature.badge}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium text-therapy-600">
                      {feature.endpoints}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Integration Use Cases</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how healthcare organizations use our API to transform mental health care
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardHeader>
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 mr-4`}>
                        <useCase.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{useCase.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-base">
                          {useCase.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Build?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of developers building the future of mental health technology
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-3 bg-white text-therapy-600 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Start Building Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/contact')}
                >
                  <LinkIcon className="mr-2 h-5 w-5" />
                  Talk to Developer Relations
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default ApiDocs;