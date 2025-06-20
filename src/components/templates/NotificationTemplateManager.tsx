import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { FileText, Plus, Edit, Trash2, Copy, Eye, Send, Save, X, CheckCircle, AlertTriangle, Settings, Bell, MessageCircle, Calendar, Clock, Target } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  body: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const NotificationTemplateManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'general',
    subject: '',
    body: '',
    isEnabled: true,
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
        .order('createdAt', { ascending: false });

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
          subject: '',
          body: '',
          isEnabled: true,
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

  const updateTemplate = async (id: string, updates: Partial<NotificationTemplate>) => {
    setIsEditing(true);
    try {
      const { error } = await supabase
        .from('notification_templates')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating template:', error);
        toast({
          title: "Error",
          description: "Failed to update notification template.",
          variant: "destructive",
        });
      } else {
        setTemplates(prev =>
          prev.map(template => (template.id === id ? { ...template, ...updates } : template))
        );
        toast({
          title: "Template Updated",
          description: "Notification template updated successfully.",
        });
      }
    } finally {
      setIsEditing(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTemplate({ ...newTemplate, type: e.target.value });
  };

  const handleToggleChange = (id: string, isEnabled: boolean) => {
    updateTemplate(id, { isEnabled });
  };

  const handleEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCloseEdit = () => {
    setSelectedTemplate(null);
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
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                placeholder="Template Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => handleSelectChange({ target: { name: 'type', value } } as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" defaultValue={newTemplate.type} />
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
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={newTemplate.subject}
              onChange={handleInputChange}
              placeholder="Notification Subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              name="body"
              value={newTemplate.body}
              onChange={handleInputChange}
              placeholder="Notification Body"
              rows={4}
            />
          </div>
          <Button onClick={createTemplate} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Settings className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </>
            )}
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
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`template-${template.id}`}
                        checked={template.isEnabled}
                        onCheckedChange={(checked) => handleToggleChange(template.id, checked)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
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

      {/* Edit Template Dialog */}
      {selectedTemplate && (
        <EditTemplateDialog
          template={selectedTemplate}
          onUpdate={updateTemplate}
          onClose={handleCloseEdit}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

interface EditTemplateDialogProps {
  template: NotificationTemplate;
  onUpdate: (id: string, updates: Partial<NotificationTemplate>) => void;
  onClose: () => void;
  isEditing: boolean;
}

const EditTemplateDialog = ({ template, onUpdate, onClose, isEditing }: EditTemplateDialogProps) => {
  const [editedTemplate, setEditedTemplate] = useState(template);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedTemplate({ ...editedTemplate, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedTemplate({ ...editedTemplate, type: e.target.value });
  };

  const handleSave = () => {
    onUpdate(template.id, {
      name: editedTemplate.name,
      type: editedTemplate.type,
      subject: editedTemplate.subject,
      body: editedTemplate.body,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Edit Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editedTemplate.name}
                onChange={handleInputChange}
                placeholder="Template Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => handleSelectChange({ target: { name: 'type', value } } as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" defaultValue={editedTemplate.type} />
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
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={editedTemplate.subject}
              onChange={handleInputChange}
              placeholder="Notification Subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              name="body"
              value={editedTemplate.body}
              onChange={handleInputChange}
              placeholder="Notification Body"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isEditing}>
              {isEditing ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTemplateManager;
