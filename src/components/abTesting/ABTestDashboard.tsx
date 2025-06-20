import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Activity, Play, Pause, RotateCcw } from 'lucide-react';
import { abTestingService, ABTest, ABTestResult } from '@/services/abTestingService';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const ABTestDashboard = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTests();
    }
  }, [user]);

  const fetchTests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await abTestingService.getTests(user.id);
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'completed': return <Square className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatVariantData = (variants: ABTestVariant[]) => {
    return variants.map(variant => ({
      name: variant.name,
      participants: variant.metrics.participants,
      conversions: variant.metrics.conversions,
      rate: variant.metrics.conversionRate
    }));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to view A/B tests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A/B Testing Dashboard</h2>
          <p className="text-muted-foreground">Test and optimize your notification strategies</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
            </DialogHeader>
            <CreateTestForm onSuccess={() => {
              setShowCreateDialog(false);
              fetchTests();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tests.length}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'running').length}</p>
                <p className="text-sm text-muted-foreground">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {tests.length > 0 ? (tests.filter(t => t.results?.winner).length / tests.length * 100).toFixed(0) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map(test => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <Badge className={getStatusColor(test.status)}>
                  {getStatusIcon(test.status)}
                  <span className="ml-1 capitalize">{test.status}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{test.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Target Audience:</span>
                  <span>{test.targetAudience.percentage}% of users</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Primary Metric:</span>
                  <span className="capitalize">{test.metrics.primary.replace('_', ' ')}</span>
                </div>

                {test.variants.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Variant Performance</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={formatVariantData(test.variants)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#8884d8" name="Conversion Rate %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {test.results?.winner && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Winner: {test.results.winner}</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">{test.results.summary}</p>
                    <div className="text-xs text-green-600 mt-2">
                      Confidence: {test.results.confidence}%
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {test.status === 'running' && (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {test.status === 'paused' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tests.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No A/B Tests Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start testing different notification strategies to optimize engagement
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CreateTestForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetPercentage: 50,
    primaryMetric: 'click_rate',
    variants: [
      { name: 'Control', description: 'Original version', weight: 50 },
      { name: 'Variant A', description: 'Test version', weight: 50 }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const testData = {
        name: formData.name,
        description: formData.description,
        status: 'draft' as const,
        startDate: new Date(),
        variants: formData.variants.map((v, i) => ({
          id: `variant_${i}`,
          name: v.name,
          description: v.description,
          weight: v.weight,
          config: {},
          metrics: { participants: 0, conversions: 0, conversionRate: 0 }
        })),
        targetAudience: { percentage: formData.targetPercentage },
        metrics: { primary: formData.primaryMetric, secondary: [] }
      };

      const testId = await abTestingService.createTest(testData);
      
      if (testId) {
        toast({
          title: "Test Created",
          description: "Your A/B test has been created successfully.",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create A/B test.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Test Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Morning vs Evening Reminders"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what you're testing..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Target Percentage</label>
        <Input
          type="number"
          min="1"
          max="100"
          value={formData.targetPercentage}
          onChange={(e) => setFormData(prev => ({ ...prev, targetPercentage: parseInt(e.target.value) }))}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Primary Metric</label>
        <Select
          value={formData.primaryMetric}
          onValueChange={(value) => setFormData(prev => ({ ...prev, primaryMetric: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="click_rate">Click Rate</SelectItem>
            <SelectItem value="view_rate">View Rate</SelectItem>
            <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
            <SelectItem value="engagement_time">Engagement Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Create Test
      </Button>
    </form>
  );
};

export default ABTestDashboard;
