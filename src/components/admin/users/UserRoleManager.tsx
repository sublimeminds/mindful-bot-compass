
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserRoleManagerProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

type AppRole = 'super_admin' | 'content_admin' | 'support_admin' | 'analytics_admin';

const UserRoleManager = ({ user, isOpen, onClose }: UserRoleManagerProps) => {
  const [currentRoles, setCurrentRoles] = useState<string[]>(user.roles || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const availableRoles = [
    { value: 'super_admin' as AppRole, label: 'Super Admin', color: 'bg-red-500' },
    { value: 'content_admin' as AppRole, label: 'Content Admin', color: 'bg-blue-500' },
    { value: 'support_admin' as AppRole, label: 'Support Admin', color: 'bg-green-500' },
    { value: 'analytics_admin' as AppRole, label: 'Analytics Admin', color: 'bg-purple-500' },
  ];

  const addRole = async (role: AppRole) => {
    if (currentRoles.includes(role)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role,
          is_active: true
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to add role',
          variant: 'destructive',
        });
      } else {
        setCurrentRoles([...currentRoles, role]);
        toast({
          title: 'Success',
          description: `Added ${role.replace('_', ' ')} role`,
        });
      }
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error',
        description: 'Failed to add role',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (role: string) => {
    if (!currentRoles.includes(role)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('role', role as AppRole);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove role',
          variant: 'destructive',
        });
      } else {
        setCurrentRoles(currentRoles.filter(r => r !== role));
        toast({
          title: 'Success',
          description: `Removed ${role.replace('_', ' ')} role`,
        });
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Manage User Roles</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-gray-400 mb-2">User: {user.name || user.email}</p>
          </div>

          {/* Current Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Roles</h3>
            <div className="space-y-2">
              {currentRoles.length === 0 ? (
                <p className="text-gray-400">No admin roles assigned</p>
              ) : (
                currentRoles.map((role) => {
                  const roleConfig = availableRoles.find(r => r.value === role);
                  return (
                    <div key={role} className="flex items-center justify-between p-2 bg-gray-750 rounded">
                      <Badge className={`${roleConfig?.color} text-white`}>
                        {roleConfig?.label || role}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeRole(role)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Available Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Add Roles</h3>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <div key={role.value} className="flex items-center justify-between p-2 bg-gray-750 rounded">
                  <Badge variant="outline">
                    {role.label}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addRole(role.value)}
                    disabled={loading || currentRoles.includes(role.value)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleManager;
