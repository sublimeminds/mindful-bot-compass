
import React from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Home } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useSimpleApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Mock admin roles for now since we removed the complex admin system
  const userRoles = ['admin'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500';
      case 'content_admin': return 'bg-blue-500';
      case 'support_admin': return 'bg-green-500';
      case 'analytics_admin': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'content_admin': return 'Content Admin';
      case 'support_admin': return 'Support Admin';
      case 'analytics_admin': return 'Analytics Admin';
      default: return role;
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">
            Admin Dashboard
          </h1>
          <div className="flex space-x-2">
            {userRoles.map((role) => (
              <Badge
                key={role}
                className={`${getRoleColor(role)} text-white`}
              >
                {getRoleLabel(role)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to App
          </Button>

          <div className="flex items-center space-x-2 text-gray-300">
            <User className="h-4 w-4" />
            <span className="text-sm">
              {user?.user_metadata?.name || user?.email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
