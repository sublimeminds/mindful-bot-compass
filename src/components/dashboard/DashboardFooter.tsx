
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, HelpCircle, Heart, Clock } from 'lucide-react';

const DashboardFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/crisis-resources')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Shield className="h-4 w-4 mr-2" />
              Crisis Support
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center
            </Button>
          </div>

          {/* Status Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last sync: Just now</span>
            </div>
          </div>

          {/* Branding */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-therapy-500" />
            <span>Made with care by TherapySync</span>
            <span className="text-xs">v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
