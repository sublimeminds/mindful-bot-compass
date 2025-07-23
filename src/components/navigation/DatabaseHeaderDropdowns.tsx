
import React from 'react';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Brain, Settings, BarChart3, Building, BookOpen, Target } from 'lucide-react';

// Simplified icon mapping - no complex validation
const getMenuIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'Brain': Brain,
    'Settings': Settings,
    'BarChart3': BarChart3,
    'Building': Building,
    'BookOpen': BookOpen,
    'Target': Target
  };
  
  return iconMap[iconName] || Brain;
};

const getItemIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'Brain': Brain,
    'Heart': Target, // Using Target as fallback for Heart
    'BarChart3': BarChart3,
    'TrendingUp': BarChart3,
    'Target': Target
  };
  
  return iconMap[iconName] || Target;
};

const DatabaseHeaderDropdowns = () => {
  console.log('🔍 DatabaseHeaderDropdowns: Component rendering');
  
  const { menuConfig, loading, error } = useNavigationMenus();

  console.log('🔍 DatabaseHeaderDropdowns - Render state:', {
    menusCount: menuConfig.menus.length,
    itemsCount: menuConfig.items.length,
    loading,
    error,
    firstMenu: menuConfig.menus[0]?.name
  });

  if (loading) {
    console.log('🔍 DatabaseHeaderDropdowns: Showing loading state');
    return (
      <div className="flex items-center space-x-6">
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    console.error('🚨 DatabaseHeaderDropdowns: Navigation menu error:', error);
    // Still show navigation even with error
  }

  console.log('🔍 DatabaseHeaderDropdowns: Rendering menus');

  return (
    <nav className="flex items-center space-x-6">
      {menuConfig.menus.map((menu) => {
        const IconComponent = getMenuIcon(menu.icon);
        const menuItems = menuConfig.items.filter(item => item.menu_id === menu.id);
        
        console.log(`🔍 Menu ${menu.name} (${menu.label}) has ${menuItems.length} items`);

        return (
          <div key={menu.id} className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-700 transition-colors">
              <IconComponent className="h-4 w-4" />
              <span>{menu.label}</span>
            </button>
            
            {menuItems.length > 0 && (
              <HeaderDropdownCard width="adaptive">
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const ItemIcon = getItemIcon(item.icon);
                    return (
                      <HeaderDropdownItem
                        key={item.id}
                        icon={ItemIcon}
                        title={item.title}
                        description={item.description}
                        href={item.href}
                        gradient={item.gradient}
                        badge={item.badge}
                      />
                    );
                  })}
                </div>
              </HeaderDropdownCard>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default DatabaseHeaderDropdowns;
