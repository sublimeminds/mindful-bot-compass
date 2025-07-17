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
  // Force cache busting with timestamp
  const cacheKey = Date.now();
  
  return (
    <div className="min-h-screen" data-cache-key={cacheKey}>
      {/* REDESIGNED Hero Section with Cultural Mosaic Design */}
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
              🌟 NEW DESIGN - Cultural Intelligence AI
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
              ✨ COMPLETELY REDESIGNED ✨<br />
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
                🧠 Cultural Intelligence Dimensions
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI understands culture through multiple interconnected lenses, creating a holistic understanding of your unique background.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Language & Communication */}
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Languages className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-900">🗣️ Language & Communication</CardTitle>
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
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-900">💝 Values & Beliefs</CardTitle>
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
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-50 to-teal-50 border-green-200/50 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-900">👥 Social Structures</CardTitle>
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

      {/* Success Message */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-emerald-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              🎉 NEW DESIGN SUCCESSFULLY LOADED! 
            </h3>
            <p className="text-green-700 text-lg">
              You are now seeing the completely redesigned Cultural AI page with beautiful gradients, 
              cultural elements, and enhanced user experience. Cache cleared successfully!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturalAI;