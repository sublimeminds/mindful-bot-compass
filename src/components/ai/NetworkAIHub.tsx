import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Activity, 
  Cpu, 
  Database, 
  Cloud,
  Sparkles,
  ArrowRight,
  Play,
  BarChart3,
  Lock,
  Heart,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AIHubIcon from '@/components/icons/custom/AIHubIcon';

const NetworkAIHub = () => {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [connectionPulse, setConnectionPulse] = useState(0);

  // AI System Nodes
  const aiNodes = [
    {
      id: 'emotional-ai',
      icon: Heart,
      title: 'Emotional Intelligence',
      description: 'Real-time emotion processing and empathy modeling',
      position: { x: 20, y: 30 },
      color: 'from-rose-500 to-pink-600',
      connections: ['therapy-core', 'crisis-prevention', 'personalization'],
      metrics: { accuracy: '98%', speed: '50ms', languages: '29' }
    },
    {
      id: 'therapy-core',
      icon: Brain,
      title: 'Therapy AI Core',
      description: 'Central therapeutic intelligence and decision making',
      position: { x: 50, y: 50 },
      color: 'from-blue-600 to-indigo-700',
      connections: ['emotional-ai', 'crisis-prevention', 'personalization', 'cultural-ai', 'analytics'],
      metrics: { sessions: '1M+', satisfaction: '94%', uptime: '99.9%' },
      isCore: true
    },
    {
      id: 'crisis-prevention',
      icon: Shield,
      title: 'Crisis Prevention',
      description: 'Predictive risk assessment and early intervention',
      position: { x: 80, y: 30 },
      color: 'from-red-500 to-orange-600',
      connections: ['therapy-core', 'emotional-ai', 'analytics'],
      metrics: { prevention: '94%', response: '<30s', coverage: '24/7' }
    },
    {
      id: 'personalization',
      icon: Target,
      title: 'Personalization Engine',
      description: 'Adaptive therapy approaches and individual customization',
      position: { x: 20, y: 70 },
      color: 'from-purple-500 to-violet-600',
      connections: ['therapy-core', 'emotional-ai', 'cultural-ai'],
      metrics: { adaptation: '99%', profiles: '500K+', accuracy: '96%' }
    },
    {
      id: 'cultural-ai',
      icon: Globe,
      title: 'Cultural Intelligence',
      description: 'Cross-cultural competency and localization',
      position: { x: 80, y: 70 },
      color: 'from-green-500 to-emerald-600',
      connections: ['therapy-core', 'personalization', 'analytics'],
      metrics: { cultures: '150+', languages: '29', accuracy: '97%' }
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Intelligence Analytics',
      description: 'Pattern recognition and therapeutic insights',
      position: { x: 50, y: 20 },
      color: 'from-cyan-500 to-blue-600',
      connections: ['therapy-core', 'crisis-prevention', 'cultural-ai'],
      metrics: { insights: '10M+', patterns: '1000+', accuracy: '95%' }
    }
  ];

  const infrastructureFeatures = [
    {
      icon: Cloud,
      title: 'Distributed Intelligence',
      description: 'Global AI network with edge computing capabilities'
    },
    {
      icon: Database,
      title: 'Federated Learning',
      description: 'Privacy-preserving collaborative AI improvement'
    },
    {
      icon: Lock,
      title: 'Zero-Trust Security',
      description: 'End-to-end encryption with quantum-safe protocols'
    },
    {
      icon: Activity,
      title: 'Real-Time Sync',
      description: 'Instant synchronization across all AI systems'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getConnectionPath = (from: any, to: any) => {
    const fromX = from.position.x;
    const fromY = from.position.y;
    const toX = to.position.x;
    const toY = to.position.y;
    
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    return `M ${fromX} ${fromY} Q ${midX + 10} ${midY - 10} ${toX} ${toY}`;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-blue-50/20 to-indigo-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6 border border-blue-200/50"
          >
            <Network className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium">AI Ecosystem Control Center</span>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Interconnected AI Intelligence
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            See how our AI systems work together in perfect harmony, creating an intelligent ecosystem 
            that delivers coordinated, comprehensive therapeutic support.
          </motion.p>
        </div>

        {/* Network Visualization */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Interactive Network Diagram */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 overflow-hidden"
            >
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[size:20px_20px]" />
              </div>

              {/* SVG Network */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Connections */}
                {aiNodes.map((node) => 
                  node.connections.map((connectionId) => {
                    const targetNode = aiNodes.find(n => n.id === connectionId);
                    if (!targetNode) return null;
                    
                    return (
                      <motion.path
                        key={`${node.id}-${connectionId}`}
                        d={getConnectionPath(node, targetNode)}
                        stroke="url(#connectionGradient)"
                        strokeWidth="0.5"
                        fill="none"
                        strokeDasharray="2,2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: Math.random() }}
                      />
                    );
                  })
                )}

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* AI Nodes */}
              {aiNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute cursor-pointer group"
                  style={{ 
                    left: `${node.position.x}%`, 
                    top: `${node.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setActiveNode(index)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div className={`
                    w-12 h-12 rounded-full bg-gradient-to-r ${node.color} 
                    flex items-center justify-center shadow-lg
                    ${node.isCore ? 'ring-4 ring-white/30 w-16 h-16' : ''}
                    ${activeNode === index ? 'scale-125' : ''}
                    transition-all duration-300
                  `}>
                    <node.icon className={`${node.isCore ? 'h-8 w-8' : 'h-6 w-6'} text-white`} />
                  </div>
                  
                  {/* Pulse Animation */}
                  <div className={`
                    absolute inset-0 rounded-full bg-gradient-to-r ${node.color} 
                    animate-ping opacity-20
                    ${activeNode === index ? 'opacity-40' : ''}
                  `} />

                  {/* Tooltip */}
                  {activeNode === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border p-3 z-10"
                    >
                      <h4 className="font-semibold text-sm mb-1">{node.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{node.description}</p>
                      <div className="space-y-1">
                        {Object.entries(node.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="capitalize">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* System Details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <AIHubIcon className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">AI Ecosystem Overview</h3>
                <p className="text-muted-foreground">Coordinated intelligence for optimal therapy</p>
              </div>
            </motion.div>

            {aiNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`
                  transition-all duration-300 cursor-pointer
                  ${activeNode === index 
                    ? 'border-2 border-blue-300 shadow-lg bg-gradient-to-r from-white to-blue-50/50' 
                    : 'border border-border hover:border-blue-200 hover:shadow-md bg-white/80'
                  }
                `}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${node.color} flex items-center justify-center shadow-sm`}>
                        <node.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{node.title}</h4>
                        <p className="text-xs text-muted-foreground">{node.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-blue-600">
                          {Object.values(node.metrics)[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Object.keys(node.metrics)[0]}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Infrastructure Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Global AI Infrastructure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {infrastructureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-white/60 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Experience Coordinated AI Intelligence</h3>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              See how our interconnected AI systems work together to provide personalized, intelligent therapy support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Explore AI Hub
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                <Network className="mr-2 h-5 w-5" />
                View Architecture
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NetworkAIHub;