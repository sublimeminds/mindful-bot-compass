
import { useState, useEffect } from 'react';
import { MenuConfiguration, NavigationMenu, NavigationMenuItem, NavigationMenuCategory } from '@/types/navigation';
import { supabase } from '@/integrations/supabase/client';

// Fallback menu data (current hardcoded structure)
const fallbackMenuData: MenuConfiguration = {
  menus: [
    { id: '1', name: 'therapy-ai', label: 'Therapy AI', icon: 'Brain', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '2', name: 'platform', label: 'Platform', icon: 'Settings', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '3', name: 'tools-data', label: 'Tools & Data', icon: 'BarChart3', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '4', name: 'solutions', label: 'Solutions', icon: 'Building', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '5', name: 'resources', label: 'Resources', icon: 'BookOpen', position: 5, is_active: true, created_at: '', updated_at: '' }
  ],
  items: [
    // Add some fallback menu items so navigation shows something
    { id: '1-1', menu_id: '1', title: 'AI Therapy Sessions', description: 'Experience personalized AI-powered therapy', href: '/therapy/ai', icon: 'Brain', gradient: 'from-blue-500 to-purple-600', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '1-2', menu_id: '1', title: 'Mood Analysis', description: 'Track and analyze your emotional patterns', href: '/therapy/mood', icon: 'Heart', gradient: 'from-pink-500 to-red-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '2-1', menu_id: '2', title: 'Dashboard', description: 'View your therapy progress and insights', href: '/dashboard', icon: 'BarChart3', gradient: 'from-green-500 to-blue-500', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '3-1', menu_id: '3', title: 'Progress Reports', description: 'Detailed analysis of your therapy journey', href: '/reports', icon: 'TrendingUp', gradient: 'from-orange-500 to-yellow-500', position: 1, is_active: true, created_at: '', updated_at: '' }
  ],
  categories: []
};

export const useNavigationMenus = () => {
  const [menuConfig, setMenuConfig] = useState<MenuConfiguration>(fallbackMenuData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    console.log('🔍 useNavigationMenus: Starting fetchMenus');
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 useNavigationMenus: Fetching navigation menus from database...');
      
      // Fetch all data from the new database structure
      const [menusResult, categoriesResult, itemsResult] = await Promise.all([
        supabase
          .from('navigation_menus')
          .select('*')
          .eq('is_active', true)
          .order('position'),
        supabase
          .from('navigation_menu_categories')
          .select('*')
          .eq('is_active', true)
          .order('position'),
        supabase
          .from('navigation_menu_items')
          .select('*')
          .eq('is_active', true)
          .order('position')
      ]);

      console.log('🔍 useNavigationMenus: Database results:', {
        menus: menusResult.data?.length || 0,
        categories: categoriesResult.data?.length || 0,
        items: itemsResult.data?.length || 0,
        menuError: menusResult.error,
        categoryError: categoriesResult.error,
        itemError: itemsResult.error
      });

      if (menusResult.data && categoriesResult.data && itemsResult.data) {
        console.log('🔍 useNavigationMenus: Using database menu data');
        const dbConfig = {
          menus: menusResult.data,
          categories: categoriesResult.data,
          items: itemsResult.data
        };
        console.log('🔍 useNavigationMenus: Setting DB config:', dbConfig);
        setMenuConfig(dbConfig);
      } else {
        console.warn('🔍 useNavigationMenus: Using fallback menu data - database tables may not exist');
        setMenuConfig(fallbackMenuData);
      }
    } catch (err) {
      console.warn('🔍 useNavigationMenus: Database error, using fallback menus:', err);
      setMenuConfig(fallbackMenuData);
      setError('Database connection issue');
    } finally {
      setLoading(false);
      console.log('🔍 useNavigationMenus: fetchMenus completed');
    }
  };

  const updateMenu = async (menu: Partial<NavigationMenu> & { id: string }) => {
    try {
      console.log('🔍 useNavigationMenus: Menu update requested:', menu);
      setError('Menu updates not yet implemented - database tables needed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu');
    }
  };

  const updateMenuItem = async (item: Partial<NavigationMenuItem> & { id: string }) => {
    try {
      console.log('🔍 useNavigationMenus: Menu item update requested:', item);
      setError('Menu item updates not yet implemented - database tables needed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
    }
  };

  useEffect(() => {
    console.log('🔍 useNavigationMenus: useEffect triggered');
    fetchMenus();
  }, []);

  return {
    menuConfig,
    loading,
    error,
    refetch: fetchMenus,
    updateMenu,
    updateMenuItem
  };
};
