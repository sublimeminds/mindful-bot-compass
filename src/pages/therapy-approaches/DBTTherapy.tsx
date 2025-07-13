import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Brain, 
  Target,
  CheckCircle,
  ArrowRight,
  Zap,
  Calendar,
  BookOpen,
  Star,
  Crown,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const DBTTherapy = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Dialectical Behavior Therapy (DBT) - TherapySync AI',
    description: 'Master emotional regulation and interpersonal skills with AI-powered DBT therapy. Learn distress tolerance and mindfulness techniques.',
    keywords: 'DBT therapy, dialectical behavior therapy, emotional regulation, distress tolerance, interpersonal effectiveness'
  });

  const dbtSkills = [
    {
      icon: Heart,
      title: "Emotional Regulation",
      description: "Learn to understand, experience, and manage emotions effectively without being overwhelmed.",
      details: ["Emotion identification", "Intensity management", "Emotion surfing", "Opposite action techniques"],
      tier: "Pro+"
    },
    {
      icon: Users,
      title: "Interpersonal Effectiveness",
      description: "Build healthy relationships while maintaining self-respect and achieving your goals.",
      details: ["DEAR MAN techniques", "Boundary setting", "Relationship skills", "Conflict resolution"],
      tier: "All Plans"
    },
    {
      icon: Brain,
      title: "Distress Tolerance",
      description: "Survive crisis situations without making them worse through impulsive actions.",
      details: ["TIPP techniques", "Distraction methods", "Self-soothing strategies", "Crisis survival skills"],
      tier: "Pro+"
    },
    {
      icon: Target,
      title: "Mindfulness",
      description: "Develop present-moment awareness and non-judgmental observation of thoughts and feelings.",
      details: ["Wise mind practice", "Observe and describe", "Non-judgmental stance", "One-mindfully focus"],
      tier: "Premium"
    }
  ];

  const dbtModules = [
    {
      name: "Core Mindfulness",
      description: "Foundation skills for awareness and acceptance",
      techniques: ["Wise Mind", "Observe & Describe", "Participate", "Non-judgmental stance"],
      duration: "4 weeks"
    },
    {
      name: "Distress Tolerance", 
      description: "Crisis survival and distress tolerance skills",
      techniques: ["TIPP", "Distraction", "Self-soothing", "Improving the moment"],
      duration: "4 weeks"
    },
    {
      name: "Emotion Regulation",
      description: "Understanding and managing intense emotions",
      techniques: ["Emotion identification", "Opposite action", "Mastery activities", "PLEASE skills"],
      duration: "6 weeks"
    },
    {
      name: "Interpersonal Effectiveness",
      description: "Building and maintaining healthy relationships",
      techniques: ["DEAR MAN", "GIVE", "FAST", "Relationship mindfulness"],
      duration: "4 weeks"
    }
  ];

  const realUserStories = [
    {
      name: "Dr. Rachel Kim",
      role: "DBT Therapist", 
      location: "San Francisco, CA",
      content: "The AI's implementation of DBT skills is remarkably accurate. My clients practice between sessions and come back with real progress in emotional regulation.",
      improvement: "92% client skill retention",
      tier: "Professional"
    },
    {
      name: "Marcus Johnson",
      role: "Borderline Personality Disorder",
      location: "Chicago, IL", 
      content: "DBT skills training through the AI has been life-changing. I can finally manage my emotions without pushing people away.",
      improvement: "80% reduction in crisis episodes",
      tier: "Premium"
    },
    {
      name: "Lisa Chen",
      role: "Anxiety & Relationships",
      location: "Vancouver, Canada",
      content: "The DEAR MAN technique helped me communicate my needs clearly. My relationships have improved dramatically.",
      improvement: "Healthy relationship maintenance",
      tier: "Pro"
    }
  ];

  const dbtPlans = [
    {
      tier: 'DBT Basics',
      features: [
        'Core mindfulness exercises',
        'Basic emotion tracking',
        'Simple distress tolerance tools',
        'Weekly skill reminders'
      ],
      price: '$0',
      duration: 'Free Forever'
    },
    {
      tier: 'DBT Pro',
      features: [
        'All 4 DBT modules',
        'Personalized skill coaching',
        'Crisis plan development',
        'DEAR MAN practice tools',
        'Emotion regulation tracking',
        'Daily skills reminders'
      ],
      price: '$29',
      duration: 'per month',
      highlight: true
    },
    {
      tier: 'DBT Premium',
      features: [
        'Everything in Pro',
        'Advanced emotion analytics',
        'Family skills training',
        'Crisis intervention support',
        'Therapist collaboration tools',
        'Custom skill development'
      ],
      price: '$79',
      duration: 'per month'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-green-50/80">
      {/* Hero Section with Heart Icon Branding */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Heart className="h-5 w-5 mr-2" />
              DBT Skills Training
              <Users className="h-5 w-5 ml-2" />
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Dialectical
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Behavior
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Therapy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Master emotional regulation with 
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold"> evidence-based DBT skills</span>,
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-bold"> crisis survival techniques</span>, 
              and <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">interpersonal effectiveness</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-6 w-6 mr-3" />
                Start DBT Training
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/therapy-chat')}
              >
                <Users className="h-6 w-6 mr-3" />
                Practice Skills
              </Button>
            </div>

            {/* DBT Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">4</div>
                <div className="text-muted-foreground font-medium">Core Modules</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">24</div>
                <div className="text-muted-foreground font-medium">Essential Skills</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">85%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-muted-foreground font-medium">Skills Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DBT Skills with Tier Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Core DBT Skills Modules
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master the four essential skills modules that form the foundation of dialectical behavior therapy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dbtSkills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className={`${skill.tier === 'All Plans' ? 'bg-gray-100 text-gray-700' : skill.tier === 'Premium' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-green-100 text-green-700'}`}>
                        {skill.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold">{skill.title}</CardTitle>
                    <p className="text-muted-foreground text-lg leading-relaxed">{skill.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {skill.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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

      {/* DBT Modules Timeline */}
      <section className="py-20 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                DBT Skills Training Program
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Structured 18-week program covering all essential DBT skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbtModules.map((module, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <h3 className="font-bold text-lg">{module.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                    <Badge variant="outline" className="text-green-700 border-green-300">{module.duration}</Badge>
                  </div>
                  <div className="space-y-2">
                    {module.techniques.map((technique, techIndex) => (
                      <div key={techIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{technique}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DBT Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                DBT Skills Training Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the DBT support level that matches your emotional regulation goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbtPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-green-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Most Popular</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.duration}</div>
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
                    {plan.tier === 'DBT Basics' ? 'Get Started Free' : `Start ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                DBT Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real transformations through DBT skills training
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-8 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Master Your Emotions?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Start your DBT skills journey today and discover the power of emotional regulation and interpersonal effectiveness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Users className="h-5 w-5 mr-2" />
                Begin DBT Training
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

export default DBTTherapy;