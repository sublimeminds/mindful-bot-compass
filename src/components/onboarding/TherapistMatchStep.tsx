import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GradientButton from '@/components/ui/GradientButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Users, Zap, Star, CheckCircle, ArrowLeft, Lock, Crown, Gem } from 'lucide-react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

interface TherapistMatchStepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  onboardingData?: any;
}

const TherapistMatchStep = ({ onNext, onBack, onboardingData }: TherapistMatchStepProps) => {
  const { t } = useTranslation();
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const subscriptionAccess = useSubscriptionAccess();

  const { data: therapists = [] } = useQuery({
    queryKey: ['therapist-personalities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true)
        .order('therapist_tier', { ascending: true })
        .order('user_rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate match scores and access levels
  const therapistMatches = useMemo(() => {
    if (!onboardingData || !therapists.length) return [];

    return therapists.map(therapist => {
      let score = 70; // Base score
      const matchFactors = [];

      // Match based on problems/challenges
      if (onboardingData.specificProblems?.length) {
        const problemMatch = onboardingData.specificProblems.some((problem: string) =>
          therapist.specialties.some((specialty: string) => 
            specialty.toLowerCase().includes(problem.toLowerCase())
          )
        );
        if (problemMatch) {
          score += 15;
          matchFactors.push('Specializes in your primary concerns');
        }
      }

      // Match based on communication style
      if (onboardingData.culturalPreferences?.communicationStyle) {
        const styleMatch = therapist.communication_style === onboardingData.culturalPreferences.communicationStyle;
        if (styleMatch) {
          score += 10;
          matchFactors.push('Matches your communication preferences');
        }
      }

      // Match based on therapy approach preferences
      if (onboardingData.culturalPreferences?.therapyApproachPreferences?.length) {
        const approachMatch = onboardingData.culturalPreferences.therapyApproachPreferences.some((pref: string) =>
          therapist.therapeutic_techniques?.some((technique: string) =>
            technique.toLowerCase().includes(pref.toLowerCase())
          )
        );
        if (approachMatch) {
          score += 10;
          matchFactors.push('Uses your preferred therapy approaches');
        }
      }

      // Experience level match
      if (onboardingData.enhancedTherapyPreferences?.experience_level_preference) {
        if (therapist.experience_level === onboardingData.enhancedTherapyPreferences.experience_level_preference) {
          score += 5;
          matchFactors.push('Matches your experience level preference');
        }
      }

      // Determine if therapist is accessible
      const isAccessible = getTherapistAccess(therapist.therapist_tier || 'free', subscriptionAccess.tier);

      return {
        ...therapist,
        matchScore: Math.min(score, 98), // Cap at 98%
        matchFactors,
        isAccessible
      };
    }).sort((a, b) => {
      // Sort by accessibility first (accessible therapists first), then by match score
      if (a.isAccessible !== b.isAccessible) {
        return a.isAccessible ? -1 : 1;
      }
      return b.matchScore - a.matchScore;
    });
  }, [therapists, onboardingData, subscriptionAccess.tier]);

  // Helper function to determine therapist access
  const getTherapistAccess = (therapistTier: string, userTier: string) => {
    const tierHierarchy = { free: 0, premium: 1, professional: 2 };
    const therapistLevel = tierHierarchy[therapistTier as keyof typeof tierHierarchy] || 0;
    const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0;
    return userLevel >= therapistLevel;
  };

  // Get tier icon and badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'professional':
        return { icon: Gem, label: 'Professional', color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' };
      case 'premium':
        return { icon: Crown, label: 'Premium', color: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' };
      default:
        return { icon: Star, label: 'Free', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' };
    }
  };

  const handleTherapistSelect = (therapistId: string, isAccessible: boolean) => {
    if (isAccessible) {
      setSelectedTherapist(therapistId);
    }
  };

  const handleContinue = () => {
    const selectedTherapistData = therapistMatches.find(t => t.id === selectedTherapist);
    onNext({ 
      selectedTherapist,
      therapistSelection: selectedTherapistData
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('onboarding.therapistMatch.title')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.therapistMatch.subtitle')}
        </p>
      </div>

      <div className="grid gap-6">
        {therapistMatches.map((therapist) => {
          const isSelected = selectedTherapist === therapist.id;
          const tierBadge = getTierBadge(therapist.therapist_tier || 'free');
          const IconComponent = therapist.icon === 'Brain' ? Brain : 
                               therapist.icon === 'Heart' ? Heart :
                               therapist.icon === 'Users' ? Users : Zap;

          return (
            <Card
              key={therapist.id}
              className={`transition-all border-2 relative ${
                !therapist.isAccessible
                  ? 'cursor-not-allowed opacity-75 border-gray-300 bg-gray-50 dark:bg-gray-900'
                  : `cursor-pointer ${
                      isSelected 
                        ? 'border-therapy-500 shadow-lg bg-therapy-50 dark:bg-therapy-950' 
                        : 'border-border hover:border-therapy-300 hover:shadow-md'
                    }`
              }`}
              onClick={() => handleTherapistSelect(therapist.id, therapist.isAccessible)}
            >
              <CardHeader className="pb-3">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center space-x-3">
                       <Professional2DAvatar 
                         therapistId={therapist.id}
                         therapistName={therapist.name}
                         size="md"
                         className="w-12 h-12"
                       />
                     <div>
                       <div className="flex items-center gap-2">
                         <CardTitle className="text-lg">{therapist.name}</CardTitle>
                         <Badge className={`text-xs px-2 py-1 ${tierBadge.color}`}>
                           <tierBadge.icon className="h-3 w-3 mr-1" />
                           {tierBadge.label}
                         </Badge>
                       </div>
                       <p className="text-sm text-muted-foreground">{therapist.title}</p>
                     </div>
                   </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Progress 
                        value={therapist.matchScore} 
                        className="w-16 h-2"
                      />
                      <span className="text-sm font-medium text-therapy-600">
                        {therapist.matchScore}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('onboarding.therapistMatch.compatibilityScore')}
                    </div>
                  </div>
                </div>
                
                {/* Lock overlay for inaccessible therapists */}
                {!therapist.isAccessible && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg text-center max-w-xs">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {tierBadge.label} Therapist
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Upgrade to access this therapist
                      </p>
                      <GradientButton size="sm">
                        Upgrade Plan
                      </GradientButton>
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{therapist.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {therapist.specialties.slice(0, 3).map((specialty: string) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {therapist.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{therapist.specialties.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{therapist.user_rating}</span>
                  </div>
                  <div>{therapist.years_experience} years experience</div>
                  <div>{therapist.total_sessions}+ sessions</div>
                </div>

                {therapist.matchFactors.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-therapy-700">
                      {t('onboarding.therapistMatch.matchFactors')}
                    </div>
                    {therapist.matchFactors.slice(0, 2).map((factor: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{factor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between">
        <GradientButton variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </GradientButton>
        <GradientButton 
          onClick={handleContinue}
          disabled={!selectedTherapist}
        >
          {selectedTherapist 
            ? t('onboarding.therapistMatch.selectTherapist')
            : t('onboarding.validation.selectOption')
          }
        </GradientButton>
      </div>
    </div>
  );
};

export default TherapistMatchStep;