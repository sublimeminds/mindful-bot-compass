import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Sparkles,
  Cpu,
  Activity,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function AIHubSection() {
  const aiModules = [
    {
      id: 'therapist',
      name: 'AI Therapist',
      description: 'Advanced emotional intelligence with therapeutic expertise',
      status: 'active',
      icon: Brain,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'wellness',
      name: 'Wellness Coach', 
      description: 'Proactive wellness monitoring and lifestyle guidance',
      status: 'active',
      icon: Activity,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'crisis',
      name: 'Crisis Support',
      description: 'Specialized crisis intervention and emergency response',
      status: 'standby',
      icon: Shield,
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 'analytics',
      name: 'Insight Engine',
      description: 'Advanced analytics and pattern recognition',
      status: 'active',
      icon: BarChart3,
      gradient: 'from-orange-500 to-yellow-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>;
      case 'standby':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Standby</Badge>;
      default:
        return <Badge variant="outline" className="text-white/70 border-white/30">Unknown</Badge>;
    }
  };

  return (
    <div className="text-center w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
          AI Hub
          <span className="block text-2xl font-normal text-white/80 mt-2">
            Your Intelligent Therapeutic Ecosystem
          </span>
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Experience the future of mental health with our advanced AI modules working in harmony to provide personalized, 
          comprehensive therapeutic support tailored to your unique needs.
        </p>
      </div>

      {/* AI Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {aiModules.map((module) => (
          <Card key={module.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} shadow-lg`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                {getStatusBadge(module.status)}
              </div>
              <CardTitle className="text-lg text-white group-hover:text-white transition-colors">
                {module.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                {module.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-blue-400/30">
            <Cpu className="h-8 w-8 text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Neural Processing</h3>
          <p className="text-white/80 leading-relaxed">
            Advanced language models trained specifically on therapeutic data for more accurate and empathetic responses.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-purple-400/30">
            <Sparkles className="h-8 w-8 text-purple-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Personalized Intelligence</h3>
          <p className="text-white/80 leading-relaxed">
            AI that learns and adapts to your unique communication style, preferences, and therapeutic goals.
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-green-400/30">
            <Zap className="h-8 w-8 text-green-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Real-time Insights</h3>
          <p className="text-white/80 leading-relaxed">
            Instant analysis of your emotional patterns and progress with actionable recommendations for improvement.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience AI-Powered Therapy?</h3>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Join thousands of users who have transformed their mental health journey with our advanced AI therapeutic platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8"
          >
            <Brain className="h-5 w-5 mr-2" />
            Start Your AI Session
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 text-white hover:bg-white/10 px-8"
          >
            <Settings className="h-5 w-5 mr-2" />
            Customize AI Settings
          </Button>
        </div>
      </div>
    </div>
  );
}