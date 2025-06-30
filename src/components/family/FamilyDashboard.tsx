
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Settings, 
  AlertTriangle, 
  Crown, 
  Eye,
  Shield,
  Heart,
  TrendingUp,
  Calendar,
  MessageSquare,
  Calculator
} from 'lucide-react';
import { familyService, type Household, type HouseholdMember, type FamilyAlert } from '@/services/familyService';
import { useToast } from '@/hooks/use-toast';
import FamilyMemberCard from './FamilyMemberCard';
import InviteMemberDialog from './InviteMemberDialog';
import FamilyAlertsPanel from './FamilyAlertsPanel';
import FamilyPlanSelector from './FamilyPlanSelector';

const FamilyDashboard = () => {
  const { toast } = useToast();
  const [household, setHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [alerts, setAlerts] = useState<FamilyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    setLoading(true);
    try {
      const householdData = await familyService.getUserHousehold();
      if (householdData) {
        setHousehold(householdData);
        const membersData = await familyService.getHouseholdMembers(householdData.id);
        setMembers(membersData);
        const alertsData = await familyService.getFamilyAlerts(householdData.id);
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error('Error loading family data:', error);
      toast({
        title: "Error",
        description: "Failed to load family data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (memberData: any) => {
    if (!household) return;

    const success = await familyService.inviteFamilyMember({
      household_id: household.id,
      ...memberData
    });

    if (success) {
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${memberData.invited_email}`,
      });
      setShowInviteDialog(false);
      loadFamilyData();
    } else {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const success = await familyService.removeFamilyMember(memberId);
    if (success) {
      toast({
        title: "Member Removed",
        description: "Family member has been removed.",
      });
      loadFamilyData();
    } else {
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePermissions = async (memberId: string, permissions: any) => {
    const success = await familyService.updateMemberPermissions(memberId, permissions);
    if (success) {
      toast({
        title: "Permissions Updated",
        description: "Member permissions have been updated.",
      });
      loadFamilyData();
    } else {
      toast({
        title: "Error",
        description: "Failed to update permissions.",
        variant: "destructive",
      });
    }
  };

  const canAddMembers = household && members.length < household.max_members;
  const isFamilyPlan = household?.plan_type.includes('family');
  const isAdaptivePlan = household?.plan_type.includes('adaptive') || household?.plan_type.includes('pro') || household?.plan_type.includes('premium');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Loading family dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Family Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your family's mental health journey together
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isFamilyPlan && (
            <Button
              onClick={() => setShowPlanSelector(true)}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white"
            >
              <Crown className="h-4 w-4 mr-2" />
              Get Family Plan
            </Button>
          )}
          
          {isFamilyPlan && !isAdaptivePlan && (
            <Button
              onClick={() => setShowPlanSelector(true)}
              variant="outline"
              className="border-therapy-500 text-therapy-600 hover:bg-therapy-50"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Upgrade to Adaptive Plan
            </Button>
          )}
          
          {canAddMembers && (
            <Button onClick={() => setShowInviteDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>
      </div>

      {/* Plan Status */}
      {household && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-therapy-500" />
                <span>{household.name}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={isFamilyPlan ? "default" : "secondary"}>
                  {household.plan_type.replace('_', ' ').toUpperCase()}
                </Badge>
                {isAdaptivePlan && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    Adaptive
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {members.length}
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {household.max_members}
                </div>
                <div className="text-sm text-gray-600">
                  {isAdaptivePlan ? 'Current Limit' : 'Max Members'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {alerts.length}
                </div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>
            
            {isAdaptivePlan && (
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Adaptive Pricing Active</span>
                    <p className="text-gray-600">You're only paying for {members.length} active members</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPlanSelector(true)}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Adjust Plan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Alerts Summary */}
      {alerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You have {alerts.length} family alert{alerts.length > 1 ? 's' : ''} requiring attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Members</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Alerts</span>
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onRemove={handleRemoveMember}
                onUpdatePermissions={handleUpdatePermissions}
                canManage={household?.primary_account_holder_id === member.user_id || member.member_type !== 'primary'}
              />
            ))}
            
            {canAddMembers && (
              <Card className="border-dashed border-2 border-gray-300 hover:border-therapy-400 transition-colors cursor-pointer" 
                    onClick={() => setShowInviteDialog(true)}>
                <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                  <Plus className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Invite Family Member</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {isAdaptivePlan 
                      ? 'Add members as needed' 
                      : `${household.max_members - members.length} spots remaining`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <FamilyAlertsPanel 
            alerts={alerts} 
            onAcknowledge={async (alertId) => {
              const success = await familyService.acknowledgeAlert(alertId);
              if (success) {
                loadFamilyData();
                toast({
                  title: "Alert Acknowledged",
                  description: "The alert has been marked as acknowledged.",
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Family Wellness Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track your family's overall mental health and progress.
                </p>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Family Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  See therapy sessions, milestones, and shared goals.
                </p>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Family Timeline
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Household Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Household Name</label>
                  <p className="text-gray-600 mt-1">{household?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Plan Type</label>
                  <p className="text-gray-600 mt-1">{household?.plan_type.replace('_', ' ')}</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Settings
                  </Button>
                  {isAdaptivePlan && (
                    <Button variant="outline" onClick={() => setShowPlanSelector(true)}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Adjust Pricing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InviteMemberDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onInvite={handleInviteMember}
        maxMembers={household?.max_members || 4}
        currentMembers={members.length}
      />

      <FamilyPlanSelector
        isOpen={showPlanSelector}
        onClose={() => setShowPlanSelector(false)}
        currentPlan={household?.plan_type || 'individual'}
      />
    </div>
  );
};

export default FamilyDashboard;
