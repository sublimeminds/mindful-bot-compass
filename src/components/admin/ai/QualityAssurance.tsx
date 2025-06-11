
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const QualityAssurance = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-400" />
            Quality Assurance & Safety
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Safety Score</h3>
              <p className="text-2xl font-bold text-green-400">99.8%</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Flagged Responses</h3>
              <p className="text-2xl font-bold text-yellow-400">23</p>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Crisis Interventions</h3>
              <p className="text-2xl font-bold text-blue-400">12</p>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400">
            <p>Advanced quality assurance features coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssurance;
