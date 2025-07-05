import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Users, MessageCircle, Heart, Sparkles } from 'lucide-react';
import { EnhancedCulturalContextService, UserCulturalProfile } from '@/services/enhancedCulturalContextService';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const EnhancedCulturalAI = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserCulturalProfile | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [adaptationSettings, setAdaptationSettings] = useState({
    enableCulturalAdaptation: true,
    enableLanguageDetection: true,
    enableReligiousConsiderations: false,
    enableFamilyContext: true,
    communicationStyleAdaptation: true
  });

  useEffect(() => {
    if (user) {
      loadCulturalProfile();
      loadRecommendations();
    }
  }, [user]);

  const loadCulturalProfile = async () => {
    if (!user) return;
    
    try {
      const culturalProfile = await EnhancedCulturalContextService.getCulturalProfile(user.id);
      setProfile(culturalProfile);
    } catch (error) {
      console.error('Error loading cultural profile:', error);
    }
  };

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      const recs = await EnhancedCulturalContextService.getCulturalRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setAdaptationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const applyRecommendation = async (recommendation: any) => {
    try {
      // Apply the recommendation logic based on type
      if (recommendation.type === 'language') {
        handleSettingChange('enableLanguageDetection', true);
      } else if (recommendation.type === 'therapy-approach') {
        handleSettingChange('enableFamilyContext', true);
      } else if (recommendation.type === 'communication') {
        handleSettingChange('communicationStyleAdaptation', true);
      } else if (recommendation.type === 'spiritual') {
        handleSettingChange('enableReligiousConsiderations', true);
      }

      toast({
        title: "Recommendation Applied",
        description: `${recommendation.title} has been enabled for your therapy sessions.`,
      });

      // Remove the applied recommendation
      setRecommendations(prev => prev.filter(r => r !== recommendation));
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to apply recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Enhanced Cultural AI Adaptation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Personalized AI therapy that understands and respects your cultural background, 
            communication style, and personal values.
          </p>
        </CardContent>
      </Card>

      {/* Cultural Profile Summary */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Your Cultural Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Language</Label>
                <Badge variant="outline">{profile.primaryLanguage}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cultural Background</Label>
                <Badge variant="outline">{profile.culturalBackground}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Family Structure</Label>
                <Badge variant="outline">{profile.familyStructure}</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Communication Style</Label>
                <Badge variant="outline">{profile.communicationStyle}</Badge>
              </div>
            </div>

            {profile.therapyApproachPreferences.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Preferred Therapy Approaches</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.therapyApproachPreferences.map((approach, index) => (
                    <Badge key={index} variant="secondary">{approach}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Adaptation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Adaptation Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="cultural-adaptation">Cultural Adaptation</Label>
                <p className="text-sm text-muted-foreground">
                  Adapt AI responses based on your cultural background
                </p>
              </div>
              <Switch
                id="cultural-adaptation"
                checked={adaptationSettings.enableCulturalAdaptation}
                onCheckedChange={(checked) => handleSettingChange('enableCulturalAdaptation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="language-detection">Automatic Language Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and respond in your preferred language
                </p>
              </div>
              <Switch
                id="language-detection"
                checked={adaptationSettings.enableLanguageDetection}
                onCheckedChange={(checked) => handleSettingChange('enableLanguageDetection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="religious-considerations">Religious Considerations</Label>
                <p className="text-sm text-muted-foreground">
                  Include spiritual and religious perspectives in therapy
                </p>
              </div>
              <Switch
                id="religious-considerations"
                checked={adaptationSettings.enableReligiousConsiderations}
                onCheckedChange={(checked) => handleSettingChange('enableReligiousConsiderations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="family-context">Family & Community Context</Label>
                <p className="text-sm text-muted-foreground">
                  Consider family and community relationships in therapy
                </p>
              </div>
              <Switch
                id="family-context"
                checked={adaptationSettings.enableFamilyContext}
                onCheckedChange={(checked) => handleSettingChange('enableFamilyContext', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="communication-style">Communication Style Adaptation</Label>
                <p className="text-sm text-muted-foreground">
                  Adapt communication style (direct vs. indirect, high/low context)
                </p>
              </div>
              <Switch
                id="communication-style"
                checked={adaptationSettings.communicationStyleAdaptation}
                onCheckedChange={(checked) => handleSettingChange('communicationStyleAdaptation', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Personalized Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <Badge 
                          variant={recommendation.priority === 'high' ? 'destructive' : 'secondary'}
                        >
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {recommendation.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applyRecommendation(recommendation)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cultural AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Cultural AI Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Language & Communication</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multi-language therapy sessions</li>
                <li>• Cultural idiom and expression understanding</li>
                <li>• Context-sensitive communication styles</li>
                <li>• Non-verbal communication awareness</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Cultural Integration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Family and community-centered approaches</li>
                <li>• Religious and spiritual integration</li>
                <li>• Cultural trauma-informed care</li>
                <li>• Traditional healing method recognition</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Bias Prevention</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cultural bias detection and correction</li>
                <li>• Inclusive therapy recommendations</li>
                <li>• Culturally adapted assessment tools</li>
                <li>• Stereotype avoidance mechanisms</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Adaptive Learning</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Continuous cultural context learning</li>
                <li>• Personal preference adaptation</li>
                <li>• Outcome-based cultural optimization</li>
                <li>• Feedback-driven improvements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCulturalAI;