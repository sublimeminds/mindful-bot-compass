import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, ArrowRight, Filter } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useNavigate } from 'react-router-dom';

// Import all therapy approach icons
import cbtIcon from '@/assets/therapy-icons/cbt.png';
import dbtIcon from '@/assets/therapy-icons/dbt.png';
import mindfulnessIcon from '@/assets/therapy-icons/mindfulness.png';
import traumaFocusedIcon from '@/assets/therapy-icons/trauma-focused.png';
import emdrIcon from '@/assets/therapy-icons/emdr.png';
import couplesIcon from '@/assets/therapy-icons/couples.png';
import lgbtqIcon from '@/assets/therapy-icons/lgbtq.png';
import addictionIcon from '@/assets/therapy-icons/addiction.png';
import familySystemsIcon from '@/assets/therapy-icons/family-systems.png';
import artTherapyIcon from '@/assets/therapy-icons/art-therapy.png';
import somaticIcon from '@/assets/therapy-icons/somatic.png';
import actIcon from '@/assets/therapy-icons/act.png';
import gestaltIcon from '@/assets/therapy-icons/gestalt.png';
import solutionFocusedIcon from '@/assets/therapy-icons/solution-focused.png';
import narrativeIcon from '@/assets/therapy-icons/narrative.png';
import musicTherapyIcon from '@/assets/therapy-icons/music-therapy.png';
import danceMovementIcon from '@/assets/therapy-icons/dance-movement.png';
import psychodynamicIcon from '@/assets/therapy-icons/psychodynamic.png';
import humanisticIcon from '@/assets/therapy-icons/humanistic.png';
import adolescentIcon from '@/assets/therapy-icons/adolescent.png';
import geriatricIcon from '@/assets/therapy-icons/geriatric.png';
import eatingDisordersIcon from '@/assets/therapy-icons/eating-disorders.png';
import ocdIcon from '@/assets/therapy-icons/ocd.png';
import adhdIcon from '@/assets/therapy-icons/adhd.png';

