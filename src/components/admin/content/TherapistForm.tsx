
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Brain, Heart, Zap, Plus, X } from 'lucide-react';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  approach: string;
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  is_active: boolean;
  personality_traits: any;
  effectiveness_areas: any;
}

interface TherapistFormProps {
  therapist?: TherapistPersonality | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TherapistForm = ({ therapist, onSuccess, onCancel }: TherapistFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    specialties: [] as string[],
    approach: '',
    communication_style: '',
    experience_level: 'all',
    color_scheme: 'from-blue-500 to-blue-600',
    icon: 'Brain',
    is_active: true,
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (therapist) {
      setFormData({
        name: therapist.name || '',
        title: therapist.title || '',
        description: therapist.description || '',
        specialties: therapist.specialties || [],
        approach: therapist.approach || '',
        communication_style: therapist.communication_style || '',
        experience_level: therapist.experience_level || 'all',
        color_scheme: therapist.color_scheme || 'from-blue-500 to-blue-600',
        icon: therapist.icon || 'Brain',
        is_active: therapist.is_active ?? true,
      });
    }
  }, [therapist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const therapistData = {
        ...formData,
        personality_traits: {},
        effectiveness_areas: {},
      };

      if (therapist) {
        const { error } = await supabase
          .from('therapist_personalities')
          .update(therapistData)
          .eq('id', therapist.id);

        if (error) throw error;

        toast({
          title: "Therapist updated",
          description: "Therapist personality has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('therapist_personalities')
          .insert([therapistData]);

        if (error) throw error;

        toast({
          title: "Therapist created",
          description: "New therapist personality has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving therapist:', error);
      toast({
        title: "Error saving therapist",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="h-5 w-5" />;
      case 'Heart': return <Heart className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-bold text-white">
            {therapist ? 'Edit Therapist' : 'Add New Therapist'}
          </h2>
          <p className="text-gray-400">Configure AI therapist personality and behavior</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Appearance & Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="icon" className="text-white">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brain">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>Brain</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Heart">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>Heart</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Zap">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Zap</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color_scheme" className="text-white">Color Scheme</Label>
                <Select
                  value={formData.color_scheme}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, color_scheme: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-blue-500 to-blue-600">Blue</SelectItem>
                    <SelectItem value="from-green-500 to-green-600">Green</SelectItem>
                    <SelectItem value="from-purple-500 to-purple-600">Purple</SelectItem>
                    <SelectItem value="from-orange-500 to-orange-600">Orange</SelectItem>
                    <SelectItem value="from-pink-500 to-pink-600">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Preview</Label>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${formData.color_scheme} flex items-center justify-center`}>
                  {getIcon(formData.icon)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Specialties & Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Specialties</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add specialty..."
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="flex items-center space-x-1">
                    <span>{specialty}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="approach" className="text-white">Therapeutic Approach</Label>
                <Input
                  id="approach"
                  value={formData.approach}
                  onChange={(e) => setFormData(prev => ({ ...prev, approach: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., CBT, Mindfulness-based"
                  required
                />
              </div>
              <div>
                <Label htmlFor="communication_style" className="text-white">Communication Style</Label>
                <Input
                  id="communication_style"
                  value={formData.communication_style}
                  onChange={(e) => setFormData(prev => ({ ...prev, communication_style: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Warm and empathetic"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="experience_level" className="text-white">Experience Level</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? 'Saving...' : (therapist ? 'Update Therapist' : 'Create Therapist')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TherapistForm;
