import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Link as LinkIcon, 
  Settings, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Building,
  Globe,
  Database,
  Terminal,
  Layers,
  Workflow
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const CustomIntegrations = () => {
  const navigate = useNavigate();

  const integrationTypes = [
    {
      icon: Database,
      title: "EMR Integration",
      description: "Connect with Epic, Cerner, and other electronic medical record systems",
      features: ["HL7 FHIR compliance", "Real-time sync", "Clinical workflows", "Provider dashboards"],
      badge: "Healthcare"
    },
    {
      icon: Building,
      title: "Enterprise Systems",
      description: "Integrate with HR, wellness platforms, and employee assistance programs",
      features: ["SSO authentication", "Bulk user management", "Analytics APIs", "Custom branding"],
      badge: "Enterprise"
    },
    {
      icon: Globe,
      title: "Third-party Apps",
      description: "Connect with fitness trackers, meditation apps, and wellness platforms",
      features: ["API connectors", "Data mapping", "Real-time updates", "Cross-platform sync"],
      badge: "Wellness"
    },
    {
      icon: Workflow,
      title: "Custom Workflows",
      description: "Build automated therapy workflows and care coordination systems",
      features: ["Workflow automation", "Custom triggers", "Notification systems", "Care protocols"],
      badge: "Automation"
    }
  ];

  const technicalFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, OAuth 2.0, and comprehensive audit logging for all integrations"
    },
    {
      icon: Zap,
      title: "Real-time APIs",
      description: "WebSocket connections and real-time updates for immediate data synchronization"
    },
    {
      icon: Code,
      title: "Developer Tools",
      description: "Comprehensive SDKs, documentation, and sandbox environments for rapid development"
    },
    {
      icon: Layers,
      title: "Scalable Architecture",
      description: "Cloud-native infrastructure that scales with your organization's growth"
    }
  ];

  const integrationScenarios = [
    {
      title: "Healthcare System Integration",
      description: "Seamlessly integrate with existing healthcare infrastructure",
      icon: Building,
      benefits: ["EMR connectivity", "Clinical workflows", "Provider dashboards", "Patient portals"],
      timeline: "4-8 weeks"
    },
    {
      title: "Employee Wellness Programs",
      description: "Corporate mental health solutions with HR system integration",
      icon: Globe,
      benefits: ["SSO integration", "Bulk enrollment", "Analytics reporting", "Privacy controls"],
      timeline: "2-4 weeks"
    },
    {
      title: "Research Platform Integration",
      description: "Connect with research databases and clinical trial systems",
      icon: Database,
      benefits: ["Anonymous data sharing", "Research protocols", "Data export", "Compliance tracking"],
      timeline: "6-12 weeks"
    },
    {
      title: "Custom Application Development",
      description: "Build specialized applications using our comprehensive API platform",
      icon: Code,
      benefits: ["Full API access", "Custom UIs", "Branded experiences", "White-label solutions"],
      timeline: "8-16 weeks"
    }
  ];

  return (
    <SafeComponentWrapper name="CustomIntegrations">
      <Helmet>
        <title>Custom Integrations - TherapySync Enterprise Solutions</title>
        <meta name="description" content="Enterprise custom integrations with EMRs, HR systems, and wellness platforms. HIPAA-compliant APIs, real-time sync, and developer tools for healthcare organizations." />
        <meta name="keywords" content="custom integrations, EMR integration, enterprise API, healthcare systems, HIPAA compliant" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/30">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-therapy-100 text-therapy-700 text-sm font-medium mb-6">
              <LinkIcon className="w-4 h-4 mr-2" />
              Enterprise Integration Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold therapy-text-gradient mb-6">
              Custom Integrations
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect TherapySync with your existing healthcare systems, enterprise platforms, and custom applications. 
              HIPAA-compliant integrations with world-class developer tools and support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-3 therapy-gradient text-white hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                Start Integration Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                onClick={() => navigate('/api-docs')}
              >
                <Terminal className="mr-2 h-5 w-5" />
                View API Documentation
              </Button>
            </div>

            {/* Enterprise Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">500+</div>
                <div className="text-sm text-gray-600">Healthcare Integrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">99.9%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">50+</div>
                <div className="text-sm text-gray-600">Enterprise Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold therapy-text-gradient">24/7</div>
                <div className="text-sm text-gray-600">Support & Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Types */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Integration Capabilities</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From healthcare systems to enterprise platforms, we integrate with your existing infrastructure
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {integrationTypes.map((integration, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                        <integration.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                        {integration.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{integration.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base mb-4">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {integration.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-Grade Technology</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for healthcare with the highest security, compliance, and performance standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technicalFeatures.map((feature, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white text-center">
                  <CardHeader>
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Scenarios */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Integration Scenarios</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real-world integration examples with timelines and expected outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {integrationScenarios.map((scenario, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 mr-4`}>
                        <scenario.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{scenario.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-base mb-3">
                          {scenario.description}
                        </CardDescription>
                        <Badge variant="outline" className="text-xs">
                          Timeline: {scenario.timeline}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scenario.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Process */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Integration Process</h2>
              <p className="text-xl text-gray-600">
                Our proven process ensures successful integrations with minimal disruption to your operations
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                <p className="text-gray-600 text-sm">Assess requirements, existing systems, and integration goals</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Design</h3>
                <p className="text-gray-600 text-sm">Create detailed integration architecture and implementation plan</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Development</h3>
                <p className="text-gray-600 text-sm">Build and test integration components with rigorous quality assurance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-therapy-100 rounded-full flex items-center justify-center text-therapy-600 font-bold text-xl mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Deployment</h3>
                <p className="text-gray-600 text-sm">Seamless deployment with monitoring and ongoing support</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">Start Your Integration Project</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Connect TherapySync with your existing systems and unlock the full potential of integrated mental healthcare.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-3 bg-white text-therapy-600 hover:bg-gray-100"
                  onClick={() => navigate('/contact')}
                >
                  Discuss Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/api-docs')}
                >
                  <Code className="mr-2 h-5 w-5" />
                  Explore APIs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SafeComponentWrapper>
  );
};

export default CustomIntegrations;