import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Heart, 
  Users, 
  Star, 
  Shield, 
  Lightbulb,
  MapPin,
  Languages,
  BookOpen,
  Moon,
  Sun,
  Flower,
  Mountain,
  Waves,
  TreePine,
  ArrowRight,
  CheckCircle,
  Sparkles,
  MessageCircle,
  UserCheck,
  Brain,
  Compass,
  Palette,
  Music,
  Coffee,
  Utensils,
  Home,
  Clock,
  Calendar,
  Target,
  Award,
  TrendingUp,
  Eye,
  Ear,
  HandHeart,
  Smile,
  Zap,
  Layers,
  Network
} from 'lucide-react';

// Cache-buster for force refresh - Updated Component
const COMPONENT_VERSION = Date.now();
console.log(`🚀 Cultural AI Component Loaded - Version: ${COMPONENT_VERSION} - Cache Cleared`);

const CulturalAI = () => {
  // Add cache-busting effect
  React.useEffect(() => {
    console.log(`🎨 Cultural AI Page Mounted - ${new Date().toISOString()}`);
    
    // Force DOM update with timestamp
    const timestamp = Date.now();
    document.documentElement.setAttribute('data-cultural-ai-version', timestamp.toString());
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cultural Mosaic Design */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden">
        {/* Cultural Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #f59e0b 2px, transparent 2px),
              radial-gradient(circle at 75% 25%, #ef4444 2px, transparent 2px),
              radial-gradient(circle at 25% 75%, #8b5cf6 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #10b981 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Floating Cultural Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🏮</div>
          <div className="absolute top-32 right-20 text-5xl opacity-10 animate-bounce">🕌</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse">⛩️</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-bounce">🏛️</div>
          <div className="absolute top-1/2 left-1/4 text-4xl opacity-10">🎭</div>
          <div className="absolute top-1/3 right-1/3 text-4xl opacity-10">🗿</div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-6 py-3 text-base font-medium">
              <Globe className="w-5 h-5 mr-2" />
              Cultural Intelligence AI
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Every Culture
              </span>
              <br />
              <span className="text-gray-900">Every Story</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                Every Heart
              </span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              AI that speaks your language, understands your traditions, and honors your cultural heritage 
              in every therapeutic interaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-4 text-xl font-medium group transition-all duration-300 shadow-lg"
              >
                Discover Your Cultural AI
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-4 text-xl font-medium transition-all duration-300"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                See Cultural Examples
              </Button>
            </div>
            
            {/* Cultural Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <div className="text-3xl font-bold text-amber-600 mb-2">100+</div>
                <div className="text-gray-600">Cultural Contexts</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600">Languages</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <div className="text-3xl font-bold text-red-600 mb-2">25+</div>
                <div className="text-gray-600">Healing Traditions</div>
              </div>
              <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
                <div className="text-gray-600">Unique Stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Dimensions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cultural Intelligence Dimensions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI understands culture through multiple interconnected lenses, creating a holistic understanding of your unique background.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Language & Communication */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Languages className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Language & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6">
                  Understanding not just words, but the cultural nuances, expressions, and communication patterns that shape meaning.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Direct vs. Indirect Communication</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Ear className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">High-Context vs. Low-Context</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Smile className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Emotional Expression Styles</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Storytelling Traditions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values & Beliefs */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Values & Beliefs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6">
                  Respecting the core values, spiritual beliefs, and moral frameworks that guide your life decisions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Compass className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Individual vs. Collective Values</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Spiritual & Religious Practices</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Honor & Respect Systems</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <HandHeart className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Family & Community Bonds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Structures */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-teal-50 border-green-200/50">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-900">Social Structures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6">
                  Understanding how relationships, hierarchies, and social expectations shape your worldview and interactions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Home className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Family Dynamics & Roles</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Network className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Community Relationships</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <Layers className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Power Distance Awareness</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Gender Role Expectations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Traditional Healing Integration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Honoring Ancient Wisdom
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Integrating time-tested healing traditions from around the world with modern therapeutic approaches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Eastern Traditions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mountain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Eastern Wisdom</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-emerald-100">
                  • Mindfulness & Meditation
                </div>
                <div className="text-sm text-emerald-100">
                  • Traditional Chinese Medicine
                </div>
                <div className="text-sm text-emerald-100">
                  • Ayurvedic Principles
                </div>
                <div className="text-sm text-emerald-100">
                  • Buddhist Psychology
                </div>
                <div className="text-sm text-emerald-100">
                  • Zen Philosophy
                </div>
              </CardContent>
            </Card>

            {/* Indigenous Practices */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Indigenous Healing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-emerald-100">
                  • Circle Healing Practices
                </div>
                <div className="text-sm text-emerald-100">
                  • Nature-Based Therapy
                </div>
                <div className="text-sm text-emerald-100">
                  • Storytelling Medicine
                </div>
                <div className="text-sm text-emerald-100">
                  • Community Healing
                </div>
                <div className="text-sm text-emerald-100">
                  • Ancestral Wisdom
                </div>
              </CardContent>
            </Card>

            {/* African Traditions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">African Wisdom</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-emerald-100">
                  • Ubuntu Philosophy
                </div>
                <div className="text-sm text-emerald-100">
                  • Rhythmic Healing
                </div>
                <div className="text-sm text-emerald-100">
                  • Communal Support Systems
                </div>
                <div className="text-sm text-emerald-100">
                  • Oral Tradition Therapy
                </div>
                <div className="text-sm text-emerald-100">
                  • Ancestral Connection
                </div>
              </CardContent>
            </Card>

            {/* Western Integration */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Modern Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-emerald-100">
                  • Evidence-Based Therapy
                </div>
                <div className="text-sm text-emerald-100">
                  • Cognitive Behavioral Therapy
                </div>
                <div className="text-sm text-emerald-100">
                  • Trauma-Informed Care
                </div>
                <div className="text-sm text-emerald-100">
                  • Neuroscience Integration
                </div>
                <div className="text-sm text-emerald-100">
                  • Digital Wellness
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Examples Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Cultural Examples in Action
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI adapts its approach based on different cultural contexts and backgrounds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Asian Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🏮</div>
                  <CardTitle className="text-lg">East Asian Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "I understand the importance of family harmony and saving face. Let us work together to find solutions that honor your family relationships while supporting your personal well-being."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Collectivism</Badge>
                  <Badge variant="secondary" className="text-xs">Indirect Communication</Badge>
                  <Badge variant="secondary" className="text-xs">Respect for Elders</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Latin American Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🌺</div>
                  <CardTitle className="text-lg">Latin American Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "Your strong connection to family and community is a beautiful strength. Let us explore how your cultural values of warmth and togetherness can support your healing journey."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Familismo</Badge>
                  <Badge variant="secondary" className="text-xs">Personalismo</Badge>
                  <Badge variant="secondary" className="text-xs">Spirituality</Badge>
                </div>
              </CardContent>
            </Card>

            {/* African Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🌍</div>
                  <CardTitle className="text-lg">African Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "Ubuntu teaches us that we are interconnected - 'I am because we are.' Your healing journey is not just personal but contributes to the wellness of your entire community."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Ubuntu</Badge>
                  <Badge variant="secondary" className="text-xs">Community Healing</Badge>
                  <Badge variant="secondary" className="text-xs">Ancestral Wisdom</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Middle Eastern Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🕌</div>
                  <CardTitle className="text-lg">Middle Eastern Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "I respect the role of faith and spiritual practices in your life. Let us integrate your beliefs and values as sources of strength and guidance in our therapeutic work."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Faith Integration</Badge>
                  <Badge variant="secondary" className="text-xs">Honor & Dignity</Badge>
                  <Badge variant="secondary" className="text-xs">Extended Family</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Indigenous Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🪶</div>
                  <CardTitle className="text-lg">Indigenous Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "Your connection to the land, ancestors, and traditional ways of knowing are profound sources of wisdom. Let us honor these teachings as we walk this healing path together."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Nature Connection</Badge>
                  <Badge variant="secondary" className="text-xs">Ancestral Wisdom</Badge>
                  <Badge variant="secondary" className="text-xs">Circular Thinking</Badge>
                </div>
              </CardContent>
            </Card>

            {/* European Cultural Context */}
            <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🏰</div>
                  <CardTitle className="text-lg">European Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  "I appreciate your value for individual autonomy and intellectual discourse. Let us approach your healing with thoughtful analysis while honoring your personal agency and cultural heritage."
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Individualism</Badge>
                  <Badge variant="secondary" className="text-xs">Rationalism</Badge>
                  <Badge variant="secondary" className="text-xs">Direct Communication</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Cultural AI?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands who have found deeper healing through culturally intelligent AI therapy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl font-medium group transition-all duration-300 shadow-lg"
            >
              Start Your Cultural Journey
              <Sparkles className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-12 py-6 text-xl font-medium transition-all duration-300"
            >
              <BookOpen className="mr-3 h-6 w-6" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturalAI;