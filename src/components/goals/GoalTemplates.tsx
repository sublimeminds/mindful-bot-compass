
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Users, Brain, TrendingUp, Plus } from "lucide-react";
import { GoalTemplate } from "@/services/goalService";

interface GoalTemplatesProps {
  templates: GoalTemplate[];
  onSelectTemplate: (template: GoalTemplate) => void;
}

const GoalTemplates = ({ templates, onSelectTemplate }: GoalTemplatesProps) => {
  const getCategoryIcon = (category: GoalTemplate['category']) => {
    switch (category) {
      case 'mental-health': return <Brain className="h-5 w-5" />;
      case 'habit-building': return <TrendingUp className="h-5 w-5" />;
      case 'therapy-specific': return <Users className="h-5 w-5" />;
      case 'personal-growth': return <Target className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: GoalTemplate['category']) => {
    switch (category) {
      case 'mental-health': return 'bg-blue-100 text-blue-800';
      case 'habit-building': return 'bg-green-100 text-green-800';
      case 'therapy-specific': return 'bg-purple-100 text-purple-800';
      case 'personal-growth': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose a Goal Template</h3>
        <p className="text-muted-foreground">
          Start with a proven template or create your own custom goal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                {getCategoryIcon(template.category)}
                <span>{template.title}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={getCategoryColor(template.category)}>
                  {template.category.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Target: </span>
                  {template.defaultTargetValue} {template.defaultUnit} 
                  <span className="text-muted-foreground ml-1">
                    ({template.defaultDuration} days)
                  </span>
                </div>

                {template.milestoneTemplates.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Milestones:</span>
                    <div className="flex flex-wrap gap-1">
                      {template.milestoneTemplates.slice(0, 2).map((milestone, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {milestone.title}
                        </Badge>
                      ))}
                      {template.milestoneTemplates.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.milestoneTemplates.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalTemplates;
