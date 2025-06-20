
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface RegionSelectorProps {
  onRegionChange?: (region: string) => void;
  currentRegion?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ onRegionChange, currentRegion }) => {
  const regions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'EU', name: 'European Union', flag: '🇪🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={currentRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select region">
            {currentRegion && (
              <div className="flex items-center space-x-2">
                <span>{regions.find(r => r.code === currentRegion)?.flag}</span>
                <span>{regions.find(r => r.code === currentRegion)?.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          {regions.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              <div className="flex items-center space-x-2">
                <span>{region.flag}</span>
                <span>{region.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RegionSelector;
