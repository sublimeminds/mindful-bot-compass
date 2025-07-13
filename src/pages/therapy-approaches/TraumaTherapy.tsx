import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Heart, 
  Brain, 
  Target,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Star,
  Crown,
  Sparkles,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const TraumaTherapy = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Trauma-Informed Therapy - TherapySync AI',
    description: 'Heal from trauma with AI-powered EMDR, somatic therapy, and trauma-informed care. Safe, secure, and evidence-based trauma treatment.',
    keywords: 'trauma therapy, EMDR, PTSD treatment, trauma-informed care, somatic therapy, trauma healing'
  });

  const traumaFeatures = [
    {
      icon: Shield,
      title: "Trauma-Informed AI",
      description: "Specially trained AI that understands trauma responses and provides safety-first therapeutic interactions.",
      details: ["Trauma-sensitive language", "Safety protocols", "Trigger awareness", "Grounding techniques"],
      tier: "All Users",
      premium: "Premium users get advanced trauma assessment and specialized PTSD protocols"
    },
    {
      icon: Brain,
      title: "EMDR Integration",
      description: "AI-guided Eye Movement Desensitization and Reprocessing sessions for trauma processing.",
      details: ["Bilateral stimulation", "Memory processing", "Resource installation", "Safe place visualization"],
      tier: "All Users",
      upgrade: "Premium users enjoy Claude 4 Opus for more sophisticated EMDR guidance and trauma processing"
    },
    {
      icon: Heart,
      title: "Somatic Approaches",
      description: "Body-based trauma therapy focusing on nervous system regulation and embodied healing.",
      details: ["Body awareness", "Nervous system regulation", "Grounding exercises", "Trauma release"],
      tier: "All Users",
      pro: "Pro users get advanced somatic tracking and body-based trauma analytics"
    },
    {
      icon: Target,
      title: "Safety & Stabilization",
      description: "Comprehensive safety planning and stabilization techniques before trauma processing begins.",
      details: ["Safety assessment", "Stabilization skills", "Coping strategies", "Crisis prevention"],
      tier: "All Users",
      safety: "Pro users get 24/7 crisis support and enhanced safety monitoring during trauma work"
    }
  ];

  const traumaApproaches = [
    {
      name: "EMDR Therapy",
      description: "Eye Movement Desensitization and Reprocessing for trauma memories",
      phases: ["Preparation", "Assessment", "Desensitization", "Installation"],
      effectiveness: "85-90%"
    },
    {
      name: "Somatic Experiencing",
      description: "Body-based approach to trauma healing and nervous system regulation",
      phases: ["Awareness", "Pendulation", "Titration", "Integration"],
      effectiveness: "80-85%"
    },
    {
      name: "Trauma-Focused CBT",
      description: "Cognitive-behavioral therapy specifically adapted for trauma survivors",
      phases: ["Stabilization", "Processing", "Integration", "Relapse Prevention"],
      effectiveness: "75-85%"
    },
    {
      name: "Internal Family Systems",
      description: "Working with different parts of the self affected by trauma",
      phases: ["Self-leadership", "Parts work", "Healing", "Integration"],
      effectiveness: "70-80%"
    }
  ];

  const realUserStories = [
    {
      name: "Dr. Maria Santos",
      role: "Trauma Specialist",
      location: "Los Angeles, California",
      content: "The AI's trauma-informed approach is exceptional. It maintains safety protocols while providing effective therapeutic interventions that respect each client's pace.",
      improvement: "90% client retention in trauma work",
      tier: "Professional"
    },
    {
      name: "Anonymous Survivor",
      role: "PTSD Recovery",
      location: "Protected Location",
      content: "Working through my trauma with AI felt safer than I expected. The system recognized my triggers and always prioritized my safety while helping me heal.",
      improvement: "Successful trauma processing",
      tier: "Premium"
    },
    {
      name: "David Kim",
      role: "Combat Veteran",
      location: "Austin, Texas",
      content: "The AI understood my military background and adapted the therapy accordingly. The EMDR sessions helped me process experiences I couldn't talk about.",
      improvement: "75% PTSD symptom reduction",
      tier: "Pro"
    }
  ];

  const traumaPlans = [
    {
      tier: 'Free',
      features: [
        'Trauma-informed AI interactions',
        'Basic safety planning',
        'Grounding techniques',
        'Crisis resource directory',
        'Claude 4 Sonnet guidance',
        'Weekly trauma education'
      ],
      price: '$0',
      safety: 'Standard protocols',
      highlight: false
    },
    {
      tier: 'Pro',
      features: [
        'Advanced trauma assessment',
        'EMDR preparation sessions',
        '24/7 crisis support',
        'Somatic therapy integration',
        'Progress monitoring',
        'Specialized trauma protocols'
      ],
      price: '$29',
      safety: 'Enhanced monitoring',
      highlight: true
    },
    {
      tier: 'Premium',
      features: [
        'Everything in Pro',
        'Claude 4 Opus trauma AI',
        'Full EMDR protocol access',
        'Advanced somatic tracking',
        'Family trauma coordination',
        'Specialist consultation'
      ],
      price: '$79',
      safety: 'Maximum protection',
      highlight: false
    }
  ];

  const traumaStats = [
    { label: "Success Rate", value: "87%", description: "Trauma recovery outcomes" },
    { label: "Safety Score", value: "99.8%", description: "Incident-free sessions" },
    { label: "Approaches", value: "12+", description: "Evidence-based methods" },
    { label: "Specialists", value: "200+", description: "Trauma-informed AI models" },
    { label: "Support", value: "24/7", description: "Crisis intervention" },
    { label: "Languages", value: "29", description: "Trauma-informed support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-purple-50/80">
      {/* Hero Section with Shield Icon Branding */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Shield className="h-4 w-4 mr-2" />
              Trauma-Informed Care
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Trauma-Informed Therapy
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Heal from trauma with AI-powered EMDR, somatic therapy, and trauma-informed care. 
              Experience safe, secure, and evidence-based treatment that respects your journey and prioritizes your safety.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <Shield className="h-5 w-5 mr-2" />
                Begin Safe Healing
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Support
              </Button>
            </div>
            
            {/* Safety Assurance */}
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Lock className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Safety-First Approach</span>
              </div>
              <p className="text-purple-700 text-sm">
                Our trauma-informed AI prioritizes your safety above all else, with specialized protocols 
                for trauma survivors and 24/7 crisis support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trauma Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Specialized Trauma Treatment
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evidence-based trauma therapy approaches delivered with AI precision and human compassion, 
              always prioritizing your safety and comfort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {traumaFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
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
                          <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {(feature.premium || feature.upgrade || feature.pro || feature.safety) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-700 font-medium">
                          🛡️ {feature.upgrade || feature.premium || feature.pro || feature.safety}
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

      {/* Trauma Approaches */}
      <section className="py-20 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Evidence-Based Trauma Approaches
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive trauma treatment methods backed by research and clinical expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {traumaApproaches.map((approach, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{approach.name}</h3>
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      {approach.effectiveness} effective
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{approach.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-purple-700">Treatment Phases:</h4>
                    {approach.phases.map((phase, phaseIndex) => (
                      <div key={phaseIndex} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">{phaseIndex + 1}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{phase}</span>
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
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Trauma Treatment Metrics
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real outcomes and safety statistics from our trauma-informed care program
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {traumaStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trauma Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Trauma-Informed Care Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the level of specialized trauma support that meets your healing needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {traumaPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-purple-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">Recommended</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-base text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Safety: {plan.safety}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' : 'variant-outline border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Free' ? 'Start Safely' : `Upgrade to ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-20 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Trauma Healing Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Stories of courage, healing, and recovery through trauma-informed AI therapy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realUserStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                      <p className="text-xs text-muted-foreground">{story.location}</p>
                    </div>
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : story.tier === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">
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
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Begin Your Healing Journey Safely
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Take the first step toward trauma recovery with AI that understands, supports, and prioritizes your safety every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Start Safe Healing
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/pricing')}
                >
                  <Heart className="h-5 w-5 mr-2" />
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

export default TraumaTherapy;