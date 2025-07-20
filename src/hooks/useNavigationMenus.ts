
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MenuConfiguration, NavigationMenu, NavigationMenuItem, NavigationMenuCategory } from '@/types/navigation';

// Fallback menu data (current hardcoded structure)
const fallbackMenuData: MenuConfiguration = {
  menus: [
    { id: '1', name: 'therapy-ai', label: 'Therapy AI', icon: 'Brain', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '2', name: 'platform', label: 'Platform', icon: 'Settings', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '3', name: 'tools-data', label: 'Tools & Data', icon: 'BarChart3', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '4', name: 'solutions', label: 'Solutions', icon: 'Building', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '5', name: 'resources', label: 'Resources', icon: 'BookOpen', position: 5, is_active: true, created_at: '', updated_at: '' }
  ],
  items: [],
  categories: []
};

export const useNavigationMenus = () => {
  const [menuConfig, setMenuConfig] = useState<MenuConfiguration>(fallbackMenuData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from database
      const { data: menus, error: menusError } = await supabase
        .from('navigation_menus')
        .select('*')
        .eq('is_active', true)
        .order('position');

      const { data: items, error: itemsError } = await supabase
        .from('navigation_menu_items')
        .select('*')
        .eq('is_active', true)
        .order('position');

      const { data: categories, error: categoriesError } = await supabase
        .from('navigation_menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (menusError || itemsError || categoriesError) {
        console.warn('Failed to fetch navigation menus from database, using fallback');
        setMenuConfig(fallbackMenuData);
      } else {
        setMenuConfig({
          menus: menus || [],
          items: items || [],
          categories: categories || []
        });
      }
    } catch (err) {
      console.warn('Database not available, using fallback menus');
      setMenuConfig(fallbackMenuData);
    } finally {
      setLoading(false);
    }
  };

  const updateMenu = async (menu: Partial<NavigationMenu> & { id: string }) => {
    try {
      const { error } = await supabase
        .from('navigation_menus')
        .update(menu)
        .eq('id', menu.id);

      if (error) throw error;
      await fetchMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu');
    }
  };

  const updateMenuItem = async (item: Partial<NavigationMenuItem> & { id: string }) => {
    try {
      const { error } = await supabase
        .from('navigation_menu_items')
        .update(item)
        .eq('id', item.id);

      if (error) throw error;
      await fetchMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
    }
  };

  useEffect(() => {
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
