
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Heart, Brain, Lightbulb, Target, Users, Compass } from 'lucide-react';
import { TherapistMatch, AssessmentResponse } from '@/services/therapistMatchingService';

interface TherapistMatchResultsProps {
  matches: TherapistMatch[];
  responses: AssessmentResponse[];
  onSelectTherapist: (therapistId: string) => void;
  onRetakeAssessment: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Brain,
  Heart,
  Lightbulb,
  Target,
  Users,
  Compass,
  Star
};

const TherapistMatchResults: React.FC<TherapistMatchResultsProps> = ({
  matches,
  onSelectTherapist,
  onRetakeAssessment
}) => {
  const topMatches = matches.slice(0, 3);

  const getMatchQuality = (score: number) => {
    if (score >= 0.8) return { label: 'Excellent Match', color: 'bg-green-500' };
    if (score >= 0.6) return { label: 'Good Match', color: 'bg-blue-500' };
    if (score >= 0.4) return { label: 'Fair Match', color: 'bg-yellow-500' };
    return { label: 'Basic Match', color: 'bg-gray-500' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Your Therapist Matches</CardTitle>
          <p className="text-center text-muted-foreground">
            Based on your responses, here are the AI therapists best suited for you
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {topMatches.map((match, index) => {
          const { therapist } = match;
          const matchQuality = getMatchQuality(match.compatibility_score);
          const IconComponent = iconMap[therapist.icon] || Star;

          return (
            <Card key={therapist.id} className={`${index === 0 ? 'ring-2 ring-therapy-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${therapist.color_scheme}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{therapist.name}</h3>
                        <p className="text-muted-foreground">{therapist.title}</p>
                        {index === 0 && (
                          <Badge className="mt-1 bg-therapy-100 text-therapy-800">
                            Best Match
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-therapy-600">
                          {Math.round(match.compatibility_score * 100)}%
                        </div>
                        <Badge variant="outline" className={matchQuality.color + ' text-white'}>
                          {matchQuality.label}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {therapist.description}
                    </p>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Approach: </span>
                        <span className="text-sm text-muted-foreground">{therapist.approach}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Specialties: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {therapist.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {match.reasoning.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Why this match: </span>
                          <ul className="text-sm text-muted-foreground mt-1">
                            {match.reasoning.map((reason, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-1 h-1 bg-therapy-400 rounded-full mr-2" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {match.strengths.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Key strengths: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.strengths.map((strength) => (
                              <Badge key={strength} variant="outline" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compatibility Score</span>
                        <span>{Math.round(match.compatibility_score * 100)}%</span>
                      </div>
                      <Progress value={match.compatibility_score * 100} className="h-2" />
                    </div>

                    <Button 
                      onClick={() => onSelectTherapist(therapist.id)}
                      className={`w-full ${index === 0 ? 'bg-therapy-600 hover:bg-therapy-700' : ''}`}
                      variant={index === 0 ? 'default' : 'outline'}
                    >
                      Select {therapist.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onRetakeAssessment}>
          Retake Assessment
        </Button>
      </div>
    </div>
  );
};

export default TherapistMatchResults;
