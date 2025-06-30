
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Mail, User, Shield, Eye, AlertTriangle } from 'lucide-react';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (memberData: any) => void;
  maxMembers: number;
  currentMembers: number;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  isOpen,
  onClose,
  onInvite,
  maxMembers,
  currentMembers
}) => {
  const [formData, setFormData] = useState({
    invited_email: '',
    member_type: 'adult' as 'adult' | 'teen' | 'child',
    relationship: '',
    age: '',
    permission_level: 'basic' as 'full' | 'limited' | 'basic' | 'view_only',
    can_view_progress: false,
    can_view_mood_data: false,
    can_receive_alerts: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canAddMore = currentMembers < maxMembers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddMore) return;

    setIsSubmitting(true);
    try {
      const memberData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };
      await onInvite(memberData);
      setFormData({
        invited_email: '',
        member_type: 'adult',
        relationship: '',
        age: '',
        permission_level: 'basic',
        can_view_progress: false,
        can_view_mood_data: false,
        can_receive_alerts: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultPermissions = (memberType: string, permissionLevel: string) => {
    if (memberType === 'child') {
      return {
        can_view_progress: false,
        can_view_mood_data: false,
        can_receive_alerts: false
      };
    }
    
    switch (permissionLevel) {
      case 'full':
        return {
          can_view_progress: true,
          can_view_mood_data: true,
          can_receive_alerts: true
        };
      case 'limited':
        return {
          can_view_progress: true,
          can_view_mood_data: false,
          can_receive_alerts: true
        };
      case 'basic':
        return {
          can_view_progress: false,
          can_view_mood_data: false,
          can_receive_alerts: false
        };
      default:
        return {
          can_view_progress: false,
          can_view_mood_data: false,
          can_receive_alerts: false
        };
    }
  };

  const handlePermissionLevelChange = (level: string) => {
    const permissions = getDefaultPermissions(formData.member_type, level);
    setFormData(prev => ({
      ...prev,
      permission_level: level as any,
      ...permissions
    }));
  };

  const handleMemberTypeChange = (type: string) => {
    const permissions = getDefaultPermissions(type, formData.permission_level);
    setFormData(prev => ({
      ...prev,
      member_type: type as any,
      ...permissions
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-therapy-500" />
            <span>Invite Family Member</span>
          </DialogTitle>
        </DialogHeader>

        {!canAddMore ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You've reached the maximum number of members ({maxMembers}) for your plan. 
              Consider upgrading to invite more family members.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="family.member@example.com"
                value={formData.invited_email}
                onChange={(e) => setFormData(prev => ({ ...prev, invited_email: e.target.value }))}
                required
              />
            </div>

            {/* Member Type and Relationship */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member_type">Member Type</Label>
                <Select 
                  value={formData.member_type} 
                  onValueChange={handleMemberTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="teen">Teenager (13-17)</SelectItem>
                    <SelectItem value="child">Child (under 13)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  placeholder="e.g., Spouse, Child, Parent"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                />
              </div>
            </div>

            {/* Age */}
            {(formData.member_type === 'child' || formData.member_type === 'teen') && (
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="17"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
            )}

            {/* Permission Level */}
            <div className="space-y-2">
              <Label htmlFor="permission_level" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Permission Level</span>
              </Label>
              <Select 
                value={formData.permission_level} 
                onValueChange={handlePermissionLevelChange}
                disabled={formData.member_type === 'child'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Access - Can view all data and receive alerts</SelectItem>
                  <SelectItem value="limited">Limited Access - Can view progress and receive alerts</SelectItem>
                  <SelectItem value="basic">Basic Access - Standard member access</SelectItem>
                  <SelectItem value="view_only">View Only - Cannot receive sensitive information</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specific Permissions */}
            {formData.member_type !== 'child' && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">Specific Permissions</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_view_progress"
                      checked={formData.can_view_progress}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, can_view_progress: checked as boolean }))
                      }
                    />
                    <Label htmlFor="can_view_progress" className="text-sm">
                      Can view therapy progress and insights
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_view_mood_data"
                      checked={formData.can_view_mood_data}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, can_view_mood_data: checked as boolean }))
                      }
                    />
                    <Label htmlFor="can_view_mood_data" className="text-sm">
                      Can view mood tracking and emotional data
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_receive_alerts"
                      checked={formData.can_receive_alerts}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, can_receive_alerts: checked as boolean }))
                      }
                    />
                    <Label htmlFor="can_receive_alerts" className="text-sm">
                      Can receive crisis and safety alerts
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Child Safety Notice */}
            {formData.member_type === 'child' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Child Safety:</strong> Children under 13 have restricted permissions by default. 
                  You'll have full oversight of their therapy progress and receive all safety alerts.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600"
              >
                {isSubmitting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
