import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  Plus, 
  Target, 
  Heart, 
  Brain,
  Users,
  CheckCircle,
  Clock,
  Pause,
  X
} from 'lucide-react';
import { useTherapyPlans } from '@/hooks/useTherapyPlans';

interface TherapyPlanSwitcherProps {
  onCreateNew: () => void;
}

const getStatusIcon = (isActive: boolean, phase: string) => {
  if (isActive) {
    return <CheckCircle className="h-3 w-3 text-green-500" />;
  }
  switch (phase) {
    case 'completed': return <CheckCircle className="h-3 w-3 text-blue-500" />;
    case 'paused': return <Pause className="h-3 w-3 text-yellow-500" />;
    case 'cancelled': return <X className="h-3 w-3 text-red-500" />;
    default: return <Clock className="h-3 w-3 text-gray-500" />;
  }
};

const getFocusIcon = (focusArea: string) => {
  switch (focusArea) {
    case 'anxiety': return <Heart className="h-3 w-3" />;
    case 'depression': return <Brain className="h-3 w-3" />;
    case 'relationships': return <Users className="h-3 w-3" />;
    default: return <Target className="h-3 w-3" />;
  }
};

const getStatusColor = (isActive: boolean, phase: string) => {
  if (isActive) return 'bg-green-500';
  switch (phase) {
    case 'completed': return 'bg-blue-500';
    case 'paused': return 'bg-yellow-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const TherapyPlanSwitcher: React.FC<TherapyPlanSwitcherProps> = ({ onCreateNew }) => {
  const { therapyPlans, activePlan, switchActivePlan } = useTherapyPlans();

  if (!activePlan && therapyPlans.length === 0) {
    return (
      <Button 
        onClick={onCreateNew}
        className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Plan
      </Button>
    );
  }

  const primaryFocus = activePlan?.focus_areas?.[0] || 'general';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="justify-between bg-card/50 backdrop-blur-sm border-therapy-200 hover:bg-therapy-50"
        >
          <div className="flex items-center space-x-2">
            {getFocusIcon(primaryFocus)}
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">
                {activePlan?.title || 'No Active Plan'}
              </span>
              {activePlan && (
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activePlan.is_active, activePlan.current_phase)}`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {activePlan.is_active ? 'active' : activePlan.current_phase}
                  </span>
                </div>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Therapy Plans</span>
          <Badge variant="secondary">{therapyPlans.length}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {therapyPlans.map((plan) => (
          <DropdownMenuItem
            key={plan.id}
            onClick={() => switchActivePlan(plan.id)}
            className={`p-3 cursor-pointer ${plan.id === activePlan?.id ? 'bg-therapy-50 border-l-2 border-therapy-500' : ''}`}
          >
            <div className="flex items-start space-x-3 w-full">
              <div className="flex-shrink-0 mt-1">
                {getFocusIcon(plan.focus_areas?.[0] || 'general')}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm truncate">{plan.title}</p>
                  {getStatusIcon(plan.is_active, plan.current_phase)}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {plan.description || 'No description'}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {plan.focus_areas?.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                      {area}
                    </Badge>
                  ))}
                  {plan.focus_areas?.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{plan.focus_areas.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onCreateNew} className="p-3 cursor-pointer">
          <div className="flex items-center space-x-3 w-full">
            <div className="w-8 h-8 rounded-lg bg-therapy-100 flex items-center justify-center">
              <Plus className="h-4 w-4 text-therapy-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Create New Plan</p>
              <p className="text-xs text-muted-foreground">
                Start a new therapy focus area
              </p>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TherapyPlanSwitcher;