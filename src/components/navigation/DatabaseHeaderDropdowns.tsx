
import React from 'react';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SafeIcons, getIcon, validateIcon } from '@/utils/iconImports';

const DatabaseHeaderDropdowns = () => {
  const { menuConfig, loading, error } = useNavigationMenus();

  console.log('DatabaseHeaderDropdowns - Render state:', {
    menusCount: menuConfig.menus.length,
    itemsCount: menuConfig.items.length,
    loading,
    error
  });

  if (loading) {
    return (
      <div className="flex items-center space-x-6">
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    console.error('Navigation menu error:', error);
    // Don't return null - show at least basic navigation
  }

  return (
    <div className="flex items-center space-x-6">
      {menuConfig.menus.map((menu) => {
        // Safely get the icon component using our validation system
        const IconComponent = validateIcon(menu.icon) ? getIcon(menu.icon as keyof typeof SafeIcons) : SafeIcons.Brain;
        
        // Get items for this menu
        const menuItems = menuConfig.items.filter(item => item.menu_id === menu.id);
        
        console.log(`Menu ${menu.name} (${menu.label}) has ${menuItems.length} items`);

        // Show menu even if no items (user can still see the dropdown)
        return (
          <DropdownMenu key={menu.id}>
            <DropdownMenuTrigger asChild>
              <HeaderDropdownTrigger
                icon={IconComponent}
                label={menu.label}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild>
              <HeaderDropdownCard width="adaptive">
                <div className="space-y-2">
                  {menuItems.length > 0 ? (
                    menuItems.map((item) => {
                      const ItemIcon = validateIcon(item.icon) ? getIcon(item.icon as keyof typeof SafeIcons) : SafeIcons.Target;
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
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Coming soon...</p>
                      <p className="text-xs mt-1">New features will appear here</p>
                    </div>
                  )}
                </div>
              </HeaderDropdownCard>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};

export default DatabaseHeaderDropdowns;
