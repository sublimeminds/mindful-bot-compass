
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Award, Square } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface ABTestVariant {
  id: string;
  name: string;
  traffic_split: number;
  conversions: number;
  impressions: number;
}

interface ABTestResult {
  test_id: string;
  variant_a_conversions: number;
  variant_b_conversions: number;
  statistical_significance: number;
  confidence_level: number;
  winner: string;
}

const ABTestDashboard = () => {
  const { user } = useSimpleApp();
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating new test
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    hypothesis: '',
    target_metric: 'conversion_rate',
    user_segment: 'all_users'
  });

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockTests = [
        {
          id: '1',
          name: 'Button Color Test',
          description: 'Testing blue vs green button colors',
          status: 'active',
          target_metric: 'conversion_rate',
          results: {
            variant_a_conversions: 45,
            variant_b_conversions: 52,
            statistical_significance: 0.82,
            confidence_level: 95,
            winner: 'B'
          }
        }
      ];
      setTests(mockTests);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTest = async () => {
    setIsCreating(true);
    try {
      // Mock test creation
      const mockTest = {
        id: Date.now().toString(),
        ...newTest,
        status: 'active',
        created_at: new Date().toISOString()
      };
      setTests([...tests, mockTest]);
      setNewTest({
        name: '',
        description: '',
        hypothesis: '',
        target_metric: 'conversion_rate',
        user_segment: 'all_users'
      });
    } catch (error) {
      console.error('Error creating test:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Square className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading A/B tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">A/B Testing Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your experiments</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New A/B Test</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Test Name</label>
                <Input
                  value={newTest.name}
                  onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  placeholder="Enter test name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  placeholder="Describe what you're testing"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Hypothesis</label>
                <Input
                  value={newTest.hypothesis}
                  onChange={(e) => setNewTest({...newTest, hypothesis: e.target.value})}
                  placeholder="Your hypothesis"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Target Metric</label>
                <Select
                  value={newTest.target_metric}
                  onValueChange={(value) => setNewTest({...newTest, target_metric: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                    <SelectItem value="click_through_rate">Click Through Rate</SelectItem>
                    <SelectItem value="engagement_time">Engagement Time</SelectItem>
                    <SelectItem value="bounce_rate">Bounce Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createTest} disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Create Test'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {test.name}
                </CardTitle>
                <Badge variant={test.status === 'active' ? 'default' : 'secondary'}>
                  {test.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
              
              {test.results && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Variant A Conversions:</span>
                    <span>{test.results.variant_a_conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variant B Conversions:</span>
                    <span>{test.results.variant_b_conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statistical Significance:</span>
                    <span>{(test.results.statistical_significance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winner:</span>
                    <Badge variant={test.results.winner === 'A' ? 'default' : 'secondary'}>
                      Variant {test.results.winner}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No A/B Tests Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first A/B test to start optimizing your application.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Test
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ABTestDashboard;
