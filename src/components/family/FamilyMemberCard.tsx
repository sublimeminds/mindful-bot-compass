
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Shield, 
  Trash2, 
  Settings,
  Crown,
  User,
  AlertTriangle,
  Heart,
  TrendingUp
} from 'lucide-react';
import { type HouseholdMember } from '@/services/familyService';

interface FamilyMemberCardProps {
  member: HouseholdMember;
  onRemove: (memberId: string) => void;
  onUpdatePermissions: (memberId: string, permissions: any) => void;
  canManage: boolean;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onRemove,
  onUpdatePermissions,
  canManage
}) => {
  const [showPermissions, setShowPermissions] = useState(false);

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case 'primary':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'child':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'teen':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMemberTypeBadge = (type: string) => {
    const colors = {
      primary: 'bg-yellow-100 text-yellow-800',
      adult: 'bg-green-100 text-green-800',
      teen: 'bg-purple-100 text-purple-800',
      child: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.adult}>
        {getMemberTypeIcon(type)}
        <span className="ml-1">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </Badge>
    );
  };

  const getPermissionLevel = (level: string) => {
    const levels = {
      full: { color: 'text-green-600', label: 'Full Access' },
      limited: { color: 'text-yellow-600', label: 'Limited Access' },
      basic: { color: 'text-blue-600', label: 'Basic Access' },
      view_only: { color: 'text-gray-600', label: 'View Only' }
    };
    
    return levels[level as keyof typeof levels] || levels.basic;
  };

  const togglePermission = (permission: string, currentValue: boolean) => {
    onUpdatePermissions(member.id, {
      [permission]: !currentValue
    });
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={member.profiles?.avatar_url} />
              <AvatarFallback>
                {member.profiles?.name?.charAt(0) || member.invited_email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {member.profiles?.name || member.invited_email || 'Pending'}
              </CardTitle>
              {member.relationship && (
                <p className="text-sm text-gray-500">{member.relationship}</p>
              )}
            </div>
          </div>
          
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Manage Member</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowPermissions(!showPermissions)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Permissions
                </DropdownMenuItem>
                {member.member_type !== 'primary' && (
                  <DropdownMenuItem 
                    onClick={() => onRemove(member.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Member
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Member Status */}
        <div className="flex items-center justify-between">
          {getMemberTypeBadge(member.member_type)}
          <Badge variant={member.invitation_status === 'active' ? 'default' : 'secondary'}>
            {member.invitation_status}
          </Badge>
        </div>

        {/* Age and Permission Level */}
        <div className="space-y-2">
          {member.age && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{member.age} years</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Access Level:</span>
            <span className={`font-medium ${getPermissionLevel(member.permission_level).color}`}>
              {getPermissionLevel(member.permission_level).label}
            </span>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              member.can_view_progress ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600 mt-1">Progress</p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              member.can_view_mood_data ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <Heart className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600 mt-1">Mood</p>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              member.can_receive_alerts ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-600 mt-1">Alerts</p>
          </div>
        </div>

        {/* Detailed Permissions (Expandable) */}
        {showPermissions && canManage && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">View Progress</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePermission('can_view_progress', member.can_view_progress)}
                >
                  {member.can_view_progress ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">View Mood Data</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePermission('can_view_mood_data', member.can_view_mood_data)}
                >
                  {member.can_view_mood_data ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Receive Alerts</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePermission('can_receive_alerts', member.can_receive_alerts)}
                >
                  {member.can_receive_alerts ? (
                    <Shield className="h-4 w-4 text-green-600" />
                  ) : (
                    <Shield className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {member.invitation_status === 'active' && member.user_id && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            {(member.member_type === 'child' || member.member_type === 'teen') && (
              <Button variant="outline" size="sm" className="flex-1">
                <Shield className="h-4 w-4 mr-2" />
                Safety Check
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
