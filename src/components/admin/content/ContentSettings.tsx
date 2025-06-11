
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';

const ContentSettings = () => {
  const [settings, setSettings] = useState({
    autoModeration: true,
    contentVersioning: true,
    publicSubmissions: false,
    requireApproval: true,
    backupEnabled: true,
    analyticsTracking: true,
    contentExpiry: false,
    multiLanguage: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      autoModeration: true,
      contentVersioning: true,
      publicSubmissions: false,
      requireApproval: true,
      backupEnabled: true,
      analyticsTracking: true,
      contentExpiry: false,
      multiLanguage: false
    });
    setHasChanges(false);
  };

  const settingsConfig = [
    {
      key: 'autoModeration',
      title: 'Auto Moderation',
      description: 'Automatically scan content for inappropriate material',
      category: 'Security'
    },
    {
      key: 'contentVersioning',
      title: 'Content Versioning',
      description: 'Keep historical versions of content changes',
      category: 'Management'
    },
    {
      key: 'publicSubmissions',
      title: 'Public Submissions',
      description: 'Allow users to submit content for review',
      category: 'Community'
    },
    {
      key: 'requireApproval',
      title: 'Require Approval',
      description: 'All content changes must be approved before publishing',
      category: 'Workflow'
    },
    {
      key: 'backupEnabled',
      title: 'Automatic Backup',
      description: 'Automatically backup content library daily',
      category: 'Security'
    },
    {
      key: 'analyticsTracking',
      title: 'Analytics Tracking',
      description: 'Track content usage and effectiveness metrics',
      category: 'Analytics'
    },
    {
      key: 'contentExpiry',
      title: 'Content Expiry',
      description: 'Automatically archive old or unused content',
      category: 'Management'
    },
    {
      key: 'multiLanguage',
      title: 'Multi-Language Support',
      description: 'Enable content translation and localization',
      category: 'Localization'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Security': return 'bg-red-500/20 text-red-400';
      case 'Management': return 'bg-blue-500/20 text-blue-400';
      case 'Community': return 'bg-green-500/20 text-green-400';
      case 'Workflow': return 'bg-purple-500/20 text-purple-400';
      case 'Analytics': return 'bg-orange-500/20 text-orange-400';
      case 'Localization': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const categories = [...new Set(settingsConfig.map(s => s.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content Settings</h2>
          <p className="text-gray-400">Configure content management and moderation settings</p>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      {hasChanges && (
        <Card className="bg-yellow-900/20 border-yellow-600/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">You have unsaved changes. Please save or reset your settings.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings by Category */}
      {categories.map(category => (
        <Card key={category} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-400" />
              {category} Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {settingsConfig
                .filter(setting => setting.category === category)
                .map(setting => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-medium">{setting.title}</h3>
                        <Badge className={`text-xs ${getCategoryColor(setting.category)}`}>
                          {setting.category}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                    <Switch
                      checked={settings[setting.key as keyof typeof settings]}
                      onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Advanced Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Retention Period (days)
              </label>
              <input
                type="number"
                defaultValue={365}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Content Size (MB)
              </label>
              <input
                type="number"
                defaultValue={50}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Backup Frequency
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Content Language
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSettings;
