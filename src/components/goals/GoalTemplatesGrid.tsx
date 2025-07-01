import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  Search, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Filter,
  Brain,
  Heart,
  Activity,
  Moon,
  Shield,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalTemplate } from '@/hooks/useGoalTemplates';

interface GoalTemplatesGridProps {
  templates: GoalTemplate[];
  onSelectTemplate: (template: GoalTemplate) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Brain,
  Heart,
  Activity,
  Moon,
  Users,
  MessageCircle,
  Shield,
  Star,
  TrendingUp,
};

const GoalTemplatesGrid = ({ templates, onSelectTemplate }: GoalTemplatesGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredTemplates = filteredTemplates.filter(t => t.is_featured);
  const regularTemplates = filteredTemplates.filter(t => !t.is_featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTemplateCard = (template: GoalTemplate) => {
    const IconComponent = iconMap[template.icon] || Target;
    
    return (
      <Card 
        key={template.id} 
        className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
        onClick={() => onSelectTemplate(template)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-therapy-100">
                <IconComponent className="h-5 w-5 text-therapy-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base group-hover:text-therapy-600 transition-colors">
                  {template.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge className={cn("text-xs", getDifficultyColor(template.difficulty_level))}>
                    {template.difficulty_level}
                  </Badge>
                  {template.is_featured && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{template.estimated_duration_days} days</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Target className="h-3 w-3" />
              <span>{template.target_value} {template.unit}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Users className="h-3 w-3" />
              <span>{template.usage_count} users</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <TrendingUp className="h-3 w-3" />
              <span>{Math.round(template.success_rate * 100)}% success</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          <Button 
            className="w-full mt-3 bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
            size="sm"
          >
            Use This Template
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex space-x-1">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "text-xs",
                    selectedCategory === category && "bg-therapy-600 hover:bg-therapy-700"
                  )}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            <div className="flex space-x-1">
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={cn(
                    "text-xs",
                    selectedDifficulty === difficulty && "bg-therapy-600 hover:bg-therapy-700"
                  )}
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Featured Templates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.map(renderTemplateCard)}
          </div>
        </div>
      )}

      {/* Regular Templates */}
      {regularTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">All Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularTemplates.map(renderTemplateCard)}
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find templates.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalTemplatesGrid;