import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package } from 'lucide-react';
import { WIDGET_REGISTRY, getWidgetsByCategory, WidgetConfig } from './WidgetRegistry';
import { cn } from '@/lib/utils';

interface WidgetLibraryProps {
  availableWidgets: string[];
  onAddWidget: (widgetId: string) => void;
  className?: string;
}

const WidgetLibrary = ({ availableWidgets, onAddWidget, className }: WidgetLibraryProps) => {
  const categories = [
    { id: 'essential', name: 'Essential', color: 'bg-primary' },
    { id: 'progress', name: 'Progress', color: 'bg-green-500' },
    { id: 'ai-features', name: 'AI Features', color: 'bg-purple-500' },
    { id: 'analytics', name: 'Analytics', color: 'bg-blue-500' },
    { id: 'communication', name: 'Communication', color: 'bg-orange-500' },
    { id: 'wellness', name: 'Wellness', color: 'bg-pink-500' }
  ] as const;

  const renderWidgetCard = (widget: WidgetConfig) => {
    const isAvailable = !availableWidgets.includes(widget.id);
    
    return (
      <Card key={widget.id} className={cn(
        'transition-all duration-200 hover:shadow-md',
        !isAvailable && 'opacity-50'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <widget.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground mb-1">{widget.name}</h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{widget.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {widget.defaultSize}
                </Badge>
                <Button
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onAddWidget(widget.id)}
                  disabled={!isAvailable}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Widget Library</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="essential" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-xs"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-3">
              <div className="grid gap-3">
                {getWidgetsByCategory(category.id as WidgetConfig['category']).map(renderWidgetCard)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WidgetLibrary;