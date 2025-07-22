
import React from 'react';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as LucideIcons from 'lucide-react';

const DatabaseHeaderDropdowns = () => {
  const { menuConfig, loading, error } = useNavigationMenus();

  console.log('DatabaseHeaderDropdowns - menuConfig:', menuConfig);
  console.log('DatabaseHeaderDropdowns - loading:', loading);
  console.log('DatabaseHeaderDropdowns - error:', error);

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
    return null;
  }

  return (
    <div className="flex items-center space-x-6">
      {menuConfig.menus.map((menu) => {
        // Get the icon component
        const IconComponent = LucideIcons[menu.icon as keyof typeof LucideIcons] as React.ComponentType<any>;
        
        // Get items for this menu
        const menuItems = menuConfig.items.filter(item => item.menu_id === menu.id);
        
        console.log(`Menu ${menu.name} has ${menuItems.length} items:`, menuItems);

        if (menuItems.length === 0) {
          return null;
        }

        return (
          <DropdownMenu key={menu.id}>
            <DropdownMenuTrigger asChild>
              <HeaderDropdownTrigger
                icon={IconComponent || LucideIcons.Brain}
                label={menu.label}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent asChild>
              <HeaderDropdownCard width="adaptive">
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const ItemIcon = LucideIcons[item.icon as keyof typeof LucideIcons] as React.ComponentType<any>;
                    return (
                      <HeaderDropdownItem
                        key={item.id}
                        icon={ItemIcon || LucideIcons.Circle}
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};

export default DatabaseHeaderDropdowns;
