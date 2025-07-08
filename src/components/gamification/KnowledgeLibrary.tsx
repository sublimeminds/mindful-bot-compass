import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Search, Lock, CheckCircle, Star } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const KnowledgeLibrary = () => {
  const { userKnowledge, unlockKnowledge, isLoading } = useGamification();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-therapy-50 rounded-lg p-6">
            <div className="h-4 bg-therapy-100 rounded mb-2"></div>
            <div className="h-3 bg-therapy-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Mock available knowledge items for demonstration
  const allKnowledgeItems = [
    {
      id: '1',
      title: 'Box Breathing Technique',
      content: 'Learn the 4-4-4-4 breathing pattern used by Navy SEALs and athletes to manage stress and improve focus.',
      category: 'breathing',
      unlock_requirements: {},
      xp_value: 10,
      difficulty_level: 'beginner',
      tags: ['breathing', 'stress-relief', 'focus'],
      is_premium: false
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      content: 'A technique that involves tensing and relaxing different muscle groups to achieve deep relaxation.',
      category: 'relaxation',
      unlock_requirements: { badges: ['first_breath_session'] },
      xp_value: 15,
      difficulty_level: 'intermediate',
      tags: ['relaxation', 'anxiety', 'sleep'],
      is_premium: false
    },
    {
      id: '3',
      title: 'Cognitive Restructuring',
      content: 'Learn to identify and challenge negative thought patterns using CBT techniques.',
      category: 'cognitive',
      unlock_requirements: { badges: ['first_session'] },
      xp_value: 30,
      difficulty_level: 'intermediate',
      tags: ['cbt', 'thoughts', 'reframing'],
      is_premium: false
    }
  ];

  const unlockedItems = userKnowledge || [];
  const categories = ['all', 'breathing', 'relaxation', 'cognitive', 'mindfulness', 'trauma'];

  const filteredItems = allKnowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const isUnlocked = (itemId: string) => {
    return unlockedItems.some(item => item.id === itemId);
  };

  const getMasteryLevel = (itemId: string) => {
    const item = unlockedItems.find(item => item.id === itemId);
    return item?.mastery_level || 0;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Book className="h-6 w-6 text-therapy-600" />
          <div>
            <h2 className="text-2xl font-bold text-therapy-900">Knowledge Library</h2>
            <p className="text-therapy-600">Unlock and master therapeutic techniques and insights</p>
          </div>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          {unlockedItems.length} / {allKnowledgeItems.length} Unlocked
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-therapy-400" />
          <Input
            placeholder="Search knowledge items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const unlocked = isUnlocked(item.id);
              const masteryLevel = getMasteryLevel(item.id);

              return (
                <Card 
                  key={item.id} 
                  className={`
                    transition-all duration-200 hover:shadow-lg
                    ${unlocked 
                      ? 'bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className={`
                        text-lg
                        ${unlocked ? 'text-therapy-900' : 'text-gray-600'}
                      `}>
                        {item.title}
                      </CardTitle>
                      
                      {unlocked ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          {masteryLevel > 1 && (
                            <div className="flex">
                              {Array.from({ length: masteryLevel }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getDifficultyColor(item.difficulty_level)}>
                        {item.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="text-therapy-600">
                        +{item.xp_value} XP
                      </Badge>
                      {item.is_premium && (
                        <Badge variant="outline" className="text-orange-600">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className={`
                      text-sm
                      ${unlocked ? 'text-therapy-700' : 'text-gray-500'}
                    `}>
                      {item.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    {unlocked ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-therapy-600 border-therapy-300 hover:bg-therapy-50"
                      >
                        Review & Practice
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => unlockKnowledge(item.id)}
                        size="sm" 
                        className="w-full bg-therapy-600 hover:bg-therapy-700"
                      >
                        Unlock for {item.xp_value} XP
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeLibrary;