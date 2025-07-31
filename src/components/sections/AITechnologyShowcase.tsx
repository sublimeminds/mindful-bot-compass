import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Activity, 
  Cpu, 
  Database, 
  Network,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const AITechnologyShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const technologies = [
    {
      icon: Brain,
      title: 'Neural Language Models',
      description: 'Advanced GPT-4 architecture fine-tuned for therapeutic conversations',
      metrics: '99.7% accuracy',
      status: 'Active',
      color: 'from-therapy-500 to-therapy-600',
      demo: 'language-model'
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Zero-knowledge encryption with on-device processing capabilities',
      metrics: 'Military-grade',
      status: 'Secured',
      color: 'from-calm-500 to-calm-600',
      demo: 'privacy'
    },
    {
      icon: Activity,
      title: 'Emotional Intelligence',
      description: 'Real-time emotion detection and contextual response adaptation',
      metrics: '94% accuracy',
      status: 'Learning',
      color: 'from-harmony-500 to-harmony-600',
      demo: 'emotion'
    },
    {
      icon: Globe,
      title: 'Cultural Adaptation',
      description: 'Dynamic cultural context understanding across 150+ regions',
      metrics: '150+ cultures',
      status: 'Global',
      color: 'from-balance-500 to-balance-600',
      demo: 'cultural'
    },
    {
      icon: Cpu,
      title: 'Edge Computing',
      description: 'Low-latency processing with distributed AI inference nodes',
      metrics: '<50ms response',
      status: 'Optimized',
      color: 'from-flow-500 to-flow-600',
      demo: 'performance'
    },
    {
      icon: Database,
      title: 'Knowledge Graph',
      description: 'Comprehensive therapy knowledge base with continuous learning',
      metrics: '1M+ data points',
      status: 'Growing',
      color: 'from-mindful-500 to-mindful-600',
      demo: 'knowledge'
    }
  ];

  const liveMetrics = [
    { label: 'Active Sessions', value: '12,847', trend: '+23%', icon: Activity },
    { label: 'Response Time', value: '32ms', trend: '-8%', icon: Zap },
    { label: 'Model Accuracy', value: '99.7%', trend: '+0.3%', icon: TrendingUp },
    { label: 'Global Nodes', value: '47', trend: '+4', icon: Network }
  ];

  return (
    <SafeComponentWrapper name="AITechnologyShowcase">
      <div className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-therapy-500 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-calm-500 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-3 text-base font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Advanced AI Technology
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Science Behind
              <span className="block bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
                Intelligent Therapy
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our breakthrough AI combines the latest advances in natural language processing, 
              emotional intelligence, and therapeutic science to deliver personalized mental health support.
            </p>
          </div>

          {/* Live Metrics Dashboard */}
          <div className="mb-16 bg-gradient-to-r from-gray-50 to-therapy-50/30 rounded-3xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Live AI Performance</h3>
              <p className="text-gray-600">Real-time metrics from our global AI infrastructure</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {liveMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className="h-6 w-6 text-therapy-600" />
                    <span className={`text-sm font-medium ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                      {metric.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {technologies.map((tech, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-therapy-300 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${tech.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <tech.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-white border-gray-300 text-gray-700 hover:border-therapy-400"
                    >
                      {tech.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tech.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{tech.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Performance: </span>
                      <span className="font-semibold text-therapy-600">{tech.metrics}</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 group/btn"
                      onClick={() => setActiveDemo(tech.demo)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Demo
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technical Specifications */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4">Technical Architecture</h3>
                <p className="text-gray-300 text-lg">
                  Built on enterprise-grade infrastructure with cutting-edge AI capabilities
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-therapy-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">175B Parameters</h4>
                  <p className="text-gray-400">Advanced neural network with therapeutic fine-tuning</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Zero-Trust Security</h4>
                  <p className="text-gray-400">End-to-end encryption with HIPAA compliance</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Global Scale</h4>
                  <p className="text-gray-400">Distributed across 47 regions worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default AITechnologyShowcase;