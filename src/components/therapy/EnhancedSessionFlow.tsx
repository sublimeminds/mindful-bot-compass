import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TherapyApproachSelector from './TherapyApproachSelector';
import SessionProgressTracker from './SessionProgressTracker';
import { PlayCircle, BookOpen, Target, ArrowRight } from 'lucide-react';

interface TherapyApproach {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  system_prompt_addition: string;
}

interface EnhancedSessionFlowProps {
  onSessionStart: (approach: TherapyApproach) => void;
}

const EnhancedSessionFlow = ({ onSessionStart }: EnhancedSessionFlowProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'approach-selection' | 'pre-session' | 'ready'>('approach-selection');
  const [selectedApproach, setSelectedApproach] = useState<TherapyApproach | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      // Check if user has existing preferences
      const { data: preferences } = await supabase
        .from('user_therapy_preferences')
        .select(`
          *,
          therapeutic_approach_configs (*)
        `)
        .eq('user_id', user.id)
        .single();

      if (preferences?.therapeutic_approach_configs) {
        setSelectedApproach(preferences.therapeutic_approach_configs);
        setCurrentStep('pre-session');
      }
      
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproachSelected = async (approach: TherapyApproach) => {
    setSelectedApproach(approach);
    setCurrentStep('pre-session');

    // Save user preference
    try {
      await supabase
        .from('user_therapy_preferences')
        .upsert({
          user_id: user?.id,
          preferred_approach_id: approach.id,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  const handleStartSession = () => {
    if (selectedApproach) {
      onSessionStart(selectedApproach);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  if (currentStep === 'approach-selection') {
    return (
      <div className="space-y-6">
        <TherapyApproachSelector
          onApproachSelected={handleApproachSelected}
          currentApproachId={userPreferences?.preferred_approach_id}
        />
      </div>
    );
  }

  if (currentStep === 'pre-session' && selectedApproach) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Session Overview */}
        <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-therapy-600" />
              Today's Session: {selectedApproach.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{selectedApproach.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Key Techniques
                </h4>
                <ul className="space-y-1">
                  {selectedApproach.techniques.slice(0, 4).map((technique, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-therapy-600 rounded-full"></div>
                      {technique}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <SessionProgressTracker />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleStartSession}
                className="bg-therapy-600 hover:bg-therapy-700 px-8 py-3"
                size="lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Start {selectedApproach.name} Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentStep('approach-selection')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Approach</h4>
                  <p className="text-sm text-muted-foreground">Try a different therapy method</p>
                </div>
                <ArrowRight className="h-5 w-5 text-therapy-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Session History</h4>
                  <p className="text-sm text-muted-foreground">Review past sessions</p>
                </div>
                <ArrowRight className="h-5 w-5 text-therapy-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default EnhancedSessionFlow;