import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useGamification, Achievement } from '@/hooks/useGamification';

interface AchievementBadgeProps {
  achievement: Achievement;
  isEarned?: boolean;
  showProgress?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  isEarned = false, 
  showProgress = false 
}) => {
  const { getRarityColor } = useGamification();
  
  // Get the icon component
  const IconComponent = (Icons as any)[achievement.icon] || Icons.Star;
  
  return (
    <Card className={`
      relative transition-all duration-200 hover:scale-105 cursor-pointer
      ${isEarned 
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg' 
        : 'bg-gray-50 border-gray-200 opacity-75'
      }
    `}>
      <CardContent className="p-4">
        {/* Earned indicator */}
        {isEarned && (
          <div className="absolute -top-2 -right-2">
            <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
          </div>
        )}
        
        {/* Locked indicator */}
        {!isEarned && (
          <div className="absolute -top-2 -right-2">
            <Lock className="h-5 w-5 text-gray-400 bg-white rounded-full p-1" />
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Icon */}
          <div className={`
            p-3 rounded-full 
            ${isEarned 
              ? 'bg-gradient-to-br from-yellow-200 to-orange-200' 
              : 'bg-gray-200'
            }
          `}>
            <IconComponent className={`
              h-8 w-8 
              ${isEarned ? 'text-yellow-700' : 'text-gray-500'}
            `} />
          </div>
          
          {/* Title */}
          <div>
            <h3 className={`
              font-semibold text-sm
              ${isEarned ? 'text-yellow-900' : 'text-gray-600'}
            `}>
              {achievement.title}
            </h3>
            
            {/* Rarity badge */}
            <Badge 
              variant="outline" 
              className={`
                text-xs mt-1 capitalize
                ${getRarityColor(achievement.rarity)}
              `}
            >
              {achievement.rarity}
            </Badge>
          </div>
          
          {/* Description */}
          <p className={`
            text-xs leading-relaxed
            ${isEarned ? 'text-yellow-800' : 'text-gray-500'}
          `}>
            {achievement.description}
          </p>
          
          {/* XP Reward */}
          <div className={`
            text-xs font-medium
            ${isEarned ? 'text-yellow-700' : 'text-gray-500'}
          `}>
            +{achievement.xp_reward} XP
          </div>
          
          {/* Earned date */}
          {isEarned && achievement.earned_at && (
            <div className="text-xs text-yellow-600">
              Earned {new Date(achievement.earned_at).toLocaleDateString()}
            </div>
          )}
          
          {/* Category */}
          <Badge variant="secondary" className="text-xs capitalize">
            {achievement.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadge;