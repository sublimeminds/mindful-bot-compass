import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Settings,
  ExternalLink,
  Zap,
  Shield,
  Crown,
  Users,
  Download,
  RefreshCw
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { AdvancedBillingService } from '@/services/advancedBillingService';
import { format, addDays } from 'date-fns';

export const AdvancedSubscriptionManager = () => {
  const { user } = useSimpleApp();
  const { subscription, plans, usage, loading, changePlan, cancelSubscription, refetch } = useSubscription();
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionChanges, setSubscriptionChanges] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadSubscriptionChanges();
    }
  }, [user]);

  const loadSubscriptionChanges = async () => {
    if (!user) return;
    
    try {
      const changes = await AdvancedBillingService.getSubscriptionChanges(user.id);
      setSubscriptionChanges(changes);
    } catch (error) {
      console.error('Error loading subscription changes:', error);
    }
  };

  const handleCustomerPortal = async () => {
    try {
      const portalUrl = await AdvancedBillingService.getCustomerPortalUrl();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Unable to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlanChange = async (newPlanId: string) => {
    if (!subscription) return;

    setIsProcessing(true);
    try {
      await AdvancedBillingService.changeSubscriptionPlan(subscription.id, newPlanId);
      await refetch();
      await loadSubscriptionChanges();
      setShowUpgradeDialog(false);
      
      toast({
        title: "Plan Changed",
        description: "Your subscription has been updated successfully.",
      });
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: "Error",
        description: "Failed to change plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsProcessing(true);
    try {
      await AdvancedBillingService.cancelSubscription(subscription.id, true);
      await refetch();
      setShowCancelDialog(false);
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of your billing period.",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case 'free': return Shield;
      case 'basic': return Zap;
      case 'pro': return Crown;
      case 'enterprise': return Users;
      default: return CreditCard;
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading subscription details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            No Active Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You don't have an active subscription</p>
            <Button>Subscribe Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = plans.find(p => p.id === subscription.planId);
  const PlanIcon = getPlanIcon(currentPlan?.name || '');

  return (
    <div className="space-y-6">
      {/* Main Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <PlanIcon className="h-5 w-5 mr-2" />
              Current Subscription
            </div>
            <Button variant="outline" onClick={handleCustomerPortal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{currentPlan?.name} Plan</h3>
                <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {subscription.cancelAtPeriodEnd 
                  ? `Expires on ${format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}`
                  : `Renews on ${format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${currentPlan?.priceMonthly?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>

          {/* Trial Info */}
          {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your free trial ends on {format(new Date(subscription.trialEnd), 'MMM dd, yyyy')}
              </AlertDescription>
            </Alert>
          )}

          {/* Cancellation Warning */}
          {subscription.cancelAtPeriodEnd && (
            <Alert className="border-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                Your subscription will be cancelled on {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
              </AlertDescription>
            </Alert>
          )}

          {/* Usage Metrics */}
          {usage && (
            <div className="space-y-4">
              <h4 className="font-medium">Current Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sessions</span>
                    <span className={getUsageColor(getUsagePercentage(usage.sessionsUsed, usage.sessionsLimit))}>
                      {usage.sessionsUsed} / {usage.sessionsLimit === -1 ? '∞' : usage.sessionsLimit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.sessionsUsed, usage.sessionsLimit)} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Messages</span>
                    <span className={getUsageColor(getUsagePercentage(usage.messagesUsed, usage.messagesLimit))}>
                      {usage.messagesUsed} / {usage.messagesLimit === -1 ? '∞' : usage.messagesLimit}
                    </span>
                  </div>
                  <Progress 
                    value={getUsagePercentage(usage.messagesUsed, usage.messagesLimit)} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Change Your Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className={`border rounded-lg p-4 ${plan.id === subscription.planId ? 'border-therapy-600 bg-therapy-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${plan.priceMonthly.toFixed(2)}/month
                          </p>
                        </div>
                        {plan.id === subscription.planId ? (
                          <Badge variant="secondary">Current Plan</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handlePlanChange(plan.id)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Select"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            {!subscription.cancelAtPeriodEnd && (
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Are you sure you want to cancel your subscription?</p>
                    <p className="text-sm text-muted-foreground">
                      Your subscription will remain active until {format(new Date(subscription.currentPeriodEnd), 'MMM dd, yyyy')}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                        Keep Subscription
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelSubscription}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Cancel Subscription"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription History */}
      {subscriptionChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Subscription History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptionChanges.slice(0, 5).map((change) => (
                <div key={change.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{change.changeType}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(change.effectiveDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {change.prorationAmount && (
                    <div className="text-right">
                      <div className="font-medium">
                        ${Math.abs(change.prorationAmount).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {change.prorationAmount > 0 ? 'Credit' : 'Charge'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};