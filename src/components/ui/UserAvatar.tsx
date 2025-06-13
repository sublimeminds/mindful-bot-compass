
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  user?: { 
    email?: string; 
    user_metadata?: { name?: string; avatar_url?: string; }; 
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className = '' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const getInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getGradientColor = () => {
    const colors = [
      'from-therapy-500 to-therapy-600',
      'from-calm-500 to-calm-600',
      'from-purple-500 to-purple-600',
      'from-emerald-500 to-emerald-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600'
    ];
    
    const email = user?.email || '';
    const index = email.length % colors.length;
    return colors[index];
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={user?.user_metadata?.avatar_url} 
        alt={user?.user_metadata?.name || user?.email || 'User'} 
      />
      <AvatarFallback className={`bg-gradient-to-br ${getGradientColor()} text-white font-semibold`}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
