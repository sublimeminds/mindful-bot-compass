
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/contexts/TherapistContext';

const TherapistWidget = () => {
  const { currentTherapist } = useTherapist();
  const navigate = useNavigate();

  const handleChangeTherapist = () => {
    navigate('/therapist-matching');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-therapy-600" />
          Your AI Therapist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentTherapist ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{currentTherapist.name}</h3>
              <p className="text-sm text-muted-foreground">{currentTherapist.title}</p>
            </div>

            <p className="text-sm text-center">{currentTherapist.description}</p>

            <div className="flex flex-wrap gap-1 justify-center">
              {currentTherapist.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {currentTherapist.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{currentTherapist.specialties.length - 3} more
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/chat')}
                className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Session
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleChangeTherapist}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                Change Therapist
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No Therapist Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Take our assessment to find your perfect AI therapist match.
              </p>
            </div>
            <Button 
              onClick={handleChangeTherapist}
              className="w-full"
              variant="outline"
            >
              Find My Therapist
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistWidget;
