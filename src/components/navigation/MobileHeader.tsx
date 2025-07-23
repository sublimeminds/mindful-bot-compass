
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import Logo from '@/components/navigation/Logo';
import UserMenu from './UserMenu';
import SearchPopup from '@/components/search/SearchPopup';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronRight,
  Home,
  Settings
} from 'lucide-react';

const MobileHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { menuConfig, loading } = useNavigationMenus();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveSubmenu(null);
  };

  const handleSubmenuToggle = (menuId: string) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const getMenuIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'Brain': Home,
      'Settings': Settings,
      'BarChart3': Settings,
      'Building': Settings,
      'BookOpen': Settings
    };
    return iconMap[iconName] || Home;
  };

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Logo />

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <SearchPopup>
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
          </SearchPopup>
          {user && (
            <>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <UserMenu />
            </>
          )}
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-h-screen overflow-y-auto">
            {/* User Section */}
            {user ? (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Welcome back!</p>
                    <p className="text-sm text-gray-500">Manage your therapy</p>
                  </div>
                  <Button onClick={() => navigate('/dashboard')} size="sm">
                    Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex space-x-2">
                  <Button onClick={() => navigate('/login')} variant="ghost" className="flex-1">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/register')} className="flex-1">
                    Get Started
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="py-2">
              {!loading && menuConfig.menus.map((menu) => {
                const IconComponent = getMenuIcon(menu.icon);
                const menuItems = menuConfig.items.filter(item => item.menu_id === menu.id);
                const isActive = activeSubmenu === menu.id;

                return (
                  <div key={menu.id}>
                    <button
                      onClick={() => handleSubmenuToggle(menu.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-therapy-600" />
                        <span className="font-medium text-gray-900">{menu.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-gray-400 transform transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </button>

                    {isActive && (
                      <div className="bg-gray-50 border-t border-gray-200">
                        {menuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              navigate(item.href);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-8 py-3 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
