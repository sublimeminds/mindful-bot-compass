import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Volume2,
  Globe,
  Heart
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import BulletproofDashboardLayout from '@/components/dashboard/BulletproofDashboardLayout';
import { useSafeSEO } from '@/hooks/useSafeSEO';

const Settings = () => {
  useSafeSEO({
    title: 'Settings - TherapySync',
    description: 'Customize your TherapySync experience with personalized settings for therapy, notifications, and privacy.',
    keywords: 'settings, preferences, privacy, notifications, customization'
  });

  const settingsCategories = [
    {
      icon: User,
      title: 'Profile & Account',
      description: 'Manage your personal information and account preferences',
      color: 'from-therapy-500 to-calm-500',
      comingSoon: false
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control your data privacy and security settings',
      color: 'from-harmony-500 to-balance-500',
      comingSoon: false
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Customize notification preferences and scheduling',
      color: 'from-flow-500 to-therapy-500',
      comingSoon: false
    },
    {
      icon: Volume2,
      title: 'Voice & Audio',
      description: 'Configure voice settings and audio preferences',
      color: 'from-calm-500 to-harmony-500',
      comingSoon: false
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Personalize the look and feel of your interface',
      color: 'from-balance-500 to-flow-500',
      comingSoon: true
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your preferred language and regional settings',
      color: 'from-purple-500 to-pink-500',
      comingSoon: true
    }
  ];

  return (
    <SafeComponentWrapper name="SettingsPage">
      <BulletproofDashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-therapy-800">Settings</h1>
              <p className="text-slate-600">Customize your TherapySync experience</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settingsCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg cursor-pointer ${category.comingSoon ? 'opacity-60' : ''}`}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 relative`}>
                      <IconComponent className="h-6 w-6 text-white" />
                      {category.comingSoon && (
                        <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white scale-75">
                          Soon
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-therapy-800">{category.title}</CardTitle>
                    {category.comingSoon && (
                      <Badge variant="outline" className="w-fit text-orange-600 border-orange-200">
                        Coming Soon
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Settings */}
          <Card className="bg-gradient-to-r from-therapy-25 to-calm-25 border-therapy-100">
            <CardHeader>
              <CardTitle className="flex items-center text-therapy-800">
                <Heart className="h-5 w-5 mr-2" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Most commonly used settings for a faster experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-therapy-700 mb-2">Notification Schedule</h4>
                  <p className="text-sm text-slate-600">Daily reminders at 9:00 AM</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-therapy-700 mb-2">Voice Language</h4>
                  <p className="text-sm text-slate-600">English (US)</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-therapy-700 mb-2">Privacy Mode</h4>
                  <p className="text-sm text-slate-600">Enhanced</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-therapy-700 mb-2">Theme</h4>
                  <p className="text-sm text-slate-600">Auto (Light/Dark)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BulletproofDashboardLayout>
    </SafeComponentWrapper>
  );
};

export default Settings;