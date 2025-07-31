import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Cpu, 
  Database, 
  Shield, 
  Zap, 
  Globe,
  Code,
  Lock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Network,
  Eye,
  MessageSquare
} from 'lucide-react';

const TechnologySection = () => {
  const [activeTab, setActiveTab] = useState('ai-engine');

  const techSpecs = [
    {
      id: 'ai-engine',
      title: 'Neural Therapy Engine',
      icon: Brain,
      gradient: 'from-therapy-500 to-calm-500',
      description: 'Advanced language model trained on 50+ therapeutic approaches',
      features: [
        'Transformer-based architecture with 175B+ parameters',
        'Fine-tuned on clinical therapy transcripts',
        'Multi-modal understanding (text, voice, emotion)',
        'Real-time response optimization',
        'Cultural context awareness'
      ]
    },
    {
      id: 'security',
      title: 'Security Infrastructure',
      icon: Shield,
      gradient: 'from-harmony-500 to-therapy-500',
      description: 'Enterprise-grade security protecting your most sensitive conversations',
      features: [
        'End-to-end AES-256 encryption',
        'Zero-knowledge architecture',
        'HIPAA & GDPR compliance',
        'SOC 2 Type II certified',
        'Federated learning protocols'
      ]
    },
    {
      id: 'personalization',
      title: 'Personalization Engine',
      icon: Cpu,
      gradient: 'from-calm-500 to-harmony-500',
      description: 'AI that learns and adapts to your unique therapeutic needs',
      features: [
        'Dynamic personality modeling',
        'Therapy approach optimization',
        'Progress tracking algorithms',
        'Predictive intervention triggers',
        'Cross-session memory synthesis'
      ]
    },
    {
      id: 'infrastructure',
      title: 'Global Infrastructure',
      icon: Globe,
      gradient: 'from-balance-500 to-therapy-500',
      description: 'Worldwide deployment ensuring low-latency, high-availability therapy',
      features: [
        '99.99% uptime guarantee',
        'Edge computing deployment',
        'Multi-region data residency',
        'Auto-scaling architecture',
        'Real-time monitoring'
      ]
    }
  ];

  const metrics = [
    {
      value: '<100ms',
      label: 'Response Time',
      description: 'Near-instant therapeutic responses'
    },
    {
      value: '99.99%',
      label: 'Uptime',
      description: 'Always available when you need support'
    },
    {
      value: '256-bit',
      label: 'Encryption',
      description: 'Military-grade conversation security'
    },
    {
      value: '150+',
      label: 'Data Centers',
      description: 'Global infrastructure for low latency'
    }
  ];

  const activeSpec = techSpecs.find(spec => spec.id === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Technology Hero */}
      <div className="text-center mb-20">
        <Badge variant="secondary" className="mb-8 bg-white text-foreground border px-6 py-3 text-base font-medium shadow-lg">
          <Code className="w-5 h-5 mr-2" />
          Technology Deep Dive
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
          <span className="block">Powered by</span>
          <span className="bg-gradient-to-r from-therapy-300 via-harmony-300 to-calm-300 bg-clip-text text-transparent">
            Advanced AI
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          Behind every therapeutic conversation is cutting-edge technology designed to understand, 
          protect, and personalize your mental health journey.
        </p>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-white font-semibold mb-1">{metric.label}</div>
              <div className="text-white/70 text-sm">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Deep Dive */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Under the Hood
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explore the advanced systems that make therapeutic AI possible.
          </p>
        </div>

        {/* Technology Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {techSpecs.map((spec) => (
            <Button
              key={spec.id}
              variant={activeTab === spec.id ? "default" : "outline"}
              onClick={() => setActiveTab(spec.id)}
              className={`flex items-center space-x-2 ${
                activeTab === spec.id 
                  ? 'bg-white text-therapy-600 hover:bg-white/90' 
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <spec.icon className="h-4 w-4" />
              <span>{spec.title}</span>
            </Button>
          ))}
        </div>

        {/* Active Technology Detail */}
        {activeSpec && (
          <Card className="bg-white border-therapy-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${activeSpec.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <activeSpec.icon className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">{activeSpec.title}</CardTitle>
              <p className="text-muted-foreground text-lg">{activeSpec.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSpec.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-therapy-50 rounded-lg border border-therapy-100">
                    <CheckCircle className="h-5 w-5 text-therapy-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Training Process */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            How We Train Therapeutic AI
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            A multi-stage process combining clinical expertise with cutting-edge machine learning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white border-therapy-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-harmony-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Clinical Data Training</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Training on anonymized therapy sessions from licensed professionals across 40+ therapeutic modalities.
              </p>
              <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
                10M+ Sessions
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-therapy-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Expert Review</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Licensed therapists review and validate AI responses to ensure clinical accuracy and safety.
              </p>
              <Badge variant="outline" className="bg-harmony-50 text-harmony-700 border-harmony-200">
                500+ Therapists
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-therapy-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-therapy-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Continuous Learning</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Real-time feedback loops improve responses while maintaining strict privacy protections.
              </p>
              <Badge variant="outline" className="bg-calm-50 text-calm-700 border-calm-200">
                24/7 Updates
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-3xl p-12 border border-therapy-200 shadow-xl text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Experience the Technology
        </h3>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          See how advanced AI technology translates into meaningful therapeutic conversations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700 text-white px-8 py-4 text-lg font-medium group"
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            Try a Demo Session
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg"
          >
            <Network className="mr-3 h-5 w-5" />
            View Architecture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnologySection;