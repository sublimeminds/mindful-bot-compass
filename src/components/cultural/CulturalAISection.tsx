import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Heart, 
  Users, 
  Languages,
  BookOpen,
  Mountain,
  TreePine,
  Sun,
  Brain,
  Compass,
  MessageCircle,
  Sparkles,
  ArrowRight,
  UserCheck,
  Home,
  Network,
  Layers,
  HandHeart,
  Star,
  Shield,
  Ear,
  Smile
} from 'lucide-react';

const CulturalAISection = () => {
  const culturalDimensions = [
    {
      icon: Languages,
      title: "Language & Communication",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50/20 to-indigo-50/20",
      description: "Understanding not just words, but cultural nuances, expressions, and communication patterns.",
      features: [
        { icon: MessageCircle, text: "Direct vs. Indirect Communication" },
        { icon: Ear, text: "High-Context vs. Low-Context" },
        { icon: Smile, text: "Emotional Expression Styles" },
        { icon: BookOpen, text: "Storytelling Traditions" }
      ]
    },
    {
      icon: Heart,
      title: "Values & Beliefs",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50/20 to-pink-50/20",
      description: "Respecting core values, spiritual beliefs, and moral frameworks that guide life decisions.",
      features: [
        { icon: Compass, text: "Individual vs. Collective Values" },
        { icon: Star, text: "Spiritual & Religious Practices" },
        { icon: Shield, text: "Honor & Respect Systems" },
        { icon: HandHeart, text: "Family & Community Bonds" }
      ]
    },
    {
      icon: Users,
      title: "Social Structures",
      color: "from-green-500 to-teal-600",
      bgColor: "from-green-50/20 to-teal-50/20",
      description: "Understanding how relationships, hierarchies, and social expectations shape worldview.",
      features: [
        { icon: Home, text: "Family Dynamics & Roles" },
        { icon: Network, text: "Community Relationships" },
        { icon: Layers, text: "Power Distance Awareness" },
        { icon: UserCheck, text: "Gender Role Expectations" }
      ]
    }
  ];

  const healingTraditions = [
    {
      icon: Mountain,
      title: "Eastern Wisdom",
      color: "from-amber-400 to-orange-500",
      traditions: [
        "Mindfulness & Meditation",
        "Traditional Chinese Medicine",
        "Ayurvedic Principles",
        "Buddhist Psychology",
        "Zen Philosophy"
      ]
    },
    {
      icon: TreePine,
      title: "Indigenous Healing",
      color: "from-green-400 to-emerald-500",
      traditions: [
        "Circle Healing Practices",
        "Nature-Based Therapy",
        "Storytelling Medicine",
        "Community Healing",
        "Ancestral Wisdom"
      ]
    },
    {
      icon: Sun,
      title: "African Wisdom",
      color: "from-red-400 to-pink-500",
      traditions: [
        "Ubuntu Philosophy",
        "Rhythmic Healing",
        "Communal Support Systems",
        "Oral Tradition Therapy",
        "Ancestral Connection"
      ]
    },
    {
      icon: Brain,
      title: "Modern Integration",
      color: "from-blue-400 to-purple-500",
      traditions: [
        "Evidence-Based Therapy",
        "Culturally Adapted CBT",
        "Narrative Therapy",
        "Somatic Experiencing",
        "Trauma-Informed Care"
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Content */}
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-8 bg-white/90 text-foreground border border-white px-6 py-3 text-base font-medium shadow-lg">
          <Globe className="w-5 h-5 mr-2" />
          Cultural Intelligence AI
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
            Every Culture
          </span>
          <br />
          <span className="text-white">Every Story</span>
          <br />
          <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
            Every Heart
          </span>
        </h1>
        
        <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          AI that speaks your language, understands your traditions, and honors your cultural heritage 
          in every therapeutic interaction.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-4 text-lg font-medium group transition-all duration-300 shadow-lg"
          >
            <Sparkles className="mr-3 h-5 w-5" />
            Discover Your Cultural AI
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Cultural Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center p-6 bg-white/90 rounded-2xl border border-white shadow-lg">
            <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
            <div className="text-foreground">Cultural Contexts</div>
          </div>
          <div className="text-center p-6 bg-white/90 rounded-2xl border border-white shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-foreground">Languages</div>
          </div>
          <div className="text-center p-6 bg-white/90 rounded-2xl border border-white shadow-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">25+</div>
            <div className="text-foreground">Healing Traditions</div>
          </div>
          <div className="text-center p-6 bg-white/90 rounded-2xl border border-white shadow-lg">
            <div className="text-3xl font-bold text-purple-300 mb-2">∞</div>
            <div className="text-white/80">Unique Stories</div>
          </div>
        </div>
      </div>

      {/* Cultural Dimensions */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Cultural Intelligence Dimensions
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Our AI understands culture through multiple interconnected lenses, creating a holistic understanding of your unique background.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {culturalDimensions.map((dimension, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white/90 border-white hover:bg-white">
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 bg-gradient-to-br ${dimension.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <dimension.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">{dimension.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/80 text-center mb-6">
                  {dimension.description}
                </p>
                <div className="space-y-3">
                  {dimension.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-white" />
                      <span className="text-sm font-medium text-white">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Traditional Healing Integration */}
      <div className="mb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Honoring Ancient Wisdom
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Integrating time-tested healing traditions from around the world with modern therapeutic approaches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {healingTraditions.map((tradition, index) => (
            <Card key={index} className="bg-white/90 border-white text-foreground hover:bg-white transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${tradition.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <tradition.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{tradition.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tradition.traditions.map((item, itemIndex) => (
                  <div key={itemIndex} className="text-sm text-white/80">
                    • {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulturalAISection;