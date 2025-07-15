
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Clock, TrendingUp, Target, MessageCircle, Calendar } from "lucide-react";
import GradientButton from '@/components/ui/GradientButton';
import { useTranslation } from 'react-i18next';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  icon: any;
  defaultValue: boolean;
}

const notificationOptions: NotificationPreference[] = [
  {
    id: 'session_reminders',
    name: 'Session Reminders',
    description: 'Get reminded about your scheduled therapy sessions',
    icon: Calendar,
    defaultValue: true
  },
  {
    id: 'progress_updates',
    name: 'Progress Updates',
    description: 'Weekly summaries of your wellness journey',
    icon: TrendingUp,
    defaultValue: true
  },
  {
    id: 'milestone_notifications',
    name: 'Milestone Celebrations',
    description: 'Celebrate when you reach important goals',
    icon: Target,
    defaultValue: true
  },
  {
    id: 'insight_notifications',
    name: 'Daily Insights',
    description: 'Personalized tips and wellness insights',
    icon: MessageCircle,
    defaultValue: false
  },
  {
    id: 'streak_reminders',
    name: 'Streak Reminders',
    description: 'Gentle nudges to maintain your wellness habits',
    icon: Clock,
    defaultValue: false
  }
];

interface NotificationPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const NotificationPreferencesStep: React.FC<NotificationPreferencesStepProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    notificationOptions.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.defaultValue
    }), {})
  );

  const handleToggle = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-full">
            <Bell className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Stay Connected to Your Wellness</h2>
        <p className="text-muted-foreground">
          Choose how you'd like TherapySync to support your journey with thoughtful notifications.
        </p>
      </div>

      <div className="bg-balance-50 p-4 rounded-lg border border-balance-200">
        <p className="text-sm text-balance-800">
          ✨ <strong>Privacy first:</strong> All notifications respect your quiet hours and can be customized anytime in settings.
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-harmony-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-harmony-600" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="text-base font-medium cursor-pointer">
                        {option.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.id}
                    checked={preferences[option.id]}
                    onCheckedChange={() => handleToggle(option.id)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <GradientButton variant="outline" onClick={onBack}>
          {t('common.back')}
        </GradientButton>
        <GradientButton onClick={onNext}>
          {t('onboarding.completion.completeSetup')}
        </GradientButton>
      </div>
    </div>
  );
};

export default NotificationPreferencesStep;
