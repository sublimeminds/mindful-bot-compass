import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTherapistCharacter } from '@/hooks/useTherapistCharacter';
import { SessionNote, TherapistNoteStyle } from '@/types/therapist-character';
import { FileText, Target, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface PersonalizedSessionNotesProps {
  sessionNote: SessionNote;
  therapistId: string;
  userId: string;
  showTherapistStyle?: boolean;
}

export const PersonalizedSessionNotes: React.FC<PersonalizedSessionNotesProps> = ({
  sessionNote,
  therapistId,
  userId,
  showTherapistStyle = true,
}) => {
  const { characterProfile } = useTherapistCharacter(therapistId, userId);

  if (!sessionNote || !characterProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Loading session notes...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStyleDescription = (style: string): string => {
    switch (style) {
      case 'holistic_narrative':
        return 'Integrative approach focusing on mind-body connections and cultural context';
      case 'strength_based_structured':
        return 'Solution-focused methodology emphasizing client resilience and practical skills';
      case 'structured':
        return 'Systematic documentation with clear objectives and interventions';
      case 'narrative':
        return 'Story-based approach capturing the client\'s journey and growth';
      default:
        return 'Professional therapeutic documentation';
    }
  };

  const getPhilosophyBasedObservations = () => {
    const philosophy = characterProfile.therapy_philosophy?.toLowerCase() || '';
    const observations = sessionNote.note_content.observations;

    if (philosophy.includes('mindfulness')) {
      return observations.filter(obs => 
        obs.includes('awareness') || 
        obs.includes('present') || 
        obs.includes('breathing') ||
        obs.includes('somatic')
      );
    }

    if (philosophy.includes('strength')) {
      return observations.filter(obs => 
        obs.includes('resilience') || 
        obs.includes('capability') || 
        obs.includes('resource') ||
        obs.includes('achievement')
      );
    }

    return observations;
  };

  return (
    <div className="space-y-6">
      {/* Header with Therapist Style */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Session Notes</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {format(new Date(sessionNote.created_at), 'MMMM dd, yyyy • HH:mm')}
              </p>
            </div>
            {showTherapistStyle && (
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {sessionNote.documentation_style.replace('_', ' ')}
                </Badge>
                <p className="text-xs text-muted-foreground max-w-48">
                  {getStyleDescription(sessionNote.documentation_style)}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content */}
        <div className="space-y-4">
          {/* Therapist Reflections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>Therapist Reflections</span>
                <Badge variant="secondary" className="text-xs">
                  {characterProfile.therapist_id.replace('dr-', 'Dr. ').replace('-', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <p className="text-sm leading-relaxed">
                  {sessionNote.therapist_reflections}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Key Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Observations</CardTitle>
              <p className="text-xs text-muted-foreground">
                Filtered by {characterProfile.therapy_philosophy.split('.')[0]}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPhilosophyBasedObservations().map((observation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm">{observation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Therapeutic Interventions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interventions Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionNote.note_content.therapeutic_interventions.map((intervention, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium mb-1">
                      {intervention.split(':')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {intervention.split(':').slice(1).join(':').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Content */}
        <div className="space-y-4">
          {/* Progress Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Progress Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(sessionNote.progress_assessment.session_effectiveness * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Effectiveness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {Math.round(sessionNote.progress_assessment.client_engagement * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {Math.round(sessionNote.progress_assessment.therapeutic_alliance * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Therapeutic Alliance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homework Assigned */}
          {sessionNote.note_content.homework_assigned && sessionNote.note_content.homework_assigned.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Homework & Practice</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessionNote.note_content.homework_assigned.map((homework, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Target className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm">{homework}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Session Focus */}
          {sessionNote.note_content.next_session_focus && sessionNote.note_content.next_session_focus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Next Session Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessionNote.note_content.next_session_focus.map((focus, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {sessionNote.note_content.client_responses.map((response, index) => (
                    <p key={index} className="text-sm text-muted-foreground italic">
                      "{response}"
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Character Signature */}
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Documentation by
                </p>
                <p className="font-medium text-sm">
                  {characterProfile.therapist_id.replace('dr-', 'Dr. ').replace('-', ' ')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Clinical Therapist
                </p>
                {characterProfile.signature_phrases && characterProfile.signature_phrases.length > 0 && (
                  <p className="text-xs italic text-primary/70 mt-2">
                    "{characterProfile.signature_phrases[0]}"
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};