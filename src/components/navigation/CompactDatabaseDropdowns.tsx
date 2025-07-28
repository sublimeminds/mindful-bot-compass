import React from 'react';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { getItemIcon } from '@/utils/iconUtils';

const CompactDatabaseDropdowns: React.FC = () => {
  const { menuConfig, loading, error } = useNavigationMenus();

  if (loading) {
    return <div className="flex space-x-4 text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return null; // Fail silently on tablet view
  }

  // Filter out active menus and sort by position - show ALL menus
  const activeMenus = menuConfig.menus
    .filter(menu => menu.is_active)
    .sort((a, b) => a.position - b.position);

  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList className="flex space-x-2 lg:space-x-4">
        {activeMenus.map((menu) => {
          // Get items for this menu - show more items (8-10)
          const menuItems = menuConfig.items
            .filter(item => item.menu_id === menu.id && item.is_active)
            .sort((a, b) => a.position - b.position)
            .slice(0, 10); // Show up to 10 items

          if (menuItems.length === 0) {
            return null;
          }

          const MenuIcon = getItemIcon(menu.icon);

          return (
            <NavigationMenuItem key={menu.id}>
              <NavigationMenuTrigger className="group flex items-center space-x-1 px-2 py-1.5 text-xs lg:text-sm font-medium text-gray-900 hover:text-therapy-700 transition-colors bg-transparent border-none">
                <MenuIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="truncate max-w-20 lg:max-w-none">{menu.label}</span>
                <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
              </NavigationMenuTrigger>
              
              <NavigationMenuContent className="z-50">
                <HeaderDropdownCard compact={true}>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {menuItems.map((item) => {
                      const IconComponent = getItemIcon(item.icon);
                      return (
                        <HeaderDropdownItem
                          key={item.id}
                          title={item.title}
                          description={item.description}
                          href={item.href}
                          icon={IconComponent}
                          gradient={item.gradient}
                          compact={true}
                          badge={item.badge}
                        />
                      );
                    })}
                  </div>
                </HeaderDropdownCard>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default CompactDatabaseDropdowns;