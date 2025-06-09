
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, X } from "lucide-react";
import { SessionFilter } from "@/services/sessionHistoryService";
import { format } from "date-fns";

interface SessionFiltersProps {
  onFilterChange: (filter: SessionFilter) => void;
  onClearFilters: () => void;
}

const SessionFilters = ({ onFilterChange, onClearFilters }: SessionFiltersProps) => {
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [moodRange, setMoodRange] = useState<[number, number]>([1, 10]);
  const [selectedEffectiveness, setSelectedEffectiveness] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const availableTechniques = [
    'Deep Breathing',
    'Progressive Muscle Relaxation',
    'Mindfulness Meditation',
    'Cognitive Restructuring',
    'Grounding Techniques',
    'Journaling',
    'Visualization'
  ];

  const effectivenessOptions = [
    { value: 'high', label: 'High Effectiveness' },
    { value: 'medium', label: 'Medium Effectiveness' },
    { value: 'low', label: 'Low Effectiveness' }
  ];

  const applyFilters = () => {
    const filter: SessionFilter = {};

    if (dateRange.start && dateRange.end) {
      filter.dateRange = {
        start: dateRange.start,
        end: dateRange.end
      };
    }

    if (selectedTechniques.length > 0) {
      filter.techniques = selectedTechniques;
    }

    if (moodRange[0] !== 1 || moodRange[1] !== 10) {
      filter.moodRange = {
        min: moodRange[0],
        max: moodRange[1]
      };
    }

    if (selectedEffectiveness.length > 0) {
      filter.effectiveness = selectedEffectiveness as ('high' | 'medium' | 'low')[];
    }

    onFilterChange(filter);
  };

  const clearAllFilters = () => {
    setDateRange({});
    setSelectedTechniques([]);
    setMoodRange([1, 10]);
    setSelectedEffectiveness([]);
    onClearFilters();
  };

  const toggleTechnique = (technique: string) => {
    setSelectedTechniques(prev =>
      prev.includes(technique)
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    );
  };

  const hasActiveFilters = 
    dateRange.start || 
    selectedTechniques.length > 0 || 
    moodRange[0] !== 1 || 
    moodRange[1] !== 10 || 
    selectedEffectiveness.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.start ? format(dateRange.start, 'MMM dd') : 'Start Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.end ? format(dateRange.end, 'MMM dd') : 'End Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Techniques */}
          <div className="space-y-2">
            <Label>Techniques Used</Label>
            <div className="flex flex-wrap gap-2">
              {availableTechniques.map(technique => (
                <Badge
                  key={technique}
                  variant={selectedTechniques.includes(technique) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTechnique(technique)}
                >
                  {technique}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mood Range */}
          <div className="space-y-2">
            <Label>Mood After Session: {moodRange[0]} - {moodRange[1]}</Label>
            <Slider
              value={moodRange}
              onValueChange={(value) => setMoodRange(value as [number, number])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Effectiveness */}
          <div className="space-y-2">
            <Label>Session Effectiveness</Label>
            <div className="flex flex-wrap gap-2">
              {effectivenessOptions.map(option => (
                <Badge
                  key={option.value}
                  variant={selectedEffectiveness.includes(option.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedEffectiveness(prev =>
                      prev.includes(option.value)
                        ? prev.filter(e => e !== option.value)
                        : [...prev, option.value]
                    );
                  }}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default SessionFilters;
