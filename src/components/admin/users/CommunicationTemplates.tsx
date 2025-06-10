
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Send,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'support' | 'promotional' | 'reminder' | 'follow_up' | 'announcement';
  variables: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
}

const CommunicationTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Welcome New User',
      subject: 'Welcome to our Mental Wellness Platform!',
      content: `Hi {{name}},

Welcome to our mental wellness platform! We're excited to have you join our community.

Here are some quick tips to get started:
- Complete your profile setup
- Take the initial assessment
- Explore our therapy sessions
- Set your first wellness goal

If you have any questions, don't hesitate to reach out to our support team.

Best regards,
The Team`,
      category: 'welcome',
      variables: ['name'],
      usage_count: 45,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Session Reminder',
      subject: 'Don\'t forget your therapy session today',
      content: `Hi {{name}},

This is a friendly reminder about your therapy session scheduled for {{session_time}}.

Taking care of your mental health is important, and we're here to support you every step of the way.

Session details:
- Time: {{session_time}}
- Duration: {{duration}} minutes
- Type: {{session_type}}

See you soon!

Best regards,
The Team`,
      category: 'reminder',
      variables: ['name', 'session_time', 'duration', 'session_type'],
      usage_count: 128,
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Support Follow-up',
      subject: 'How can we help you further?',
      content: `Hi {{name}},

We wanted to follow up on your recent support request about {{issue_topic}}.

We hope our solution was helpful! If you're still experiencing any issues or have additional questions, please don't hesitate to reach out.

Your feedback is important to us, and we're always here to help improve your experience.

Best regards,
{{support_agent}}
Support Team`,
      category: 'follow_up',
      variables: ['name', 'issue_topic', 'support_agent'],
      usage_count: 67,
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category: 'support' as Template['category']
  });

  const categoryOptions = [
    { value: 'welcome', label: 'Welcome' },
    { value: 'support', label: 'Support' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'announcement', label: 'Announcement' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'welcome': return 'bg-green-500';
      case 'support': return 'bg-blue-500';
      case 'promotional': return 'bg-purple-500';
      case 'reminder': return 'bg-yellow-500';
      case 'follow_up': return 'bg-orange-500';
      case 'announcement': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(match => match.slice(2, -2)))];
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const variables = extractVariables(formData.content);
    const now = new Date().toISOString();

    if (isCreating) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        ...formData,
        variables,
        usage_count: 0,
        created_at: now,
        updated_at: now
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Template created",
        description: "Communication template has been created successfully.",
      });
    } else if (selectedTemplate) {
      const updatedTemplate: Template = {
        ...selectedTemplate,
        ...formData,
        variables,
        updated_at: now
      };
      setTemplates(prev => 
        prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t)
      );
      setSelectedTemplate(updatedTemplate);
      toast({
        title: "Template updated",
        description: "Communication template has been updated successfully.",
      });
    }

    setIsEditing(false);
    setIsCreating(false);
    resetForm();
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      category: template.category
    });
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
    toast({
      title: "Template deleted",
      description: "Communication template has been deleted successfully.",
    });
  };

  const handleDuplicate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
    toast({
      title: "Template duplicated",
      description: "Template has been duplicated successfully.",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      content: '',
      category: 'support'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Communication Templates</h2>
          <p className="text-gray-400">Manage reusable message templates</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Templates ({templates.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm truncate">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {template.subject}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={`${getCategoryColor(template.category)} text-white text-xs`}>
                            {template.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Used {template.usage_count} times
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Details/Editor */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            {selectedTemplate && !isEditing && !isCreating ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedTemplate.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`${getCategoryColor(selectedTemplate.category)} text-white`}>
                          {selectedTemplate.category}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Used {selectedTemplate.usage_count} times
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(selectedTemplate)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDuplicate(selectedTemplate)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(selectedTemplate.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Subject</label>
                    <div className="mt-1 p-3 bg-gray-700/50 rounded border border-gray-600">
                      <p className="text-white">{selectedTemplate.subject}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Content</label>
                    <div className="mt-1 p-3 bg-gray-700/50 rounded border border-gray-600">
                      <pre className="text-white whitespace-pre-wrap text-sm">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Variables</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="secondary">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (isEditing || isCreating) ? (
              <>
                <CardHeader>
                  <CardTitle className="text-white">
                    {isCreating ? 'Create Template' : 'Edit Template'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Template Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter template name..."
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject..."
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter message content... Use {{variable}} for dynamic content."
                      className="bg-gray-700 border-gray-600"
                      rows={12}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use double curly braces for variables: {`{{name}}, {{email}}, {{date}}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>
                      <FileText className="h-4 w-4 mr-2" />
                      {isCreating ? 'Create Template' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setIsCreating(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template to view details or create a new one</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTemplates;
