
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Users, Mail, Ban, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
  onboarding_complete: boolean;
}

interface BulkUserOperationsProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  onRefresh: () => void;
}

const BulkUserOperations = ({ users, selectedUsers, onSelectionChange, onRefresh }: BulkUserOperationsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [bulkAction, setBulkAction] = useState<string>('');

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(users.map(user => user.id));
    }
  };

  const handleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    } else {
      onSelectionChange([...selectedUsers, userId]);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      switch (action) {
        case 'activate':
          await activateUsers(selectedUsers);
          break;
        case 'deactivate':
          await deactivateUsers(selectedUsers);
          break;
        case 'upgrade':
          await upgradeUsers(selectedUsers);
          break;
        case 'message':
          setShowMessageDialog(true);
          return;
        default:
          throw new Error('Unknown action');
      }

      toast({
        title: "Bulk operation completed",
        description: `Successfully performed ${action} on ${selectedUsers.length} users.`,
      });

      onSelectionChange([]);
      onRefresh();
    } catch (error) {
      console.error('Bulk operation error:', error);
      toast({
        title: "Operation failed",
        description: "Failed to perform bulk operation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activateUsers = async (userIds: string[]) => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .in('id', userIds);
    
    if (error) throw error;
  };

  const deactivateUsers = async (userIds: string[]) => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'suspended' })
      .in('id', userIds);
    
    if (error) throw error;
  };

  const upgradeUsers = async (userIds: string[]) => {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'premium' })
      .in('id', userIds);
    
    if (error) throw error;
  };

  const sendBulkMessage = async () => {
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const notifications = selectedUsers.map(userId => ({
        user_id: userId,
        type: 'admin_message',
        title: messageSubject,
        message: messageContent,
        priority: 'high',
        data: { source: 'admin_bulk_message' }
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast({
        title: "Messages sent",
        description: `Successfully sent message to ${selectedUsers.length} users.`,
      });

      setShowMessageDialog(false);
      setMessageSubject('');
      setMessageContent('');
      onSelectionChange([]);
    } catch (error) {
      console.error('Message sending error:', error);
      toast({
        title: "Failed to send messages",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Users className="h-5 w-5 mr-2 text-blue-400" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selection Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUsers.length === users.length && users.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-300">
                Select All ({selectedUsers.length} of {users.length} selected)
              </span>
            </div>
            {selectedUsers.length > 0 && (
              <Badge variant="secondary">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
          </div>

          {/* User List */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-2 rounded border ${
                  selectedUsers.includes(user.id)
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-700/30'
                }`}
              >
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleUserSelection(user.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white truncate">
                      {user.name}
                    </span>
                    <Badge
                      variant={user.plan === 'premium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.plan}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-600">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
                disabled={isLoading}
              >
                <Ban className="h-4 w-4 mr-1" />
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('upgrade')}
                disabled={isLoading}
              >
                <Users className="h-4 w-4 mr-1" />
                Upgrade to Premium
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('message')}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-1" />
                Send Message
              </Button>
            </div>
          )}
        </div>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Message to {selectedUsers.length} Users</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Message subject..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Your message to users..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={sendBulkMessage} disabled={isLoading} className="flex-1">
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMessageDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BulkUserOperations;
