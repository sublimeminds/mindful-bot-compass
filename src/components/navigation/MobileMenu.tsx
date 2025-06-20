
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  activeSection,
  scrollToSection
}: MobileMenuProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const publicSections = [
    { id: '#features', label: 'Features' },
    { id: '#pricing', label: 'Pricing' },
    { id: '/help', label: 'Help' }
  ];

  const authenticatedSections = [
    { id: '/dashboard', label: 'Dashboard' },
    { id: '/crisis-management', label: 'Crisis' },
    { id: '/community', label: 'Community' },
    { id: '/notebook', label: 'Journal' },
    { id: '/smart-scheduling', label: 'Schedule' },
    { id: '/help', label: 'Help' }
  ];

  const sectionsToShow = isAuthenticated ? authenticatedSections : publicSections;

  const handleSectionClick = useCallback((sectionId: string) => {
    try {
      if (sectionId.startsWith('#')) {
        scrollToSection(sectionId);
      } else {
        navigate(sectionId);
      }
      setIsMenuOpen(false);
    } catch (error) {
      console.error('MobileMenu: Error in handleSectionClick:', error);
    }
  }, [navigate, scrollToSection, setIsMenuOpen]);

  const handleAuthClick = useCallback(() => {
    try {
      navigate("/auth");
      setIsMenuOpen(false);
    } catch (error) {
      console.error('MobileMenu: Error in handleAuthClick:', error);
    }
  }, [navigate, setIsMenuOpen]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative z-50 p-2"
      >
        {isMenuOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-therapy-50/95 via-white/95 to-calm-50/95 backdrop-blur-xl z-40 lg:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
            {sectionsToShow.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`text-lg font-medium transition-colors px-4 py-2 rounded-lg ${
                  activeSection === section.id
                    ? 'text-therapy-600 bg-therapy-100'
                    : 'text-therapy-900 hover:text-therapy-600 hover:bg-therapy-50'
                }`}
              >
                {section.label}
              </button>
            ))}

            {!isAuthenticated && (
              <Button 
                onClick={handleAuthClick}
                size="lg"
                className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-therapy-700 hover:from-therapy-600 hover:via-therapy-700 hover:to-therapy-800 text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105 mt-4"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
