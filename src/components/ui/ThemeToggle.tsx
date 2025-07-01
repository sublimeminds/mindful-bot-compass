
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Palette } from 'lucide-react';

const ThemeToggle = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 rounded-lg border border-therapy-200 bg-white/80 backdrop-blur-sm hover:bg-therapy-50 transition-all duration-200 shadow-sm hover:shadow-md"
      title="Light theme active"
    >
      <Sun className="h-4 w-4 text-therapy-600" />
      <span className="sr-only">Light theme active</span>
    </Button>
  );
};

export default ThemeToggle;
