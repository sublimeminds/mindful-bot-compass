
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Content Moderation
    autoModeration: true,
    moderationLevel: 'medium',
    requireApproval: false,
    
    // Content Organization
    maxTagsPerItem: 10,
    allowUserSubmissions: false,
    defaultCategory: 'General',
    
    // Media Settings
    maxFileSize: 50, // MB
    allowedFileTypes: ['jpg', 'png', 'mp4', 'mp3', 'pdf'],
    autoTranscription: true,
    
    // Publishing
    autoPublish: false,
    scheduleContent: true,
    versionControl: true,
    
    // SEO & Metadata
    autoGenerateMetadata: true,
    seoOptimization: true,
    searchIndexing: true,
  });

  const [contentPolicies, setContentPolicies] = useState({
    guidelines: 'All content must be therapeutic in nature and follow evidence-based practices.',
    restrictions: 'No content that could be harmful or triggering without proper warnings.',
    approval_process: 'All new content requires review by qualified staff before publication.',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePolicyChange = (key: string, value: string) => {
    setContentPolicies(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // In real app, save to backend
    toast({
      title: "Settings saved",
      description: "Content settings have been updated successfully.",
    });
  };

  const resetSettings = () => {
    // Reset to defaults
    setSettings({
      autoModeration: true,
      moderationLevel: 'medium',
      requireApproval: false,
      maxTagsPerItem: 10,
      allowUserSubmissions: false,
      defaultCategory: 'General',
      maxFileSize: 50,
      allowedFileTypes: ['jpg', 'png', 'mp4', 'mp3', 'pdf'],
      autoTranscription: true,
      autoPublish: false,
      scheduleContent: true,
      versionControl: true,
      autoGenerateMetadata: true,
      seoOptimization: true,
      searchIndexing: true,
    });
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Content Settings</h2>
          <p className="text-gray-400">Configure content management policies and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Moderation */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Content Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoModeration" className="text-white">Auto Moderation</Label>
              <Switch
                id="autoModeration"
                checked={settings.autoModeration}
                onCheckedChange={(checked) => handleSettingChange('autoModeration', checked)}
              />
            </div>

            <div>
              <Label htmlFor="moderationLevel" className="text-white">Moderation Level</Label>
              <Select
                value={settings.moderationLevel}
                onValueChange={(value) => handleSettingChange('moderationLevel', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requireApproval" className="text-white">Require Approval</Label>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Organization */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Content Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxTags" className="text-white">Max Tags Per Item</Label>
              <Input
                id="maxTags"
                type="number"
                value={settings.maxTagsPerItem}
                onChange={(e) => handleSettingChange('maxTagsPerItem', parseInt(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                min="1"
                max="20"
              />
            </div>

            <div>
              <Label htmlFor="defaultCategory" className="text-white">Default Category</Label>
              <Input
                id="defaultCategory"
                value={settings.defaultCategory}
                onChange={(e) => handleSettingChange('defaultCategory', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowUserSubmissions" className="text-white">Allow User Submissions</Label>
              <Switch
                id="allowUserSubmissions"
                checked={settings.allowUserSubmissions}
                onCheckedChange={(checked) => handleSettingChange('allowUserSubmissions', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Media Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxFileSize" className="text-white">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
                min="1"
                max="500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoTranscription" className="text-white">Auto Transcription</Label>
              <Switch
                id="autoTranscription"
                checked={settings.autoTranscription}
                onCheckedChange={(checked) => handleSettingChange('autoTranscription', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoPublish" className="text-white">Auto Publish</Label>
              <Switch
                id="autoPublish"
                checked={settings.autoPublish}
                onCheckedChange={(checked) => handleSettingChange('autoPublish', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="scheduleContent" className="text-white">Schedule Content</Label>
              <Switch
                id="scheduleContent"
                checked={settings.scheduleContent}
                onCheckedChange={(checked) => handleSettingChange('scheduleContent', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="versionControl" className="text-white">Version Control</Label>
              <Switch
                id="versionControl"
                checked={settings.versionControl}
                onCheckedChange={(checked) => handleSettingChange('versionControl', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Metadata */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">SEO & Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoGenerateMetadata" className="text-white">Auto Generate Metadata</Label>
              <Switch
                id="autoGenerateMetadata"
                checked={settings.autoGenerateMetadata}
                onCheckedChange={(checked) => handleSettingChange('autoGenerateMetadata', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="seoOptimization" className="text-white">SEO Optimization</Label>
              <Switch
                id="seoOptimization"
                checked={settings.seoOptimization}
                onCheckedChange={(checked) => handleSettingChange('seoOptimization', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="searchIndexing" className="text-white">Search Indexing</Label>
              <Switch
                id="searchIndexing"
                checked={settings.searchIndexing}
                onCheckedChange={(checked) => handleSettingChange('searchIndexing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Policies */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Content Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guidelines" className="text-white">Content Guidelines</Label>
              <Textarea
                id="guidelines"
                value={contentPolicies.guidelines}
                onChange={(e) => handlePolicyChange('guidelines', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="restrictions" className="text-white">Content Restrictions</Label>
              <Textarea
                id="restrictions"
                value={contentPolicies.restrictions}
                onChange={(e) => handlePolicyChange('restrictions', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="approval_process" className="text-white">Approval Process</Label>
              <Textarea
                id="approval_process"
                value={contentPolicies.approval_process}
                onChange={(e) => handlePolicyChange('approval_process', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentSettings;
