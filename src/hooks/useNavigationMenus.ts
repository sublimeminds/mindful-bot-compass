import { useState, useEffect } from 'react';
import { MenuConfiguration, NavigationMenu, NavigationMenuItem, NavigationMenuCategory } from '@/types/navigation';
import { supabase } from '@/integrations/supabase/client';

// Fallback menu data with all complete navigation items
const fallbackMenuData: MenuConfiguration = {
  menus: [
    { id: '1', name: 'therapy-ai', label: 'Therapy AI', icon: 'Brain', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '2', name: 'platform', label: 'Platform', icon: 'Settings', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '3', name: 'tools-data', label: 'Tools & Data', icon: 'BarChart3', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '4', name: 'solutions', label: 'Solutions', icon: 'Building', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '5', name: 'resources', label: 'Resources', icon: 'BookOpen', position: 5, is_active: true, created_at: '', updated_at: '' }
  ],
  items: [
    // Therapy AI menu items
    { id: '1-1', menu_id: '1', title: 'AI Therapy Sessions', description: 'Experience personalized AI-powered therapy', href: '/therapy/ai', icon: 'Brain', gradient: 'from-blue-500 to-purple-600', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '1-2', menu_id: '1', title: 'Mood Analysis', description: 'Track and analyze your emotional patterns', href: '/therapy/mood', icon: 'Heart', gradient: 'from-pink-500 to-red-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '1-3', menu_id: '1', title: 'CulturalAI', description: 'Culturally-sensitive AI therapy tailored to your background', href: '/therapy/cultural-ai', icon: 'Globe', gradient: 'from-purple-500 to-indigo-600', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '1-4', menu_id: '1', title: 'Crisis Support', description: 'Immediate support for mental health emergencies', href: '/therapy/crisis', icon: 'Phone', gradient: 'from-red-500 to-pink-600', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '1-5', menu_id: '1', title: 'Therapy Chat', description: 'Interactive AI therapy conversations', href: '/therapy/chat', icon: 'MessageCircle', gradient: 'from-green-500 to-teal-600', position: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '1-6', menu_id: '1', title: 'Voice Therapy', description: 'AI therapy with voice interaction', href: '/therapy/voice', icon: 'Mic', gradient: 'from-teal-500 to-cyan-600', position: 6, is_active: true, created_at: '', updated_at: '' },
    { id: '1-7', menu_id: '1', title: 'Video Therapy', description: 'AI therapy with video interaction', href: '/therapy/video', icon: 'Video', gradient: 'from-violet-500 to-purple-600', position: 7, is_active: true, created_at: '', updated_at: '' },
    { id: '1-8', menu_id: '1', title: 'Mindfulness', description: 'Guided mindfulness and meditation', href: '/therapy/mindfulness', icon: 'Brain', gradient: 'from-emerald-500 to-green-600', position: 8, is_active: true, created_at: '', updated_at: '' },
    
    // Platform menu items
    { id: '2-1', menu_id: '2', title: 'Dashboard', description: 'View your therapy progress and insights', href: '/dashboard', icon: 'BarChart3', gradient: 'from-green-500 to-blue-500', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '2-2', menu_id: '2', title: 'Profile', description: 'Manage your personal information and preferences', href: '/profile', icon: 'User', gradient: 'from-blue-500 to-cyan-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '2-3', menu_id: '2', title: 'Calendar', description: 'Schedule and manage your therapy sessions', href: '/calendar', icon: 'Calendar', gradient: 'from-green-500 to-emerald-500', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '2-4', menu_id: '2', title: 'Settings', description: 'Configure your account and preferences', href: '/settings', icon: 'Settings', gradient: 'from-gray-500 to-slate-600', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '2-5', menu_id: '2', title: 'Billing', description: 'Manage your subscription and billing', href: '/billing', icon: 'CreditCard', gradient: 'from-yellow-500 to-orange-500', position: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '2-6', menu_id: '2', title: 'Security', description: 'Manage your account security settings', href: '/security', icon: 'Shield', gradient: 'from-red-500 to-pink-500', position: 6, is_active: true, created_at: '', updated_at: '' },
    { id: '2-7', menu_id: '2', title: 'Integrations', description: 'Connect with third-party services', href: '/integrations', icon: 'Globe', gradient: 'from-purple-500 to-indigo-500', position: 7, is_active: true, created_at: '', updated_at: '' },
    
    // Tools & Data menu items
    { id: '3-1', menu_id: '3', title: 'Progress Reports', description: 'Detailed analysis of your therapy journey', href: '/reports', icon: 'TrendingUp', gradient: 'from-orange-500 to-yellow-500', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '3-2', menu_id: '3', title: 'Goals Tracking', description: 'Set and track your mental health goals', href: '/goals', icon: 'Target', gradient: 'from-yellow-500 to-orange-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '3-3', menu_id: '3', title: 'Mood Insights', description: 'Analyze your emotional patterns and trends', href: '/mood-insights', icon: 'TrendingUp', gradient: 'from-pink-500 to-rose-500', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '3-4', menu_id: '3', title: 'Analytics', description: 'Detailed progress and performance analytics', href: '/analytics', icon: 'BarChart3', gradient: 'from-indigo-500 to-purple-600', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '3-5', menu_id: '3', title: 'Therapy History', description: 'Review your past therapy sessions', href: '/therapy-history', icon: 'FileText', gradient: 'from-blue-500 to-indigo-500', position: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '3-6', menu_id: '3', title: 'Export Data', description: 'Export your therapy data and reports', href: '/export', icon: 'FileText', gradient: 'from-gray-500 to-slate-600', position: 6, is_active: true, created_at: '', updated_at: '' },
    { id: '3-7', menu_id: '3', title: 'Wellness Tracking', description: 'Track your overall wellness metrics', href: '/wellness', icon: 'Heart', gradient: 'from-rose-500 to-red-500', position: 7, is_active: true, created_at: '', updated_at: '' },
    
    // Solutions menu items
    { id: '4-1', menu_id: '4', title: 'For Individuals', description: 'Personal mental health support and therapy', href: '/solutions/individuals', icon: 'User', gradient: 'from-blue-500 to-indigo-500', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '4-2', menu_id: '4', title: 'For Teams', description: 'Mental health support for organizations', href: '/solutions/teams', icon: 'Users', gradient: 'from-green-500 to-teal-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '4-3', menu_id: '4', title: 'For Healthcare', description: 'Solutions for healthcare providers', href: '/solutions/healthcare', icon: 'Building', gradient: 'from-purple-500 to-violet-500', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '4-4', menu_id: '4', title: 'For Schools', description: 'Mental health support for educational institutions', href: '/solutions/schools', icon: 'BookOpen', gradient: 'from-orange-500 to-red-500', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '4-5', menu_id: '4', title: 'For Therapists', description: 'Tools and resources for mental health professionals', href: '/solutions/therapists', icon: 'Users', gradient: 'from-teal-500 to-cyan-500', position: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '4-6', menu_id: '4', title: 'Enterprise', description: 'Large-scale mental health solutions', href: '/solutions/enterprise', icon: 'Building', gradient: 'from-slate-500 to-gray-600', position: 6, is_active: true, created_at: '', updated_at: '' },
    
    // Resources menu items
    { id: '5-1', menu_id: '5', title: 'Help Center', description: 'Find answers to common questions', href: '/help', icon: 'BookOpen', gradient: 'from-purple-500 to-violet-500', position: 1, is_active: true, created_at: '', updated_at: '' },
    { id: '5-2', menu_id: '5', title: 'Mental Health Library', description: 'Educational content and resources', href: '/library', icon: 'Book', gradient: 'from-indigo-500 to-blue-500', position: 2, is_active: true, created_at: '', updated_at: '' },
    { id: '5-3', menu_id: '5', title: 'Community', description: 'Connect with others on similar journeys', href: '/community', icon: 'Users', gradient: 'from-green-500 to-emerald-500', position: 3, is_active: true, created_at: '', updated_at: '' },
    { id: '5-4', menu_id: '5', title: 'Blog', description: 'Latest insights and mental health tips', href: '/blog', icon: 'FileText', gradient: 'from-orange-500 to-yellow-500', position: 4, is_active: true, created_at: '', updated_at: '' },
    { id: '5-5', menu_id: '5', title: 'Research', description: 'Clinical studies and research findings', href: '/research', icon: 'BarChart3', gradient: 'from-cyan-500 to-blue-500', position: 5, is_active: true, created_at: '', updated_at: '' },
    { id: '5-6', menu_id: '5', title: 'Webinars', description: 'Educational webinars and workshops', href: '/webinars', icon: 'Calendar', gradient: 'from-violet-500 to-purple-500', position: 6, is_active: true, created_at: '', updated_at: '' },
    { id: '5-7', menu_id: '5', title: 'Certification', description: 'Professional certification programs', href: '/certification', icon: 'Shield', gradient: 'from-amber-500 to-orange-500', position: 7, is_active: true, created_at: '', updated_at: '' },
    { id: '5-8', menu_id: '5', title: 'Support Groups', description: 'Join peer support communities', href: '/support-groups', icon: 'Users', gradient: 'from-emerald-500 to-green-500', position: 8, is_active: true, created_at: '', updated_at: '' },
    { id: '5-9', menu_id: '5', title: 'Crisis Resources', description: 'Immediate help and crisis support', href: '/crisis-resources', icon: 'Phone', gradient: 'from-red-500 to-rose-500', position: 9, is_active: true, created_at: '', updated_at: '' }
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
