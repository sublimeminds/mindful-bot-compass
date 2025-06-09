
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Star, Play, BookOpen, Heart, Brain, Wind, Anchor, PenTool } from "lucide-react";
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
    { key: 'all', label: 'All Techniques', icon: BookOpen },
    { key: 'breathing', label: 'Breathing', icon: Wind },
    { key: 'mindfulness', label: 'Mindfulness', icon: Brain },
    { key: 'cbt', label: 'CBT', icon: Heart },
    { key: 'grounding', label: 'Grounding', icon: Anchor },
    { key: 'journaling', label: 'Journaling', icon: PenTool }
  ];

  const filteredTechniques = selectedCategory === 'all' 
    ? techniques 
    : techniques.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Therapy Technique Library</h2>
        <p className="text-muted-foreground">
          Interactive guided exercises to support your mental health journey
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category.key} value={category.key} className="text-xs">
              {category.icon && <category.icon className="h-4 w-4 mr-1" />}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredTechniques.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No techniques found</h3>
                <p className="text-muted-foreground">
                  Try selecting a different category
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTechniques.map(technique => (
                <Card key={technique.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center">
                          {getCategoryIcon(technique.category)}
                          <span className="ml-2">{technique.title}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {technique.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(technique.difficulty)}>
                        {technique.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {technique.duration} min
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {technique.benefits.slice(0, 2).map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                        {technique.benefits.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{technique.benefits.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">When to use:</h4>
                      <p className="text-xs text-muted-foreground">
                        {technique.whenToUse[0]}
                        {technique.whenToUse.length > 1 && `, +${technique.whenToUse.length - 1} more`}
                      </p>
                    </div>

                    <Button 
                      onClick={() => handleStartTechnique(technique)}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechniqueLibrary;
