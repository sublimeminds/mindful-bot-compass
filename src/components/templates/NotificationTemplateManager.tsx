
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Copy, TrendingUp, Sparkles, Target, MessageSquare, Zap } from 'lucide-react';
import { AdvancedNotificationTemplateService, NotificationTemplate } from '@/services/advancedNotificationTemplateService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const NotificationTemplateManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await AdvancedNotificationTemplateService.getTemplates(category);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Target className="h-4 w-4" />;
      case 'achievement': return <TrendingUp className="h-4 w-4" />;
      case 'insight': return <Sparkles className="h-4 w-4" />;
      case 'reminder': return <MessageSquare className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'bg-blue-500';
      case 'achievement': return 'bg-green-500';
      case 'insight': return 'bg-purple-500';
      case 'reminder': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceData = (template: NotificationTemplate) => [
    { name: 'Sent', value: template.performance.sent },
    { name: 'Viewed', value: template.performance.viewed },
    { name: 'Clicked', value: template.performance.clicked }
  ];

  const testTemplate = async (template: NotificationTemplate) => {
    if (!user) return;
    
    try {
      const result = await AdvancedNotificationTemplateService.generatePersonalizedNotification(
        template.id,
        user.id
      );
      
      if (result) {
        toast({
          title: result.title,
          description: result.message,
          duration: 6000,
        });
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not generate test notification.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to manage templates</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Templates</h2>
          <p className="text-muted-foreground">Create and manage intelligent notification templates</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="insight">Insight</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Notification Template</DialogTitle>
              </DialogHeader>
              <CreateTemplateForm onSuccess={() => {
                setShowCreateDialog(false);
                loadTemplates();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {getCategoryIcon(template.category)}
                  <span className="ml-2">{template.name}</span>
                </CardTitle>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">{template.template.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{template.template.message}</div>
              </div>

              {/* Personalization Features */}
              <div>
                <div className="text-sm font-medium mb-2">Personalization</div>
                <div className="flex flex-wrap gap-1">
                  {template.personalization.useUserName && (
                    <Badge variant="outline" className="text-xs">Name</Badge>
                  )}
                  {template.personalization.useMoodData && (
                    <Badge variant="outline" className="text-xs">Mood</Badge>
                  )}
                  {template.personalization.useProgressData && (
                    <Badge variant="outline" className="text-xs">Progress</Badge>
                  )}
                  {template.personalization.useTimeContext && (
                    <Badge variant="outline" className="text-xs">Time</Badge>
                  )}
                </div>
              </div>

              {/* Performance Chart */}
              {template.performance.sent > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Performance</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={getPerformanceData(template)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-muted-foreground mt-1">
                    {template.performance.viewed > 0 && (
                      <span>View Rate: {(template.performance.viewed / template.performance.sent * 100).toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              )}

              {/* Variants */}
              {template.variants.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">A/B Variants</div>
                  <div className="flex flex-wrap gap-1">
                    {template.variants.map(variant => (
                      <Badge key={variant.id} variant="secondary" className="text-xs">
                        {variant.name} ({variant.weight}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testTemplate(template)}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Handle clone */}}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Templates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first notification template to start personalizing user experiences
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Editor Dialog */}
      {selectedTemplate && (
        <TemplateEditorDialog
          template={selectedTemplate}
          open={!!selectedTemplate}
          onOpenChange={(open) => !open && setSelectedTemplate(null)}
          onSuccess={loadTemplates}
        />
      )}
    </div>
  );
};

const CreateTemplateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'engagement' as const,
    type: 'session_reminder',
    title: '',
    message: '',
    useUserName: true,
    useMoodData: false,
    useProgressData: false,
    useTimeContext: true,
    useWeatherData: false,
    variants: [{ name: 'Default', weight: 100, title: '', message: '' }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const template = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        template: {
          title: formData.title,
          message: formData.message,
          variables: []
        },
        personalization: {
          useUserName: formData.useUserName,
          useMoodData: formData.useMoodData,
          useProgressData: formData.useProgressData,
          useTimeContext: formData.useTimeContext,
          useWeatherData: formData.useWeatherData
        },
        variants: formData.variants.map((v, i) => ({
          id: `variant_${i}`,
          name: v.name,
          weight: v.weight,
          template: {
            title: v.title || formData.title,
            message: v.message || formData.message
          },
          performance: { sent: 0, viewed: 0, clicked: 0, conversionRate: 0 }
        })),
        isActive: true
      };

      const templateId = await AdvancedNotificationTemplateService.createTemplate(template);
      
      if (templateId) {
        toast({
          title: "Template Created",
          description: "Your notification template has been created successfully.",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning Motivation"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="insight">Insight</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when and how this template should be used..."
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Notification Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Good {timeOfDay}, {userName}!"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use variables like {'{userName}'}, {'{timeOfDay}'}, {'{streak}'}, {'{moodDescription}'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Ready to start your day with some mindfulness? Your {streak}-day streak is inspiring!"
              rows={4}
              required
            />
          </div>
        </TabsContent>
        
        <TabsContent value="personalization" className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Use User Name</label>
                <p className="text-xs text-muted-foreground">Personalize with user's name</p>
              </div>
              <Switch
                checked={formData.useUserName}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useUserName: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Use Mood Data</label>
                <p className="text-xs text-muted-foreground">Adapt based on recent mood entries</p>
              </div>
              <Switch
                checked={formData.useMoodData}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useMoodData: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Use Progress Data</label>
                <p className="text-xs text-muted-foreground">Include streak and session information</p>
              </div>
              <Switch
                checked={formData.useProgressData}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useProgressData: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Use Time Context</label>
                <p className="text-xs text-muted-foreground">Adapt language for time of day</p>
              </div>
              <Switch
                checked={formData.useTimeContext}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useTimeContext: checked }))}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full">
        Create Template
      </Button>
    </form>
  );
};

const TemplateEditorDialog = ({ 
  template, 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  template: NotificationTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Template: {template.name}</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8 text-muted-foreground">
          Template editor would go here...
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationTemplateManager;
