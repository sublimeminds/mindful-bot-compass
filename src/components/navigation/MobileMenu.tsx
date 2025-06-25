import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, MessageSquare, BarChart3, Users, Settings, LogOut,
  Heart, Brain, Target, Book, Shield, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="bg-white h-full w-64 shadow-lg">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link to="/progress" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <BarChart3 className="h-4 w-4" />
                  <span>Progress</span>
                </Link>
              </li>
              <li>
                <Link to="/community" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </Link>
              </li>
              <li>
                <Link to="/mood-tracker" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Heart className="h-4 w-4" />
                  <span>Mood Tracker</span>
                </Link>
              </li>
              <li>
                <Link to="/journal" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Book className="h-4 w-4" />
                  <span>Journal</span>
                </Link>
              </li>
              <li>
                <Link to="/techniques" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Brain className="h-4 w-4" />
                  <span>Techniques</span>
                </Link>
              </li>
              <li>
                <Link to="/goals" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Target className="h-4 w-4" />
                  <span>Goals</span>
                </Link>
              </li>
              <li>
                <Link to="/security" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </Link>
              </li>
              <li>
                <Link to="/help" className="flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-4">
            <Button variant="ghost" className="w-full justify-start" onClick={onClose}>
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
