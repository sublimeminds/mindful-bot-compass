import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Flower, 
  Brain, 
  Heart, 
  Target,
  CheckCircle,
  ArrowRight,
  Clock,
  Waves,
  Sun,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const MindfulnessTherapy = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Mindfulness-Based Therapy - TherapySync AI',
    description: 'Discover peace and presence with AI-guided mindfulness therapy. Learn meditation, awareness techniques, and stress reduction through mindful practices.',
    keywords: 'mindfulness therapy, meditation, mindful awareness, stress reduction, present moment, mindfulness-based stress reduction'
  });

  const mindfulnessFeatures = [
    {
      icon: Flower,
      title: "AI-Guided Meditation",
      description: "Personalized meditation sessions that adapt to your experience level and current emotional state.",
      details: ["Breath awareness", "Body scanning", "Loving-kindness", "Walking meditation"],
      tier: "All Users",
      premium: "Premium users get access to advanced meditation libraries and biometric-guided sessions"
    },
    {
      icon: Brain,
      title: "Present Moment Awareness",
      description: "Learn to cultivate moment-to-moment awareness and break free from autopilot living.",
      details: ["Mindful observation", "Thought awareness", "Emotional presence", "Sensory grounding"],
      tier: "All Users",
      upgrade: "Premium users enjoy Claude 4 Opus for deeper mindfulness insights and personalized guidance"
    },
    {
      icon: Heart,
      title: "Compassion Training",
      description: "Develop self-compassion and loving-kindness through structured mindfulness practices.",
      details: ["Self-compassion exercises", "Loving-kindness meditation", "Forgiveness practices", "Compassionate communication"],
      tier: "All Users",
      pro: "Pro users get advanced compassion analytics and family mindfulness coordination"
    },
    {
      icon: Waves,
      title: "Stress Reduction",
      description: "Evidence-based mindfulness techniques for reducing stress, anxiety, and emotional reactivity.",
      details: ["MBSR protocols", "Stress response awareness", "Relaxation techniques", "Anxiety management"],
      tier: "All Users",
      analytics: "Pro users get real-time stress tracking and mindfulness progress analytics"
    }
  ];

  const mindfulnessPractices = [
    {
      name: "Breath Awareness",
      description: "Foundation practice focusing on breath observation and concentration",
      duration: "5-20 minutes",
      difficulty: "Beginner",
      benefits: ["Improved focus", "Stress reduction", "Emotional regulation"]
    },
    {
      name: "Body Scan Meditation",
      description: "Progressive awareness of physical sensations throughout the body",
      duration: "15-45 minutes", 
      difficulty: "Beginner",
      benefits: ["Physical relaxation", "Body awareness", "Pain management"]
    },
    {
      name: "Mindful Movement",
      description: "Integration of mindfulness with gentle movement and yoga",
      duration: "20-60 minutes",
      difficulty: "Intermediate",
      benefits: ["Mind-body connection", "Flexibility", "Stress relief"]
    },
    {
      name: "Open Awareness",
      description: "Advanced practice of observing thoughts and sensations without attachment",
      duration: "20-40 minutes",
      difficulty: "Advanced",
      benefits: ["Non-reactive awareness", "Emotional freedom", "Deep insight"]
    }
  ];

  const realUserStories = [
    {
      name: "Dr. Sarah Kim",
      role: "Mindfulness Instructor",
      location: "Berkeley, California",
      content: "The AI's understanding of mindfulness principles is remarkable. It guides students through practices with the same depth I would expect from experienced teachers.",
      improvement: "95% student engagement retention",
      tier: "Professional"
    },
    {
      name: "Robert Chen",
      role: "Executive Stress Management",
      location: "New York, New York",
      content: "The personalized meditation sessions fit perfectly into my busy schedule. The AI knows exactly when I need a 5-minute session versus a longer practice.",
      improvement: "60% stress reduction",
      tier: "Premium"
    },
    {
      name: "Lisa Martinez",
      role: "Anxiety & Mindfulness",
      location: "Seattle, Washington",
      content: "Learning mindfulness through AI has been surprisingly effective. The guided sessions are so natural and responsive to my current emotional state.",
      improvement: "Consistent daily practice",
      tier: "Pro"
    }
  ];

  const mindfulnessPlans = [
    {
      tier: 'Free',
      features: [
        'Basic meditation sessions',
        'Breath awareness practices',
        'Simple mindfulness exercises',
        'Progress tracking',
        'Claude 4 Sonnet guidance',
        'Weekly mindfulness insights'
      ],
      price: '$0',
      sessions: 'Unlimited',
      highlight: false
    },
    {
      tier: 'Pro',
      features: [
        'Advanced meditation library',
        'Personalized practice plans',
        'Stress tracking integration',
        'Mindfulness analytics',
        'Group meditation sessions',
        'Daily mindfulness reminders'
      ],
      price: '$29',
      sessions: 'Premium content',
      highlight: true
    },
    {
      tier: 'Premium',
      features: [
        'Everything in Pro',
        'Claude 4 Opus meditation guide',
        'Biometric integration',
        'Advanced analytics dashboard',
        'Family mindfulness programs',
        'Professional teacher access'
      ],
      price: '$79',
      sessions: 'Full library',
      highlight: false
    }
  ];

  const mindfulnessStats = [
    { label: "Practices", value: "200+", description: "Guided meditations" },
    { label: "Stress Reduction", value: "65%", description: "Average improvement" },
    { label: "Session Length", value: "5-60min", description: "Flexible durations" },
    { label: "Success Rate", value: "89%", description: "User satisfaction" },
    { label: "Daily Users", value: "50k+", description: "Active practitioners" },
    { label: "Languages", value: "29", description: "Meditation guides" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-green-50/80">
      {/* Hero Section with Flower Icon Branding */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Flower className="h-4 w-4 mr-2" />
              Mindfulness Therapy
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Mindfulness-Based Therapy
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover peace, presence, and emotional balance through AI-guided mindfulness practices. 
              Learn meditation, awareness techniques, and stress reduction in a supportive, personalized environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <Flower className="h-5 w-5 mr-2" />
                Start Mindfulness Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mindfulness Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI-Powered Mindfulness Training
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience personalized mindfulness practices that adapt to your current state, experience level, and specific goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mindfulnessFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
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
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {(feature.premium || feature.upgrade || feature.pro || feature.analytics) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-medium">
                          🧘 {feature.upgrade || feature.premium || feature.pro || feature.analytics}
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

      {/* Mindfulness Practices */}
      <section className="py-20 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Core Mindfulness Practices
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Evidence-based practices for developing mindful awareness and emotional balance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mindfulnessPractices.map((practice, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{practice.name}</h3>
                    <Badge className={`${practice.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : practice.difficulty === 'Intermediate' ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}`}>
                      {practice.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{practice.description}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{practice.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {practice.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
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
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Mindfulness Program Metrics
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-world impact and program effectiveness statistics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mindfulnessStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mindfulness Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Mindfulness Training Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the mindfulness program that supports your journey to inner peace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mindfulnessPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-green-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Popular</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-base text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Sessions: {plan.sessions}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700' : 'variant-outline border-green-300 text-green-700 hover:bg-green-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Free' ? 'Start Free' : `Upgrade to ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-20 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Mindfulness Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              How mindfulness practice is transforming lives and reducing stress
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
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : story.tier === 'Premium' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
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
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Begin Your Mindfulness Journey Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover inner peace, reduce stress, and cultivate lasting well-being through personalized mindfulness practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Flower className="h-5 w-5 mr-2" />
                  Start Mindfulness Practice
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/pricing')}
                >
                  <Sun className="h-5 w-5 mr-2" />
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

export default MindfulnessTherapy;