
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Languages, Heart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EnhancedCulturalContextService } from '@/services/enhancedCulturalContextService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const CulturalAdaptationNotice = () => {
  const { t } = useTranslation();
  const { user } = useSimpleApp();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      const recs = await EnhancedCulturalContextService.getCulturalRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading cultural recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'language':
        return <Languages className="h-4 w-4" />;
      case 'therapy-approach':
        return <Users className="h-4 w-4" />;
      case 'communication':
        return <Globe className="h-4 w-4" />;
      case 'spiritual':
        return <Heart className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <Globe className="h-5 w-5" />
        <span>{t('cultural.title')}</span>
      </h3>
      
      {recommendations.map((rec, index) => (
        <Card key={index} className={`${getPriorityColor(rec.priority)}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-primary mt-1">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">
                  {rec.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {rec.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    // Handle recommendation action
                    console.log('Applying recommendation:', rec.action);
                  }}
                >
                  {rec.action}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CulturalAdaptationNotice;
