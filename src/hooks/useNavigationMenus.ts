
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuConfiguration } from '@/types/navigation';

export const useNavigationMenus = () => {
  const { data: menuConfig, isLoading: loading } = useQuery({
    queryKey: ['navigation-menus'],
    queryFn: async (): Promise<MenuConfiguration> => {
      console.log('🔍 Fetching navigation menus from database...');
      
      // Fetch menus
      const { data: menus, error: menusError } = await supabase
        .from('navigation_menus')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (menusError) {
        console.error('Error fetching menus:', menusError);
        throw menusError;
      }

      // Fetch menu items
      const { data: items, error: itemsError } = await supabase
        .from('navigation_menu_items')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (itemsError) {
        console.error('Error fetching menu items:', itemsError);
        throw itemsError;
      }

      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('navigation_menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        throw categoriesError;
      }

      console.log('✅ Navigation data loaded:', { menus, items, categories });
      
      return {
        menus: menus || [],
        items: items || [],
        categories: categories || []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    menuConfig: menuConfig || { menus: [], items: [], categories: [] },
    loading
  };
};
