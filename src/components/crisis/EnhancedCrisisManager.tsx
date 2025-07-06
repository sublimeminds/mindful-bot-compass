import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { crisisDetectionService } from '@/services/crisisDetectionService';

const EnhancedCrisisManager: React.FC = () => {
  const { user } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const crisisResources = crisisDetectionService.getCrisisResources('severe');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Crisis Monitoring</span>
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Clear</h3>
              <p className="text-gray-600">No active crisis alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert: any, index) => (
                <Alert key={index} className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>Crisis alert detected</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crisis Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {crisisResources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-medium">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                <Button size="sm" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{resource.phone}</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCrisisManager;