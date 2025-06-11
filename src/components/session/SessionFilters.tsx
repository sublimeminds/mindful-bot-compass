
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
import { format } from "date-fns";

interface SessionFiltersProps {
  dateRange: string;
  moodFilter: string;
  sortBy: string;
  onDateRangeChange: (dateRange: string) => void;
  onMoodFilterChange: (moodFilter: string) => void;
  onSortByChange: (sortBy: string) => void;
}

const SessionFilters = ({ 
  dateRange, 
  moodFilter, 
  sortBy, 
  onDateRangeChange, 
  onMoodFilterChange, 
  onSortByChange 
}: SessionFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearAllFilters = () => {
    onDateRangeChange('30d');
    onMoodFilterChange('all');
    onSortByChange('date');
  };

  const hasActiveFilters = 
    dateRange !== '30d' || 
    moodFilter !== 'all' || 
    sortBy !== 'date';

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
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mood Filter */}
          <div className="space-y-2">
            <Label>Mood Filter</Label>
            <Select value={moodFilter} onValueChange={onMoodFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All moods</SelectItem>
                <SelectItem value="improved">Improved mood</SelectItem>
                <SelectItem value="stable">Stable mood</SelectItem>
                <SelectItem value="declined">Declined mood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (newest first)</SelectItem>
                <SelectItem value="date-asc">Date (oldest first)</SelectItem>
                <SelectItem value="mood">Mood improvement</SelectItem>
                <SelectItem value="duration">Session duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default SessionFilters;
