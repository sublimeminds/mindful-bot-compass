import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Brain, Heart, Users, Sparkles, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/therapy-types-overview-hero.jpg';

interface TherapyType {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  conditions: string[];
  icon: string;
  gradient: string;
  isPremium?: boolean;
  isNew?: boolean;
}

const therapyTypes: TherapyType[] = [
  // Core Approaches
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy',
    category: 'Core Approaches',
    description: 'Evidence-based therapy focusing on changing negative thought patterns and behaviors.',
    benefits: ['Anxiety reduction', 'Depression management', 'Behavioral change'],
    conditions: ['Anxiety', 'Depression', 'PTSD', 'OCD'],
    icon: '🧠',
    gradient: 'from-therapy-400 via-therapy-500 to-harmony-600',
    isPremium: true
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
    isPremium: true
  },
  {
    id: 'act',
    name: 'Acceptance and Commitment Therapy',
    category: 'Core Approaches',
    description: 'Mindfulness-based therapy focusing on psychological flexibility and values.',
    benefits: ['Psychological flexibility', 'Values clarity', 'Mindful awareness'],
    conditions: ['Chronic pain', 'Anxiety', 'Substance abuse'],
    icon: '🎯',
    gradient: 'from-mindful-400 via-flow-500 to-calm-600'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness-Based Therapy',
    category: 'Core Approaches',
    description: 'Present-moment awareness techniques for stress reduction and emotional regulation.',
    benefits: ['Stress reduction', 'Emotional balance', 'Present-moment awareness'],
    conditions: ['Stress', 'Anxiety', 'Depression', 'Chronic pain'],
    icon: '🧘',
    gradient: 'from-calm-400 via-mindful-500 to-flow-600'
  },

  // Specialized Therapies
  {
    id: 'trauma-focused',
    name: 'Trauma-Focused Therapy',
    category: 'Specialized Therapies',
    description: 'Specialized approaches for processing and healing from traumatic experiences.',
    benefits: ['Trauma processing', 'PTSD recovery', 'Emotional healing'],
    conditions: ['PTSD', 'Trauma', 'Abuse survivors'],
    icon: '🛡️',
    gradient: 'from-healing-400 via-therapy-500 to-calm-600',
    isPremium: true
  },
  {
    id: 'emdr',
    name: 'EMDR Therapy',
    category: 'Specialized Therapies',
    description: 'Eye Movement Desensitization and Reprocessing for trauma recovery.',
    benefits: ['Trauma reprocessing', 'Memory integration', 'Symptom relief'],
    conditions: ['PTSD', 'Trauma', 'Phobias'],
    icon: '👁️',
    gradient: 'from-therapy-500 via-healing-400 to-balance-600',
    isPremium: true
  },
  {
    id: 'somatic',
    name: 'Somatic Therapy',
    category: 'Specialized Therapies',
    description: 'Body-based therapy for trauma and nervous system regulation.',
    benefits: ['Nervous system regulation', 'Body awareness', 'Trauma release'],
    conditions: ['Trauma', 'Chronic stress', 'Anxiety'],
    icon: '🌱',
    gradient: 'from-flow-400 via-calm-500 to-healing-600'
  },
  {
    id: 'ifs',
    name: 'Internal Family Systems',
    category: 'Specialized Therapies',
    description: 'Working with different parts of the self for internal harmony.',
    benefits: ['Self-compassion', 'Internal integration', 'Part work'],
    conditions: ['Complex trauma', 'Identity issues', 'Relationship difficulties'],
    icon: '👥',
    gradient: 'from-harmony-400 via-balance-500 to-therapy-600'
  },

  // Relationship & Family
  {
    id: 'couples',
    name: 'Couples Therapy',
    category: 'Relationship & Family',
    description: 'Relationship counseling for couples to improve communication and connection.',
    benefits: ['Communication skills', 'Conflict resolution', 'Intimacy building'],
    conditions: ['Relationship issues', 'Communication problems', 'Infidelity'],
    icon: '💕',
    gradient: 'from-therapy-400 via-harmony-500 to-healing-600',
    isPremium: true
  },
  {
    id: 'family-systems',
    name: 'Family Systems Therapy',
    category: 'Relationship & Family',
    description: 'Addressing family dynamics and improving family relationships.',
    benefits: ['Family communication', 'System understanding', 'Boundary setting'],
    conditions: ['Family conflict', 'Parenting issues', 'Adolescent problems'],
    icon: '🏠',
    gradient: 'from-balance-400 via-harmony-500 to-therapy-600',
    isPremium: true
  },
  {
    id: 'eft',
    name: 'Emotionally Focused Therapy',
    category: 'Relationship & Family',
    description: 'Attachment-based therapy for couples and families.',
    benefits: ['Emotional connection', 'Secure attachment', 'Relationship repair'],
    conditions: ['Attachment issues', 'Relationship distress', 'Emotional disconnection'],
    icon: '💖',
    gradient: 'from-healing-400 via-therapy-500 to-harmony-600'
  },

  // Population-Specific
  {
    id: 'lgbtq',
    name: 'LGBTQ+ Affirmative Therapy',
    category: 'Population-Specific',
    description: 'Culturally competent therapy for LGBTQ+ individuals and relationships.',
    benefits: ['Identity affirmation', 'Coming out support', 'Minority stress'],
    conditions: ['Identity exploration', 'Discrimination stress', 'Coming out'],
    icon: '🏳️‍🌈',
    gradient: 'from-therapy-400 via-harmony-500 to-flow-600',
    isPremium: true
  },
  {
    id: 'cultural',
    name: 'Cultural Therapy',
    category: 'Population-Specific',
    description: 'Culturally adapted therapy approaches for diverse backgrounds.',
    benefits: ['Cultural integration', 'Identity exploration', 'Bicultural stress'],
    conditions: ['Cultural adjustment', 'Immigration stress', 'Identity conflicts'],
    icon: '🌍',
    gradient: 'from-harmony-400 via-balance-500 to-mindful-600',
    isPremium: true
  },
  {
    id: 'geriatric',
    name: 'Geriatric Therapy',
    category: 'Population-Specific',
    description: 'Specialized therapy for older adults and aging-related challenges.',
    benefits: ['Aging adjustment', 'Loss processing', 'Cognitive support'],
    conditions: ['Late-life depression', 'Grief', 'Cognitive decline'],
    icon: '🌿',
    gradient: 'from-calm-400 via-healing-500 to-therapy-600'
  },
  {
    id: 'adolescent',
    name: 'Adolescent Therapy',
    category: 'Population-Specific',
    description: 'Age-appropriate therapy for teenagers and young adults.',
    benefits: ['Identity development', 'Peer relationships', 'Academic stress'],
    conditions: ['Teen depression', 'Anxiety', 'Behavioral issues'],
    icon: '🎨',
    gradient: 'from-flow-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'children',
    name: 'Child Therapy',
    category: 'Population-Specific',
    description: 'Play-based and developmentally appropriate therapy for children.',
    benefits: ['Emotional expression', 'Behavioral improvement', 'Coping skills'],
    conditions: ['Childhood anxiety', 'ADHD', 'Behavioral problems'],
    icon: '🧸',
    gradient: 'from-healing-400 via-flow-500 to-calm-600'
  },

  // Condition-Specific
  {
    id: 'adhd',
    name: 'ADHD Therapy',
    category: 'Condition-Specific',
    description: 'Specialized approaches for attention and focus challenges.',
    benefits: ['Focus improvement', 'Executive functioning', 'Coping strategies'],
    conditions: ['ADHD', 'Attention problems', 'Executive dysfunction'],
    icon: '⚡',
    gradient: 'from-therapy-400 via-flow-500 to-balance-600'
  },
  {
    id: 'autism',
    name: 'Autism Spectrum Support',
    category: 'Condition-Specific',
    description: 'Neurodiversity-affirming support for autistic individuals.',
    benefits: ['Sensory regulation', 'Social skills', 'Self-advocacy'],
    conditions: ['Autism', 'Sensory issues', 'Social challenges'],
    icon: '🧩',
    gradient: 'from-mindful-400 via-calm-500 to-therapy-600'
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
    isPremium: true
  },
  {
    id: 'eating-disorders',
    name: 'Eating Disorder Therapy',
    category: 'Condition-Specific',
    description: 'Specialized treatment for eating disorders and body image issues.',
    benefits: ['Body acceptance', 'Nutrition relationship', 'Recovery support'],
    conditions: ['Anorexia', 'Bulimia', 'Binge eating', 'Body dysmorphia'],
    icon: '🌸',
    gradient: 'from-therapy-400 via-healing-500 to-harmony-600',
    isPremium: true
  },
  {
    id: 'ocd',
    name: 'OCD Therapy',
    category: 'Condition-Specific',
    description: 'Exposure and Response Prevention and other OCD-specific treatments.',
    benefits: ['Compulsion reduction', 'Anxiety management', 'Functional improvement'],
    conditions: ['OCD', 'Obsessive thoughts', 'Compulsive behaviors'],
    icon: '🔄',
    gradient: 'from-balance-400 via-therapy-500 to-calm-600'
  },

  // Modern Approaches
  {
    id: 'art-therapy',
    name: 'Art & Creative Therapy',
    category: 'Modern Approaches',
    description: 'Creative expression as a pathway to healing and self-discovery.',
    benefits: ['Creative expression', 'Non-verbal processing', 'Self-discovery'],
    conditions: ['Trauma', 'Depression', 'Communication difficulties'],
    icon: '🎨',
    gradient: 'from-flow-400 via-harmony-500 to-therapy-600'
  },
  {
    id: 'music-therapy',
    name: 'Music Therapy',
    category: 'Modern Approaches',
    description: 'Using music and sound for therapeutic healing and expression.',
    benefits: ['Emotional expression', 'Stress relief', 'Memory enhancement'],
    conditions: ['Depression', 'Anxiety', 'Dementia', 'ADHD'],
    icon: '🎵',
    gradient: 'from-healing-400 via-flow-500 to-mindful-600'
  },
  {
    id: 'vr-therapy',
    name: 'Virtual Reality Therapy',
    category: 'Modern Approaches',
    description: 'Immersive VR environments for exposure therapy and skill building.',
    benefits: ['Safe exposure', 'Immersive experience', 'Skill practice'],
    conditions: ['Phobias', 'PTSD', 'Social anxiety', 'Pain management'],
    icon: '🥽',
    gradient: 'from-therapy-400 via-balance-500 to-flow-600',
    isPremium: true,
    isNew: true
  },
  {
    id: 'biofeedback',
    name: 'Biofeedback Therapy',
    category: 'Modern Approaches',
    description: 'Real-time physiological monitoring for self-regulation training.',
    benefits: ['Self-regulation', 'Stress management', 'Body awareness'],
    conditions: ['Anxiety', 'Chronic pain', 'Hypertension', 'ADHD'],
    icon: '📊',
    gradient: 'from-calm-400 via-therapy-500 to-balance-600'
  }
];

