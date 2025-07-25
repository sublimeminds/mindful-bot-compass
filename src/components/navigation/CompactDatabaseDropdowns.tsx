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

  // Filter out active menus and sort by position - show only top 2
  const activeMenus = menuConfig.menus
    .filter(menu => menu.is_active)
    .sort((a, b) => a.position - b.position)
    .slice(0, 2); // Only show first 2 menus on tablet

  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList className="flex space-x-4">
        {activeMenus.map((menu) => {
          // Get items for this menu - show only top 4
          const menuItems = menuConfig.items
            .filter(item => item.menu_id === menu.id && item.is_active)
            .sort((a, b) => a.position - b.position)
            .slice(0, 4); // Only show first 4 items

          if (menuItems.length === 0) {
            return null;
          }

          const MenuIcon = getItemIcon(menu.icon);

          return (
            <NavigationMenuItem key={menu.id}>
              <NavigationMenuTrigger className="group flex items-center space-x-1 px-2 py-1.5 text-sm font-medium text-gray-900 hover:text-therapy-700 transition-colors bg-transparent border-none">
                <MenuIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{menu.label}</span>
                <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
              </NavigationMenuTrigger>
              
              <NavigationMenuContent className="z-50 bg-white shadow-lg border border-gray-200 rounded-lg">
                <HeaderDropdownCard>
                  <div className="grid grid-cols-1 gap-1 min-w-[280px]">
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
                    {menuConfig.items.filter(item => item.menu_id === menu.id && item.is_active).length > 4 && (
                      <HeaderDropdownItem
                        title={`View All ${menu.label}`}
                        description="See all available options"
                        href={`/menu/${menu.name}`}
                        icon={MenuIcon}
                        gradient="from-gray-500 to-gray-600"
                        compact={true}
                      />
                    )}
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