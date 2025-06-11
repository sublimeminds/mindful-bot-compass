
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Activity,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, userRoles } = useAdmin();

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin',
      permission: null,
      exact: true
    },
    {
      icon: Users,
      label: 'User Management',
      path: '/admin/users',
      permission: { name: 'view_users', resource: 'users' }
    },
    {
      icon: FileText,
      label: 'Content Management',
      path: '/admin/content',
      permission: { name: 'manage_content', resource: 'content' }
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/admin/analytics',
      permission: { name: 'view_analytics', resource: 'analytics' }
    },
    {
      icon: Settings,
      label: 'System Management',
      path: '/admin/system',
      permission: { name: 'manage_system', resource: 'system' }
    },
    {
      icon: Activity,
      label: 'Performance',
      path: '/admin/performance',
      permission: { name: 'view_analytics', resource: 'analytics' }
    }
  ];

  const filteredItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    if (userRoles.includes('super_admin')) return true;
    return hasPermission(item.permission.name, item.permission.resource);
  });

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-gray-400 text-sm">Management Console</p>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Button
                key={item.path}
                variant={active ? "secondary" : "ghost"}
                className={`
                  w-full justify-start text-left
                  ${active 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
