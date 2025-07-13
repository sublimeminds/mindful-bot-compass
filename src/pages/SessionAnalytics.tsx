import React, { useState } from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Brain, TrendingUp, Calendar } from 'lucide-react';

const SessionAnalytics = () => {
  return (
    <DashboardLayoutWithSidebar>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-therapy-800">Session Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-therapy-50 to-therapy-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-therapy-600" />
                <div>
                  <p className="text-sm font-medium text-therapy-700">Session Transcripts</p>
                  <p className="text-2xl font-bold text-therapy-800">Coming Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default SessionAnalytics;