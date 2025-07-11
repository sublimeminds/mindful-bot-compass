import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Heart,
  Settings,
  Plus,
  Bell
} from 'lucide-react';
import { useFamily } from '@/hooks/useFamily';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FamilyDashboard = () => {
  const {
    household,
    members,
    alerts,
    isLoadingHousehold,
    isLoadingMembers,
    isLoadingAlerts,
    acknowledgeAlert,
    isAcknowledging
  } = useFamily();

  if (isLoadingHousehold || isLoadingMembers) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
            Family Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {household?.name || 'Family'} • {members?.length || 0} members
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-therapy-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-700">Total Members</p>
                <p className="text-2xl font-bold text-therapy-800">{members?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-therapy-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-harmony-200 bg-gradient-to-r from-harmony-25 to-harmony-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-harmony-700">Active Alerts</p>
                <p className="text-2xl font-bold text-harmony-800">{alerts?.length || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-harmony-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-flow-200 bg-gradient-to-r from-flow-25 to-flow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-flow-700">Plan Type</p>
                <p className="text-lg font-bold text-flow-800">{household?.plan_type || 'Individual'}</p>
              </div>
              <Shield className="h-8 w-8 text-flow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-calm-200 bg-gradient-to-r from-calm-25 to-calm-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-calm-700">Wellness Score</p>
                <p className="text-2xl font-bold text-calm-800">82%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-calm-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-therapy-600" />
            Family Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.profiles?.avatar_url} />
                    <AvatarFallback>
                      {member.profiles?.name?.split(' ').map(n => n[0]).join('') || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.profiles?.name || 'Family Member'}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{member.member_type}</Badge>
                      <Badge variant={member.invitation_status === 'active' ? 'default' : 'secondary'}>
                        {member.invitation_status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Alerts */}
      {alerts && alerts.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Bell className="h-5 w-5 mr-2" />
              Family Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border border-orange-200 rounded-lg bg-orange-25">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-orange-800">{alert.title}</h3>
                      <Badge 
                        variant={alert.severity === 'high' || alert.severity === 'critical' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700 mb-2">{alert.description}</p>
                    <p className="text-xs text-orange-600">
                      Member: {alert.member_profile?.name} • {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                    disabled={isAcknowledging}
                  >
                    {isAcknowledging ? 'Acknowledging...' : 'Acknowledge'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyDashboard;