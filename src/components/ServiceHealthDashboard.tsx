import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { serviceHealthManager } from '@/utils/serviceHealthManager';
import SafeErrorBoundary from './SafeErrorBoundary';

const ServiceHealthDashboard: React.FC = () => {
  const [services, setServices] = useState(serviceHealthManager.getAllServices());
  const [healthSummary, setHealthSummary] = useState(serviceHealthManager.getHealthSummary());

  useEffect(() => {
    const updateStatus = () => {
      setServices(serviceHealthManager.getAllServices());
      setHealthSummary(serviceHealthManager.getHealthSummary());
    };

    // Initial update
    updateStatus();

    // Subscribe to status changes
    const unsubscribe = serviceHealthManager.onStatusChange(updateStatus);

    return unsubscribe;
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      loaded: 'default',
      failed: 'destructive',
      loading: 'secondary',
      unavailable: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleRefreshHealth = () => {
    // Force a health check
    serviceHealthManager.startHealthChecks(1000); // Quick check
    setTimeout(() => {
      serviceHealthManager.startHealthChecks(); // Resume normal interval
    }, 5000);
  };

  const healthPercentage = Math.round(healthSummary.healthy * 100);
  const isHealthy = healthPercentage >= 75;

  return (
    <SafeErrorBoundary name="ServiceHealthDashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-orange-500'}`} />
              Service Health Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{healthSummary.loaded}</div>
                <div className="text-sm text-muted-foreground">Loaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{healthSummary.loading}</div>
                <div className="text-sm text-muted-foreground">Loading</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{healthSummary.unavailable}</div>
                <div className="text-sm text-muted-foreground">Unavailable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{healthSummary.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">
                  Overall Health: {healthPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {healthSummary.loaded} of {healthSummary.total} services healthy
                </div>
              </div>
              <Button onClick={handleRefreshHealth} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className={`h-2 rounded-full transition-all ${
                  isHealthy ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Individual Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Attempts: {service.attempts} | Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                      </div>
                      {service.error && (
                        <div className="text-sm text-red-600 mt-1">
                          Error: {service.error}
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>

            {services.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No services registered
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SafeErrorBoundary>
  );
};

export default ServiceHealthDashboard;