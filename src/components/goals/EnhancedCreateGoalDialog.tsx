import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Star, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoalTemplate } from '@/hooks/useGoalTemplates';
import { format } from 'date-fns';

interface EnhancedCreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: GoalTemplate[];
  selectedTemplate?: GoalTemplate;
}

const EnhancedCreateGoalDialog = ({ 
  open, 
  onOpenChange, 
  templates,
  selectedTemplate 
}: EnhancedCreateGoalDialogProps) => {
  const [activeTab, setActiveTab] = useState('custom');
  const [selectedTemplateInternal, setSelectedTemplateInternal] = useState<GoalTemplate | null>(selectedTemplate || null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    targetValue: 100,
    unit: 'points',
    targetDate: new Date(),
    difficultyLevel: 'medium',
    motivationLevel: 5,
    visibility: 'private',
    tags: [] as string[],
  });

  const categories = [
    'Mental Wellness',
    'Physical Health', 
    'Mental Health',
    'Social',
    'Personal Growth',
    'Habits',
    'Skills'
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-red-600' },
  ];

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplateInternal(template);
    setFormData({
      ...formData,
      title: template.name,
      description: template.description,
      category: template.category,
      targetValue: template.target_value,
      unit: template.unit,
      difficultyLevel: template.difficulty_level,
      tags: template.tags,
    });
    setActiveTab('custom');
  };

  const renderMotivationStars = () => (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, motivationLevel: i + 1 })}
          className="transition-colors"
        >
          <Star
            className={cn(
              "h-5 w-5",
              i < formData.motivationLevel 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300 hover:text-yellow-300"
            )}
          />
        </button>
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement goal creation API call
      console.log('Creating goal:', formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-therapy-600" />
            <span>Create New Goal</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Use Template</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Custom Goal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {templates.slice(0, 6).map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                    selectedTemplateInternal?.id === template.id 
                      ? "border-therapy-500 bg-therapy-50" 
                      : "border-gray-200 hover:border-therapy-300"
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    {template.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{template.category}</span>
                    <span>{template.target_value} {template.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Daily Meditation Practice"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your goal and what success looks like..."
                  rows={3}
                />
              </div>

              {/* Goal Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">Target Value *</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g., days, sessions, points"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.targetDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.targetDate ? format(formData.targetDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.targetDate}
                        onSelect={(date) => date && setFormData({ ...formData, targetDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Goal Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select 
                    value={formData.difficultyLevel} 
                    onValueChange={(value) => setFormData({ ...formData, difficultyLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Motivation Level</Label>
                <div className="flex items-center space-x-3">
                  {renderMotivationStars()}
                  <span className="text-sm text-gray-600">
                    {formData.motivationLevel}/5
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                >
                  Create Goal
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateGoalDialog;