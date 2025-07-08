import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Cpu,
  Database,
  Shield,
  Zap,
  BarChart,
  MessageSquare,
  HeartHandshake,
  Clock,
  Globe,
  TrendingUp,
  Activity,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Lock,
  Network,
  Gauge,
  FileText,
  Lightbulb,
  Layers,
  Router,
  Server,
  HardDrive,
  CircuitBoard,
  Workflow
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIArchitecture = () => {
  const navigate = useNavigate();

  const aiModels = [
    {
      name: "ChatGPT-4 Turbo",
      usage: "Primary therapeutic conversations",
      capabilities: ["Natural conversation", "Emotional understanding", "Crisis detection", "Therapy techniques"],
      performance: 96,
      color: "from-therapy-500 to-therapy-600"
    },
    {
      name: "Claude (Anthropic)",
      usage: "Deep analysis & ethical reasoning",
      capabilities: ["Complex analysis", "Ethical reasoning", "Long-term planning", "Cultural sensitivity"],
      performance: 94,
      color: "from-harmony-500 to-harmony-600"
    },
    {
      name: "Multi-Model Router",
      usage: "Intelligent model selection",
      capabilities: ["Automatic routing", "Context analysis", "Performance optimization", "Fallback handling"],
      performance: 98,
      color: "from-flow-500 to-flow-600"
    }
  ];

  const architectureFeatures = [
    {
      icon: Brain,
      title: "Therapeutic Memory System",
      description: "Advanced memory architecture that maintains context across sessions while respecting privacy boundaries",
      details: [
        "Persistent conversation memory across sessions",
        "Emotional state tracking and analysis",
        "Progress milestone recognition",
        "Therapeutic goal alignment",
        "Privacy-first data handling"
      ],
      performance: 97
    },
    {
      icon: AlertTriangle,
      title: "Crisis Detection Engine",
      description: "Real-time monitoring system that identifies crisis situations and triggers immediate intervention protocols",
      details: [
        "Real-time sentiment analysis",
        "Suicide risk assessment algorithms",
        "Emergency contact activation",
        "Professional intervention routing",
        "24/7 monitoring capabilities"
      ],
      performance: 99
    },
    {
      icon: Target,
      title: "Dynamic Therapy Plans",
      description: "AI-generated therapy plans that adapt in real-time based on progress, mood, and therapeutic goals",
      details: [
        "Personalized treatment protocols",
        "Evidence-based technique selection",
        "Progress-driven adaptations",
        "Multi-modal therapy integration",
        "Outcome prediction modeling"
      ],
      performance: 95
    },
    {
      icon: Globe,
      title: "Cultural AI Integration",
      description: "Culturally-aware AI that adapts therapeutic approaches based on cultural background and context",
      details: [
        "29 language support",
        "Cultural context understanding",
        "Localized therapy approaches",
        "Religious/spiritual considerations",
        "Cross-cultural communication"
      ],
      performance: 92
    }
  ];

  const dataArchitecture = [
    {
      layer: "Application Layer",
      components: ["React Frontend", "Real-time Chat", "Voice Processing", "Notification System"],
      security: "End-to-end encryption",
      color: "from-therapy-500 to-calm-500"
    },
    {
      layer: "AI Processing Layer",
      components: ["Multi-Model Router", "Context Manager", "Memory Service", "Crisis Detection"],
      security: "Secure API gateways",
      color: "from-harmony-500 to-balance-500"
    },
    {
      layer: "Data Storage Layer",
      components: ["Encrypted Database", "Session Storage", "Analytics Warehouse", "Backup Systems"],
      security: "AES-256 encryption",
      color: "from-flow-500 to-therapy-500"
    },
    {
      layer: "Infrastructure Layer",
      components: ["Load Balancers", "CDN", "Monitoring", "Compliance Tools"],
      security: "Zero-trust architecture",
      color: "from-calm-500 to-harmony-500"
    }
  ];

  const performanceMetrics = [
    { metric: "Response Time", value: "< 500ms", icon: Zap },
    { metric: "Uptime", value: "99.9%", icon: CheckCircle },
    { metric: "AI Accuracy", value: "96.7%", icon: Target },
    { metric: "Crisis Detection", value: "< 3 seconds", icon: AlertTriangle },
    { metric: "Languages", value: "29", icon: Globe },
    { metric: "Daily Users", value: "50K+", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-25 to-calm-25">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-therapy-600 to-calm-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold">Advanced AI Architecture</h1>
            </div>
            <p className="text-xl text-therapy-100 mb-8 leading-relaxed">
              Discover the sophisticated AI technology powering TherapySync's revolutionary mental health platform. 
              Our multi-model architecture combines ChatGPT and Anthropic's Claude to deliver the most advanced 
              therapeutic AI experience available.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Multi-Model AI Router</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                <span>Real-time Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Performance Metrics Grid */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            System Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 border-therapy-100">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-therapy-700 mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.metric}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Models Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Multi-Model AI Integration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiModels.map((model, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${model.color} text-white border-0`}>
                      {model.performance}% Efficient
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{model.usage}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span>{model.performance}%</span>
                      </div>
                      <Progress value={model.performance} className="h-2" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Capabilities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((capability, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture Features */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Core AI Systems
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {architectureFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">System Reliability</span>
                        <span className="text-therapy-600">{feature.performance}%</span>
                      </div>
                      <Progress value={feature.performance} className="h-2" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {feature.details.map((detail, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Architecture */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Secure Data Architecture
          </h2>
          <div className="space-y-6">
            {dataArchitecture.map((layer, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${layer.color} rounded-xl flex items-center justify-center`}>
                        <Layers className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{layer.layer}</h3>
                        <p className="text-sm text-gray-600">Security: {layer.security}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map((component, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Router className="h-5 w-5 mr-2 text-therapy-500" />
                  AI Model Routing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CircuitBoard className="h-4 w-4 mr-2 text-therapy-500" />
                    Intelligent context analysis
                  </li>
                  <li className="flex items-center">
                    <Gauge className="h-4 w-4 mr-2 text-therapy-500" />
                    Sub-100ms routing decisions
                  </li>
                  <li className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-therapy-500" />
                    Dynamic load balancing
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-therapy-500" />
                    Automatic fallback systems
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-therapy-500" />
                  Memory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-therapy-500" />
                    Distributed memory architecture
                  </li>
                  <li className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 text-therapy-500" />
                    Encrypted memory storage
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-therapy-500" />
                    Real-time context updates
                  </li>
                  <li className="flex items-center">
                    <Workflow className="h-4 w-4 mr-2 text-therapy-500" />
                    Automated memory pruning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-therapy-500" />
                  Crisis Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Real-time sentiment analysis
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-therapy-500" />
                    ML-powered risk assessment
                  </li>
                  <li className="flex items-center">
                    <Network className="h-4 w-4 mr-2 text-therapy-500" />
                    Instant alert systems
                  </li>
                  <li className="flex items-center">
                    <HeartHandshake className="h-4 w-4 mr-2 text-therapy-500" />
                    Professional escalation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comparison Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Industry Comparison
          </h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-therapy-50 to-calm-50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-therapy-600">TherapySync</th>
                      <th className="text-center p-4 font-semibold text-gray-500">Competitor A</th>
                      <th className="text-center p-4 font-semibold text-gray-500">Competitor B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Multi-Model AI</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Single Model</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">Single Model</span></td>
                    </tr>
                    <tr className="border-b bg-gray-25">
                      <td className="p-4 font-medium">Crisis Detection</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Basic</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">Manual</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Cultural AI</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Limited</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">None</span></td>
                    </tr>
                    <tr className="border-b bg-gray-25">
                      <td className="p-4 font-medium">Memory Persistence</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Session Only</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">None</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Response Time</td>
                      <td className="text-center p-4"><span className="text-therapy-600 font-semibold">&lt; 500ms</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">2-3s</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">3-5s</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 therapy-text-gradient">
              Experience the Future of AI Therapy
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Ready to experience the most advanced AI therapy platform? Start your journey with our 
              intelligent AI that understands, adapts, and grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/therapy-chat')}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-3"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start AI Therapy Session
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/ai-hub')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <Brain className="h-5 w-5 mr-2" />
                Explore AI Hub
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/analytics')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <BarChart className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIArchitecture;