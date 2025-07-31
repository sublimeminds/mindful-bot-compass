import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StorytellingCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  story: string;
  impact: string;
  color: string;
  delay?: number;
  onLearnMore?: () => void;
}

export const StorytellingCard: React.FC<StorytellingCardProps> = ({
  icon: Icon,
  title,
  story,
  impact,
  color,
  delay = 0,
  onLearnMore
}) => {
  return (
    <Card 
      className={cn(
        "group bg-white border border-gray-200 hover:border-therapy-300",
        "shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full",
        "animate-fade-in"
      )}
      style={{
        animationDelay: `${delay}ms`,
        willChange: 'transform, box-shadow'
      }}
    >
      <CardContent className="p-8 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div 
            className={cn(
              "p-4 rounded-2xl bg-gradient-to-br shadow-lg",
              "group-hover:scale-110 transition-transform duration-300",
              color
            )}
            style={{ willChange: 'transform' }}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <Badge 
            variant="outline" 
            className="bg-white border-gray-300 text-gray-700 hover:border-therapy-400"
          >
            {impact}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed flex-grow">{story}</p>
        
        {onLearnMore && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 group/btn w-full"
              onClick={onLearnMore}
            >
              Learn More
              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};