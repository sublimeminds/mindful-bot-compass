
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, MessageSquare, Activity } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';
import UserRoleManager from './UserRoleManager';
import BulkUserOperations from './BulkUserOperations';
import UserSessionManager from './UserSessionManager';
import UserCommunicationCenter from './UserCommunicationCenter';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  created_at: string;
  onboarding_complete: boolean;
  last_active?: string;
  total_sessions?: number;
  roles: string[];
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userData: User[] = profiles?.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        plan: profile.plan || 'free',
        created_at: profile.created_at,
        onboarding_complete: profile.onboarding_complete || false,
        last_active: profile.updated_at,
        total_sessions: 0, // Will be calculated separately if needed
        roles: ['user']
      })) || [];

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchUsers();
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleRoleManagement = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Users className="h-6 w-6 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage users, sessions, and communications</p>
        </div>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <Users className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-blue-600">
            <UserCheck className="h-4 w-4 mr-2" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-blue-600">
            <Activity className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="roles" className="data-[state=active]:bg-blue-600">
            <Users className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded border border-gray-600 hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                      <div className="text-sm text-gray-400">{user.plan}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <BulkUserOperations
            users={users}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
            onRefresh={refreshData}
          />
        </TabsContent>

        <TabsContent value="sessions">
          <UserSessionManager />
        </TabsContent>

        <TabsContent value="communication">
          <UserCommunicationCenter />
        </TabsContent>

        <TabsContent value="roles">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded border border-gray-600"
                  >
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                    <button
                      onClick={() => handleRoleManagement(user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Manage Roles
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Modal */}
      {selectedUser && showUserModal && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* User Role Management Modal */}
      {selectedUser && showRoleModal && (
        <UserRoleManager
          user={selectedUser}
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
