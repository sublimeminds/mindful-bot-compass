import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  User, 
  Heart, 
  Brain, 
  Star, 
  Play, 
  Pause, 
  Volume2, 
  Video, 
  Search,
  Filter,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConversation } from '@11labs/react';
import RealisticHuman3DAvatar from '@/components/avatar/RealisticHuman3DAvatar';
import { supabase } from '@/integrations/supabase/client';

interface TherapistProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  specialties: string[];
  approach: string;
  experience: string;
  rating: number;
  matchScore: number;
  personality: {
    empathyLevel: number;
    energyLevel: number;
    directnessLevel: number;
    creativityLevel: number;
    culturalCompetency: string[];
  };
  voiceProfile: {
    voiceId: string;
    voiceName: string;
    accent: string;
    tone: string;
  };
  avatar: {
    avatarId: string;
    avatarUrl: string;
    customizations: any;
  };
  availability: {
    nextAvailable: string;
    preferredTimes: string[];
    timezone: string;
  };
  credentials: string[];
  languages: string[];
  pricing: {
    perSession: number;
    packages: any[];
  };
}

interface Enhanced3DTherapistDiscoveryProps {
  onTherapistSelected: (therapistId: string) => void;
  onClose: () => void;
  userPreferences?: any;
  className?: string;
}

