
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradePromptProps {
  trigger: string;
  onClose?: () => void;
  onUpgrade?: () => void;
}

const UpgradePrompt = ({ trigger, onClose, onUpgrade }: UpgradePromptProps) => {
  const { isFreePlan } = useSubscription();

  if (!isFreePlan()) return null;

  const getPromptContent = () => {
    switch (trigger) {
      case 'session_limit':
        return {
          title: 'Session Limit Reached',
          message: 'You\'ve used all 3 free sessions this month. Upgrade to continue your therapy journey.',
          benefit: 'Get 15+ sessions with Basic or unlimited with Premium'
        };
      case 'goal_limit':
        return {
          title: 'Goal Limit Reached',
          message: 'You\'ve reached the 3-goal limit for free users. Upgrade to set unlimited goals.',
          benefit: 'Track unlimited goals and get personalized insights'
        };
      case 'features_locked':
        return {
          title: 'Premium Feature',
          message: 'This feature is available for Basic and Premium subscribers.',
          benefit: 'Unlock advanced therapeutic techniques and analytics'
        };
      default:
        return {
          title: 'Upgrade Your Experience',
          message: 'Get more from your therapy journey with a paid plan.',
          benefit: 'Access unlimited sessions and premium features'
        };
    }
  };

  const content = getPromptContent();

  return (
    <Card className="border-therapy-200 bg-gradient-to-r from-therapy-50 to-calm-50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-2 rounded-full bg-therapy-500">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-therapy-900 mb-1">
                {content.title}
              </h3>
              <p className="text-therapy-700 mb-2">
                {content.message}
              </p>
              <p className="text-sm text-therapy-600 mb-4">
                {content.benefit}
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={onUpgrade}
                  className="bg-therapy-600 hover:bg-therapy-700 text-white"
                >
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="border-therapy-300 text-therapy-700 hover:bg-therapy-100"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-therapy-400 hover:text-therapy-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
