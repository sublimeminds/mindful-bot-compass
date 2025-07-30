import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Globe, Shield, Target, TrendingUp, Zap, Activity, Network, Users, Mic, AlertTriangle, Eye, Sparkles, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AIMetric {
  label: string;
  value: string;
  color: string;
  isActive: boolean;
}

interface AIComponent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  metrics: AIMetric[];
  features: string[];
  isActive: boolean;
}

export const TherapySyncAICore = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 1247,
    culturalAdaptations: 15,
    crisisAlerts: 0,
    modelSwitches: 89,
    responseTime: 0.8,
    adaptationAccuracy: 94
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        modelSwitches: prev.modelSwitches + Math.floor(Math.random() * 2),
        responseTime: Number((0.6 + Math.random() * 0.4).toFixed(1)),
        adaptationAccuracy: 92 + Math.floor(Math.random() * 6)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const aiComponents: AIComponent[] = [
    {
      id: 'cultural-intelligence',
      title: 'Cultural Intelligence Hub',
      description: 'Adapts to 15+ cultural contexts with real-time communication style adjustment',
      icon: <Globe className="h-6 w-6 text-white" />,
      color: 'from-harmony-500 to-flow-500',
      metrics: [
        { label: 'Cultural Contexts', value: '15+', color: 'harmony', isActive: true },
        { label: 'Adaptation Accuracy', value: `${liveMetrics.adaptationAccuracy}%`, color: 'flow', isActive: true },
        { label: 'Real-time Adjustments', value: `${liveMetrics.culturalAdaptations}`, color: 'harmony', isActive: liveMetrics.culturalAdaptations > 0 }
      ],
      features: ['Western/Eastern cultural adaptation', 'Religious sensitivity protocols', 'Communication style matching', 'Family structure awareness'],
      isActive: true
    },
    {
      id: 'crisis-detection',
      title: 'Crisis Detection & Safety',
      description: '24/7 monitoring with immediate professional oversight escalation',
      icon: <Shield className="h-6 w-6 text-white" />,
      color: 'from-red-500 to-orange-500',
      metrics: [
        { label: 'Risk Level', value: 'LOW', color: 'green', isActive: true },
        { label: 'Active Monitoring', value: `${liveMetrics.activeUsers}`, color: 'red', isActive: true },
        { label: 'Crisis Alerts', value: `${liveMetrics.crisisAlerts}`, color: 'orange', isActive: false }
      ],
      features: ['Real-time sentiment analysis', 'Suicide risk detection', 'Professional escalation', '24/7 human oversight'],
      isActive: liveMetrics.crisisAlerts === 0
    },
    {
      id: 'voice-multimodal',
      title: 'Voice & Multimodal Processing',
      description: 'Advanced emotion detection through voice, text, and multimodal analysis',
      icon: <Mic className="h-6 w-6 text-white" />,
      color: 'from-balance-500 to-mindful-500',
      metrics: [
        { label: 'Voice Cloning Ready', value: '24', color: 'balance', isActive: true },
        { label: 'Emotion Accuracy', value: '96%', color: 'mindful', isActive: true },
        { label: 'Processing Speed', value: `${liveMetrics.responseTime}s`, color: 'balance', isActive: true }
      ],
      features: ['Voice emotion detection', 'Personalized voice cloning', 'Multimodal analysis', 'Therapeutic tone adaptation'],
      isActive: true
    },
    {
      id: 'model-router',
      title: 'Multi-Model AI Router',
      description: 'Intelligent routing between 5 AI models based on subscription, context, and task complexity',
      icon: <Cpu className="h-6 w-6 text-white" />,
      color: 'from-therapy-500 to-calm-500',
      metrics: [
        { label: 'Claude Models', value: '65%', color: 'therapy', isActive: true },
        { label: 'OpenAI Models', value: '35%', color: 'calm', isActive: true },
        { label: 'Smart Routes/min', value: `${liveMetrics.modelSwitches}`, color: 'therapy', isActive: true }
      ],
      features: [
        'Premium Chat → Claude Opus 4', 
        'Free Chat → Claude Sonnet 4', 
        'Cultural/Crisis → GPT-4o',
        'Enhanced Services → GPT-4.1',
        'Translations → GPT-4o-mini'
      ],
      isActive: true
    },
    {
      id: 'adaptive-therapy',
      title: 'Adaptive Therapy Engine',
      description: 'Personalized approach selection from CBT, DBT, mindfulness, and 12+ modalities',
      icon: <Target className="h-6 w-6 text-white" />,
      color: 'from-balance-500 to-therapy-500',
      metrics: [
        { label: 'Active Modalities', value: '15+', color: 'balance', isActive: true },
        { label: 'Personalization', value: '94%', color: 'therapy', isActive: true },
        { label: 'Technique Match', value: '87%', color: 'balance', isActive: true }
      ],
      features: ['CBT/DBT adaptive switching', 'Trauma-informed approaches', 'Mindfulness integration', 'Real-time technique selection'],
      isActive: true
    },
    {
      id: 'professional-oversight',
      title: 'Professional Oversight Network',
      description: 'Licensed therapist supervision with AI-human collaborative protocols',
      icon: <Users className="h-6 w-6 text-white" />,
      color: 'from-flow-500 to-harmony-500',
      metrics: [
        { label: 'Licensed Supervisors', value: '24/7', color: 'flow', isActive: true },
        { label: 'Review Accuracy', value: '98%', color: 'harmony', isActive: true },
        { label: 'Escalation Time', value: '<2min', color: 'flow', isActive: true }
      ],
      features: ['Human therapist review', 'AI-human collaboration', 'Quality assurance', 'Ethical oversight'],
      isActive: true
    }
  ];

  return (
    <div className="relative py-32 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/30 via-calm-50/20 to-harmony-50/30"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-therapy-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-calm-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{animationDuration: '60s'}}>
          <defs>
            <pattern id="neural-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3"/>
              <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-therapy-500 via-calm-500 to-harmony-500 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-400/20 to-transparent animate-pulse"></div>
                <Brain className="h-10 w-10 text-white relative z-10" />
                
                {/* Neural pulse effects */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 bg-white/30 animate-pulse"
                      style={{
                        height: '30px',
                        left: '50%',
                        top: '50%',
                        transformOrigin: 'bottom',
                        transform: `rotate(${i * 60}deg) translateY(-35px)`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Orbiting indicators */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-therapy-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `rotate(${i * 90}deg) translateX(50px) rotate(-${i * 90}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-left">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground">TherapySync AI Core</h2>
              <p className="text-xl text-muted-foreground mt-2">Advanced AI that evolves with every conversation</p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">24/7 Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-therapy-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-therapy-600">{liveMetrics.activeUsers} Users Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Central Neural Network Visualization */}
        <div className="relative mb-24">
          <div className="text-center">
            <div className="relative inline-block">
              {/* Enhanced Central Brain */}
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-therapy-500 via-calm-500 to-harmony-500 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-400/30 to-transparent animate-pulse"></div>
                <div className="absolute inset-4 border border-white/20 rounded-full"></div>
                <div className="absolute inset-8 border border-white/10 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
                
                <div className="relative z-10 text-center">
                  <Brain className="h-16 w-16 text-white mx-auto mb-2" />
                  <div className="text-white text-sm font-semibold">TherapySync</div>
                  <div className="text-white/80 text-xs">AI Core</div>
                </div>
                
                {/* Enhanced Neural Connections */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 bg-gradient-to-t from-white/40 to-transparent animate-pulse"
                      style={{
                        height: '100px',
                        left: '50%',
                        top: '50%',
                        transformOrigin: 'bottom',
                        transform: `rotate(${i * 60}deg) translateY(-132px)`,
                        animationDelay: `${i * 0.4}s`
                      }}
                    />
                  ))}
                </div>

                {/* Data flow particles */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white/60 rounded-full animate-ping"
                      style={{
                        left: '50%',
                        top: '50%',
                        animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
                        animationDelay: `${i * 0.5}s`,
                        transform: `rotate(${i * 30}deg) translateX(${60 + Math.sin(i) * 20}px) rotate(-${i * 30}deg)`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Component connection lines */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {aiComponents.map((_, i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const x1 = 200;
                    const y1 = 200;
                    const x2 = 200 + Math.cos(angle) * 180;
                    const y2 = 200 + Math.sin(angle) * 180;
                    
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        opacity="0.3"
                        className="animate-pulse"
                        style={{animationDelay: `${i * 0.5}s`}}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--therapy-500))" />
                      <stop offset="100%" stopColor="hsl(var(--calm-500))" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-3xl font-bold text-foreground mb-2">Central Intelligence Core</h3>
              <p className="text-muted-foreground mb-4">Processing 10,000+ therapeutic decisions per minute</p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-therapy-500" />
                  <span className="font-medium text-therapy-600">Real-time Adaptation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-calm-500" />
                  <span className="font-medium text-calm-600">Instant Response</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-harmony-500" />
                  <span className="font-medium text-harmony-600">Multi-Modal Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Component Clusters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {aiComponents.map((component, index) => (
            <div
              key={component.id}
              onMouseEnter={() => setActiveComponent(component.id)}
              onMouseLeave={() => setActiveComponent(null)}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden cursor-pointer ${
                activeComponent === component.id ? 'scale-105 shadow-xl' : ''
              }`}
            >
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${component.color} opacity-10 rounded-bl-full`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${component.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">{component.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${component.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {component.isActive ? 'Active' : 'Standby'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{component.description}</p>
                
                {/* Live Metrics */}
                <div className="space-y-3 mb-4">
                  {component.metrics.map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold text-${metric.color}-600`}>{metric.value}</span>
                        {metric.isActive && (
                          <div className={`w-2 h-2 bg-${metric.color}-500 rounded-full animate-pulse`}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature List */}
                <div className="space-y-1">
                  {component.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-therapy-400 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {component.features.length > 3 && (
                    <div className="text-xs text-therapy-600 font-medium">+{component.features.length - 3} more features</div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${component.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Live Metrics Dashboard */}
        <div className="bg-gradient-to-r from-flow-100/50 to-therapy-100/30 rounded-3xl p-8 border border-flow-200/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-2">Real-Time AI Performance</h3>
            <p className="text-muted-foreground">Live monitoring of TherapySync AI Core operations</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {[
              { metric: `${liveMetrics.responseTime}s`, label: "Response Time", color: "therapy", icon: <Clock className="h-4 w-4" /> },
              { metric: "99.9%", label: "Uptime", color: "calm", icon: <Activity className="h-4 w-4" /> },
              { metric: `${liveMetrics.adaptationAccuracy}%`, label: "Cultural Accuracy", color: "harmony", icon: <Globe className="h-4 w-4" /> },
              { metric: "24/7", label: "Crisis Detection", color: "flow", icon: <Shield className="h-4 w-4" /> },
              { metric: `${liveMetrics.activeUsers}`, label: "Active Users", color: "balance", icon: <Users className="h-4 w-4" /> },
              { metric: `${liveMetrics.modelSwitches}`, label: "Smart Routing", color: "mindful", icon: <Cpu className="h-4 w-4" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate('/ai-technology')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Brain className="mr-2 h-5 w-5" />
              Explore AI Technology
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/demo')}
              className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Eye className="mr-2 h-5 w-5" />
              Watch Live Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};