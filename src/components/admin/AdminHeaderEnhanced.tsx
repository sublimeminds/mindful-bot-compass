
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminHeaderEnhanced = () => {
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, title: 'Crisis intervention required', type: 'urgent', time: '2 min ago' },
    { id: 2, title: 'System maintenance scheduled', type: 'info', time: '1 hour ago' },
    { id: 3, title: 'New user registration spike', type: 'success', time: '3 hours ago' },
  ]);

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    // Add Admin as first breadcrumb
    breadcrumbs.push({ label: 'Admin', path: '/admin' });
    
    // Map path segments to readable labels
    const pathMap: { [key: string]: string } = {
      'users': 'User Management',
      'ai': 'AI Configuration',
      'analytics': 'Analytics',
      'content': 'Content Management',
      'integrations': 'Integrations',
      'system': 'System Settings',
      'performance': 'Performance',
      'crisis': 'Crisis Management',
      'user-analytics': 'User Analytics',
      'roles': 'Roles & Permissions',
      'ai-templates': 'AI Templates',
      'crisis-resources': 'Crisis Resources',
      'notification-templates': 'Notification Templates',
      'help-content': 'Help & FAQ',
      'therapeutic-approaches': 'Therapeutic Approaches',
      'quality-assurance': 'Quality Assurance',
      'ab-testing': 'A/B Testing',
      'ai-performance': 'AI Performance',
      'engagement-analytics': 'User Engagement',
      'therapist-analytics': 'Therapist Analytics',
      'business-intelligence': 'Business Intelligence',
      'custom-reports': 'Custom Reports',
      'external-apis': 'External APIs',
      'webhooks': 'Webhook Management',
      'third-party': 'Third-party Services',
      'system-health': 'System Health',
      'security': 'Security Management',
      'audit-logs': 'Audit Logs',
      'safety-monitoring': 'Safety Monitoring',
      'emergency-protocols': 'Emergency Protocols',
      'crisis-resource-mgmt': 'Crisis Resource Management',
      'subscriptions': 'Subscription Management',
      'payments': 'Payment Processing',
      'revenue-analytics': 'Revenue Analytics',
      'plan-config': 'Plan Configuration',
    };
    
    // Add remaining segments
    if (pathSegments.length > 1) {
      for (let i = 1; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ 
          label, 
          path: '/' + pathSegments.slice(0, i + 1).join('/') 
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <span className={`${
              index === breadcrumbs.length - 1 
                ? 'text-white font-medium' 
                : 'text-gray-400 hover:text-white cursor-pointer'
            }`}>
              {crumb.label}
            </span>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users, sessions, or content..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-medium text-white">Notifications</h3>
            </div>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-3 focus:bg-gray-700">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{notification.title}</span>
                    <Badge 
                      variant={notification.type === 'urgent' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700">
            <DropdownMenuItem className="focus:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-white">Admin Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="focus:bg-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="text-white">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeaderEnhanced;
