
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TrialService, TrialInfo } from '@/services/trialService';
import { useNavigate } from 'react-router-dom';

const TrialStatusBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrialInfo();
    }
  }, [user]);

  const loadTrialInfo = async () => {
    if (!user) return;
    
    try {
      const info = await TrialService.getTrialInfo(user.id);
      setTrialInfo(info);
      
      // Check for expiration warnings
      if (info.isOnTrial) {
        TrialService.checkTrialExpiration(info);
      }
    } catch (error) {
      console.error('Error loading trial info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trialInfo?.isOnTrial) return null;

  const getBannerColor = () => {
    if (trialInfo.daysRemaining <= 1) return 'border-red-200 bg-red-50';
    if (trialInfo.daysRemaining <= 3) return 'border-orange-200 bg-orange-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getTextColor = () => {
    if (trialInfo.daysRemaining <= 1) return 'text-red-800';
    if (trialInfo.daysRemaining <= 3) return 'text-orange-800';
    return 'text-blue-800';
  };

  return (
    <Alert className={`${getBannerColor()} border-l-4 mb-4`}>
      <Crown className={`h-4 w-4 ${getTextColor()}`} />
      <AlertDescription className="flex items-center justify-between">
        <div className={`${getTextColor()}`}>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">
              {trialInfo.daysRemaining > 0 
                ? `${trialInfo.daysRemaining} day${trialInfo.daysRemaining === 1 ? '' : 's'} left in your ${trialInfo.planName} trial`
                : 'Your trial has expired'
              }
            </span>
          </div>
          <p className="text-sm mt-1">
            {trialInfo.daysRemaining > 0 
              ? 'Enjoying premium features? Upgrade now to continue after your trial ends.'
              : 'Please upgrade to continue using premium features.'
            }
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <Button
            size="sm"
            onClick={() => navigate('/plans')}
            className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Upgrade Now
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TrialStatusBanner;
