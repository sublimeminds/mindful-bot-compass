
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { getItemIcon } from '@/utils/iconUtils';

const DatabaseHeaderDropdowns: React.FC = () => {
  console.log('🚀 DatabaseHeaderDropdowns component started rendering...');
  
  // Simple test first
  return (
    <div className="flex space-x-4">
      <div className="text-sm text-gray-600">Test Navigation</div>
      <a href="/test-link" className="text-sm text-blue-600 hover:text-blue-800">
        Test Link
      </a>
    </div>
  );
};

export default DatabaseHeaderDropdowns;