const categories = Array.from(new Set(therapyTypes.map(t => t.category)));

const TherapyTypesOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTherapyTypes = therapyTypes.filter(therapy => {
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || therapy.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || therapy.isPremium;
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-therapy-500 to-harmony-600 mb-6">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-therapy-600 via-harmony-600 to-balance-600 bg-clip-text text-transparent mb-6">
              Comprehensive Therapy Types
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover over 70 evidence-based therapy approaches powered by our AI system. 
              Find the perfect therapeutic modality for your unique needs and goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                70+ Therapy Types
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Evidence-Based
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Personalized
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search therapy types, conditions, or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('All')}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="hidden md:inline-flex"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Button
              variant={showPremiumOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Premium Only
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTherapyTypes.length} of {therapyTypes.length} therapy types
          </p>
        </div>

        {/* Therapy Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapyTypes.map((therapy) => (
            <Card key={therapy.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${therapy.gradient} flex items-center justify-center text-2xl`}>
                    {therapy.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-therapy-700 transition-colors leading-tight">
                        {therapy.name}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {therapy.isPremium && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                            Premium
                          </Badge>
                        )}
                        {therapy.isNew && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs mb-3">
                      {therapy.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {therapy.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Key Benefits</h4>
                    <div className="flex flex-wrap gap-1">
                      {therapy.benefits.slice(0, 3).map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs px-2 py-0.5">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Helpful For</h4>
                    <div className="flex flex-wrap gap-1">
                      {therapy.conditions.slice(0, 3).map((condition) => (
                        <Badge key={condition} variant="outline" className="text-xs px-2 py-0.5">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700">
                    Start Session
                  </Button>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTherapyTypes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No therapy types found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowPremiumOnly(false); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-therapy-50 via-harmony-50 to-balance-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Therapy Journey?</h2>
            <p className="text-muted-foreground mb-6">
              Our AI will help match you with the most effective therapy approaches based on your unique needs and preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700">
                Get Personalized Recommendations
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/assessment">Take Assessment</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyTypesOverview;