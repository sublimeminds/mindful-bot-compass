
import * as React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import ScrollProgressIndicator from "./ScrollProgressIndicator";
import Logo from "./navigation/Logo";
import UnifiedNavigation from "./navigation/UnifiedNavigation";
import UserMenu from "./navigation/UserMenu";
import MobileMenu from "./navigation/MobileMenu";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');

  // Track active section for public pages
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname === '/') {
      const handleScroll = () => {
        const sections = ['#features', '#pricing'];
        let currentSection = '';

        for (const sectionId of sections) {
          const element = document.querySelector(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Consider section active if it's at least 30% visible
            if (elementTop <= window.innerHeight * 0.4 && elementTop + elementHeight > window.innerHeight * 0.4) {
              currentSection = sectionId;
              break;
            }
          }
        }
        
        setActiveSection(currentSection);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Call once to set initial state

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isAuthenticated, location.pathname]);

  const scrollToSection = React.useCallback((sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(sectionId);
    }
  }, [navigate]);

  const publicSections = ['#features', '#pricing'];

  return (
    <>
      <header className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation - Now unified */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <UnifiedNavigation />
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  <UserMenu user={user} logout={logout} />
                </>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")} 
                  size="sm"
                  className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-therapy-700 hover:from-therapy-600 hover:via-therapy-700 hover:to-therapy-800 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 hover:scale-105"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* Mobile menu */}
              <MobileMenu 
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isAuthenticated={isAuthenticated}
                activeSection={activeSection}
                scrollToSection={scrollToSection}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Add scroll progress indicator */}
      <ScrollProgressIndicator 
        sections={publicSections} 
        isAuthenticated={isAuthenticated} 
      />
    </>
  );
};

export default Header;
