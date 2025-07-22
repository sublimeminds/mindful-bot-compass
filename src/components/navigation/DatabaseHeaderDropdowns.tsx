import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { 
  Brain, Globe, Mic, Target, Heart, Users, Shield, BarChart3, 
  Code, TrendingUp, FileText, User, Building, BookOpen, Settings,
  MessageSquare, Zap, Compass, LayoutDashboard, Smartphone, Download,
  CreditCard, HelpCircle, LifeBuoy, GraduationCap, Plug
} from 'lucide-react';

// Icon mapping - expanded to include all needed icons
const iconMap: Record<string, any> = {
  Brain, Globe, Mic, Target, Heart, Users, Shield, BarChart3,
  Code, TrendingUp, FileText, User, Building, BookOpen, Settings,
  MessageSquare, Zap, Compass, LayoutDashboard, Smartphone, Download,
  CreditCard, HelpCircle, LifeBuoy, GraduationCap, Plug
};

// Helper to get icon component from string
const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Brain;
};

const DatabaseHeaderDropdowns = () => {
  const { menuConfig, loading, error } = useNavigationMenus();
  const { isDesktop, isMd, isTablet } = useEnhancedScreenSize();
  const isLargeScreen = isDesktop; // 1280px+
  const isMediumScreen = isMd; // 1024-1279px
  const isSmallScreen = isTablet; // 768-1023px

  if (loading) {
    return <div className="flex space-x-4">Loading menus...</div>;
  }

  if (error) {
    console.warn('Navigation menu error:', error);
  }

  // Group items by menu and category
  const getMenuItems = (menuName: string, categoryName?: string) => {
    const menu = menuConfig.menus.find(m => m.name === menuName);
    if (!menu) return [];

    let items = menuConfig.items.filter(item => item.menu_id === menu.id);
    
    if (categoryName) {
      const category = menuConfig.categories.find(c => c.menu_id === menu.id && c.name === categoryName);
      if (category) {
        items = items.filter(item => item.category_id === category.id);
      }
    } else {
      // Get items without category for this menu
      items = items.filter(item => !item.category_id);
    }

    return items.sort((a, b) => a.position - b.position);
  };

  const getMenuCategories = (menuName: string) => {
    const menu = menuConfig.menus.find(m => m.name === menuName);
    if (!menu) return [];
    
    return menuConfig.categories
      .filter(c => c.menu_id === menu.id)
      .sort((a, b) => a.position - b.position);
  };

  // Render 2-column grid layout for large screens only
  const renderLargeScreenGrid = (items: any[], columns = 2) => (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {items.map((item) => (
        <HeaderDropdownItem
          key={item.id}
          icon={getIconComponent(item.icon)}
          title={item.title}
          description={item.description}
          href={item.href}
          gradient={item.gradient}
          badge={item.badge}
          compact={false}
        />
      ))}
    </div>
  );

  // Render compact single column for medium screens
  const renderMediumScreenList = (items: any[]) => (
    <div className="space-y-2">
      {items.map((item) => (
        <HeaderDropdownItem
          key={item.id}
          icon={getIconComponent(item.icon)}
          title={item.title}
          description={item.description}
          href={item.href}
          gradient={item.gradient}
          badge={item.badge}
          compact={true}
        />
      ))}
    </div>
  );

  // Render simple list for small screens
  const renderSmallScreenList = (items: any[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const IconComponent = getIconComponent(item.icon);
        return (
          <Link
            key={item.id}
            to={item.href}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
              <IconComponent className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </div>
  );

  const renderContent = (items: any[], columns = 2) => {
    if (isLargeScreen) {
      return renderLargeScreenGrid(items, columns);
    } else if (isMediumScreen) {
      return renderMediumScreenList(items);
    } else {
      return renderSmallScreenList(items);
    }
  };

  const renderCategorizedContent = (menuName: string) => {
    const categories = getMenuCategories(menuName);
    const uncategorizedItems = getMenuItems(menuName);

    if (categories.length === 0) {
      return renderContent(uncategorizedItems, 2);
    }

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = getMenuItems(menuName, category.name);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                {category.label}
              </h4>
              {renderContent(categoryItems, 1)}
            </div>
          );
        })}
        {uncategorizedItems.length > 0 && (
          <div>
            {renderContent(uncategorizedItems, 2)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Therapy AI Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Brain className="h-4 w-4" />
          <span>Therapy AI</span>
        </button>
        <HeaderDropdownCard width="xl" className="dropdown-left">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Therapy</h3>
            <p className="text-sm text-gray-600">
              Experience personalized mental health support with our advanced AI therapists
            </p>
          </div>
          {renderCategorizedContent('therapy-ai')}
        </HeaderDropdownCard>
      </div>

      {/* Platform Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Platform</span>
        </button>
        <HeaderDropdownCard width="xl">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Platform Features</h3>
            <p className="text-sm text-gray-600">
              Comprehensive tools for your mental wellness journey
            </p>
          </div>
          {renderCategorizedContent('platform')}
        </HeaderDropdownCard>
      </div>

      {/* Tools & Data Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <BarChart3 className="h-4 w-4" />
          <span>Tools & Data</span>
        </button>
        <HeaderDropdownCard width="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics & Insights</h3>
            <p className="text-sm text-gray-600">
              Powerful tools to track and understand your mental health
            </p>
          </div>
          {renderCategorizedContent('tools-data')}
        </HeaderDropdownCard>
      </div>

      {/* Solutions Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Building className="h-4 w-4" />
          <span>Solutions</span>
        </button>
        <HeaderDropdownCard width="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Specialized Solutions</h3>
            <p className="text-sm text-gray-600">
              Tailored mental health solutions for different needs
            </p>
          </div>
          {renderCategorizedContent('solutions')}
        </HeaderDropdownCard>
      </div>

      {/* Resources Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span>Resources</span>
        </button>
        <HeaderDropdownCard width="xl" className="dropdown-right">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Help & Resources</h3>
            <p className="text-sm text-gray-600">
              Educational content, support, and community resources
            </p>
          </div>
          {renderCategorizedContent('resources')}
        </HeaderDropdownCard>
      </div>
    </>
  );
};

export default DatabaseHeaderDropdowns;