import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Star, 
  Award, 
  Clock, 
  Users, 
  User,
  Heart, 
  Brain, 
  GraduationCap, 
  TrendingUp,
  MessageSquare,
  Play,
  Volume2,
  Shield,
  Globe
} from 'lucide-react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { enhancedVoiceService } from '@/services/voiceService';

interface TherapistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapist: any;
  onStartSession?: () => void;
}

const TherapistProfileModal = ({ 
  isOpen, 
  onClose, 
  therapist,
  onStartSession 
}: TherapistProfileModalProps) => {
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  if (!therapist) return null;

  const handleVoicePreview = async () => {
    if (isVoicePlaying) return;
    
    setIsVoicePlaying(true);
    
    const previewText = `Hello, I'm ${therapist.name}. I'm a ${therapist.title} specializing in ${therapist.specialties.slice(0, 3).join(', ')}. I use ${therapist.approach} to help my clients achieve their mental health goals. I believe in ${therapist.communicationStyle.toLowerCase()} approach to therapy. I'm here to support you on your journey to better mental health.`;
    
    try {
      await enhancedVoiceService.playTherapistMessage(
        previewText,
        therapist.avatarId,
        'encouraging'
      );
    } catch (error) {
      console.error('Voice preview failed:', error);
    } finally {
      setIsVoicePlaying(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'education', label: 'Education & Training', icon: GraduationCap },
    { id: 'approach', label: 'Therapeutic Approach', icon: Brain },
    { id: 'techniques', label: 'Techniques & Specialties', icon: Heart },
    { id: 'stats', label: 'Performance & Reviews', icon: TrendingUp }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Brain className="h-5 w-5 mr-2" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{therapist.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{therapist.yearsExperience} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Sessions</p>
                  <p className="text-sm text-muted-foreground">{therapist.sessionCount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-sm text-muted-foreground">{Math.round(therapist.successRate * 100)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-sm text-muted-foreground">{therapist.userSatisfaction}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="h-5 w-5 mr-2" />
                Communication Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{therapist.communicationStyle}</p>
              
              {/* Voice Characteristics */}
              {typeof therapist.voiceCharacteristics === 'object' ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Voice Profile:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tone:</span> {therapist.voiceCharacteristics.tone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pace:</span> {String(therapist.voiceCharacteristics.pace)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{therapist.voiceCharacteristics}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Avatar & Voice Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Professional2DAvatar
                  therapistId={therapist.avatarId}
                  therapistName={therapist.name}
                  className="w-full h-64 mb-4"
                  size="xl"
                  showName={false}
                  emotion={isVoicePlaying ? 'encouraging' : 'neutral'}
                  isSpeaking={isVoicePlaying}
                  showVoiceIndicator={true}
                  therapeuticMode={true}
                />
                
                <Button
                  onClick={handleVoicePreview}
                  disabled={isVoicePlaying}
                  variant="outline"
                  className="w-full mb-4"
                >
                  {isVoicePlaying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-therapy-500 mr-2"></div>
                      Speaking...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear My Voice
                    </>
                  )}
                </Button>

                <Button
                  onClick={onStartSession}
                  className="w-full bg-therapy-600 hover:bg-therapy-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Session Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Heart className="h-5 w-5 mr-2" />
            Areas of Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {therapist.specialties?.map((specialty: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-sm">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <GraduationCap className="h-5 w-5 mr-2" />
            Educational Background
          </CardTitle>
        </CardHeader>
        <CardContent>
          {therapist.education?.length > 0 ? (
            <div className="space-y-3">
              {therapist.education.map((edu: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-therapy-600 mt-0.5" />
                  <p className="text-sm">{edu}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Professional AI training with specialized therapeutic knowledge</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="h-5 w-5 mr-2" />
            Certifications & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm">HIPAA Compliant AI Systems</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm">Crisis Intervention Protocols</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm">Cultural Competency Training</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm">Trauma-Informed Care</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApproach = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="h-5 w-5 mr-2" />
            Therapeutic Approach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Primary Method</p>
              <Badge variant="outline" className="text-sm">
                {therapist.approach}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Philosophy</p>
              <p className="text-sm text-muted-foreground">
                My approach centers on {therapist.approach.toLowerCase()}, helping clients develop practical skills and insights for lasting change. I believe in creating a safe, non-judgmental space where healing can occur naturally.
              </p>
            </div>

            {/* Emotional Response Profile */}
            {therapist.emotionalResponses && typeof therapist.emotionalResponses === 'object' && (
              <div>
                <p className="text-sm font-medium mb-3">Emotional Response Profile</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(therapist.emotionalResponses).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                      <Progress 
                        value={
                          value === 'exceptional' ? 100 :
                          value === 'excellent' ? 90 :
                          value === 'high' ? 80 :
                          value === 'strong' ? 70 : 60
                        } 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTechniques = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Heart className="h-5 w-5 mr-2" />
            Therapeutic Techniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          {therapist.therapeuticTechniques?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {therapist.therapeuticTechniques.map((technique: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-therapy-600" />
                  <span className="text-sm">{technique}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Utilizes evidence-based therapeutic techniques tailored to individual client needs
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Globe className="h-5 w-5 mr-2" />
            Cultural & Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {therapist.languages?.map((lang: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Accessibility</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <span>Text & Voice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Crisis Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span>Cultural Sensitivity</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Success Rate</span>
                  <span>{Math.round(therapist.successRate * 100)}%</span>
                </div>
                <Progress value={therapist.successRate * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Satisfaction</span>
                  <span>{therapist.userSatisfaction}/5.0</span>
                </div>
                <Progress value={(therapist.userSatisfaction / 5) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Response Quality</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              Client Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Sessions</span>
                <span className="text-sm font-medium">{therapist.sessionCount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Clients</span>
                <span className="text-sm font-medium">{Math.floor(therapist.sessionCount / 10)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Session Rating</span>
                <span className="text-sm font-medium">{therapist.userSatisfaction}/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Recommendation Rate</span>
                <span className="text-sm font-medium">96%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Client Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-therapy-500 pl-4">
              <p className="text-sm italic">"Incredibly helpful and insightful. The personalized approach really made a difference in my progress."</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
            </div>
            
            <div className="border-l-4 border-therapy-500 pl-4">
              <p className="text-sm italic">"The voice feature makes it feel like talking to a real person. Very comfortable and professional."</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="h-3 w-3 fill-current text-yellow-500" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">1 week ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch(currentTab) {
      case 'overview': return renderOverview();
      case 'education': return renderEducation();
      case 'approach': return renderApproach();
      case 'techniques': return renderTechniques();
      case 'stats': return renderStats();
      default: return renderOverview();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{therapist.name}</DialogTitle>
          <p className="text-muted-foreground">{therapist.title}</p>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={currentTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTab(tab.id)}
                className="whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {renderTabContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistProfileModal;