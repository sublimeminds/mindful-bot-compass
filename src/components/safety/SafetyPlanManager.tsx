
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Plus, Edit, Check, AlertTriangle, Heart, Users } from 'lucide-react';
import { CrisisManagementService, SafetyPlan } from '@/services/crisisManagementService';
import { useToast } from '@/hooks/use-toast';

const SafetyPlanManager: React.FC = () => {
  const [safetyPlans, setSafetyPlans] = useState<SafetyPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SafetyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    plan_name: '',
    warning_signs: [''],
    coping_strategies: [''],
    environment_safety: [''],
    reasons_to_live: ['']
  });

  useEffect(() => {
    loadSafetyPlans();
  }, []);

  const loadSafetyPlans = async () => {
    try {
      const data = await CrisisManagementService.getUserSafetyPlans();
      setSafetyPlans(data);
    } catch (error) {
      console.error('Error loading safety plans:', error);
      toast({
        title: "Error",
        description: "Failed to load safety plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const planData = {
        ...formData,
        warning_signs: formData.warning_signs.filter(item => item.trim() !== ''),
        coping_strategies: formData.coping_strategies.filter(item => item.trim() !== ''),
        environment_safety: formData.environment_safety.filter(item => item.trim() !== ''),
        reasons_to_live: formData.reasons_to_live.filter(item => item.trim() !== '')
      };

      if (editingPlan) {
        await CrisisManagementService.updateSafetyPlan(editingPlan.id, planData);
        toast({
          title: "Success",
          description: "Safety plan updated successfully"
        });
      } else {
        await CrisisManagementService.createSafetyPlan(planData);
        toast({
          title: "Success",
          description: "Safety plan created successfully"
        });
      }
      
      await loadSafetyPlans();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving safety plan:', error);
      toast({
        title: "Error",
        description: "Failed to save safety plan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      warning_signs: [''],
      coping_strategies: [''],
      environment_safety: [''],
      reasons_to_live: ['']
    });
    setEditingPlan(null);
  };

  const openEditDialog = (plan: SafetyPlan) => {
    setEditingPlan(plan);
    setFormData({
      plan_name: plan.plan_name,
      warning_signs: plan.warning_signs?.length ? plan.warning_signs : [''],
      coping_strategies: plan.coping_strategies?.length ? plan.coping_strategies : [''],
      environment_safety: plan.environment_safety?.length ? plan.environment_safety : [''],
      reasons_to_live: plan.reasons_to_live?.length ? plan.reasons_to_live : ['']
    });
    setIsDialogOpen(true);
  };

  const addListItem = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const updateListItem = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const renderListEditor = (
    field: keyof typeof formData,
    label: string,
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </Label>
      {(formData[field] as string[]).map((item, index) => (
        <div key={index} className="flex space-x-2">
          <Input
            value={item}
            onChange={(e) => updateListItem(field, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          {(formData[field] as string[]).length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeListItem(field, index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addListItem(field)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading safety plans...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety Plans
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Safety Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPlan ? 'Edit Safety Plan' : 'Create Safety Plan'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="plan_name">Plan Name</Label>
                    <Input
                      id="plan_name"
                      value={formData.plan_name}
                      onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                      placeholder="My Safety Plan"
                    />
                  </div>

                  {renderListEditor(
                    'warning_signs',
                    'Warning Signs',
                    'Early warning signs of a crisis',
                    <AlertTriangle className="h-4 w-4" />
                  )}

                  {renderListEditor(
                    'coping_strategies',
                    'Coping Strategies',
                    'Things I can do to help myself cope',
                    <Heart className="h-4 w-4" />
                  )}

                  {renderListEditor(
                    'environment_safety',
                    'Environment Safety',
                    'Ways to make my environment safer',
                    <Shield className="h-4 w-4" />
                  )}

                  {renderListEditor(
                    'reasons_to_live',
                    'Reasons to Live',
                    'Things that are important to me',
                    <Users className="h-4 w-4" />
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      {editingPlan ? 'Update' : 'Create'} Safety Plan
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {safetyPlans.length === 0 ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                No safety plans created yet. A safety plan helps you prepare for and manage crisis situations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {safetyPlans.map((plan) => (
                <Card key={plan.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{plan.plan_name}</h3>
                        <Badge variant="secondary">
                          Last reviewed: {new Date(plan.last_reviewed).toLocaleDateString()}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(plan)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.warning_signs && plan.warning_signs.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                            Warning Signs
                          </h4>
                          <ul className="text-sm space-y-1">
                            {plan.warning_signs.map((sign, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                {sign}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.coping_strategies && plan.coping_strategies.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center mb-2">
                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                            Coping Strategies
                          </h4>
                          <ul className="text-sm space-y-1">
                            {plan.coping_strategies.map((strategy, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                {strategy}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.environment_safety && plan.environment_safety.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center mb-2">
                            <Shield className="h-4 w-4 mr-1 text-blue-500" />
                            Environment Safety
                          </h4>
                          <ul className="text-sm space-y-1">
                            {plan.environment_safety.map((safety, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                {safety}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.reasons_to_live && plan.reasons_to_live.length > 0 && (
                        <div>
                          <h4 className="font-medium flex items-center mb-2">
                            <Users className="h-4 w-4 mr-1 text-purple-500" />
                            Reasons to Live
                          </h4>
                          <ul className="text-sm space-y-1">
                            {plan.reasons_to_live.map((reason, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyPlanManager;
