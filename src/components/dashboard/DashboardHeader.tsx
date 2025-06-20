
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import UserMenu from '@/components/navigation/UserMenu';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DashboardHeader = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbFromPath = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Map paths to readable names
    const pathMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'therapysync-ai': 'AI Sessions',
      'session-history': 'Chat History',
      'techniques': 'Techniques',
      'session-analytics': 'Session Analytics',
      'mood-tracking': 'Mood Tracking',
      'goals': 'Goals',
      'notebook': 'Digital Notebook',
      'enhanced-monitoring': 'Progress Reports',
      'community': 'Community',
      'analytics': 'Analytics',
      'profile': 'Profile',
      'settings': 'Settings',
      'plans': 'Subscription',
      'crisis-resources': 'Crisis Support',
      'help': 'Help Center',
      'smart-scheduling': 'Smart Scheduling'
    };

    return segments.map(segment => pathMap[segment] || segment);
  };

  const breadcrumbs = getBreadcrumbFromPath(location.pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${breadcrumbs.slice(0, index + 1).join('/').toLowerCase()}`}>
                      {crumb}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-8"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
