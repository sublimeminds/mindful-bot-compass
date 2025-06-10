
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Mail, Bell, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'in_app';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
}

type NotificationFormData = {
  name: string;
  type: 'email' | 'push' | 'in_app';
  category: string;
  subject: string;
  content: string;
  variables: string[];
  is_active: boolean;
};

const NotificationTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>({
    name: '',
    type: 'email',
    category: '',
    subject: '',
    content: '',
    variables: [],
    is_active: true,
  });
  const [newVariable, setNewVariable] = useState('');

  useEffect(() => {
    // Mock data - in real app, fetch from Supabase
    setTemplates([
      {
        id: '1',
        name: 'Welcome Email',
        type: 'email',
        category: 'onboarding',
        subject: 'Welcome to Mental Health Assistant, {{user_name}}!',
        content: 'Hi {{user_name}},\n\nWelcome to our platform! We\'re excited to help you on your mental health journey.',
        variables: ['user_name', 'platform_name'],
        is_active: true,
        created_at: '2024-01-01',
      },
      {
        id: '2',
        name: 'Session Reminder',
        type: 'push',
        category: 'reminders',
        content: 'Don\'t forget your therapy session scheduled for {{session_time}}',
        variables: ['session_time', 'therapist_name'],
        is_active: true,
        created_at: '2024-01-02',
      },
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, ...formData, id: selectedTemplate.id, created_at: selectedTemplate.created_at }
          : t
      ));
      toast({
        title: "Template updated",
        description: "Notification template has been updated successfully.",
      });
    } else {
      // Create new template
      const newTemplate: NotificationTemplate = {
        ...formData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: "Template created",
        description: "New notification template has been created successfully.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'email',
      category: '',
      subject: '',
      content: '',
      variables: [],
      is_active: true,
    });
    setSelectedTemplate(null);
    setShowForm(false);
  };

  const editTemplate = (template: NotificationTemplate) => {
    setFormData({
      name: template.name,
      type: template.type,
      category: template.category,
      subject: template.subject || '',
      content: template.content,
      variables: template.variables,
      is_active: template.is_active,
    });
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template deleted",
      description: "Notification template has been deleted successfully.",
    });
  };

  const addVariable = () => {
    if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable.trim()]
      }));
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'in_app': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500';
      case 'push': return 'bg-green-500';
      case 'in_app': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {selectedTemplate ? 'Edit Template' : 'Create New Template'}
          </h3>
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., onboarding, reminders"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Notification Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'email' | 'push' | 'in_app') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                    <SelectItem value="in_app">In-App Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'email' && (
                <div>
                  <Label htmlFor="subject" className="text-white">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Email subject line"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="content" className="text-white">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={6}
                  placeholder="Template content with {{variables}}"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Variables</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    placeholder="Add variable name..."
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                  />
                  <Button type="button" onClick={addVariable} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="flex items-center space-x-1">
                      <span>{`{{${variable}}}`}</span>
                      <button
                        type="button"
                        onClick={() => removeVariable(variable)}
                        className="ml-1 hover:text-red-400"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {selectedTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Notification Templates</h2>
          <p className="text-gray-400">Manage email, push, and in-app notification templates</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{templates.length}</div>
            <p className="text-sm text-gray-400">Total Templates</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">
              {templates.filter(t => t.type === 'email').length}
            </div>
            <p className="text-sm text-gray-400">Email Templates</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">
              {templates.filter(t => t.type === 'push').length}
            </div>
            <p className="text-sm text-gray-400">Push Templates</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-400">
              {templates.filter(t => t.type === 'in_app').length}
            </div>
            <p className="text-sm text-gray-400">In-App Templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates created yet</p>
              <Button 
                onClick={() => setShowForm(true)} 
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded ${getTypeColor(template.type)}`}>
                      {getTypeIcon(template.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{template.name}</h3>
                        <Badge variant="outline">{template.category}</Badge>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {template.content.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default NotificationTemplates;
