
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Brain, ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TherapistFormProps {
  therapist?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const TherapistForm = ({ therapist, onSuccess, onCancel }: TherapistFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    approach: '',
    communication_style: '',
    experience_level: 'all',
    color_scheme: 'from-blue-500 to-blue-600',
    icon: 'Brain',
    specialties: [] as string[],
    is_active: true,
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (therapist) {
      setFormData({
        name: therapist.name || '',
        title: therapist.title || '',
        description: therapist.description || '',
        approach: therapist.approach || '',
        communication_style: therapist.communication_style || '',
        experience_level: therapist.experience_level || 'all',
        color_scheme: therapist.color_scheme || 'from-blue-500 to-blue-600',
        icon: therapist.icon || 'Brain',
        specialties: therapist.specialties || [],
        is_active: therapist.is_active ?? true,
      });
    }
  }, [therapist]);

  const colorSchemes = [
    { value: 'from-blue-500 to-blue-600', label: 'Blue' },
    { value: 'from-green-500 to-green-600', label: 'Green' },
    { value: 'from-purple-500 to-purple-600', label: 'Purple' },
    { value: 'from-orange-500 to-orange-600', label: 'Orange' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' },
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner Friendly' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.title || !formData.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const therapistData = {
        ...formData,
        specialties: formData.specialties,
      };

      let error;
      if (therapist) {
        ({ error } = await supabase
          .from('therapist_personalities')
          .update(therapistData)
          .eq('id', therapist.id));
      } else {
        ({ error } = await supabase
          .from('therapist_personalities')
          .insert([therapistData]));
      }

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to ${therapist ? 'update' : 'create'} therapist`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Therapist ${therapist ? 'updated' : 'created'} successfully`,
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving therapist:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Brain className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">
            {therapist ? 'Edit Therapist' : 'Create New Therapist'}
          </h2>
          <p className="text-gray-400">Configure the AI therapist personality and characteristics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. Sarah Chen"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Licensed Clinical Psychologist"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A warm and empathetic therapist who specializes in cognitive behavioral therapy..."
                className="bg-gray-700 border-gray-600 text-white min-h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Approach
                </label>
                <Input
                  value={formData.approach}
                  onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                  placeholder="Cognitive Behavioral Therapy"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Communication Style
                </label>
                <Input
                  value={formData.communication_style}
                  onChange={(e) => setFormData({ ...formData, communication_style: e.target.value })}
                  placeholder="Warm and supportive"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Specialties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add specialty (e.g., Anxiety, Depression)"
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{specialty}</span>
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Appearance & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color Scheme
                </label>
                <Select value={formData.color_scheme} onValueChange={(value) => setFormData({ ...formData, color_scheme: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${scheme.value}`} />
                          <span>{scheme.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Experience Level
                </label>
                <Select value={formData.experience_level} onValueChange={(value) => setFormData({ ...formData, experience_level: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? 'Saving...' : therapist ? 'Update Therapist' : 'Create Therapist'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TherapistForm;
