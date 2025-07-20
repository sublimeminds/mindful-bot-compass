
import React from 'react';
import { cn } from '@/lib/utils';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';

interface TabletOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

const TabletOptimizedLayout: React.FC<TabletOptimizedLayoutProps> = ({
  children,
  className,
  showSidebar = false,
  sidebarContent
}) => {
  const { isTablet, breakpoint } = useEnhancedScreenSize();

  if (!isTablet) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30",
      "flex",
      className
    )}>
      {/* Sidebar for tablet landscape */}
      {showSidebar && sidebarContent && (
        <aside className={cn(
          "transition-all duration-300",
          breakpoint === 'md' ? "w-64" : "w-80"
        )}>
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-hidden",
        "px-fluid-md py-fluid-lg"
      )}>
        <div className="max-w-none mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default TabletOptimizedLayout;
