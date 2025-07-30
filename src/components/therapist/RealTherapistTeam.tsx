import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, Star } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { useTherapistDatabase } from '@/hooks/useTherapistDatabase';
import { useNavigate } from 'react-router-dom';

const RealTherapistTeam = () => {
  const navigate = useNavigate();
  const { therapists, loading, error } = useTherapistDatabase();

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your AI Therapy Team</h2>
            <p className="text-gray-600">Loading our world-class AI therapists...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Your AI Therapy Team</h2>
          <p className="text-gray-600">Unable to load therapist data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Crown className="h-4 w-4" />;
      case 'premium':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'pro':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-therapy-500 to-harmony-500 text-white border-0 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            <Star className="h-3 w-3 mr-1" />
            Free
          </Badge>
        );
    }
  };

  return (
    <SafeComponentWrapper name="RealTherapistTeam">
      <div className="py-20 px-4 bg-gradient-to-br from-therapy-50/30 via-white to-harmony-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-therapy-100 text-therapy-800 border-therapy-200">
              {therapists.length}+ AI Specialists
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Your AI Therapy Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each AI therapist specializes in different approaches and techniques, 
              offering personalized support for your unique mental health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {therapists.slice(0, 12).map((therapist) => (
              <Card 
                key={therapist.id} 
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${therapist.color_scheme}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Professional2DAvatar
                        therapistId={therapist.id}
                        therapistName={therapist.name}
                        emotion="neutral"
                        size="md"
                        showName={false}
                        className="mx-auto"
                      />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getTierBadge(therapist.therapist_tier || 'free')}
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {(therapist.user_rating || 4.5).toFixed(1)} ⭐
                      </Badge>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-therapy-700 transition-colors">
                      {therapist.name}
                    </h3>
                    <p className="text-sm text-therapy-600 font-medium mb-2">{therapist.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {therapist.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-therapy-600 uppercase tracking-wider">Specialties</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {therapist.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-therapy-50 text-therapy-700 border-therapy-200">
                            {specialty}
                          </Badge>
                        ))}
                        {therapist.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            +{therapist.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-mindful-600 uppercase tracking-wider">Approach</span>
                      <p className="text-xs text-mindful-700 mt-1 line-clamp-2">{therapist.approach}</p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-harmony-600 uppercase tracking-wider">Experience</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-harmony-50 text-harmony-700 border-harmony-200">
                          {therapist.years_experience || 5}+ years
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          {therapist.total_sessions || 150}+ sessions
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate(`/ai-therapy-chat?therapist=${therapist.id}`)}
                    className="w-full mt-6 bg-white border border-therapy-200 text-therapy-700 hover:bg-therapy-50 group-hover:bg-therapy-600 group-hover:text-white group-hover:border-therapy-600 transition-all duration-300"
                    size="sm"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/ai-therapy-chat')}
              className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-3"
              size="lg"
            >
              Explore All {therapists.length} Therapists
            </Button>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default RealTherapistTeam;