
import React from 'react';
import UnifiedNavigation from './UnifiedNavigation';

// This component is now just a wrapper for the unified navigation
interface PublicNavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const PublicNavigation = ({ activeSection, scrollToSection }: PublicNavigationProps) => {
  return <UnifiedNavigation />;
};

export default PublicNavigation;
