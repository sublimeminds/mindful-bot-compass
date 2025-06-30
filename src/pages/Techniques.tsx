
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, Heart, Target, Clock, BookOpen, Play, 
  Search, Filter, CheckCircle, Star, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Techniques = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useSafeSEO({
    title: 'Therapeutic Techniques Library - AI-Guided Mental Health Tools | TherapySync',
    description: 'Explore our comprehensive library of evidence-based therapeutic techniques including CBT, DBT, mindfulness, and more.',
    keywords: 'therapeutic techniques, CBT, DBT, mindfulness, mental health tools, therapy exercises'
  });

  const categories = ['All', 'CBT', 'DBT', 'Mindfulness', 'Anxiety', 'Depression', 'Stress'];

  const techniques = [
    {
      title: 'Cognitive Restructuring',
      category: 'CBT',
      description: 'Learn to identify and challenge negative thought patterns',
      duration: '15-20 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduces negative thinking', 'Improves mood', 'Builds self-awareness'],
      icon: Brain,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Progressive Muscle Relaxation',
      category: 'Stress',
      description: 'Systematic relaxation technique to reduce physical tension',
      duration: '20-30 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduces muscle tension', 'Improves sleep', 'Lowers anxiety'],
      icon: Heart,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Mindful Breathing',
      category: 'Mindfulness',
      description: 'Focus on breath awareness to center yourself in the present',
      duration: '5-10 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduces stress', 'Improves focus', 'Calms the mind'],
      icon: Target,
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Emotional Regulation Skills',
      category: 'DBT',
      description: 'Learn TIPP and other DBT skills for managing intense emotions',
      duration: '10-15 minutes',
      difficulty: 'Intermediate',
      benefits: ['Better emotional control', 'Reduces impulsivity', 'Improves relationships'],
      icon: Heart,
      color: 'from-rose-500 to-pink-500'
    },
    {
      title: 'Grounding Techniques',
      category: 'Anxiety',
      description: '5-4-3-2-1 and other grounding exercises for anxiety management',
      duration: '5-10 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduces anxiety', 'Brings focus to present', 'Calms panic'],
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Behavioral Activation',
      category: 'Depression',
      description: 'Structured approach to increase meaningful activities',
      duration: '30+ minutes',
      difficulty: 'Intermediate',
      benefits: ['Improves mood', 'Increases motivation', 'Builds routine'],
      icon: BookOpen,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const filteredTechniques = techniques.filter(technique => {
    const matchesSearch = technique.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || technique.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <BookOpen className="h-4 w-4 mr-2" />
              Therapeutic Techniques
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Your Technique Library
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Master evidence-based therapeutic techniques with AI guidance. Build your mental health toolkit with interactive exercises and personalized recommendations.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search techniques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Techniques Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTechniques.map((technique, index) => {
              const IconComponent = technique.icon;
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${technique.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={getDifficultyColor(technique.difficulty)}>
                        {technique.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-therapy-600">{technique.title}</CardTitle>
                    <Badge variant="outline" className="w-fit text-xs">
                      {technique.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">{technique.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {technique.duration}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700">Benefits:</h4>
                      <div className="space-y-1">
                        {technique.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        className={`flex-1 bg-gradient-to-r ${technique.color} text-white border-0`}
                        onClick={() => navigate('/therapy-chat')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Try Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTechniques.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No techniques found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Techniques;
