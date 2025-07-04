import React from 'react';

interface SafeNavigationProps {
  children: React.ReactNode;
}

// Router-safe navigation that doesn't depend on React Router hooks
export const SafeNavigation: React.FC<SafeNavigationProps> = ({ children }) => {
  return <>{children}</>;
};

// Safe navigation function that works without Router context
export const safeNavigate = (path: string) => {
  try {
    // Always use window.location for reliable navigation
    if (path.startsWith('http')) {
      window.location.href = path;
    } else {
      window.location.href = window.location.origin + path;
    }
  } catch (error) {
    console.error('Navigation error:', error);
    window.location.href = '/';
  }
};

// Safe button component that doesn't use Router hooks
interface SafeNavigationButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SafeNavigationButton: React.FC<SafeNavigationButtonProps> = ({ 
  href, 
  children, 
  className = '',
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    safeNavigate(href);
  };

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
};

export default SafeNavigation;