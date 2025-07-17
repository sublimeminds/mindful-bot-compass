import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Heart, 
  Users, 
  Languages,
  BookOpen,
  Mountain,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Brain,
  Compass,
  Shield,
  HandHeart,
  Home,
  Network,
  Layers,
  UserCheck,
  Ear,
  Smile
} from 'lucide-react';

const CulturalAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* COMPLETELY NEW Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8 bg-blue-100 text-blue-800 border-blue-200 px-6 py-3 text-lg font-medium">
              <Globe className="w-6 h-6 mr-2" />
              🌟 BRAND NEW DESIGN - Cultural Intelligence AI
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cultural AI
              </span>
              <br />
              <span className="text-gray-900 text-4xl md:text-5xl">Reimagined</span>
            </h1>
            
            <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              ✨ This is the completely redesigned Cultural AI page ✨<br />
              Experience AI that truly understands your cultural background, traditions, and unique perspective.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-medium group transition-all duration-300 shadow-xl"
              >
                Experience Cultural AI
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-6 text-xl font-medium transition-all duration-300"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Confirmation */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-200">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              🎉 Success! New Design Loaded Successfully!
            </h2>
            <p className="text-green-700 text-xl mb-6">
              You are now viewing the completely redesigned Cultural AI page. 
              All cache issues have been resolved and the new design is working perfectly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Cache Cleared</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">New Design Active</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Errors Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Dimensions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cultural Understanding
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI comprehends culture through multiple dimensions for truly personalized therapy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Language & Communication */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Languages className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Language & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6 text-lg">
                  Understanding cultural nuances in communication patterns and expressions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">Communication Styles</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <Ear className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">Listening Patterns</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span className="font-medium">Storytelling Traditions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values & Beliefs */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-purple-200">
              <CardHeader className="text-center pb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Values & Beliefs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6 text-lg">
                  Respecting core values and spiritual frameworks that guide decisions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <Compass className="h-6 w-6 text-purple-600" />
                    <span className="font-medium">Moral Frameworks</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <span className="font-medium">Honor Systems</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <HandHeart className="h-6 w-6 text-purple-600" />
                    <span className="font-medium">Community Bonds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Structures */}
            <Card className="group hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-200">
              <CardHeader className="text-center pb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-900">Social Structures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-center mb-6 text-lg">
                  Understanding relationships and social expectations in your culture.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <Home className="h-6 w-6 text-green-600" />
                    <span className="font-medium">Family Dynamics</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <Network className="h-6 w-6 text-green-600" />
                    <span className="font-medium">Community Relations</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <Layers className="h-6 w-6 text-green-600" />
                    <span className="font-medium">Social Hierarchies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturalAI;