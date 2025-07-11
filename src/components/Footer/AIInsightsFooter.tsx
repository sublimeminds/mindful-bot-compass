import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Users,
  Clock,
  Star,
  Activity,
  CheckCircle
} from 'lucide-react';

const AIInsightsFooter = () => {
  return (
    <div className="bg-gradient-to-r from-therapy-50 to-calm-50 border-t border-therapy-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Made with care by TherapySync
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsFooter;