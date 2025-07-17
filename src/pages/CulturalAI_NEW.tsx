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

const CulturalAI = () => {
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
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🏮</div>
          <div className="absolute top-32 right-20 text-5xl opacity-10 animate-float animation-delay-200">🕌</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float animation-delay-400">⛩️</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float animation-delay-600">🏛️</div>
          <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float animation-delay-800">🎭</div>
          <div className="absolute top-1/3 right-1/3 text-4xl opacity-10 animate-float animation-delay-1000">🗿</div>
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
                  • Evidence-Based Practice
                </div>
                <div className="text-sm text-emerald-100">
                  • Trauma-Informed Care
                </div>
                <div className="text-sm text-emerald-100">
                  • Narrative Therapy
                </div>
                <div className="text-sm text-emerald-100">
                  • Somatic Approaches
                </div>
                <div className="text-sm text-emerald-100">
                  • Cultural Adaptation
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Adaptation Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How Cultural AI Adapts to You
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A sophisticated process that learns and evolves to provide the most culturally appropriate care.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Cultural Discovery</h3>
              <p className="text-gray-600 text-sm">
                Understanding your background, values, and communication preferences through respectful inquiry.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Approach Customization</h3>
              <p className="text-gray-600 text-sm">
                Tailoring therapeutic techniques and communication style to align with your cultural context.
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-gray-400" />
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Continuous Learning</h3>
              <p className="text-gray-600 text-sm">
                Evolving understanding through ongoing interactions and feedback to provide better support.
              </p>
            </div>
          </div>

          {/* Cultural Sensitivity Metrics */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">Cultural Sensitivity Metrics</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
                <div className="text-gray-300">Cultural Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">4.9/5</div>
                <div className="text-gray-300">Cultural Sensitivity Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-gray-300">User Comfort Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-gray-300">Cultural Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Cultural Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Cultural AI in Action
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI adapts its approach based on different cultural contexts and needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Example 1: East Asian Context */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white border-2 border-indigo-100">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
                    🏮
                  </div>
                  <div>
                    <CardTitle className="text-xl text-indigo-900">East Asian Context</CardTitle>
                    <p className="text-sm text-gray-600">Harmony & family-centered approach</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800 italic">
                    "I understand that discussing personal struggles might feel like bringing shame to your family. 
                    Let's explore ways to find balance and harmony while honoring your family's values."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm">Indirect communication style</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm">Face-saving considerations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm">Collective harmony focus</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 2: Latin American Context */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white border-2 border-orange-100">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl">
                    🌺
                  </div>
                  <div>
                    <CardTitle className="text-xl text-orange-900">Latin American Context</CardTitle>
                    <p className="text-sm text-gray-600">Warmth & community-centered approach</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800 italic">
                    "Family is everything, I know. Let's think about how we can strengthen your family bonds 
                    while also taking care of your own well-being. ¿Cómo podemos hacer esto juntos?"
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Warm, personal connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Extended family involvement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Bilingual support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example 3: Middle Eastern Context */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-white border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                    🕌
                  </div>
                  <div>
                    <CardTitle className="text-xl text-purple-900">Middle Eastern Context</CardTitle>
                    <p className="text-sm text-gray-600">Honor & spiritual-centered approach</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800 italic">
                    "I respect that your faith and family honor are central to your life. Let's find healing 
                    paths that strengthen your spiritual connection and bring peace to your heart."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Spiritual integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Honor-based considerations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Gender-sensitive approach</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Culture, Your Healing Journey
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Experience therapy that truly understands and honors who you are, where you come from, 
            and the cultural wisdom that shapes your worldview.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 text-xl font-medium group transition-all duration-300"
            >
              Start Your Cultural Journey
              <Sparkles className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:text-white px-10 py-4 text-xl font-medium transition-all duration-300"
            >
              <Globe className="mr-3 h-6 w-6" />
              Explore All Cultures
            </Button>
          </div>
          
          <div className="mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold mb-4">Available in 50+ Languages</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">English</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Español</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">中文</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">العربية</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Français</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">हिंदी</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">Português</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">日本語</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">+ 42 more</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturalAI;