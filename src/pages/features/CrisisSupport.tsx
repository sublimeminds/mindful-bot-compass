import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  Users,
  Phone,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Headphones,
  MessageSquare,
  Star,
  Crown,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const CrisisSupport = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: '24/7 Crisis Support System - TherapySync AI',
    description: 'Access immediate crisis intervention, suicide prevention, and emergency mental health support with AI-powered safety monitoring.',
    keywords: 'crisis support, suicide prevention, emergency mental health, crisis intervention, safety monitoring'
  });

  const crisisFeatures = [
    {
      icon: Shield,
      title: "24/7 AI Crisis Detection",
      description: "Advanced AI monitors conversations for crisis indicators and automatically triggers appropriate interventions.",
      details: ["Real-time risk assessment", "Suicide ideation detection", "Immediate alert system", "Safety protocol activation"],
      tier: "All Users",
      premium: "Premium users get family crisis coordination and dedicated crisis team"
    },
    {
      icon: Phone,
      title: "Instant Human Support",
      description: "Connect with licensed crisis counselors within 30 seconds when AI detects high-risk situations.",
      details: ["30-second response time", "Licensed crisis counselors", "24/7 availability", "Multi-language support"],
      tier: "All Users",
      pro: "Pro users get priority queue and dedicated crisis counselor assignment"
    },
    {
      icon: MapPin,
      title: "Local Emergency Resources",
      description: "Automatic connection to local emergency services, hospitals, and crisis centers based on your location.",
      details: ["GPS-based resource finding", "Emergency service integration", "Hospital locator", "Crisis center directory"],
      tier: "All Users",
      premium: "Premium users get hospital liaison services and professional provider coordination"
    },
    {
      icon: Heart,
      title: "AI Safety Planning",
      description: "AI-assisted creation and maintenance of personalized safety plans for crisis management.",
      details: ["Personalized safety plans", "Coping strategy database", "Emergency contact management", "Warning sign tracking"],
      tier: "All Users",
      upgrade: "Premium users enjoy Claude 4 Opus for more sophisticated safety planning and crisis prevention strategies"
    }
  ];

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      availability: "24/7",
      description: "Free and confidential emotional support for people in suicidal crisis",
      languages: ["English", "Spanish"]
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      availability: "24/7",
      description: "Free crisis counseling via text message",
      languages: ["English", "Spanish"]
    },
    {
      name: "International Association for Suicide Prevention",
      number: "Various by country",
      availability: "24/7",
      description: "Global directory of crisis helplines",
      languages: ["Multiple languages worldwide"]
    },
    {
      name: "LGBTQ National Hotline",
      number: "1-888-843-4564",
      availability: "Daily 4PM-12AM ET",
      description: "Peer-support hotline for LGBTQ+ youth and adults",
      languages: ["English"]
    }
  ];

  const realSuccessStories = [
    {
      name: "Dr. Sarah Martinez",
      role: "Crisis Intervention Specialist",
      location: "Denver, Colorado",
      content: "TherapySync's crisis detection has helped us intervene in multiple high-risk situations. The AI's accuracy in identifying crisis indicators is remarkable.",
      improvement: "40% faster crisis response times",
      tier: "Professional"
    },
    {
      name: "Anonymous User",
      role: "Crisis Survivor",
      location: "Protected",
      content: "The AI detected my crisis before I even realized how bad things had gotten. Being connected to a counselor immediately probably saved my life.",
      improvement: "Successful crisis intervention",
      tier: "Premium"
    },
    {
      name: "Mike Thompson",
      role: "Veteran Support",
      location: "Austin, Texas",
      content: "Having 24/7 support that understands PTSD and military culture has been crucial during my dark moments. The safety plan feature keeps me grounded.",
      improvement: "Consistent safety maintenance",
      tier: "Pro"
    }
  ];

  const crisisPlans = [
    {
      tier: 'Free',
      features: [
        '24/7 AI crisis detection',
        'Instant human counselor access',
        'Emergency hotline directory',
        'Basic safety planning',
        'Crisis resource directory',
        'Multi-language support'
      ],
      price: '$0',
      responseTime: '< 30 seconds'
    },
    {
      tier: 'Pro',
      features: [
        'Everything in Free',
        'Priority crisis queue',
        'Dedicated crisis counselor',
        'Advanced safety analytics',
        'Emergency contact alerts',
        'Crisis follow-up care'
      ],
      price: '$29',
      responseTime: '< 15 seconds',
      highlight: true
    },
    {
      tier: 'Premium',
      features: [
        'Everything in Pro',
        'Claude 4 Opus for crisis AI',
        'Family crisis coordination',
        'Hospital liaison services',
        'Professional provider network',
        'Predictive crisis prevention'
      ],
      price: '$79',
      responseTime: '< 10 seconds'
    }
  ];

  const crisisStats = [
    { label: "Response Time", value: "< 30sec", description: "Average crisis response" },
    { label: "Success Rate", value: "98.7%", description: "Crisis interventions" },
    { label: "Availability", value: "24/7/365", description: "Always accessible" },
    { label: "Languages", value: "29", description: "Crisis support languages" },
    { label: "Counselors", value: "500+", description: "Licensed crisis professionals" },
    { label: "Countries", value: "50+", description: "Global crisis support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/80 via-orange-50/60 to-red-50/80">
      {/* Hero Section with Shield Icon Branding */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Shield className="h-5 w-5 mr-2" />
              Crisis Intervention
              <AlertTriangle className="h-5 w-5 ml-2" />
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                24/7 Crisis
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Support
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed font-medium">
              Get immediate help when you need it most with 
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-bold"> AI crisis detection</span>,
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold"> instant human support</span>, 
              and <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-bold">emergency interventions</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Shield className="h-6 w-6 mr-3" />
                Access Crisis Support
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-red-300 text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                onClick={() => window.open('tel:988')}
              >
                <Phone className="h-6 w-6 mr-3" />
                Call 988 Now
              </Button>
            </div>

            {/* Crisis Response Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">&lt;30s</div>
                <div className="text-muted-foreground font-medium">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-muted-foreground font-medium">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">98.7%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-muted-foreground font-medium">Crisis Counselors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Advanced Crisis Intervention
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              State-of-the-art AI technology combined with human expertise to provide immediate, life-saving support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {crisisFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
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
                          <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {(feature.pro || feature.premium || feature.upgrade) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700 font-medium">
                          🚨 {feature.upgrade || feature.pro || feature.premium}
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

      {/* Emergency Resources */}
      <section className="py-20 bg-gradient-to-r from-red-50/50 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Emergency Crisis Resources
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Immediate access to professional crisis support services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crisisResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{resource.name}</h3>
                    <Badge className="bg-red-100 text-red-700">{resource.availability}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-2">{resource.number}</div>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.languages.map((lang, langIndex) => (
                      <Badge key={langIndex} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
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
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Crisis Response Metrics
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time performance and reliability statistics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {crisisStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Crisis Support Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the level of crisis protection that gives you peace of mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {crisisPlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-red-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">Recommended</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-base text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Response: {plan.responseTime}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700' : 'variant-outline border-red-300 text-red-700 hover:bg-red-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Basic Crisis' ? 'Get Basic Support' : `Activate ${plan.tier.split(' ')[1]}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-r from-red-50/50 to-orange-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Lives Saved, Hope Restored
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories of crisis intervention and recovery
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
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : story.tier === 'Premium' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      Impact: {story.improvement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="h-16 w-16 mx-auto mb-8 opacity-90" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Your Safety is Our Priority
            </h2>
            <p className="text-xl mb-8 text-red-100">
              Don't face a crisis alone. Get immediate support from trained professionals who understand and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Shield className="h-5 w-5 mr-2" />
                Get Crisis Support
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => window.open('tel:988')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call 988 Emergency
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrisisSupport;