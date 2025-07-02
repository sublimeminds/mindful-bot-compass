import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Server, TrendingUp } from 'lucide-react';

const GlobalScaleDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-global-50 to-scale-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-global-900 mb-2">Global Scale Infrastructure</h1>
          <p className="text-global-600 text-lg">Phase 15 Week 1: Worldwide deployment and scaling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Active Regions</CardTitle>
              <Globe className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">15</div>
              <p className="text-xs text-global-600">Worldwide coverage</p>
              <Badge variant="default" className="text-xs mt-2">Global</Badge>
            </CardContent>
          </Card>

          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Global Users</CardTitle>
              <Users className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">163,769</div>
              <p className="text-xs text-global-600">Active worldwide</p>
              <Badge variant="secondary" className="text-xs mt-2">Growing</Badge>
            </CardContent>
          </Card>

          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Edge Servers</CardTitle>
              <Server className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">247</div>
              <p className="text-xs text-global-600">Distributed globally</p>
              <Badge variant="default" className="text-xs mt-2">Optimized</Badge>
            </CardContent>
          </Card>

          <Card className="border-global-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-global-700">Avg Latency</CardTitle>
              <TrendingUp className="h-4 w-4 text-global-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-global-900">18ms</div>
              <p className="text-xs text-global-600">Global average</p>
              <Badge variant="default" className="text-xs mt-2">Excellent</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalScaleDashboard;