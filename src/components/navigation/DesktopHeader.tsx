
import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface DesktopHeaderProps {
  onMenuToggle: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-xl font-semibold text-therapy-800">
          TherapySync
        </h1>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
