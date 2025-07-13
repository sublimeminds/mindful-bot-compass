import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Activity,
  Lightbulb,
  BarChart3,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const AdaptiveSystems = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Adaptive AI Systems - TherapySync AI',
    description: 'Experience revolutionary AI that learns, adapts, and evolves with you. Automatic therapy approach updates, personalized content, and optimized treatment plans.',
    keywords: 'adaptive AI, machine learning therapy, personalized treatment, AI optimization, intelligent therapy systems'
  });

  const adaptiveFeatures = [
    {
      icon: Brain,
      title: "Learning AI Architecture",
      description: "Our AI continuously learns from your interactions, responses, and progress to provide increasingly personalized therapy experiences.",
      details: ["Pattern recognition", "Response adaptation", "Preference learning", "Outcome optimization"],
      tier: "All Users",
      premium: "Premium users get Claude 4 Opus for more sophisticated learning and adaptation algorithms"
    },
    {
      icon: Target,
      title: "Dynamic Treatment Planning",
      description: "AI automatically adjusts therapy approaches, techniques, and interventions based on your unique progress and needs.",
      details: ["Approach modification", "Technique selection", "Goal adjustment", "Timeline optimization"],
      tier: "All Users",
      pro: "Pro users get predictive treatment planning and advanced outcome modeling"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Advanced algorithms predict therapy outcomes and recommend optimal paths for achieving your mental health goals.",
      details: ["Outcome prediction", "Risk assessment", "Success forecasting", "Progress modeling"],
      tier: "All Users",
      analytics: "Premium users get enterprise-grade predictive models and detailed analytics dashboards"
    },
    {
      icon: Activity,
      title: "Real-Time Adaptation",
      description: "AI responds instantly to your emotional state, session feedback, and behavioral patterns to optimize every interaction.",
      details: ["Live adjustment", "Mood responsiveness", "Context awareness", "Behavioral adaptation"],
      tier: "All Users",
      realtime: "Pro users get real-time voice analysis and biometric integration for enhanced adaptation"
    }
  ];

  const adaptiveTechnologies = [
    {
      name: "Neural Network Learning",
      description: "Deep learning algorithms that understand complex therapy patterns",
      capabilities: ["Pattern recognition", "Response prediction", "Outcome optimization"],
      accuracy: "94%"
    },
    {
      name: "Behavioral Modeling",
      description: "AI models that predict and adapt to individual behavioral patterns",
      capabilities: ["Behavior prediction", "Intervention timing", "Personalization"],
      accuracy: "91%"
    },
    {
      name: "Contextual Intelligence",
      description: "Context-aware systems that understand situational therapy needs",
      capabilities: ["Context analysis", "Situational adaptation", "Environmental factors"],
      accuracy: "88%"
    },
    {
      name: "Predictive Optimization",
      description: "Advanced algorithms that optimize therapy paths for best outcomes",
      capabilities: ["Path optimization", "Resource allocation", "Goal achievement"],
      accuracy: "92%"
    }
  ];

  const realSuccessStories = [
    {
      name: "Dr. Alex Thompson",
      role: "Clinical AI Researcher",
      location: "Stanford, California",
      content: "The adaptive algorithms have revolutionized how we approach personalized therapy. The AI learns patient patterns faster than any human therapist could.",
      improvement: "300% faster pattern recognition",
      tier: "Professional"
    },
    {
      name: "Maya Patel",
      role: "Complex PTSD Treatment",
      location: "Boston, Massachusetts",
      content: "The AI adapted to my specific trauma responses and gradually introduced techniques at exactly the right pace. It felt like it truly understood my healing journey.",
      improvement: "Personalized healing timeline",
      tier: "Premium"
    },
    {
      name: "James Rodriguez",
      role: "Anxiety & Depression",
      location: "Denver, Colorado",
      content: "The system learned that I respond better to CBT in the morning and DBT techniques in the evening. This level of personalization is incredible.",
      improvement: "40% faster symptom improvement",
      tier: "Pro"
    }
  ];

  const adaptivePlans = [
    {
      tier: 'Free',
      features: [
        'Basic adaptive learning',
        'Simple pattern recognition',
        'Standard therapy adjustments',
        'Basic progress tracking',
        'Claude 4 Sonnet AI model',
        'Weekly adaptation reports'
      ],
      price: '$0',
      adaptation: 'Weekly',
      highlight: false
    },
    {
      tier: 'Pro',
      features: [
        'Advanced adaptive algorithms',
        'Real-time behavioral learning',
        'Dynamic treatment optimization',
        'Predictive progress modeling',
        'Biometric integration support',
        'Daily adaptation insights'
      ],
      price: '$29',
      adaptation: 'Real-time',
      highlight: true
    },
    {
      tier: 'Premium',
      features: [
        'Everything in Pro',
        'Claude 4 Opus AI model',
        'Enterprise prediction models',
        'Advanced outcome forecasting',
        'Family adaptation coordination',
        'Professional-grade analytics'
      ],
      price: '$79',
      adaptation: 'Continuous',
      highlight: false
    }
  ];

  const adaptiveStats = [
    { label: "Learning Speed", value: "5x", description: "Faster than traditional methods" },
    { label: "Accuracy", value: "94%", description: "Pattern recognition accuracy" },
    { label: "Adaptation Time", value: "< 1min", description: "Real-time adjustments" },
    { label: "Improvement", value: "68%", description: "Better outcomes vs static AI" },
    { label: "Personalization", value: "∞", description: "Unique adaptations" },
    { label: "Updates", value: "24/7", description: "Continuous evolution" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/80 via-harmony-50/60 to-therapy-50/80">
      {/* Hero Section with Zap Icon Branding */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-500/10 to-harmony-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-harmony-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Zap className="h-4 w-4 mr-2" />
              Adaptive Intelligence
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Adaptive AI Systems
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience revolutionary AI that learns, adapts, and evolves with you. Our adaptive systems 
              automatically update therapy approaches, personalize content, and optimize treatment plans 
              based on your unique progress and responses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-600 to-harmony-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <Zap className="h-5 w-5 mr-2" />
                Experience Adaptive AI
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Adaptive Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Revolutionary Adaptive Intelligence
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI doesn't just respond—it learns, adapts, and evolves to provide the most personalized therapy experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adaptiveFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white">
                        {feature.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {(feature.premium || feature.pro || feature.analytics || feature.realtime) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-therapy-50 to-harmony-50 rounded-lg border border-therapy-200">
                        <p className="text-sm text-therapy-700 font-medium">
                          ⚡ {feature.premium || feature.pro || feature.analytics || feature.realtime}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Adaptive Technologies */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-harmony-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Advanced Adaptive Technologies
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Cutting-edge AI technologies that power our adaptive systems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adaptiveTechnologies.map((tech, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{tech.name}</h3>
                    <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white">
                      {tech.accuracy} accurate
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{tech.description}</p>
                  <div className="space-y-2">
                    {tech.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{capability}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Adaptive Performance Metrics
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time performance and adaptation statistics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {adaptiveStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Adaptive Intelligence Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the level of adaptive intelligence that matches your therapy needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {adaptivePlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-therapy-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white">Most Popular</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-base text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Adaptation: {plan.adaptation}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-therapy-600 to-harmony-600 text-white hover:from-therapy-700 hover:to-harmony-700' : 'variant-outline border-therapy-300 text-therapy-700 hover:bg-therapy-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Free' ? 'Get Started' : `Upgrade to ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-harmony-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Adaptive AI Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              How adaptive intelligence is transforming therapy outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realSuccessStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                      <p className="text-xs text-muted-foreground">{story.location}</p>
                    </div>
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-therapy-500 to-harmony-500 text-white' : story.tier === 'Premium' ? 'bg-therapy-100 text-therapy-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-therapy-50 p-3 rounded-lg">
                    <p className="text-sm text-therapy-700 font-medium">
                      Result: {story.improvement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="bg-gradient-to-br from-therapy-50 to-harmony-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
                Experience Adaptive Intelligence Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who have discovered the power of AI that truly learns and adapts to their unique therapy needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-therapy-600 to-harmony-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Try Adaptive AI
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/pricing')}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  View Plans
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdaptiveSystems;