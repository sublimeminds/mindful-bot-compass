
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Languages, 
  Heart, 
  Users, 
  Star,
  ArrowRight,
  Volume2,
  Mic,
  Eye,
  Brain,
  Shield,
  Sparkles,
  Play,
  CheckCircle,
  Map,
  BookOpen,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
const CulturalAIFeatures = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Cultural AI Features - TherapySync Global Mental Health',
    description: 'Explore TherapySync\'s advanced cultural AI features supporting 29 languages with culturally-adapted therapy approaches.',
    keywords: 'cultural AI therapy, multilingual therapy, global mental health, cultural sensitivity, international therapy'
  });

  const languageSupport = [
    { language: 'English', region: 'Global', flag: '🇺🇸', speakers: '1.5B+', culturalNotes: 'Western therapeutic approaches, direct communication style' },
    { language: 'Mandarin', region: 'China', flag: '🇨🇳', speakers: '918M+', culturalNotes: 'Holistic wellness, family-centered therapy, harmony concepts' },
    { language: 'Spanish', region: 'Latin America', flag: '🇪🇸', speakers: '500M+', culturalNotes: 'Family values, religious considerations, community support' }
  ];

  const culturalAdaptations = [
    {
      title: 'Asian Collectivist Cultures',
      description: 'Therapy approaches that respect family dynamics, social harmony, and indirect communication styles',
      features: ['Family-inclusive therapy sessions', 'Harmony-focused conflict resolution'],
      regions: ['China', 'Japan', 'Korea'],
      color: 'from-balance-500 to-flow-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sofia Chen',
      location: 'Toronto, Canada',
      flag: '🇨🇦',
      content: 'The AI understands my cultural background perfectly.',
      culturalNote: 'Respects multicultural identity'
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-balance-50/80 via-flow-50/60 to-balance-50/80">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-8 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Globe className="h-5 w-5 mr-2" />
              Cultural AI Technology
              <Sparkles className="h-5 w-5 ml-2" />
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Therapy That
              </span>
              <br />
              <span className="bg-gradient-to-r from-calm-600 to-therapy-600 bg-clip-text text-transparent">
                Understands
              </span>
              <br />
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Your Culture
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed font-medium">
              Experience mental health support that honors your cultural background with 
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent font-bold"> 29 languages</span>,
              <span className="bg-gradient-to-r from-calm-600 to-therapy-600 bg-clip-text text-transparent font-bold"> culturally-adapted approaches</span>, 
              and <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent font-bold">authentic understanding</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-therapy-500/25 transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-6 w-6 mr-3" />
                Start Cultural Journey
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-gradient-to-r hover:from-therapy-50 hover:to-calm-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate('/voice-technology')}
              >
                <Volume2 className="h-6 w-6 mr-3" />
                Hear Voice Samples
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-2">29</div>
                <div className="text-slate-600 font-medium">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-calm-600 to-therapy-600 bg-clip-text text-transparent mb-2">150+</div>
                <div className="text-slate-600 font-medium">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-2">6</div>
                <div className="text-slate-600 font-medium">Cultural Frameworks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-calm-600 to-therapy-600 bg-clip-text text-transparent mb-2">98%</div>
                <div className="text-slate-600 font-medium">Cultural Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Global Language Support
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI speaks your language and understands your culture, providing authentic therapeutic support worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languageSupport.slice(0, 12).map((lang, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">{lang.flag}</div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{lang.language}</h3>
                      <p className="text-sm text-slate-500">{lang.region}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-therapy-500" />
                      <span className="text-sm text-slate-600">{lang.speakers} speakers</span>
                    </div>
                    <p className="text-sm text-slate-600">{lang.culturalNotes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Adaptations */}
      <section className="py-20 bg-gradient-to-br from-therapy-50/80 via-calm-50/80 to-therapy-50/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Cultural Therapy Adaptations
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI adapts therapeutic approaches to respect and honor diverse cultural values and communication styles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {culturalAdaptations.map((adaptation, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${adaptation.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{adaptation.title}</CardTitle>
                  <p className="text-slate-600">{adaptation.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {adaptation.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {adaptation.regions.map((region, regionIndex) => (
                      <Badge key={regionIndex} variant="outline" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Global Voices, Local Understanding
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear from users worldwide who've experienced culturally-sensitive AI therapy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-3xl">{testimonial.flag}</div>
                    <div>
                      <h3 className="font-bold text-slate-900">{testimonial.name}</h3>
                      <p className="text-sm text-slate-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="bg-therapy-50 p-3 rounded-lg">
                    <p className="text-sm text-therapy-700 font-medium">
                      Cultural Adaptation: {testimonial.culturalNote}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-therapy-600 to-calm-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Experience Culturally-Aware AI Therapy
          </h2>
          <p className="text-xl text-therapy-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users worldwide who have found healing through culturally-sensitive AI therapy that truly understands their background.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-therapy-600 hover:bg-therapy-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              <Heart className="h-6 w-6 mr-3" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              onClick={() => navigate('/how-it-works')}
            >
              <BookOpen className="h-6 w-6 mr-3" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulturalAIFeatures;
