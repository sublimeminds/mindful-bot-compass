
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { getItemIcon } from '@/utils/iconUtils';

const DatabaseHeaderDropdowns: React.FC = () => {
  const { menuConfig, loading } = useNavigationMenus();

  if (loading) {
    return <div className="flex space-x-8">Loading...</div>;
  }

  // Filter out active menus and sort by position
  const activeMenus = menuConfig.menus
    .filter(menu => menu.is_active)
    .sort((a, b) => a.position - b.position);

  return (
    <NavigationMenu className="relative z-10">
      <NavigationMenuList className="flex space-x-8">
        {activeMenus.map((menu) => {
          // Get items for this menu
          const menuItems = menuConfig.items
            .filter(item => item.menu_id === menu.id && item.is_active)
            .sort((a, b) => a.position - b.position);

          if (menuItems.length === 0) return null;

          return (
            <NavigationMenuItem key={menu.id}>
              <NavigationMenuTrigger className="group flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-900 hover:text-therapy-700 transition-colors">
                {menu.label}
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </NavigationMenuTrigger>
              
              <NavigationMenuContent>
                <HeaderDropdownCard>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
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

export default DatabaseHeaderDropdowns;
