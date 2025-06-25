import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Archive, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  AlertTriangle,
  Calendar,
  Database,
  Settings
} from 'lucide-react';
import { complianceFramework } from '@/services/complianceFramework';

const DataRetentionManager = () => {
  const [policies, setPolicies] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    dataType: '',
    retentionPeriodDays: 2555,
    autoDeleteEnabled: false,
    archiveBeforeDelete: true,
    complianceRequirement: 'internal'
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = () => {
    setPolicies(complianceFramework.getRetentionPolicies());
  };

  const createPolicy = async () => {
    try {
      const policy = {
        id: crypto.randomUUID(),
        ...newPolicy,
        lastExecuted: null,
        nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      // In a real implementation, this would be saved to the backend
      console.log('Creating retention policy:', policy);
      
      await complianceFramework.logAuditEvent(
        'data_retention_policy_created',
        'retention_policy',
        undefined,
        { policyId: policy.id, dataType: policy.dataType }
      );

      setShowCreateDialog(false);
      setNewPolicy({
        name: '',
        dataType: '',
        retentionPeriodDays: 2555,
        autoDeleteEnabled: false,
        archiveBeforeDelete: true,
        complianceRequirement: 'internal'
      });
      
      loadPolicies();
    } catch (error) {
      console.error('Failed to create retention policy:', error);
    }
  };

  const executePolicy = async (policyId) => {
    try {
      await complianceFramework.executeRetentionPolicies();
      loadPolicies();
    } catch (error) {
      console.error('Failed to execute retention policy:', error);
    }
  };

  const deletePolicy = async (policyId) => {
    const confirmed = window.confirm('Are you sure you want to delete this retention policy?');
    if (!confirmed) return;

    try {
      await complianceFramework.logAuditEvent(
        'data_retention_policy_deleted',
        'retention_policy',
        undefined,
        { policyId }
      );

      // In a real implementation, this would delete from the backend
      console.log('Deleting retention policy:', policyId);
      loadPolicies();
    } catch (error) {
      console.error('Failed to delete retention policy:', error);
    }
  };

  const getStatusColor = (policy) => {
    const now = new Date();
    const daysSinceExecution = policy.lastExecuted 
      ? Math.floor((now.getTime() - new Date(policy.lastExecuted).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    if (!policy.lastExecuted) return 'bg-yellow-100 text-yellow-800';
    if (daysSinceExecution && daysSinceExecution > 7) return 'bg-red-100 text-red-800';
    if (daysSinceExecution && daysSinceExecution > 3) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (policy) => {
    const now = new Date();
    const daysSinceExecution = policy.lastExecuted 
      ? Math.floor((now.getTime() - new Date(policy.lastExecuted).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    if (!policy.lastExecuted) return 'Never Executed';
    if (daysSinceExecution === 0) return 'Executed Today';
    if (daysSinceExecution === 1) return 'Executed Yesterday';
    return `Executed ${daysSinceExecution} days ago`;
  };

  const dataTypeOptions = [
    { value: 'therapy_sessions', label: 'Therapy Sessions' },
    { value: 'user_profiles', label: 'User Profiles' },
    { value: 'mood_entries', label: 'Mood Entries' },
    { value: 'audit_logs', label: 'Audit Logs' },
    { value: 'session_messages', label: 'Session Messages' },
    { value: 'goals', label: 'Goals' },
    { value: 'assessments', label: 'Assessments' }
  ];

  const complianceOptions = [
    { value: 'hipaa', label: 'HIPAA' },
    { value: 'gdpr', label: 'GDPR' },
    { value: 'internal', label: 'Internal Policy' },
    { value: 'legal', label: 'Legal Requirement' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Data Retention Manager</h2>
          <p className="text-therapy-600 mt-1">
            Manage automated data retention and deletion policies
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Data Retention Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policy-name">Policy Name</Label>
                  <Input
                    id="policy-name"
                    value={newPolicy.name}
                    onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                    placeholder="e.g., Therapy Session Data Retention"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select value={newPolicy.dataType} onValueChange={(value) => setNewPolicy({...newPolicy, dataType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Retention Period (Days)</Label>
                  <Input
                    id="retention-period"
                    type="number"
                    value={newPolicy.retentionPeriodDays}
                    onChange={(e) => setNewPolicy({...newPolicy, retentionPeriodDays: parseInt(e.target.value)})}
                    min="1"
                    max="3650"
                  />
                  <p className="text-xs text-gray-500">
                    {Math.round(newPolicy.retentionPeriodDays / 365 * 10) / 10} years
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compliance">Compliance Requirement</Label>
                  <Select value={newPolicy.complianceRequirement} onValueChange={(value) => setNewPolicy({...newPolicy, complianceRequirement: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance" />
                    </SelectTrigger>
                    <SelectContent>
                      {complianceOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-delete">Auto-Delete Expired Data</Label>
                    <p className="text-sm text-gray-500">
                      Automatically delete data when retention period expires
                    </p>
                  </div>
                  <Switch
                    id="auto-delete"
                    checked={newPolicy.autoDeleteEnabled}
                    onCheckedChange={(checked) => setNewPolicy({...newPolicy, autoDeleteEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="archive-before-delete">Archive Before Delete</Label>
                    <p className="text-sm text-gray-500">
                      Create archive copy before permanent deletion
                    </p>
                  </div>
                  <Switch
                    id="archive-before-delete"
                    checked={newPolicy.archiveBeforeDelete}
                    onCheckedChange={(checked) => setNewPolicy({...newPolicy, archiveBeforeDelete: checked})}
                  />
                </div>
              </div>

              {!newPolicy.autoDeleteEnabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Manual review is required before data deletion when auto-delete is disabled.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createPolicy} disabled={!newPolicy.name || !newPolicy.dataType}>
                  Create Policy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{policies.length}</div>
            <p className="text-xs text-muted-foreground">Active retention policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auto-Delete Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {policies.filter(p => p.autoDeleteEnabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Automated policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due for Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {policies.filter(p => new Date(p.nextExecution) <= new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">Policies ready to run</p>
          </CardContent>
        </Card>
      </div>

      {/* Policies List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Archive className="h-5 w-5 mr-2" />
            Retention Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-lg">{policy.name}</h4>
                      <Badge className={getStatusColor(policy)}>
                        {getStatusText(policy)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Data Type</p>
                        <p className="font-medium">{policy.dataType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Retention Period</p>
                        <p className="font-medium">
                          {policy.retentionPeriodDays} days ({Math.round(policy.retentionPeriodDays / 365 * 10) / 10} years)
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Compliance</p>
                        <Badge variant="outline" className="text-xs">
                          {policy.complianceRequirement.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-500">Next Execution</p>
                        <p className="font-medium">
                          {new Date(policy.nextExecution).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1">
                        {policy.autoDeleteEnabled ? (
                          <Badge className="bg-red-100 text-red-800">Auto-Delete</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Manual Review</Badge>
                        )}
                      </div>
                      {policy.archiveBeforeDelete && (
                        <Badge className="bg-blue-100 text-blue-800">Archive First</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => executePolicy(policy.id)}>
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingPolicy(policy)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deletePolicy(policy.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {policies.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Retention Policies</h3>
                <p className="text-gray-500 mb-4">
                  Create your first data retention policy to automate compliance.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Policy
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataRetentionManager;