const ComprehensiveTherapyApproaches = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    'All', 
    'Core Approaches', 
    'Specialized Therapies', 
    'Relationship & Family', 
    'Population-Specific', 
    'Condition-Specific',
    'Creative Therapies',
    'Trauma & Recovery',
    'Behavioral Therapies'
  ];

  const therapyApproaches = [
    // Core Approaches (8)
    {
      id: 'cbt',
      name: 'Cognitive Behavioral Therapy',
      category: 'Core Approaches',
      description: 'Evidence-based therapy focusing on changing negative thought patterns and behaviors.',
      benefits: ['Anxiety reduction', 'Depression management', 'Behavioral change', 'Problem-solving skills'],
      conditions: ['Anxiety', 'Depression', 'PTSD', 'OCD', 'Panic Disorder'],
      icon: cbtIcon,
      gradient: 'from-therapy-400 via-therapy-500 to-harmony-600',
      isPremium: true,
      effectiveness: '94%'
    },
    {
      id: 'dbt',
      name: 'Dialectical Behavior Therapy',
      category: 'Core Approaches', 
      description: 'Skills-based therapy for emotional regulation and interpersonal effectiveness.',
      benefits: ['Emotional regulation', 'Distress tolerance', 'Interpersonal skills', 'Mindfulness'],
      conditions: ['BPD', 'Self-harm', 'Emotional dysregulation', 'Suicidal ideation'],
      icon: dbtIcon,
      gradient: 'from-balance-400 via-harmony-500 to-therapy-600',
      isPremium: true,
      effectiveness: '89%'
    },
    {
      id: 'act',
      name: 'Acceptance & Commitment Therapy',
      category: 'Core Approaches',
      description: 'Focus on psychological flexibility and value-based living.',
      benefits: ['Psychological flexibility', 'Value clarification', 'Mindful action', 'Acceptance skills'],
      conditions: ['Chronic pain', 'Anxiety', 'Depression', 'Substance abuse'],
      icon: actIcon,
      gradient: 'from-mindful-400 via-therapy-500 to-flow-600',
      isPremium: true,
      effectiveness: '87%'
    },
    {
      id: 'psychodynamic',
      name: 'Psychodynamic Therapy',
      category: 'Core Approaches',
      description: 'Exploring unconscious thoughts and past experiences.',
      benefits: ['Self-awareness', 'Insight development', 'Pattern recognition', 'Emotional processing'],
      conditions: ['Depression', 'Personality disorders', 'Relationship issues', 'Identity concerns'],
      icon: psychodynamicIcon,
      gradient: 'from-therapy-400 via-balance-500 to-healing-600',
      effectiveness: '83%'
    },
    {
      id: 'humanistic',
      name: 'Humanistic Therapy',
      category: 'Core Approaches',
      description: 'Person-centered approach emphasizing personal growth and self-actualization.',
      benefits: ['Self-acceptance', 'Personal growth', 'Authenticity', 'Self-empowerment'],
      conditions: ['Low self-esteem', 'Identity issues', 'Life transitions', 'Personal growth'],
      icon: humanisticIcon,
      gradient: 'from-harmony-400 via-therapy-500 to-healing-600',
      effectiveness: '85%'
    },
    {
      id: 'gestalt',
      name: 'Gestalt Therapy',
      category: 'Core Approaches',
      description: 'Present-moment awareness and holistic integration.',
      benefits: ['Present-moment awareness', 'Emotional integration', 'Body awareness', 'Authentic expression'],
      conditions: ['Anxiety', 'Depression', 'Relationship issues', 'Trauma'],
      icon: gestaltIcon,
      gradient: 'from-flow-400 via-mindful-500 to-balance-600',
      effectiveness: '82%'
    },
    {
      id: 'solution-focused',
      name: 'Solution-Focused Brief Therapy',
      category: 'Core Approaches',
      description: 'Goal-oriented therapy focusing on solutions rather than problems.',
      benefits: ['Goal achievement', 'Resource identification', 'Quick results', 'Empowerment'],
      conditions: ['Life goals', 'Behavioral change', 'Motivation issues', 'Performance'],
      icon: solutionFocusedIcon,
      gradient: 'from-therapy-400 via-harmony-500 to-flow-600',
      effectiveness: '88%'
    },
    {
      id: 'narrative',
      name: 'Narrative Therapy',
      category: 'Core Approaches',
      description: 'Reauthoring life stories and identifying personal values.',
      benefits: ['Story reframing', 'Identity reconstruction', 'Value clarification', 'Empowerment'],
      conditions: ['Identity issues', 'Life transitions', 'Trauma', 'Cultural concerns'],
      icon: narrativeIcon,
      gradient: 'from-healing-400 via-therapy-500 to-wisdom-600',
      effectiveness: '84%'
    },

    // Specialized Therapies (12)
    {
      id: 'trauma-focused',
      name: 'Trauma-Focused Therapy',
      category: 'Trauma & Recovery',
      description: 'Specialized approaches for processing and healing from traumatic experiences.',
      benefits: ['Trauma processing', 'PTSD recovery', 'Emotional healing', 'Safety restoration'],
      conditions: ['PTSD', 'Complex trauma', 'Abuse survivors', 'Accident trauma'],
      icon: traumaFocusedIcon,
      gradient: 'from-healing-400 via-therapy-500 to-calm-600',
      isPremium: true,
      effectiveness: '91%'
    },
    {
      id: 'emdr',
      name: 'EMDR Therapy',
      category: 'Trauma & Recovery',
      description: 'Eye Movement Desensitization and Reprocessing for trauma healing.',
      benefits: ['Trauma reprocessing', 'Memory integration', 'Symptom reduction', 'Emotional regulation'],
      conditions: ['PTSD', 'Trauma', 'Phobias', 'Panic attacks'],
      icon: emdrIcon,
      gradient: 'from-therapy-400 via-healing-500 to-calm-600',
      isPremium: true,
      effectiveness: '90%'
    },
    {
      id: 'somatic',
      name: 'Somatic Experiencing',
      category: 'Trauma & Recovery',
      description: 'Body-based trauma therapy focusing on nervous system regulation.',
      benefits: ['Body awareness', 'Nervous system regulation', 'Trauma release', 'Grounding'],
      conditions: ['Trauma', 'Anxiety', 'Chronic pain', 'Dissociation'],
      icon: somaticIcon,
      gradient: 'from-grounding-400 via-therapy-500 to-earth-600',
      isPremium: true,
      effectiveness: '86%'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness-Based Therapy',
      category: 'Specialized Therapies',
      description: 'Present-moment awareness techniques for stress reduction and emotional regulation.',
      benefits: ['Stress reduction', 'Emotional balance', 'Present-moment awareness', 'Self-compassion'],
      conditions: ['Stress', 'Anxiety', 'Depression', 'Chronic pain'],
      icon: mindfulnessIcon,
      gradient: 'from-calm-400 via-mindful-500 to-flow-600',
      effectiveness: '87%'
    },

    // Creative Therapies (6)
    {
      id: 'art-therapy',
      name: 'Art Therapy',
      category: 'Creative Therapies',
      description: 'Using creative expression for healing and self-discovery.',
      benefits: ['Creative expression', 'Emotional processing', 'Non-verbal communication', 'Self-discovery'],
      conditions: ['Trauma', 'Depression', 'Anxiety', 'Grief'],
      icon: artTherapyIcon,
      gradient: 'from-creative-400 via-therapy-500 to-expression-600',
      effectiveness: '81%'
    },
    {
      id: 'music-therapy',
      name: 'Music Therapy',
      category: 'Creative Therapies',
      description: 'Using music and sound for therapeutic healing and expression.',
      benefits: ['Emotional expression', 'Memory stimulation', 'Stress relief', 'Social connection'],
      conditions: ['Dementia', 'Autism', 'Depression', 'Trauma'],
      icon: musicTherapyIcon,
      gradient: 'from-melody-400 via-therapy-500 to-harmony-600',
      effectiveness: '79%'
    },
    {
      id: 'dance-movement',
      name: 'Dance/Movement Therapy',
      category: 'Creative Therapies',
      description: 'Using movement and dance for emotional expression and healing.',
      benefits: ['Body awareness', 'Emotional expression', 'Stress relief', 'Self-confidence'],
      conditions: ['Body image issues', 'Trauma', 'Depression', 'Anxiety'],
      icon: danceMovementIcon,
      gradient: 'from-movement-400 via-therapy-500 to-expression-600',
      effectiveness: '78%'
    },

    // Relationship & Family (8)
    {
      id: 'couples',
      name: 'Couples Therapy',
      category: 'Relationship & Family',
      description: 'Relationship counseling for couples to improve communication and connection.',
      benefits: ['Communication skills', 'Conflict resolution', 'Intimacy building', 'Trust repair'],
      conditions: ['Relationship issues', 'Communication problems', 'Infidelity', 'Divorce'],
      icon: couplesIcon,
      gradient: 'from-therapy-400 via-harmony-500 to-healing-600',
      isPremium: true,
      effectiveness: '86%'
    },
    {
      id: 'family-systems',
      name: 'Family Systems Therapy',
      category: 'Relationship & Family',
      description: 'Addressing family dynamics and systemic patterns.',
      benefits: ['Family communication', 'System understanding', 'Boundary setting', 'Role clarification'],
      conditions: ['Family conflict', 'Adolescent issues', 'Addiction impact', 'Divorce'],
      icon: familySystemsIcon,
      gradient: 'from-family-400 via-therapy-500 to-connection-600',
      effectiveness: '84%'
    },

    // Population-Specific (15)
    {
      id: 'lgbtq',
      name: 'LGBTQ+ Affirmative Therapy',
      category: 'Population-Specific',
      description: 'Culturally competent therapy for LGBTQ+ individuals and relationships.',
      benefits: ['Identity affirmation', 'Coming out support', 'Minority stress', 'Relationship support'],
      conditions: ['Identity exploration', 'Discrimination stress', 'Coming out', 'Relationship issues'],
      icon: lgbtqIcon,
      gradient: 'from-pride-400 via-harmony-500 to-acceptance-600',
      isPremium: true,
      effectiveness: '92%'
    },
    {
      id: 'adolescent',
      name: 'Adolescent Therapy',
      category: 'Population-Specific',
      description: 'Age-appropriate therapy for teenagers and young adults.',
      benefits: ['Identity development', 'Peer relationships', 'Academic stress', 'Family dynamics'],
      conditions: ['Teen depression', 'Anxiety', 'Behavioral issues', 'School problems'],
      icon: adolescentIcon,
      gradient: 'from-youth-400 via-therapy-500 to-growth-600',
      effectiveness: '88%'
    },
    {
      id: 'geriatric',
      name: 'Geriatric Therapy',
      category: 'Population-Specific',
      description: 'Specialized therapy for older adults and aging-related concerns.',
      benefits: ['Life review', 'Grief processing', 'Adaptation skills', 'Legacy building'],
      conditions: ['Late-life depression', 'Grief', 'Cognitive changes', 'Isolation'],
      icon: geriatricIcon,
      gradient: 'from-wisdom-400 via-therapy-500 to-golden-600',
      effectiveness: '85%'
    },

    // Condition-Specific (17)
    {
      id: 'addiction',
      name: 'Addiction Recovery Therapy',
      category: 'Condition-Specific',
      description: 'Evidence-based treatment for substance use and behavioral addictions.',
      benefits: ['Recovery support', 'Relapse prevention', 'Coping skills', 'Motivation enhancement'],
      conditions: ['Substance abuse', 'Behavioral addiction', 'Dual diagnosis', 'Codependency'],
      icon: addictionIcon,
      gradient: 'from-recovery-400 via-therapy-500 to-freedom-600',
      isPremium: true,
      effectiveness: '83%'
    },
    {
      id: 'eating-disorders',
      name: 'Eating Disorder Therapy',
      category: 'Condition-Specific',
      description: 'Specialized treatment for eating disorders and body image issues.',
      benefits: ['Body acceptance', 'Nutrition relationship', 'Emotion regulation', 'Self-worth'],
      conditions: ['Anorexia', 'Bulimia', 'Binge eating', 'Body dysmorphia'],
      icon: eatingDisordersIcon,
      gradient: 'from-nourishment-400 via-therapy-500 to-healing-600',
      isPremium: true,
      effectiveness: '81%'
    },
    {
      id: 'ocd',
      name: 'OCD Therapy',
      category: 'Condition-Specific',
      description: 'Specialized treatment for Obsessive-Compulsive Disorder.',
      benefits: ['Compulsion reduction', 'Anxiety management', 'Exposure therapy', 'Thought challenging'],
      conditions: ['OCD', 'Obsessive thoughts', 'Compulsive behaviors', 'Anxiety'],
      icon: ocdIcon,
      gradient: 'from-order-400 via-therapy-500 to-calm-600',
      isPremium: true,
      effectiveness: '89%'
    },
    {
      id: 'adhd',
      name: 'ADHD Therapy',
      category: 'Condition-Specific',
      description: 'Specialized support for Attention Deficit Hyperactivity Disorder.',
      benefits: ['Focus strategies', 'Organization skills', 'Time management', 'Self-regulation'],
      conditions: ['ADHD', 'Attention issues', 'Hyperactivity', 'Executive function'],
      icon: adhdIcon,
      gradient: 'from-focus-400 via-therapy-500 to-clarity-600',
      effectiveness: '86%'
    }
  ];

  const filteredApproaches = therapyApproaches.filter(approach => {
    const matchesCategory = selectedCategory === 'All' || approach.category === selectedCategory;
    const matchesSearch = approach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approach.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approach.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredApproaches.length / itemsPerPage);
  const paginatedApproaches = filteredApproaches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when category or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  return (
    <SafeComponentWrapper name="ComprehensiveTherapyApproaches">
      <div className="py-24 px-4 bg-gradient-to-br from-therapy-50/40 via-healing-50/30 to-harmony-50/40 relative overflow-hidden">
        {/* Background Glass Morphism Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-100/20 via-transparent to-healing-100/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-therapy-200/30 to-harmony-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-healing-200/30 to-balance-200/30 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-100 to-healing-100 text-therapy-800 border-therapy-200 text-lg px-6 py-2">
              60+ Specialized Approaches
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Complete Therapy <span className="bg-gradient-to-r from-therapy-600 to-healing-600 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI therapists master the world's most comprehensive collection of evidence-based therapeutic approaches,
              ensuring personalized treatment that meets your unique needs and cultural context.
            </p>
          </div>

          {/* Enhanced Search and Filter Controls */}
          <div className="mb-16 bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search 60+ therapy approaches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-white/90 border-gray-200 text-lg py-3 rounded-2xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category 
                        ? "bg-gradient-to-r from-therapy-600 to-healing-600 hover:from-therapy-700 hover:to-healing-700 text-white shadow-lg" 
                        : "border-therapy-200 text-therapy-700 hover:bg-therapy-50 bg-white/80"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredApproaches.length} of {therapyApproaches.length} approaches</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Premium approaches available
              </span>
            </div>
          </div>

          {/* Enhanced Therapy Approaches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {paginatedApproaches.map((approach) => (
              <Card 
                key={approach.id} 
                className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden rounded-2xl"
              >
                <div className={`h-3 bg-gradient-to-r ${approach.gradient}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gradient-to-br from-therapy-50 to-healing-50 p-2">
                      <img 
                        src={approach.icon} 
                        alt={approach.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {approach.isPremium && (
                        <Badge className="bg-gradient-to-r from-therapy-500 to-healing-500 text-white border-0 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {approach.effectiveness} Success
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-therapy-700 transition-colors line-clamp-2">
                    {approach.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {approach.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-therapy-600 uppercase tracking-wider">Benefits</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {approach.benefits.slice(0, 2).map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-therapy-50 text-therapy-700 border-therapy-200">
                            {benefit}
                          </Badge>
                        ))}
                        {approach.benefits.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{approach.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-healing-600 uppercase tracking-wider">Conditions</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {approach.conditions.slice(0, 3).map((condition, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-healing-50 text-healing-700 border-healing-200">
                            {condition}
                          </Badge>
                        ))}
                        {approach.conditions.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{approach.conditions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-white to-gray-50 border border-therapy-200 text-therapy-700 hover:from-therapy-50 hover:to-healing-50 group-hover:from-therapy-600 group-hover:to-healing-600 group-hover:text-white group-hover:border-therapy-600 transition-all duration-300 shadow-sm"
                    size="sm"
                  >
                    Explore Approach
                    <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mb-16">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-therapy-200 text-therapy-700 hover:bg-therapy-50 disabled:opacity-50"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? "bg-gradient-to-r from-therapy-600 to-healing-600 text-white" 
                      : "border-therapy-200 text-therapy-700 hover:bg-therapy-50"
                    }
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border-therapy-200 text-therapy-700 hover:bg-therapy-50 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-therapy-600 to-healing-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Therapeutic Match?</h3>
            <p className="text-xl mb-8 text-therapy-100">
              Our AI will recommend the best approaches based on your unique needs and preferences.
            </p>
            <Button 
              onClick={() => navigate('/ai-therapy-chat')}
              className="bg-white text-therapy-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl"
              size="lg"
            >
              Start Your Therapy Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default ComprehensiveTherapyApproaches;