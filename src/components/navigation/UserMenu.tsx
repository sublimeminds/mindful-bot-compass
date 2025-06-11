
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  user: { email?: string } | null;
  logout: () => void;
}

const UserMenu = ({ user, logout }: UserMenuProps) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationSettingsClick = () => {
    navigate("/notification-settings");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted/50 rounded-full transition-all duration-300 hover:scale-105">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm bg-gradient-to-br from-therapy-500 to-calm-500 text-white font-semibold">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline max-w-32 truncate font-medium text-foreground/80">{user?.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
        <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1 transition-colors">
          <User className="h-4 w-4 mr-3 text-therapy-500" />
          <span className="font-medium">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotificationSettingsClick} className="hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1 transition-colors">
          <Settings className="h-4 w-4 mr-3 text-therapy-500" />
          <span className="font-medium">Notification Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-lg mx-1 transition-colors">
          <LogOut className="h-4 w-4 mr-3" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
