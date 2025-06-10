
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TherapistForm from './TherapistForm';

const TherapistManagement = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch therapists',
          variant: 'destructive',
        });
      } else {
        setTherapists(data || []);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTherapistStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('therapist_personalities')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update therapist status',
          variant: 'destructive',
        });
      } else {
        setTherapists(therapists.map(t => 
          t.id === id ? { ...t, is_active: !currentStatus } : t
        ));
        toast({
          title: 'Success',
          description: `Therapist ${!currentStatus ? 'activated' : 'deactivated'}`,
        });
      }
    } catch (error) {
      console.error('Error updating therapist status:', error);
    }
  };

  const deleteTherapist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this therapist? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_personalities')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete therapist',
          variant: 'destructive',
        });
      } else {
        setTherapists(therapists.filter(t => t.id !== id));
        toast({
          title: 'Success',
          description: 'Therapist deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting therapist:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTherapist(null);
    fetchTherapists();
  };

  if (showForm) {
    return (
      <TherapistForm
        therapist={editingTherapist}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingTherapist(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Therapist Personalities</h2>
          <p className="text-gray-400">Manage AI therapist personalities and their characteristics</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Therapist
        </Button>
      </div>

      {/* Therapists Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">
          Loading therapists...
        </div>
      ) : therapists.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">No therapists found</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Therapist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <Card key={therapist.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${therapist.color_scheme} flex items-center justify-center`}>
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{therapist.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{therapist.title}</p>
                    </div>
                  </div>
                  <Badge variant={therapist.is_active ? "default" : "secondary"}>
                    {therapist.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-3">{therapist.description}</p>
                
                <div>
                  <p className="text-gray-400 text-xs mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties?.slice(0, 3).map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {therapist.specialties?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{therapist.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingTherapist(therapist);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleTherapistStatus(therapist.id, therapist.is_active)}
                    >
                      {therapist.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTherapist(therapist.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {therapist.approach}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistManagement;
