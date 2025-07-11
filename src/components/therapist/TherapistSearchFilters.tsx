import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface TherapistFilters {
  searchQuery: string;
  specialties: string[];
  approach: string;
  experienceLevel: string;
  communicationStyle: string;
}

interface TherapistSearchFiltersProps {
  onFiltersChange: (filters: TherapistFilters) => void;
  onClearFilters: () => void;
}

const specialtyOptions = [
  'Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma Recovery', 
  'Personal Growth', 'Life Transitions', 'Mindfulness', 'CBT', 'Goal Setting'
];

const approachOptions = [
  'Cognitive Behavioral Therapy',
  'Mindfulness-Based Therapy', 
  'Solution-Focused Therapy',
  'Trauma-Informed Therapy',
  'Relationship Counseling',
  'Holistic Wellness'
];

const experienceLevels = [
  'All Levels',
  'Beginner Friendly',
  'Intermediate',
  'Advanced'
];

const communicationStyles = [
  'All Styles',
  'Direct',
  'Supportive', 
  'Encouraging',
  'Analytical',
  'Exploratory'
];

const TherapistSearchFilters: React.FC<TherapistSearchFiltersProps> = ({
  onFiltersChange,
  onClearFilters
}) => {
  const [filters, setFilters] = useState<TherapistFilters>({
    searchQuery: '',
    specialties: [],
    approach: '',
    experienceLevel: '',
    communicationStyle: ''
  });

  const updateFilters = (newFilters: Partial<TherapistFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const addSpecialty = (specialty: string) => {
    if (!filters.specialties.includes(specialty)) {
      updateFilters({
        specialties: [...filters.specialties, specialty]
      });
    }
  };

  const removeSpecialty = (specialty: string) => {
    updateFilters({
      specialties: filters.specialties.filter(s => s !== specialty)
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchQuery: '',
      specialties: [],
      approach: '',
      experienceLevel: '',
      communicationStyle: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.specialties.length > 0 ||
    filters.approach ||
    filters.experienceLevel ||
    filters.communicationStyle;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Search & Filter Therapists
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search therapists by name or description..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="text-sm font-medium mb-2 block">Specialties</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {filters.specialties.map(specialty => (
              <Badge
                key={specialty}
                variant="default"
                className="cursor-pointer"
                onClick={() => removeSpecialty(specialty)}
              >
                {specialty}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <Select onValueChange={addSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Add specialty filter..." />
            </SelectTrigger>
            <SelectContent>
              {specialtyOptions
                .filter(s => !filters.specialties.includes(s))
                .map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        {/* Approach */}
        <div>
          <label className="text-sm font-medium mb-2 block">Therapeutic Approach</label>
          <Select 
            value={filters.approach} 
            onValueChange={(value) => updateFilters({ approach: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select approach..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Approaches</SelectItem>
              {approachOptions.map(approach => (
                <SelectItem key={approach} value={approach}>
                  {approach}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="text-sm font-medium mb-2 block">Experience Level</label>
          <Select 
            value={filters.experienceLevel} 
            onValueChange={(value) => updateFilters({ experienceLevel: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level..." />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map(level => (
                <SelectItem key={level} value={level === 'All Levels' ? 'all' : level.toLowerCase()}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Communication Style */}
        <div>
          <label className="text-sm font-medium mb-2 block">Communication Style</label>
          <Select 
            value={filters.communicationStyle} 
            onValueChange={(value) => updateFilters({ communicationStyle: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select communication style..." />
            </SelectTrigger>
            <SelectContent>
              {communicationStyles.map(style => (
                <SelectItem key={style} value={style === 'All Styles' ? 'all' : style.toLowerCase()}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistSearchFilters;