
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { FileText, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SimpleNotificationTemplate {
  id: string;
  name: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
}

const NotificationTemplateManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SimpleNotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'general',
    title: '',
    message: '',
    priority: 'medium',
    is_active: true,
    variables: [] as string[]
  });

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        toast({
          title: "Error",
          description: "Failed to load notification templates.",
          variant: "destructive",
        });
      } else {
        setTemplates(data || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert([newTemplate])
        .select()
        .single();

      if (error) {
        console.error('Error creating template:', error);
        toast({
          title: "Error",
          description: "Failed to create notification template.",
          variant: "destructive",
        });
      } else {
        setTemplates(prev => [data, ...prev]);
        setNewTemplate({
          name: '',
          type: 'general',
          title: '',
          message: '',
          priority: 'medium',
          is_active: true,
          variables: []
        });
        toast({
          title: "Template Created",
          description: "Notification template created successfully.",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting template:', error);
        toast({
          title: "Error",
          description: "Failed to delete notification template.",
          variant: "destructive",
        });
      } else {
        setTemplates(prev => prev.filter(template => template.id !== id));
        toast({
          title: "Template Deleted",
          description: "Notification template deleted successfully.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setNewTemplate(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Create Template Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Create New Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newTemplate.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Template Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="session_reminder">Session Reminder</SelectItem>
                  <SelectItem value="milestone_achieved">Milestone Achieved</SelectItem>
                  <SelectItem value="insight_generated">Insight Generated</SelectItem>
                  <SelectItem value="mood_check">Mood Check</SelectItem>
                  <SelectItem value="progress_update">Progress Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTemplate.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Notification Title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={newTemplate.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Notification Message"
              rows={4}
            />
          </div>
          <Button onClick={createTemplate} disabled={isCreating} className="w-full">
            {isCreating ? 'Creating...' : 'Create Template'}
          </Button>
        </CardContent>
      </Card>

      {/* Template List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Existing Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-4">No templates created yet.</div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.type}</p>
                      <p className="text-sm">{template.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={template.is_active ? 'default' : 'secondary'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTemplateManager;
