
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Send,
  Bell
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'in_app' | 'sms';
  category: string;
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
}

const NotificationTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const mockTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      category: 'Onboarding',
      subject: 'Welcome to MindfulAI, {{user_name}}!',
      content: 'Hi {{user_name}}, welcome to our therapy platform...',
      variables: ['user_name', 'activation_link'],
      isActive: true,
      usageCount: 1247,
      lastUsed: new Date(2024, 5, 10)
    },
    {
      id: '2',
      name: 'Session Reminder',
      type: 'push',
      category: 'Sessions',
      subject: 'Your therapy session starts in 15 minutes',
      content: 'Don\'t forget about your scheduled session with {{therapist_name}}',
      variables: ['therapist_name', 'session_time'],
      isActive: true,
      usageCount: 856,
      lastUsed: new Date(2024, 5, 11)
    },
    {
      id: '3',
      name: 'Goal Achievement',
      type: 'in_app',
      category: 'Achievements',
      subject: 'Congratulations! Goal completed',
      content: 'You\'ve successfully completed your goal: {{goal_name}}',
      variables: ['goal_name', 'achievement_badge'],
      isActive: true,
      usageCount: 432,
      lastUsed: new Date(2024, 5, 9)
    },
    {
      id: '4',
      name: 'Crisis Support',
      type: 'sms',
      category: 'Crisis',
      subject: 'Immediate Support Available',
      content: 'We\'re here for you. Call our crisis line: {{crisis_number}}',
      variables: ['crisis_number', 'support_link'],
      isActive: true,
      usageCount: 23,
      lastUsed: new Date(2024, 5, 8)
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'push': return Bell;
      case 'in_app': return Bell;
      case 'sms': return Send;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500/20 text-blue-400';
      case 'push': return 'bg-green-500/20 text-green-400';
      case 'in_app': return 'bg-purple-500/20 text-purple-400';
      case 'sms': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Onboarding': return 'bg-blue-500/20 text-blue-400';
      case 'Sessions': return 'bg-green-500/20 text-green-400';
      case 'Achievements': return 'bg-yellow-500/20 text-yellow-400';
      case 'Crisis': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Notification Templates</h2>
          <p className="text-gray-400">Manage email, push, and SMS notification templates</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTemplates.map((template) => {
          const TypeIcon = getTypeIcon(template.type);
          
          return (
            <Card key={template.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Badge className={`text-xs ${getTypeColor(template.type)}`}>
                      {template.type.toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Subject:</p>
                    <p className="text-sm text-gray-400 truncate">{template.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Content Preview:</p>
                    <p className="text-sm text-gray-400 line-clamp-2">{template.content}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{template.usageCount} uses</span>
                    {template.lastUsed && (
                      <span>Last used: {template.lastUsed.toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-sm text-gray-400">Total Templates</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">10</div>
            <p className="text-sm text-gray-400">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-400">2,558</div>
            <p className="text-sm text-gray-400">Total Sent</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">94.2%</div>
            <p className="text-sm text-gray-400">Delivery Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationTemplates;
