import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MindfulAI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-gray-600 hover:text-therapy-600 transition-colors">
                Features
              </Link>
              <Link to="/#pricing" className="text-gray-600 hover:text-therapy-600 transition-colors">
                Pricing
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/chat" className="text-gray-600 hover:text-therapy-600 transition-colors">
                    Chat
                  </Link>
                  <Link to="/sessions" className="text-gray-600 hover:text-therapy-600 transition-colors">
                    Sessions
                  </Link>
                  <Link to="/analytics" className="text-gray-600 hover:text-therapy-600 transition-colors">
                    Analytics
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  <Button variant="outline" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-therapy-600 hover:bg-therapy-700"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/#features" 
                  className="text-gray-600 hover:text-therapy-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/#pricing" 
                  className="text-gray-600 hover:text-therapy-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/chat" 
                      className="text-gray-600 hover:text-therapy-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chat
                    </Link>
                    <Link 
                      to="/sessions" 
                      className="text-gray-600 hover:text-therapy-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sessions
                    </Link>
                    <Link 
                      to="/analytics" 
                      className="text-gray-600 hover:text-therapy-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <NotificationCenter />
                    </div>
                  </>
                )}
                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      Sign Out
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-therapy-600 hover:bg-therapy-700"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
