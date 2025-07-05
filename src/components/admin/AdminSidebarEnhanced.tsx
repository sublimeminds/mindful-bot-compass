
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  BarChart3, 
  FileText, 
  Puzzle, 
  Cloud,
  Settings, 
  Zap, 
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminSidebarEnhanced = () => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    main: true,
    advanced: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      title: 'AI Management',
      href: '/admin/ai',
      icon: Brain
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3
    },
    {
      title: 'Content',
      href: '/admin/content',
      icon: FileText
    }
  ];

  const advancedNavItems = [
    {
      title: 'Integrations',
      href: '/admin/integrations',
      icon: Puzzle
    },
    {
      title: 'Infrastructure',
      href: '/admin/infrastructure',
      icon: Cloud
    },
    {
      title: 'System',
      href: '/admin/system',
      icon: Settings
    },
    {
      title: 'Performance',
      href: '/admin/performance',
      icon: Zap
    },
    {
      title: 'Crisis Management',
      href: '/admin/crisis',
      icon: AlertTriangle
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-full flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">TherapySync Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {/* Main Navigation */}
        <Collapsible open={openSections.main} onOpenChange={() => toggleSection('main')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <span className="font-medium">Main</span>
            {openSections.main ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced Navigation */}
        <Collapsible open={openSections.advanced} onOpenChange={() => toggleSection('advanced')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <span className="font-medium">Advanced</span>
            {openSections.advanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {advancedNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">System Online</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">All services operational</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarEnhanced;
