
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, MoreHorizontal, UserCheck, UserX, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import UserDetailsModal from './UserDetailsModal';
import UserRoleManager from './UserRoleManager';

const AdminUserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with their profiles and roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) {
        // Get roles for each user
        const userIds = profiles.map(p => p.id);
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds)
          .eq('is_active', true);

        // Get session counts
        const { data: sessionCounts } = await supabase
          .from('therapy_sessions')
          .select('user_id')
          .in('user_id', userIds);

        // Combine data
        const usersWithData = profiles.map(profile => {
          const roles = userRoles?.filter(r => r.user_id === profile.id).map(r => r.role) || [];
          const sessionCount = sessionCounts?.filter(s => s.user_id === profile.id).length || 0;
          
          return {
            ...profile,
            roles,
            sessionCount,
            isAdmin: roles.some(role => ['super_admin', 'content_admin', 'support_admin', 'analytics_admin'].includes(role))
          };
        });

        setUsers(usersWithData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'content_admin': return 'bg-blue-500';
      case 'support_admin': return 'bg-green-500';
      case 'analytics_admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUserAction = (user: any, action: string) => {
    setSelectedUser(user);
    if (action === 'details') {
      setShowDetailsModal(true);
    } else if (action === 'roles') {
      setShowRoleModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage users and their permissions</p>
          </div>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-300">User</th>
                    <th className="text-left py-3 px-4 text-gray-300">Roles</th>
                    <th className="text-left py-3 px-4 text-gray-300">Sessions</th>
                    <th className="text-left py-3 px-4 text-gray-300">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            user.isAdmin ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {user.isAdmin ? (
                              <Shield className="h-4 w-4 text-white" />
                            ) : (
                              <Users className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name || 'No name'}</p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role: string) => (
                              <Badge
                                key={role}
                                className={`${getRoleColor(role)} text-white text-xs`}
                              >
                                {role.replace('_', ' ')}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              user
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300">{user.sessionCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-400 text-sm">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user, 'details')}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user, 'roles')}
                          >
                            Roles
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showRoleModal && selectedUser && (
        <UserRoleManager
          user={selectedUser}
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
            fetchUsers(); // Refresh after role changes
          }}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
