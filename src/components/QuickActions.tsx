
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Target, BarChart3, Settings, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Start Session",
      description: "Begin a new therapy session",
      icon: MessageCircle,
      onClick: () => navigate('/chat'),
      className: "bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white"
    },
    {
      title: "Set Goals",
      description: "Create and track your progress",
      icon: Target,
      onClick: () => navigate('/goals'),
      className: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
    },
    {
      title: "Track Mood",
      description: "Log your current mood",
      icon: Brain,
      onClick: () => navigate('/mood'),
      className: "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
    },
    {
      title: "View Sessions",
      description: "Review past sessions",
      icon: Calendar,
      onClick: () => navigate('/sessions'),
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
    },
    {
      title: "Analytics",
      description: "See your progress analytics",
      icon: BarChart3,
      onClick: () => navigate('/analytics'),
      className: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
    },
    {
      title: "Techniques",
      description: "Learn coping techniques",
      icon: Settings,
      onClick: () => navigate('/techniques'),
      className: "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className={`h-auto p-3 flex flex-col items-center space-y-2 ${action.className}`}
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
