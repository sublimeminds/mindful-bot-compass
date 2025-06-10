
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationTemplateService, NotificationTemplate } from '@/services/notificationTemplateService';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const NotificationTemplateManager = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'session_reminder' as const,
    title: '',
    message: '',
    priority: 'medium' as const,
    variables: [] as string[],
    isActive: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await NotificationTemplateService.getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification templates',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const success = await NotificationTemplateService.createTemplate(formData);
      if (success) {
        toast({
          title: 'Success',
          description: 'Notification template created successfully'
        });
        setIsCreating(false);
        setFormData({
          name: '',
          type: 'session_reminder',
          title: '',
          message: '',
          priority: 'medium',
          variables: [],
          isActive: true
        });
        fetchTemplates();
      } else {
        throw new Error('Failed to create template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification template',
        variant: 'destructive'
      });
    }
  };

  const addVariable = () => {
    const variableName = prompt('Enter variable name (without {{}}):');
    if (variableName && !formData.variables.includes(variableName)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variableName]
      }));
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'session_reminder': return 'bg-blue-100 text-blue-800';
      case 'milestone_achieved': return 'bg-green-100 text-green-800';
      case 'insight_generated': return 'bg-purple-100 text-purple-800';
      case 'mood_check': return 'bg-orange-100 text-orange-800';
      case 'progress_update': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notification Templates</h3>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {(isCreating || editingTemplate) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Template' : 'Edit Template'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session_reminder">Session Reminder</SelectItem>
                    <SelectItem value="milestone_achieved">Milestone Achieved</SelectItem>
                    <SelectItem value="insight_generated">Insight Generated</SelectItem>
                    <SelectItem value="mood_check">Mood Check</SelectItem>
                    <SelectItem value="progress_update">Progress Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Variables</Label>
                <Button variant="outline" size="sm" onClick={addVariable}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Variable
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                    {`{{${variable}}}`}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeVariable(variable)} />
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Variables can be used in title and message using {`{{variableName}}`} syntax
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                setEditingTemplate(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No templates found. Create your first template above.
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge className={getTypeColor(template.type)}>
                            {template.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getPriorityColor(template.priority)}>
                            {template.priority}
                          </Badge>
                          {template.isActive && <Badge variant="outline">Active</Badge>}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{template.title}</p>
                          <p className="text-sm text-muted-foreground">{template.message}</p>
                        </div>
                        {template.variables.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable) => (
                              <Badge key={variable} variant="outline" className="text-xs">
                                {`{{${variable}}}`}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTemplateManager;
