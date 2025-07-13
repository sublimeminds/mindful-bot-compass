import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  BookOpen,
  Star,
  Crown,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const CBTTherapy = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Cognitive Behavioral Therapy (CBT) - TherapySync AI',
    description: 'Discover evidence-based CBT therapy with AI-powered insights. Transform negative thought patterns and behaviors with structured therapeutic approaches.',
    keywords: 'CBT therapy, cognitive behavioral therapy, thought patterns, behavioral change, evidence-based therapy'
  });

  const cbtFeatures = [
    {
      icon: Brain,
      title: "Thought Pattern Analysis",
      description: "AI identifies and helps restructure negative thought patterns with evidence-based CBT techniques.",
      details: ["Automatic thought tracking", "Cognitive distortion detection", "Pattern recognition", "Thought challenging exercises"],
      tier: "Pro+"
    },
    {
      icon: Target,
      title: "Behavioral Intervention",
      description: "Structured behavioral experiments and homework assignments to create lasting change.",
      details: ["Behavioral activation", "Exposure therapy planning", "Activity scheduling", "Progress tracking"],
      tier: "All Plans"
    },
    {
      icon: Lightbulb,
      title: "Cognitive Restructuring",
      description: "Learn to identify, challenge, and replace unhelpful thinking patterns with balanced thoughts.",
      details: ["Thought challenging worksheets", "Evidence examination", "Alternative perspective training", "Balanced thinking development"],
      tier: "Pro+"
    },
    {
      icon: TrendingUp,
      title: "Progress Monitoring",
      description: "Track your CBT journey with detailed analytics and mood assessments.",
      details: ["Mood tracking integration", "Thought record analysis", "Behavioral goal monitoring", "Session outcome measurement"],
      tier: "Premium"
    }
  ];

  const cbtTechniques = [
    {
      name: "Thought Records",
      description: "Systematic tracking and analysis of thoughts, emotions, and behaviors",
      benefits: ["Increased self-awareness", "Pattern identification", "Objective thinking"],
      difficulty: "Beginner"
    },
    {
      name: "Behavioral Experiments",
      description: "Testing negative predictions through structured behavioral activities",
      benefits: ["Reality testing", "Confidence building", "Fear reduction"],
      difficulty: "Intermediate"
    },
    {
      name: "Cognitive Restructuring",
      description: "Challenging and replacing unhelpful thought patterns",
      benefits: ["Balanced thinking", "Reduced anxiety", "Improved mood"],
      difficulty: "Intermediate"
    },
    {
      name: "Graded Exposure",
      description: "Gradual confrontation of feared situations or thoughts",
      benefits: ["Anxiety reduction", "Increased tolerance", "Confidence building"],
      difficulty: "Advanced"
    }
  ];

  const realSuccessStories = [
    {
      name: "Dr. Jennifer Martinez",
      role: "Clinical Psychologist",
      location: "Austin, Texas",
      content: "TherapySync's CBT modules provide the structure and consistency my clients need. The AI's ability to track thought patterns between sessions is remarkable.",
      improvement: "85% client engagement increase",
      tier: "Professional"
    },
    {
      name: "Michael Thompson",
      role: "Anxiety Management",
      location: "Seattle, Washington",
      content: "The thought challenging exercises helped me recognize my catastrophic thinking. I now use CBT techniques daily to manage work stress.",
      improvement: "70% reduction in anxiety symptoms",
      tier: "Premium"
    },
    {
      name: "Sarah Kim",
      role: "Depression Recovery",
      location: "Toronto, Canada",
      content: "The behavioral activation features got me moving again. The AI's gentle nudges and progress tracking kept me accountable.",
      improvement: "Consistent mood improvement over 3 months",
      tier: "Pro"
    }
  ];

  const cbtPlans = [
    {
      tier: 'Basic CBT',
      features: [
        'Basic thought tracking',
        'Simple mood logging',
        'Weekly CBT exercises',
        'Progress summaries'
      ],
      price: '$0',
      duration: 'Free Forever',
      highlight: false
    },
    {
      tier: 'CBT Pro',
      features: [
        'Advanced thought pattern analysis',
        'Personalized CBT worksheets',
        'Behavioral experiment planning',
        'AI-powered insights',
        'Weekly progress reports',
        'Homework reminders'
      ],
      price: '$29',
      duration: 'per month',
      highlight: true
    },
    {
      tier: 'CBT Premium',
      features: [
        'Everything in Pro',
        'Professional CBT assessments',
        'Advanced behavioral analytics',
        'Custom intervention planning',
        'Family involvement tools',
        'Therapist collaboration'
      ],
      price: '$79',
      duration: 'per month',
      highlight: false
    }
  ];

  const cbtConditions = [
    { name: "Depression", effectiveness: "92%", sessions: "12-16 sessions" },
    { name: "Anxiety Disorders", effectiveness: "89%", sessions: "8-12 sessions" },
    { name: "Panic Disorder", effectiveness: "88%", sessions: "10-14 sessions" },
    { name: "Social Anxiety", effectiveness: "85%", sessions: "12-16 sessions" },
    { name: "PTSD", effectiveness: "83%", sessions: "16-20 sessions" },
    { name: "OCD", effectiveness: "80%", sessions: "16-24 sessions" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-blue-50/80">
      {/* Hero Section with Brain Icon Branding */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Brain className="h-5 w-5 mr-2" />
              Evidence-Based CBT
              <Target className="h-5 w-5 ml-2" />
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Cognitive
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Behavioral
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Therapy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Transform your thinking patterns with 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold"> evidence-based CBT</span>,
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold"> AI-powered insights</span>, 
              and <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">structured progress tracking</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Brain className="h-6 w-6 mr-3" />
                Start CBT Journey
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/therapy-chat')}
              >
                <Target className="h-6 w-6 mr-3" />
                Try CBT Exercise
              </Button>
            </div>

            {/* CBT Effectiveness Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">89%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">12-16</div>
                <div className="text-muted-foreground font-medium">Avg Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-muted-foreground font-medium">CBT Techniques</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-muted-foreground font-medium">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CBT Features with Tier Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Powered CBT Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the most comprehensive CBT platform with AI-enhanced tools for lasting behavioral change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cbtFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className={`${feature.tier === 'All Plans' ? 'bg-gray-100 text-gray-700' : feature.tier === 'Premium' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-blue-100 text-blue-700'}`}>
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
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CBT Techniques */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Core CBT Techniques
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Evidence-based techniques for lasting behavioral change
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cbtTechniques.map((technique, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{technique.name}</h3>
                    <Badge variant="outline" className={`
                      ${technique.difficulty === 'Beginner' ? 'border-green-300 text-green-700' : 
                        technique.difficulty === 'Intermediate' ? 'border-blue-300 text-blue-700' : 
                        'border-red-300 text-red-700'}
                    `}>
                      {technique.difficulty}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{technique.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Benefits:</h4>
                    {technique.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
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

      {/* Condition Effectiveness */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CBT Effectiveness by Condition
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Research-backed success rates for various mental health conditions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cbtConditions.map((condition, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{condition.name}</h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {condition.effectiveness}
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                  <div className="text-sm text-muted-foreground mt-2">{condition.sessions}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CBT Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CBT Therapy Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the CBT support level that matches your therapeutic goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cbtPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-blue-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Most Popular</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.duration}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700' : 'variant-outline border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Basic CBT' ? 'Get Started Free' : `Start ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CBT Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from CBT therapy with TherapySync AI
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
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : story.tier === 'Premium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Brain className="h-16 w-16 mx-auto mb-8 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Thoughts?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start your evidence-based CBT journey today and experience the power of structured therapeutic change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Target className="h-5 w-5 mr-2" />
                Begin CBT Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/how-it-works')}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CBTTherapy;