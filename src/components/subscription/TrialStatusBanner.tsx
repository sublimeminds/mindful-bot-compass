
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const TrialStatusBanner = () => {
  const { user } = useSimpleApp();

  if (!user) return null;

  // Mock trial status
  const daysRemaining = 7;
  const isTrialActive = daysRemaining > 0;

  if (!isTrialActive) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
            Free Trial
          </Badge>
          <p className="text-sm text-blue-700">
            You have {daysRemaining} days remaining in your free trial.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-900">{daysRemaining}</p>
          <p className="text-xs text-blue-600">days left</p>
        </div>
      </div>
    </div>
  );
};

export default TrialStatusBanner;
