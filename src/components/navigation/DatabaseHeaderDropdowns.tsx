
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { getItemIcon } from '@/utils/iconUtils';

const DatabaseHeaderDropdowns: React.FC = () => {
  console.log('🚀 DatabaseHeaderDropdowns component started rendering...');
  
  try {
    const { menuConfig, loading, error } = useNavigationMenus();

    console.log('🔍 DatabaseHeaderDropdowns render:', { 
      loading, 
      hasMenus: !!menuConfig?.menus?.length,
      hasItems: !!menuConfig?.items?.length,
      error 
    });

    if (loading) {
      console.log('🔄 Navigation still loading...');
      return <div className="flex space-x-8 text-gray-500">Loading navigation...</div>;
    }

    if (error) {
      console.error('❌ Navigation error:', error);
      return <div className="flex space-x-8 text-red-500">Error loading navigation</div>;
    }

    // Filter out active menus and sort by position
    const activeMenus = menuConfig.menus
      .filter(menu => menu.is_active)
      .sort((a, b) => a.position - b.position);

    console.log('🔍 Active menus:', activeMenus);

    return (
      <NavigationMenu className="relative z-50">
        <NavigationMenuList className="flex space-x-8">
          {activeMenus.map((menu) => {
            // Get items for this menu
            const menuItems = menuConfig.items
              .filter(item => item.menu_id === menu.id && item.is_active)
              .sort((a, b) => a.position - b.position);

            console.log(`🔍 Menu "${menu.label}" items:`, menuItems);

            if (menuItems.length === 0) {
              console.log(`⚠️ No items found for menu: ${menu.label}`);
              return null;
            }

            // Get menu icon
            const MenuIcon = getItemIcon(menu.icon);

            return (
              <NavigationMenuItem key={menu.id}>
                <NavigationMenuTrigger className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-therapy-700 transition-colors bg-transparent border-none">
                  <MenuIcon className="h-4 w-4" />
                  <span>{menu.label}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </NavigationMenuTrigger>
                
                <NavigationMenuContent className="z-50 bg-white shadow-lg border border-gray-200 rounded-lg">
                  <HeaderDropdownCard>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                      {menuItems.map((item) => {
                        const IconComponent = getItemIcon(item.icon);
                        console.log(`🔍 Rendering item: ${item.title} with href: ${item.href} and icon: ${item.icon}`);
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
  } catch (error) {
    console.error('🚨 DatabaseHeaderDropdowns crashed:', error);
    return <div className="flex space-x-8 text-red-500">Navigation error</div>;
  }
};

export default DatabaseHeaderDropdowns;
