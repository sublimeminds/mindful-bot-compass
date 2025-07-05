import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Volume2, 
  VolumeX,
  Settings,
  Mic,
  Eye,
  Heart,
  Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { personalizedTherapistVoiceService } from '@/services/personalizedTherapistVoiceService';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';
import ThreeDTherapistAvatar from '@/components/avatar/ThreeDTherapistAvatar';
import { useNavigate } from 'react-router-dom';

interface CurrentTherapist {
  id: string;
  name: string;
  approach: string;
  specialties: string[];
  effectiveness_score: number;
}

const TherapistAvatarWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTherapist, setCurrentTherapist] = useState<CurrentTherapist | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [showMiniAvatar, setShowMiniAvatar] = useState(true);

  useEffect(() => {
    if (user) {
      loadCurrentTherapist();
      checkVoiceSettings();
    }
  }, [user]);

  const loadCurrentTherapist = async () => {
    if (!user) return;

    try {
      // Get user's current therapist or most compatible one
      const { data: compatibility } = await supabase
        .from('therapist_compatibility')
        .select(`
          therapist_id,
          compatibility_score,
          effectiveness_metrics,
          last_interaction
        `)
        .eq('user_id', user.id)
        .order('compatibility_score', { ascending: false })
        .limit(1)
        .single();

      let therapistId = compatibility?.therapist_id;
      
      // If no compatibility data, get from stored preference or default
      if (!therapistId) {
        therapistId = localStorage.getItem('current_therapist_id') || 'dr-sarah-chen';
      }

      // Get therapist personality data
      const { data: therapistData } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('id', therapistId)
        .single();

      if (therapistData) {
        setCurrentTherapist({
          id: therapistId,
          name: therapistData.name,
          approach: therapistData.approach,
          specialties: therapistData.specialties || [],
          effectiveness_score: compatibility?.compatibility_score || 0.8
        });
        
        // Set in voice service
        personalizedTherapistVoiceService.setCurrentTherapist(therapistId);
      } else {
        // Fallback to Dr. Sarah Chen
        setCurrentTherapist({
          id: 'dr-sarah-chen',
          name: 'Dr. Sarah Chen',
          approach: 'Cognitive Behavioral Therapy',
          specialties: ['Anxiety', 'Depression', 'Stress Management'],
          effectiveness_score: 0.85
        });
        personalizedTherapistVoiceService.setCurrentTherapist('dr-sarah-chen');
      }
    } catch (error) {
      console.error('Error loading therapist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVoiceSettings = () => {
    const hasApiKey = personalizedTherapistVoiceService.hasApiKey();
    setIsVoiceEnabled(hasApiKey);
  };

  const testTherapistVoice = async () => {
    if (!currentTherapist || !isVoiceEnabled) return;
    
    setIsTestingVoice(true);
    try {
      const audioUrl = await personalizedTherapistVoiceService.testTherapistVoice(
        currentTherapist.id,
        `Hello! I'm ${currentTherapist.name}. I'm here to support you with ${currentTherapist.approach.toLowerCase()}.`
      );
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
        URL.revokeObjectURL(audioUrl);
      }
    } catch (error) {
      console.error('Error testing voice:', error);
    } finally {
      setIsTestingVoice(false);
    }
  };

  const getTherapistIcon = (approach: string) => {
    if (approach.toLowerCase().includes('cognitive')) return Brain;
    if (approach.toLowerCase().includes('mindfulness')) return Eye;
    if (approach.toLowerCase().includes('relationship')) return Heart;
    return User;
  };

  const getApproachColor = (approach: string) => {
    if (approach.toLowerCase().includes('cognitive')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (approach.toLowerCase().includes('mindfulness')) return 'bg-green-100 text-green-800 border-green-200';
    if (approach.toLowerCase().includes('solution')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (approach.toLowerCase().includes('trauma')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (approach.toLowerCase().includes('relationship')) return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTherapist) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Your Therapist
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">No therapist assigned yet</p>
          <Button onClick={() => navigate('/therapist-selection')}>
            Find Your Therapist
          </Button>
        </CardContent>
      </Card>
    );
  }

  const TherapistIcon = getTherapistIcon(currentTherapist.approach);
  const persona = therapistPersonas[currentTherapist.id];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <TherapistIcon className="h-5 w-5 text-therapy-600" />
            <span>Your Therapist</span>
          </div>
          <div className="flex gap-1">
            {isVoiceEnabled ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Volume2 className="h-3 w-3 mr-1" />
                Voice
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-600">
                <VolumeX className="h-3 w-3 mr-1" />
                Silent
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mini Avatar Preview */}
        {showMiniAvatar && persona && (
          <div className="relative h-32 -mx-2">
            <ThreeDTherapistAvatar
              therapistId={currentTherapist.id}
              isListening={false}
              isSpeaking={false}
              emotion="neutral"
              showControls={false}
            />
          </div>
        )}

        {/* Therapist Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900">{currentTherapist.name}</h3>
            <Badge 
              variant="outline" 
              className={`mt-1 text-xs ${getApproachColor(currentTherapist.approach)}`}
            >
              {currentTherapist.approach}
            </Badge>
          </div>

          {/* Effectiveness Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Compatibility</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-therapy-500 transition-all duration-300"
                  style={{ width: `${currentTherapist.effectiveness_score * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-therapy-600">
                {Math.round(currentTherapist.effectiveness_score * 100)}%
              </span>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Specializes in:</p>
            <div className="flex flex-wrap gap-1">
              {currentTherapist.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <Button 
            onClick={() => navigate('/chat')}
            size="sm" 
            className="gap-2"
          >
            <Mic className="h-3 w-3" />
            Start Session
          </Button>
          
          <Button 
            onClick={testTherapistVoice}
            variant="outline" 
            size="sm"
            disabled={!isVoiceEnabled || isTestingVoice}
            className="gap-2"
          >
            {isTestingVoice ? (
              <>Testing...</>
            ) : (
              <>
                <Volume2 className="h-3 w-3" />
                Test Voice
              </>
            )}
          </Button>
        </div>

        {/* Settings Link */}
        <div className="pt-2 border-t">
          <Button 
            onClick={() => navigate('/therapist-selection')}
            variant="ghost" 
            size="sm"
            className="w-full gap-2"
          >
            <Settings className="h-3 w-3" />
            Change Therapist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistAvatarWidget;