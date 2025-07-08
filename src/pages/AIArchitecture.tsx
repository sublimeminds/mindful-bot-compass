import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Shield,
  Zap,
  BarChart,
  MessageSquare,
  HeartHandshake,
  Clock,
  Globe,
  TrendingUp,
  Activity,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Heart,
  Moon,
  Star,
  Lightbulb,
  UserCheck,
  Timer,
  Headphones,
  BookOpen,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIArchitecture = () => {
  const navigate = useNavigate();

  const aiCapabilities = [
    {
      name: "Your Personal AI Therapist",
      description: "Like having multiple expert therapists available 24/7",
      benefits: ["Always available when you need support", "Remembers your journey and progress", "Adapts to your unique personality", "Never judges, always listens"],
      highlight: "Available 24/7",
      color: "from-therapy-500 to-therapy-600"
    },
    {
      name: "Human-Like Understanding", 
      description: "AI that truly gets you and responds like a caring professional",
      benefits: ["Understands emotional nuances", "Responds with empathy and care", "Remembers what matters to you", "Provides culturally sensitive support"],
      highlight: "96% User Satisfaction",
      color: "from-harmony-500 to-harmony-600"
    },
    {
      name: "Always Learning & Growing",
      description: "Your AI therapist gets better at helping you over time",
      benefits: ["Learns your communication style", "Adapts therapy techniques to you", "Tracks what works best for you", "Continuously improves support"],
      highlight: "Personalized Growth",
      color: "from-flow-500 to-flow-600"
    }
  ];

  const whyChooseUs = [
    {
      icon: Heart,
      title: "Remembers Everything That Matters",
      description: "Unlike other therapy apps, our AI remembers your conversations, progress, and what's important to you across all sessions.",
      userBenefit: "You never have to repeat your story or start over",
      details: [
        "Builds on previous conversations seamlessly",
        "Tracks your emotional patterns and triggers",
        "Remembers your goals and celebrates progress",
        "Maintains therapeutic continuity",
        "Your privacy is always protected"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Always Watching Out for You",
      description: "Our AI quietly monitors your wellbeing and can detect when you might need extra support or professional help.",
      userBenefit: "You're never alone in a crisis",
      details: [
        "Detects when you're having a tough time",
        "Offers immediate coping strategies",
        "Can connect you with crisis resources",
        "Alerts trusted contacts if needed",
        "Available instantly when you need help"
      ]
    },
    {
      icon: Target,
      title: "Creates Your Personal Therapy Plan",
      description: "Your AI therapist designs a therapy plan just for you and adjusts it based on your progress and changing needs.",
      userBenefit: "Therapy that evolves with you",
      details: [
        "Personalized treatment approaches",
        "Recommends techniques that work for you",
        "Adjusts based on your progress",
        "Integrates your preferences and culture",
        "Evidence-based therapy methods"
      ]
    },
    {
      icon: Globe,
      title: "Understands Your Background",
      description: "Our AI is trained to understand and respect different cultures, languages, and personal backgrounds.",
      userBenefit: "Therapy that honors who you are",
      details: [
        "Supports 29 languages fluently",
        "Respects cultural differences",
        "Adapts to your communication style",
        "Honors religious and spiritual beliefs",
        "Inclusive of all backgrounds and identities"
      ]
    }
  ];

  const userExperience = [
    {
      title: "Instant Support",
      description: "Get help the moment you need it",
      icon: Zap,
      stat: "< 500ms response time"
    },
    {
      title: "Always Available",
      description: "Never wait for an appointment",
      icon: Clock,
      stat: "24/7 availability"
    },
    {
      title: "Highly Accurate",
      description: "Reliable and helpful responses",
      icon: Target,
      stat: "96.7% accuracy"
    },
    {
      title: "Crisis Ready",
      description: "Immediate help when you need it most",
      icon: Shield,
      stat: "< 3 sec crisis detection"
    },
    {
      title: "Global Support",
      description: "Help in your preferred language",
      icon: Globe,
      stat: "29 languages"
    },
    {
      title: "Trusted by Many",
      description: "Join thousands finding help",
      icon: Users,
      stat: "50K+ daily users"
    }
  ];

  const realStories = [
    {
      quote: "It's like having a therapist who actually remembers what I told them last week. The AI picks up exactly where we left off.",
      benefit: "Continuous care without repetition",
      icon: Brain
    },
    {
      quote: "I was having a panic attack at 2 AM and the AI was there immediately. It helped me through breathing exercises until I calmed down.",
      benefit: "24/7 crisis support when you need it",
      icon: Heart
    },
    {
      quote: "The AI understands my cultural background and doesn't make me explain why certain things matter to my family.",
      benefit: "Culturally aware therapy",
      icon: Globe
    },
    {
      quote: "After a few sessions, it started suggesting techniques that actually work for me specifically. It's like it learned my style.",
      benefit: "Personalized therapy approaches",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-25 to-calm-25">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-therapy-600 to-calm-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold">Why Our AI Understands You Better</h1>
            </div>
            <p className="text-xl text-therapy-100 mb-8 leading-relaxed">
              We've created the most human-like AI therapy experience by combining the best of ChatGPT and Anthropic's Claude. 
              The result? An AI therapist that truly understands, remembers, and grows with you on your mental health journey.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Human-Like Conversations</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Your Privacy Protected</span>
              </div>
              <div className="flex items-center">
                <Timer className="h-5 w-5 mr-2" />
                <span>Always Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Why It Works Better */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Always Available When You Need Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userExperience.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-2 border-therapy-100">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-therapy-700 mb-2">{item.stat}</div>
                  <div className="text-lg font-medium mb-2">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Like Having Multiple Therapists */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Like Having Multiple Expert Therapists in One
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {aiCapabilities.map((capability, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{capability.name}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${capability.color} text-white border-0`}>
                      {capability.highlight}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{capability.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium mb-2">What this means for you:</h4>
                    <ul className="space-y-2">
                      {capability.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* What Makes Us Different */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            What Makes TherapySync Different
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {whyChooseUs.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      <div className="mt-3 p-3 bg-therapy-50 rounded-lg">
                        <p className="text-therapy-700 font-medium text-sm">✨ {feature.userBenefit}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-therapy-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Real User Experiences */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            What People Say About Our AI
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {realStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <story.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-gray-700 italic mb-3 leading-relaxed">
                        "{story.quote}"
                      </blockquote>
                      <div className="bg-harmony-50 p-3 rounded-lg">
                        <p className="text-harmony-700 font-medium text-sm">
                          💝 {story.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparison: Why We're Better */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
            Why Choose TherapySync Over Others?
          </h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-therapy-50 to-calm-50">
                    <tr>
                      <th className="text-left p-4 font-semibold">What You Get</th>
                      <th className="text-center p-4 font-semibold text-therapy-600">TherapySync</th>
                      <th className="text-center p-4 font-semibold text-gray-500">Other Apps</th>
                      <th className="text-center p-4 font-semibold text-gray-500">Traditional Therapy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Remembers Your Story</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Forgets Each Time</span></td>
                      <td className="text-center p-4"><span className="text-orange-600">Sometimes</span></td>
                    </tr>
                    <tr className="border-b bg-gray-25">
                      <td className="p-4 font-medium">Available 24/7</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Appointments Only</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Crisis Detection & Help</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Basic or None</span></td>
                      <td className="text-center p-4"><span className="text-orange-600">During Sessions</span></td>
                    </tr>
                    <tr className="border-b bg-gray-25">
                      <td className="p-4 font-medium">Learns Your Preferences</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Limited</span></td>
                      <td className="text-center p-4"><span className="text-orange-600">Over Time</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Cultural Understanding</td>
                      <td className="text-center p-4"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                      <td className="text-center p-4"><span className="text-gray-400">Basic</span></td>
                      <td className="text-center p-4"><span className="text-orange-600">Depends on Therapist</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Response Speed</td>
                      <td className="text-center p-4"><span className="text-therapy-600 font-semibold">Instant</span></td>
                      <td className="text-center p-4"><span className="text-orange-600">Few Seconds</span></td>
                      <td className="text-center p-4"><span className="text-gray-400">Next Appointment</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 therapy-text-gradient">
              Ready for Therapy That Actually Understands You?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who've found the mental health support they've been looking for. 
              Start your first conversation with an AI that remembers, cares, and grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/therapy-chat')}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-3"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Your First Session Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/features')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <Eye className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <Star className="h-5 w-5 mr-2" />
                View Plans
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIArchitecture;