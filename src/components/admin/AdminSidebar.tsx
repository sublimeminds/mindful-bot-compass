
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Home,
  Brain,
  Bell,
  Activity,
  Database,
  Lock,
  UserCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { hasPermission, userRoles } = useAdmin();

  const menuItems = [
    {
      title: 'Overview',
      icon: Home,
      href: '/admin',
      permission: null,
    },
    {
      title: 'User Management',
      icon: Users,
      href: '/admin/users',
      permission: { name: 'view_users', resource: 'users' },
    },
    {
      title: 'Content Management',
      icon: FileText,
      href: '/admin/content',
      permission: { name: 'manage_content', resource: 'content' },
      subItems: [
        { title: 'Therapists', href: '/admin/content/therapists', icon: Brain },
        { title: 'Techniques', href: '/admin/content/techniques', icon: Activity },
        { title: 'Notifications', href: '/admin/content/notifications', icon: Bell },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      permission: { name: 'view_analytics', resource: 'analytics' },
    },
    {
      title: 'System',
      icon: Monitor,
      href: '/admin/system',
      permission: { name: 'manage_system', resource: 'system' },
      subItems: [
        { title: 'Debug Panel', href: '/admin/system/debug', icon: Settings },
        { title: 'Database', href: '/admin/system/database', icon: Database },
        { title: 'Logs', href: '/admin/system/logs', icon: FileText },
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      href: '/admin/security',
      permission: { name: 'manage_roles', resource: 'roles' },
      subItems: [
        { title: 'User Roles', href: '/admin/security/roles', icon: UserCheck },
        { title: 'Activity Log', href: '/admin/security/activity', icon: Activity },
      ]
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const canAccessItem = (item: any) => {
    if (!item.permission) return true;
    if (userRoles.includes('super_admin')) return true;
    return hasPermission(item.permission.name, item.permission.resource);
  };

  return (
    <div className={cn(
      "bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            if (!canAccessItem(item)) return null;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.title}</span>
                  )}
                </Link>

                {/* Sub Items */}
                {!isCollapsed && item.subItems && isActive(item.href) && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-1 rounded transition-colors text-sm",
                            isActive(subItem.href)
                              ? "bg-blue-500 text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-white"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 mr-2" />
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
