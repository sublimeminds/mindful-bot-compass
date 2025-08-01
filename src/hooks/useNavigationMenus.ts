
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuConfiguration } from '@/types/navigation';

export const useNavigationMenus = () => {
  console.log('🚀 useNavigationMenus hook called');
  
  const { data: menuConfig, isLoading: loading, error } = useQuery({
    queryKey: ['navigation-menus'],
    queryFn: async (): Promise<MenuConfiguration> => {
      console.log('🔍 STARTING navigation fetch from database...');
      console.log('🔍 Supabase client:', supabase);
      
      try {
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

        console.log('✅ Navigation data loaded:', { 
          menusCount: menus?.length || 0, 
          itemsCount: items?.length || 0, 
          categoriesCount: categories?.length || 0,
          menus, 
          items, 
          categories 
        });
        
        return {
          menus: menus || [],
          items: items || [],
          categories: categories || []
        };
      } catch (error) {
        console.error('❌ Failed to fetch navigation data:', error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: false, // Don't poll
  });

  if (error) {
    console.error('❌ Navigation hook error:', error);
  }

  return {
    menuConfig: menuConfig || { menus: [], items: [], categories: [] },
    loading: loading,
    error
  };
};
