
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Eye, MoreHorizontal, Brain, Heart, Zap } from 'lucide-react';
import TherapistForm from './TherapistForm';

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
  created_at: string;
}

const TherapistManagement = () => {
  const { toast } = useToast();
  const [therapists, setTherapists] = useState<TherapistPersonality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistPersonality | null>(null);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast({
        title: "Error fetching therapists",
        description: "Failed to load therapist data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTherapistStatus = async (therapist: TherapistPersonality) => {
    try {
      const { error } = await supabase
        .from('therapist_personalities')
        .update({ is_active: !therapist.is_active })
        .eq('id', therapist.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Therapist ${therapist.is_active ? 'deactivated' : 'activated'} successfully.`,
      });

      fetchTherapists();
    } catch (error) {
      console.error('Error updating therapist status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="h-5 w-5" />;
      case 'Heart': return <Heart className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedTherapist(null);
    fetchTherapists();
  };

  if (showForm) {
    return (
      <TherapistForm
        therapist={selectedTherapist}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setSelectedTherapist(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Therapist Management</h2>
          <p className="text-gray-400">Manage AI therapist personalities and configurations</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Therapist
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{therapists.length}</div>
            <p className="text-sm text-gray-400">Total Therapists</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">
              {therapists.filter(t => t.is_active).length}
            </div>
            <p className="text-sm text-gray-400">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-400">
              {therapists.filter(t => !t.is_active).length}
            </div>
            <p className="text-sm text-gray-400">Inactive</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">
              {[...new Set(therapists.flatMap(t => t.specialties))].length}
            </div>
            <p className="text-sm text-gray-400">Specialties</p>
          </CardContent>
        </Card>
      </div>

      {/* Therapists List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Therapist Personalities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Loading therapists...</p>
            </div>
          ) : therapists.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No therapists configured yet</p>
              <Button 
                onClick={() => setShowForm(true)} 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Therapist
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${therapist.color_scheme}`}>
                      {getIcon(therapist.icon)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{therapist.name}</h3>
                        <Badge variant={therapist.is_active ? "default" : "secondary"}>
                          {therapist.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{therapist.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {therapist.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {therapist.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{therapist.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTherapist(therapist);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleTherapistStatus(therapist)}
                    >
                      {therapist.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistManagement;
