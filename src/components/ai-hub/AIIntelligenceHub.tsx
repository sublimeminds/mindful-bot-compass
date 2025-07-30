import React from 'react';
import { Brain, Cpu, Globe, Shield, Target, TrendingUp, Zap, Activity, Network, Users } from 'lucide-react';

export const AIIntelligenceHub = () => {
  return (
    <div className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/30 via-calm-50/20 to-harmony-50/30"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-therapy-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-calm-300/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-2xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-5xl lg:text-6xl font-bold text-foreground">AI Intelligence Hub</h2>
              <p className="text-xl text-muted-foreground mt-2">Adaptive AI that evolves with every conversation</p>
            </div>
          </div>
        </div>

        {/* Central Neural Core */}
        <div className="relative mb-20">
          <div className="text-center">
            <div className="relative inline-block">
              {/* Central Brain */}
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-therapy-500 via-calm-500 to-harmony-500 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-400/20 to-transparent animate-pulse"></div>
                <Brain className="h-24 w-24 text-white relative z-10" />
                
                {/* Neural Connections */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 bg-white/30 animate-pulse"
                      style={{
                        height: '60px',
                        left: '50%',
                        top: '50%',
                        transformOrigin: 'bottom',
                        transform: `rotate(${i * 45}deg) translateY(-90px)`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Orbiting Data Points */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-therapy-400 rounded-full animate-pulse"
                    style={{
                      left: '50%',
                      top: '50%',
                      animation: `spin 10s linear infinite`,
                      animationDelay: `${i * 1.5}s`,
                      transform: `rotate(${i * 60}deg) translateX(120px) rotate(-${i * 60}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Central Intelligence Core</h3>
              <p className="text-muted-foreground">Processing 1,000+ decisions per second</p>
            </div>
          </div>
        </div>

        {/* AI Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* AI Model Router */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-therapy-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">AI Model Router</h3>
                  <div className="text-sm text-muted-foreground">Dynamic selection</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">GPT-4o</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 h-2 rounded-full">
                      <div className="bg-therapy-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                    </div>
                    <span className="text-xs text-therapy-600 font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">GPT-4o-mini</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 h-2 rounded-full">
                      <div className="bg-calm-500 h-2 rounded-full w-1/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    </div>
                    <span className="text-xs text-calm-600 font-medium">15%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Auto-optimizing selection</span>
              </div>
            </div>
          </div>

          {/* Cultural Intelligence */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-harmony-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Cultural Intelligence</h3>
                  <div className="text-sm text-muted-foreground">15+ contexts</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-harmony-50 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-harmony-700 mb-1">Active Context</div>
                  <div className="text-sm font-bold text-harmony-600">Western</div>
                  <div className="w-full bg-harmony-200 h-1 rounded-full mt-1">
                    <div className="bg-harmony-500 h-1 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                </div>
                <div className="bg-flow-50 rounded-lg p-3 text-center">
                  <div className="text-xs font-medium text-flow-700 mb-1">Adaptation</div>
                  <div className="text-sm font-bold text-flow-600">Real-time</div>
                  <div className="w-full bg-flow-200 h-1 rounded-full mt-1">
                    <div className="bg-flow-500 h-1 rounded-full w-5/6 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium">Adapting communication style</span>
              </div>
            </div>
          </div>

          {/* Crisis Detection */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Crisis Detection</h3>
                  <div className="text-sm text-muted-foreground">24/7 monitoring</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Risk Level</span>
                  <span className="text-sm font-bold text-green-600">LOW</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full w-1/4 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">Sentiment: <span className="font-medium text-green-600">Positive</span></div>
                  <div className="text-muted-foreground">Triggers: <span className="font-medium text-green-600">None</span></div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">All systems secure</span>
              </div>
            </div>
          </div>

          {/* Therapy Matcher */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-balance-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-balance-500 to-mindful-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Therapy Matcher</h3>
                  <div className="text-sm text-muted-foreground">Dynamic approaches</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">CBT</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-gray-200 h-1.5 rounded-full">
                      <div className="bg-balance-500 h-1.5 rounded-full w-4/5 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-medium text-balance-600">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mindfulness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-gray-200 h-1.5 rounded-full">
                      <div className="bg-mindful-500 h-1.5 rounded-full w-3/5 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </div>
                    <span className="text-xs font-medium text-mindful-600">65%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-600 font-medium">Adapting to user needs</span>
              </div>
            </div>
          </div>

          {/* Learning Engine */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-calm-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-calm-500 to-therapy-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Learning Engine</h3>
                  <div className="text-sm text-muted-foreground">Continuous improvement</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Learning Rate</span>
                  <span className="text-sm font-bold text-calm-600">94%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-calm-400 to-therapy-500 h-2 rounded-full w-[94%] animate-pulse"></div>
                </div>
                <div className="text-xs text-muted-foreground">From 847 recent interactions</div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-orange-600 font-medium">Model updated 2 mins ago</span>
              </div>
            </div>
          </div>

          {/* Performance Engine */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-therapy-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow group overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-flow-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-flow-500 to-harmony-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Performance AI</h3>
                  <div className="text-sm text-muted-foreground">Real-time optimization</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-flow-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-flow-600">0.8s</div>
                  <div className="text-xs text-muted-foreground">Response time</div>
                </div>
                <div className="bg-harmony-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-harmony-600">99.9%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-indigo-600 font-medium">Optimizing performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Dashboard */}
        <div className="bg-gradient-to-r from-flow-100/50 to-therapy-100/30 rounded-2xl p-8 border border-flow-200/50">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">Real-Time AI Performance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "&lt;200ms", label: "Response Time", color: "therapy" },
              { metric: "99.9%", label: "Uptime", color: "calm" },
              { metric: "95%", label: "User Satisfaction", color: "harmony" },
              { metric: "24/7", label: "Crisis Detection", color: "flow" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`} dangerouslySetInnerHTML={{ __html: stat.metric }}></div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};