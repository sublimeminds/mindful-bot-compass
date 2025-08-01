import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Globe, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Play,
  Activity,
  Network,
  TrendingUp,
  Users,
  Lock,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InteractiveAITechnology = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const technologies = [
    {
      icon: Brain,
      title: "Emotional Intelligence AI",
      subtitle: "Advanced Emotion Recognition",
      description: "Our AI processes micro-expressions, voice patterns, and linguistic cues to understand your emotional state with 98% accuracy.",
      features: ["Real-time emotion analysis", "Contextual understanding", "Adaptive responses", "Empathy modeling"],
      color: "from-blue-500 to-purple-600",
      demo: "Watch live emotion detection",
      stats: { accuracy: "98%", speed: "<100ms", languages: "29+" }
    },
    {
      icon: Shield,
      title: "Crisis Prevention System",
      subtitle: "24/7 Safety Monitoring",
      description: "Proactive risk assessment using predictive analytics to identify and prevent mental health crises before they escalate.",
      features: ["Predictive risk modeling", "Early warning system", "Emergency intervention", "Care coordination"],
      color: "from-red-500 to-orange-500",
      demo: "See crisis prevention in action",
      stats: { prevention: "94%", response: "<30s", availability: "24/7" }
    },
    {
      icon: Globe,
      title: "Cultural Intelligence",
      subtitle: "Culturally Adaptive Therapy",
      description: "AI that understands and adapts to cultural nuances, ensuring therapy approaches respect your background and values.",
      features: ["Cultural competency", "Language adaptation", "Value alignment", "Context awareness"],
      color: "from-green-500 to-teal-500",
      demo: "Explore cultural adaptation",
      stats: { cultures: "150+", languages: "29", accuracy: "96%" }
    },
    {
      icon: Lock,
      title: "Privacy-First Architecture",
      subtitle: "End-to-End Security",
      description: "Military-grade encryption with federated learning ensures your data never leaves your control while improving AI capabilities.",
      features: ["Zero-knowledge architecture", "Local data processing", "Federated learning", "HIPAA compliance"],
      color: "from-purple-500 to-indigo-600",
      demo: "View security details",
      stats: { encryption: "AES-256", compliance: "HIPAA", uptime: "99.9%" }
    }
  ];

  const enhancedFeatures = [
    {
      icon: Activity,
      title: "Real-Time Processing",
      description: "Instant analysis and response capabilities",
      color: "text-blue-600"
    },
    {
      icon: Network,
      title: "Neural Network Architecture", 
      description: "Advanced deep learning models",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "AI that improves with every interaction",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Collaborative Intelligence",
      description: "Human + AI working together",
      color: "text-orange-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % technologies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-background via-blue-50/30 to-purple-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 border border-blue-200/50"
          >
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Revolutionary AI Technology</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Beyond AI Chatbots
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            TherapySync AI represents the pinnacle of therapeutic technology. Our breakthrough systems create 
            the most sophisticated and caring therapy experience available anywhere.
          </motion.p>
        </div>

        {/* Interactive Technology Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Technology Tabs */}
          <div className="space-y-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 ${
                    activeTab === index 
                      ? 'border-2 border-blue-300 shadow-xl bg-gradient-to-r from-white to-blue-50/50' 
                      : 'border border-border hover:border-blue-200 hover:shadow-lg bg-white/80'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center shadow-lg`}>
                        <tech.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{tech.title}</h3>
                        <p className="text-sm text-blue-600 font-medium mb-2">{tech.subtitle}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {tech.description}
                        </p>
                        {activeTab === index && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 space-y-2"
                          >
                            {tech.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Active Technology Detail */}
          <div className="lg:sticky lg:top-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border-2 border-blue-100 shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${technologies[activeTab].color} flex items-center justify-center mb-6 shadow-lg`}>
                {React.createElement(technologies[activeTab].icon, { className: "h-8 w-8 text-white" })}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{technologies[activeTab].title}</h3>
              
              {/* Interactive Demo Area */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-400 text-sm font-mono">● LIVE DEMO</span>
                  <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                    <Play className="h-3 w-3 mr-1" />
                    {technologies[activeTab].demo}
                  </Button>
                </div>
                
                {/* Simulated Interface */}
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-blue-400">$ analyzing_user_input...</div>
                  <div className="text-green-400">✓ emotion_detected: {activeTab === 0 ? 'slightly_anxious' : activeTab === 1 ? 'stable' : activeTab === 2 ? 'culturally_aware' : 'secure'}</div>
                  <div className="text-yellow-400">→ generating_response: personalized</div>
                  <div className="text-green-400">✓ response_ready: {technologies[activeTab].stats.accuracy || '100%'} confidence</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(technologies[activeTab].stats).map(([key, value], idx) => (
                  <div key={idx} className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-lg font-bold text-blue-600">{value}</div>
                    <div className="text-xs text-blue-600/70 capitalize">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Advanced AI Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enhancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-white/60 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    
                      {hoveredFeature === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <Button size="sm" variant="outline" className="text-xs">
                            Learn More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </motion.div>
                      )}
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
          className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Experience the Future of Therapy</h3>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              See how advanced AI technology translates into meaningful therapeutic conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Live Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4"
              >
                <Lightbulb className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveAITechnology;