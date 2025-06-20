
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Simplified notification template manager without complex types
interface SimpleTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
}

const SimpleNotificationTemplateManager = () => {
  const [templates, setTemplates] = useState<SimpleTemplate[]>([
    {
      id: '1',
      name: 'Session Reminder',
      title: 'Your therapy session is coming up',
      message: 'You have a session scheduled in 1 hour. Take a moment to prepare.',
      type: 'reminder',
      isActive: true
    },
    {
      id: '2',
      name: 'Progress Update',
      title: 'Weekly progress summary',
      message: 'Here\'s your progress summary for this week.',
      type: 'progress',
      isActive: true
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<SimpleTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
    type: 'reminder'
  });

  const handleEdit = (template: SimpleTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      message: template.message,
      type: template.type
    });
  };

  const handleSave = () => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      const newTemplate: SimpleTemplate = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    
    setEditingTemplate(null);
    setFormData({ name: '', title: '', message: '', type: 'reminder' });
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setFormData({ name: '', title: '', message: '', type: 'reminder' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div><strong>Title:</strong> {template.title}</div>
                  <div><strong>Message:</strong> {template.message}</div>
                  <div><strong>Type:</strong> {template.type}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="title">Notification Title</Label>
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

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="reminder">Reminder</option>
              <option value="progress">Progress</option>
              <option value="milestone">Milestone</option>
              <option value="insight">Insight</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
            {editingTemplate && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleNotificationTemplateManager;
