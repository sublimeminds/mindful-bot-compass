import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bug,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  exact?: boolean;
  permission?: {
    name: string;
    resource: string;
  };
  submenu?: {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
  }[];
}

const AdminSidebar = () => {
  const location = useLocation();
  const { hasPermission } = useAdmin();

  const menuItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      permission: { name: 'view_users', resource: 'users' }
    },
    {
      label: 'Content',
      href: '/admin/content',
      icon: FileText,
      permission: { name: 'manage_content', resource: 'content' }
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      permission: { name: 'view_analytics', resource: 'analytics' }
    },
    {
      label: 'System',
      href: '/admin/system',
      icon: Settings,
      permission: { name: 'manage_system', resource: 'system' },
      submenu: [
        {
          label: 'Debug Panel',
          href: '/admin/system/debug',
          icon: Bug
        }
      ]
    }
  ];

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    if (item.permission && !hasPermission(item.permission.name, item.permission.resource)) {
      return null;
    }

    const isActive = item.exact
      ? location.pathname === item.href
      : location.pathname.startsWith(item.href);

    return (
      <li key={item.label}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700',
            isActive && 'bg-gray-700 font-medium',
            isSubmenu ? 'text-sm' : 'text-base'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  const renderSubmenu = (item: MenuItem) => {
    if (!item.submenu || item.submenu.length === 0) {
      return null;
    }

    const isOpen = location.pathname.startsWith(item.href) && !item.exact;

    return (
      <li key={item.label} className="space-y-1">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer">
          <div className="flex items-center space-x-2">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        {isOpen && (
          <ul className="pl-4">
            {item.submenu.map(subItem => {
              if (item.permission && !hasPermission(item.permission.name, item.permission.resource)) {
                return null;
              }
              return (
                <li key={subItem.label}>
                  <Link
                    to={subItem.href}
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 text-sm',
                      location.pathname === subItem.href && 'bg-gray-700 font-medium'
                    )}
                  >
                    <subItem.icon className="h-3 w-3" />
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="w-64 bg-gray-800 h-screen py-4 px-2">
      <nav>
        <ul>
          {menuItems.map(item => {
            if (item.submenu) {
              return renderSubmenu(item);
            } else {
              return renderMenuItem(item);
            }
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
