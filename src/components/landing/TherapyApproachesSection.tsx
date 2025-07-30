import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Sparkles, Target, ArrowRight } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useNavigate } from 'react-router-dom';

const TherapyApproachesSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Core Approaches', 'Specialized Therapies', 'Relationship & Family', 'Population-Specific', 'Condition-Specific'];

  const therapyTypes = [
    {
      id: 'cbt',
      name: 'Cognitive Behavioral Therapy',
      category: 'Core Approaches',
      description: 'Evidence-based therapy focusing on changing negative thought patterns and behaviors.',
      benefits: ['Anxiety reduction', 'Depression management', 'Behavioral change'],
      conditions: ['Anxiety', 'Depression', 'PTSD', 'OCD'],
      icon: '🧠',
      gradient: 'from-therapy-400 via-therapy-500 to-harmony-600',
      isPremium: true,
      effectiveness: '94%'
    },
    {
      id: 'dbt',
      name: 'Dialectical Behavior Therapy',
      category: 'Core Approaches', 
      description: 'Skills-based therapy for emotional regulation and interpersonal effectiveness.',
      benefits: ['Emotional regulation', 'Distress tolerance', 'Interpersonal skills'],
      conditions: ['BPD', 'Self-harm', 'Emotional dysregulation'],
      icon: '⚖️',
      gradient: 'from-balance-400 via-harmony-500 to-therapy-600',
      isPremium: true,
      effectiveness: '89%'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness-Based Therapy',
      category: 'Core Approaches',
      description: 'Present-moment awareness techniques for stress reduction and emotional regulation.',
      benefits: ['Stress reduction', 'Emotional balance', 'Present-moment awareness'],
      conditions: ['Stress', 'Anxiety', 'Depression', 'Chronic pain'],
      icon: '🧘',
      gradient: 'from-calm-400 via-mindful-500 to-flow-600',
      effectiveness: '87%'
    },
    {
      id: 'trauma-focused',
      name: 'Trauma-Focused Therapy',
      category: 'Specialized Therapies',
      description: 'Specialized approaches for processing and healing from traumatic experiences.',
      benefits: ['Trauma processing', 'PTSD recovery', 'Emotional healing'],
      conditions: ['PTSD', 'Trauma', 'Abuse survivors'],
      icon: '🛡️',
      gradient: 'from-healing-400 via-therapy-500 to-calm-600',
      isPremium: true,
      effectiveness: '91%'
    },
    {
      id: 'couples',
      name: 'Couples Therapy',
      category: 'Relationship & Family',
      description: 'Relationship counseling for couples to improve communication and connection.',
      benefits: ['Communication skills', 'Conflict resolution', 'Intimacy building'],
      conditions: ['Relationship issues', 'Communication problems', 'Infidelity'],
      icon: '💕',
      gradient: 'from-therapy-400 via-harmony-500 to-healing-600',
      isPremium: true,
      effectiveness: '86%'
    },
    {
      id: 'lgbtq',
      name: 'LGBTQ+ Affirmative Therapy',
      category: 'Population-Specific',
      description: 'Culturally competent therapy for LGBTQ+ individuals and relationships.',
      benefits: ['Identity affirmation', 'Coming out support', 'Minority stress'],
      conditions: ['Identity exploration', 'Discrimination stress', 'Coming out'],
      icon: '🏳️‍🌈',
      gradient: 'from-therapy-400 via-harmony-500 to-flow-600',
      isPremium: true,
      effectiveness: '92%'
    },
    {
      id: 'addiction',
      name: 'Addiction Therapy',
      category: 'Condition-Specific',
      description: 'Evidence-based treatment for substance use and behavioral addictions.',
      benefits: ['Recovery support', 'Relapse prevention', 'Coping skills'],
      conditions: ['Substance abuse', 'Behavioral addiction', 'Dual diagnosis'],
      icon: '🔗',
      gradient: 'from-healing-400 via-therapy-500 to-balance-600',
      isPremium: true,
      effectiveness: '83%'
    },
    {
      id: 'adolescent',
      name: 'Adolescent Therapy',
      category: 'Population-Specific',
      description: 'Age-appropriate therapy for teenagers and young adults.',
      benefits: ['Identity development', 'Peer relationships', 'Academic stress'],
      conditions: ['Teen depression', 'Anxiety', 'Behavioral issues'],
      icon: '🎨',
      gradient: 'from-flow-400 via-therapy-500 to-harmony-600',
      effectiveness: '88%'
    }
  ];

  const filteredTherapies = therapyTypes.filter(therapy => {
    const matchesCategory = selectedCategory === 'All' || therapy.category === selectedCategory;
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeComponentWrapper name="TherapyApproachesSection">
      <div id="therapy-approaches" className="py-20 px-4 bg-gradient-to-bl from-healing-50/30 via-balance-50/20 to-therapy-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-therapy-100 text-therapy-800 border-therapy-200">
              40+ Specialized Approaches
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Therapy Approaches
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our AI therapists are trained in diverse, evidence-based therapeutic modalities to meet your unique needs and preferences.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search therapy approaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-therapy-600 hover:bg-therapy-700 text-white" 
                      : "border-therapy-200 text-therapy-700 hover:bg-therapy-50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Therapy Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredTherapies.map((therapy) => (
              <Card key={therapy.id} className="group bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${therapy.gradient}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{therapy.icon}</div>
                    <div className="flex flex-col items-end space-y-1">
                      {therapy.isPremium && (
                        <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white border-0 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {therapy.effectiveness} Success
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-therapy-700 transition-colors">
                    {therapy.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {therapy.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-therapy-600 uppercase tracking-wider">Benefits</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {therapy.benefits.slice(0, 2).map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-therapy-50 text-therapy-700 border-therapy-200">
                            {benefit}
                          </Badge>
                        ))}
                        {therapy.benefits.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{therapy.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-mindful-600 uppercase tracking-wider">Conditions</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {therapy.conditions.slice(0, 3).map((condition, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-mindful-50 text-mindful-700 border-mindful-200">
                            {condition}
                          </Badge>
                        ))}
                        {therapy.conditions.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{therapy.conditions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-white border border-therapy-200 text-therapy-700 hover:bg-therapy-50 group-hover:bg-therapy-600 group-hover:text-white group-hover:border-therapy-600 transition-all duration-300"
                    size="sm"
                  >
                    Learn More
                    <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Find Your Perfect Therapeutic Match
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our AI assessment will recommend the most effective therapeutic approaches based on your unique needs, goals, and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/therapy-types-overview')}
                className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-3"
              >
                <Target className="h-4 w-4 mr-2" />
                Take Therapy Assessment
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/ai-therapy-chat')}
                className="border-therapy-200 text-therapy-700 hover:bg-therapy-50 px-8 py-3"
              >
                Browse All Approaches
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default TherapyApproachesSection;