const Enhanced3DTherapistDiscovery: React.FC<Enhanced3DTherapistDiscoveryProps> = ({
  onTherapistSelected,
  onClose,
  userPreferences = {},
  className = ''
}) => {
  const { toast } = useToast();
  
  // State management
  const [therapists, setTherapists] = useState<TherapistProfile[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistProfile[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [previewingTherapist, setPreviewingTherapist] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [matchScoreFilter, setMatchScoreFilter] = useState([70]);
  const [availabilityFilter, setAvailabilityFilter] = useState('any');
  const [priceRangeFilter, setPriceRangeFilter] = useState([50, 200]);
  
  // 3D preview states
  const [is3DPreview, setIs3DPreview] = useState(true);
  const [voicePreviewPlaying, setVoicePreviewPlaying] = useState<string | null>(null);
  const [personalityAssessment, setPersonalityAssessment] = useState<any>({});

  // ElevenLabs integration for voice previews
  const conversation = useConversation({
    onConnect: () => console.log('Voice preview connected'),
    onDisconnect: () => setVoicePreviewPlaying(null),
    onError: (error) => console.error('Voice preview error:', error)
  });

  // Load therapists with enhanced profiles
  const loadTherapists = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get enhanced therapist profiles with 3D avatars and voice data
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          action: 'getTherapists',
          includeAvatars: true,
          includeVoiceProfiles: true,
          includePersonality: true,
          userPreferences
        }
      });

      if (error) throw error;

      const enhancedTherapists: TherapistProfile[] = data.therapists.map((therapist: any) => ({
        id: therapist.id,
        name: therapist.name,
        title: therapist.title,
        description: therapist.description,
        specialties: therapist.specialties,
        approach: therapist.approach,
        experience: therapist.experience,
        rating: therapist.rating,
        matchScore: therapist.matchScore,
        personality: {
          empathyLevel: Math.random() * 0.3 + 0.7, // 70-100%
          energyLevel: Math.random() * 0.4 + 0.3, // 30-70%
          directnessLevel: Math.random() * 0.5 + 0.25, // 25-75%
          creativityLevel: Math.random() * 0.6 + 0.2, // 20-80%
          culturalCompetency: ['General', 'LGBTQ+', 'Multicultural']
        },
        voiceProfile: {
          voiceId: therapist.voiceId || 'EXAVITQu4vr4xnSDxMaL', // Default to Sarah
          voiceName: therapist.voiceName || 'Professional',
          accent: therapist.accent || 'American',
          tone: therapist.tone || 'Warm and Supportive'
        },
        avatar: {
          avatarId: therapist.avatarId,
          avatarUrl: therapist.avatarUrl,
          customizations: therapist.avatarCustomizations || {}
        },
        availability: {
          nextAvailable: therapist.nextAvailable || 'Today 2:00 PM',
          preferredTimes: therapist.preferredTimes || ['Morning', 'Evening'],
          timezone: therapist.timezone || 'EST'
        },
        credentials: therapist.credentials || ['Licensed Clinical Social Worker', 'Cognitive Behavioral Therapy Certified'],
        languages: therapist.languages || ['English'],
        pricing: {
          perSession: therapist.pricing?.perSession || Math.floor(Math.random() * 100) + 80,
          packages: therapist.pricing?.packages || []
        }
      }));

      setTherapists(enhancedTherapists);
      setFilteredTherapists(enhancedTherapists);

    } catch (error) {
      console.error('Failed to load therapists:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load therapist profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userPreferences, toast]);

  // Advanced filtering logic
  const applyFilters = useCallback(() => {
    let filtered = therapists;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.approach.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (specialtyFilter) {
      filtered = filtered.filter(t => 
        t.specialties.includes(specialtyFilter)
      );
    }

    // Match score filter
    filtered = filtered.filter(t => t.matchScore >= matchScoreFilter[0]);

    // Price range filter
    filtered = filtered.filter(t => 
      t.pricing.perSession >= priceRangeFilter[0] && 
      t.pricing.perSession <= priceRangeFilter[1]
    );

    // Availability filter
    if (availabilityFilter !== 'any') {
      filtered = filtered.filter(t => 
        t.availability.preferredTimes.includes(availabilityFilter)
      );
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    setFilteredTherapists(filtered);
  }, [therapists, searchQuery, specialtyFilter, matchScoreFilter, priceRangeFilter, availabilityFilter]);

  // Voice preview functionality
  const playVoicePreview = async (therapist: TherapistProfile) => {
    try {
      if (voicePreviewPlaying === therapist.id) {
        setVoicePreviewPlaying(null);
        return;
      }

      setVoicePreviewPlaying(therapist.id);

      // Generate a personalized introduction
      const introText = `Hello, I'm ${therapist.name}. I specialize in ${therapist.specialties[0]} and use a ${therapist.approach} approach. I'm here to support you on your journey to better mental health. How are you feeling today?`;

      const { data, error } = await supabase.functions.invoke('elevenlabs-voice-preview', {
        body: {
          text: introText,
          voiceId: therapist.voiceProfile.voiceId,
          therapistId: therapist.id
        }
      });

      if (error) throw error;

      // Play the generated audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.onended = () => setVoicePreviewPlaying(null);
      await audio.play();

    } catch (error) {
      console.error('Voice preview failed:', error);
      setVoicePreviewPlaying(null);
      toast({
        title: "Voice Preview Error",
        description: "Could not play voice preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Personality compatibility assessment
  const assessCompatibility = useCallback(async (therapist: TherapistProfile) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          action: 'assessCompatibility',
          therapistId: therapist.id,
          userPreferences,
          therapistPersonality: therapist.personality
        }
      });

      if (error) throw error;

      setPersonalityAssessment(prev => ({
        ...prev,
        [therapist.id]: data.assessment
      }));

    } catch (error) {
      console.error('Compatibility assessment failed:', error);
    }
  }, [userPreferences]);

  const handleSelectTherapist = (therapistId: string) => {
    setSelectedTherapist(therapistId);
  };

  const handlePreviewTherapist = (therapistId: string) => {
    setPreviewingTherapist(previewingTherapist === therapistId ? null : therapistId);
  };

  const handleConfirmSelection = () => {
    if (selectedTherapist) {
      onTherapistSelected(selectedTherapist);
    }
  };

  // Initialize
  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Auto-assess compatibility for top matches
  useEffect(() => {
    if (filteredTherapists.length > 0) {
      filteredTherapists.slice(0, 3).forEach(therapist => {
        assessCompatibility(therapist);
      });
    }
  }, [filteredTherapists, assessCompatibility]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center min-h-96`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Enhanced Therapist Profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Enhanced Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-therapy-500" />
              <span>Enhanced 3D Therapist Discovery</span>
              <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
                AI-Powered Matching
              </Badge>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setIs3DPreview(!is3DPreview)}
              className={is3DPreview ? 'bg-therapy-100' : ''}
            >
              {is3DPreview ? '3D Preview' : '2D Cards'}
            </Button>
          </CardTitle>
          
          <p className="text-muted-foreground">
            Experience our advanced AI-powered therapist matching with realistic 3D avatars, voice previews, and personality compatibility assessment.
          </p>
        </CardHeader>
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search therapists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label className="text-sm font-medium mb-1 block">Specialty</label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Specialties</option>
                <option value="Anxiety">Anxiety</option>
                <option value="Depression">Depression</option>
                <option value="Trauma">Trauma</option>
                <option value="Relationships">Relationships</option>
                <option value="Mindfulness">Mindfulness</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium mb-1 block">Availability</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="any">Any Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Match Score */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Match Score: {matchScoreFilter[0]}%
              </label>
              <Slider
                value={matchScoreFilter}
                onValueChange={setMatchScoreFilter}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: ${priceRangeFilter[0]} - ${priceRangeFilter[1]}
              </label>
              <Slider
                value={priceRangeFilter}
                onValueChange={setPriceRangeFilter}
                max={300}
                min={50}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <Card 
            key={therapist.id} 
            className={`${selectedTherapist === therapist.id ? 'ring-2 ring-therapy-500' : ''} overflow-hidden hover:shadow-lg transition-all duration-200`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{therapist.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{therapist.title}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{therapist.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${therapist.matchScore >= 90 ? 'bg-green-100 text-green-800' : 
                              therapist.matchScore >= 80 ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}`}
                >
                  {therapist.matchScore}% Match
                </Badge>
                <Badge variant="outline">
                  ${therapist.pricing.perSession}/session
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Realistic 3D Avatar Preview */}
              {is3DPreview && (
                <div className="relative">
                  <RealisticHuman3DAvatar
                    therapistId={therapist.id}
                    isActive={previewingTherapist === therapist.id}
                    emotion={{ 
                      name: previewingTherapist === therapist.id ? 'joy' : 'neutral', 
                      intensity: 0.7, 
                      confidence: 1 
                    }}
                    isSpeaking={voicePreviewPlaying === therapist.id}
                    isListening={previewingTherapist === therapist.id && !voicePreviewPlaying}
                    size="medium"
                    className="mx-auto"
                  />
                  
                  {/* 3D Preview Controls */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <button
                      className="bg-white/90 hover:bg-white shadow-lg px-3 py-1 rounded-md text-sm font-medium text-therapy-700 transition-colors"
                      onClick={() => handlePreviewTherapist(therapist.id)}
                    >
                      {previewingTherapist === therapist.id ? 'Hide Preview' : 'View in 3D'}
                    </button>
                  </div>
                </div>
              )}

              {/* Therapist Info */}
              <div>
                <p className="text-sm text-gray-600 line-clamp-3">{therapist.description}</p>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1">
                {therapist.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Personality Indicators */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Personality Traits</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Empathy</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-therapy-500 h-1 rounded-full" 
                        style={{ width: `${therapist.personality.empathyLevel * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Energy</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${therapist.personality.energyLevel * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility Assessment */}
              {personalityAssessment[therapist.id] && (
                <div className="bg-therapy-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-therapy-700 mb-1">
                    Compatibility Assessment
                  </div>
                  <div className="text-xs text-therapy-600">
                    {personalityAssessment[therapist.id].summary}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTherapist(therapist.id)}
                    className="flex-1"
                  >
                    {previewingTherapist === therapist.id ? 'Hide' : 'Preview'} 3D Avatar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playVoicePreview(therapist)}
                    disabled={voicePreviewPlaying !== null}
                    className="flex items-center space-x-1"
                  >
                    {voicePreviewPlaying === therapist.id ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    <span>Voice</span>
                  </Button>
                </div>

                <Button
                  onClick={() => handleSelectTherapist(therapist.id)}
                  className={`w-full ${selectedTherapist === therapist.id ? 'bg-therapy-600' : ''}`}
                  variant={selectedTherapist === therapist.id ? 'default' : 'outline'}
                >
                  {selectedTherapist === therapist.id ? 'Selected' : 'Select Therapist'}
                </Button>
              </div>

              {/* Availability Info */}
              <div className="text-xs text-gray-500 border-t pt-2">
                <div>Next available: {therapist.availability.nextAvailable}</div>
                <div>Languages: {therapist.languages.join(', ')}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selection Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-gray-600">
          Found {filteredTherapists.length} therapists matching your criteria
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSelection}
            disabled={!selectedTherapist}
            className="bg-therapy-600 hover:bg-therapy-700"
          >
            Start 3D Therapy Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Enhanced3DTherapistDiscovery;