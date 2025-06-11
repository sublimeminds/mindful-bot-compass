import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Star, Play, BookOpen, Heart, Brain, Wind, Anchor, PenTool, Waves } from "lucide-react";
import { TherapyTechniqueService, TherapyTechnique } from "@/services/therapyTechniqueService";
import { useNavigate } from "react-router-dom";

const TechniqueLibrary = () => {
  const [techniques, setTechniques] = useState<TherapyTechnique[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setTechniques(TherapyTechniqueService.getAllTechniques());
  }, []);

  const categories = [
    { key: 'all', label: 'All', icon: BookOpen },
    { key: 'breathing', label: 'Breathing', icon: Wind },
    { key: 'mindfulness', label: 'Mindfulness', icon: Brain },
    { key: 'cbt', label: 'CBT', icon: Heart },
    { key: 'grounding', label: 'Grounding', icon: Anchor },
    { key: 'relaxation', label: 'Relaxation', icon: Waves },
    { key: 'journaling', label: 'Journaling', icon: PenTool }
  ];

  const filteredTechniques = selectedCategory === 'all' 
    ? techniques 
    : techniques.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.key === category);
    const IconComponent = categoryData?.icon || BookOpen;
    return <IconComponent className="h-4 w-4" />;
  };

  const handleStartTechnique = (technique: TherapyTechnique) => {
    navigate(`/techniques/${technique.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-therapy-700">Therapy Technique Library</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover evidence-based therapeutic techniques designed to help you manage stress, 
          improve mood, and build emotional resilience. Each technique includes guided practice sessions.
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Beginner Friendly</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
            <span>Guided Sessions</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-calm-500 rounded-full"></div>
            <span>Evidence-Based</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8">
          {categories.map(category => (
            <TabsTrigger 
              key={category.key} 
              value={category.key} 
              className="text-xs flex items-center space-x-1 data-[state=active]:bg-therapy-100 data-[state=active]:text-therapy-700"
            >
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {filteredTechniques.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No techniques found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category to explore more techniques
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Found {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? 's' : ''} 
                  {selectedCategory !== 'all' && ` in ${categories.find(c => c.key === selectedCategory)?.label}`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechniques.map(technique => (
                  <Card key={technique.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-therapy-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg flex items-center text-therapy-700">
                            {getCategoryIcon(technique.category)}
                            <span className="ml-2">{technique.title}</span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {technique.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(technique.difficulty)} variant="outline">
                          {technique.difficulty}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">
                          <Clock className="h-4 w-4 mr-1" />
                          {technique.duration} min
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-therapy-600 mb-2">Key Benefits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {technique.benefits.slice(0, 2).map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-therapy-50 text-therapy-700 border-therapy-200">
                                {benefit}
                              </Badge>
                            ))}
                            {technique.benefits.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                +{technique.benefits.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-therapy-600 mb-2">Best for:</h4>
                          <p className="text-xs text-muted-foreground">
                            {technique.whenToUse[0]}
                            {technique.whenToUse.length > 1 && `, +${technique.whenToUse.length - 1} more`}
                          </p>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleStartTechnique(technique)}
                        className="w-full bg-therapy-600 hover:bg-therapy-700 text-white"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Practice Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechniqueLibrary;
