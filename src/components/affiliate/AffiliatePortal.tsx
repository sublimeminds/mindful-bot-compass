import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, DollarSign, Users, TrendingUp, Eye, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AffiliateTier {
  id: string;
  name: string;
  description: string;
  min_referrals: number;
  min_revenue: number;
  base_commission_rate: number;
  bonus_commission_rate: number;
}

interface AffiliateData {
  id: string;
  affiliate_code: string;
  status: string;
  total_referrals: number;
  total_revenue: number;
  total_commissions_earned: number;
  total_commissions_paid: number;
  tier: AffiliateTier;
}

interface AffiliateMetrics {
  metric_date: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  commissions_earned: number;
}

export const AffiliatePortal = () => {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [metrics, setMetrics] = useState<AffiliateMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadAffiliateData();
    loadTiers();
  }, []);

  const loadAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get affiliate data
      const { data: affiliateData, error } = await supabase
        .from('affiliates')
        .select(`
          *,
          tier:affiliate_tiers(*)
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading affiliate:', error);
        return;
      }

      if (affiliateData) {
        setAffiliate(affiliateData);
        loadMetrics(affiliateData.id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_tiers')
        .select('*')
        .eq('is_active', true)
        .order('priority_level');

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Error loading tiers:', error);
    }
  };

  const loadMetrics = async (affiliateId: string) => {
    try {
      const { data, error } = await supabase
        .from('affiliate_metrics')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const applyForAffiliate = async () => {
    try {
      setApplying(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate unique affiliate code
      const affiliateCode = `${user.email?.split('@')[0]}_${Math.random().toString(36).substr(2, 6)}`.toUpperCase();
      
      // Get default tier (Bronze)
      const defaultTier = tiers.find(t => t.name === 'Bronze');
      if (!defaultTier) throw new Error('Default tier not found');

      const { data, error } = await supabase
        .from('affiliates')
        .insert({
          user_id: user.id,
          affiliate_code: affiliateCode,
          tier_id: defaultTier.id,
          status: 'pending',
          payment_email: user.email
        })
        .select(`
          *,
          tier:affiliate_tiers(*)
        `)
        .single();

      if (error) throw error;

      setAffiliate(data);
      toast.success('Affiliate application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to submit affiliate application');
    } finally {
      setApplying(false);
    }
  };

  const copyAffiliateLink = (code: string) => {
    const link = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied to clipboard!');
  };

  const generateShareLink = (platform: string, code: string) => {
    const baseUrl = encodeURIComponent(`${window.location.origin}?ref=${code}`);
    const text = encodeURIComponent('Check out this amazing therapy platform!');
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${baseUrl}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${baseUrl}`,
      email: `mailto:?subject=${text}&body=Check out this link: ${baseUrl}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Affiliate Program</h1>
          <p className="text-lg text-muted-foreground">
            Join our affiliate program and earn commissions by referring new users
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-8">
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.name === 'Bronze' ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {(tier.base_commission_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Base Commission</div>
                  {tier.bonus_commission_rate > 0 && (
                    <div className="text-sm">
                      +{(tier.bonus_commission_rate * 100).toFixed(1)}% bonus
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="text-xs space-y-1">
                    <div>Min Referrals: {tier.min_referrals}</div>
                    <div>Min Revenue: ${tier.min_revenue}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={applyForAffiliate} 
            disabled={applying}
            size="lg"
            className="px-8"
          >
            {applying ? 'Applying...' : 'Apply for Affiliate Program'}
          </Button>
        </div>
      </div>
    );
  }

  const totalEarnings = affiliate.total_commissions_earned;
  const pendingPayment = totalEarnings - affiliate.total_commissions_paid;
  const conversionRate = metrics.length > 0 
    ? metrics.reduce((acc, m) => acc + m.conversion_rate, 0) / metrics.length 
    : 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">
            Track your performance and earnings
          </p>
        </div>
        <Badge 
          variant={affiliate.status === 'active' ? 'default' : 'secondary'}
          className="text-sm px-3 py-1"
        >
          {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
        </Badge>
      </div>

      {affiliate.status === 'pending' && (
        <Alert className="mb-6">
          <AlertDescription>
            Your affiliate application is pending approval. You'll be notified once it's approved.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Referrals</p>
                <p className="text-2xl font-bold">{affiliate.total_referrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Conversion Rate</p>
                <p className="text-2xl font-bold">{(conversionRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Pending Payment</p>
                <p className="text-2xl font-bold">${pendingPayment.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Affiliate Links</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Tier: {affiliate.tier.name}</CardTitle>
              <CardDescription>{affiliate.tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Commission Rate</Label>
                  <div className="text-2xl font-bold text-primary">
                    {(affiliate.tier.base_commission_rate * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bonus Rate</Label>
                  <div className="text-2xl font-bold text-green-600">
                    +{(affiliate.tier.bonus_commission_rate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Affiliate Links</CardTitle>
              <CardDescription>
                Share these links to earn commissions on referrals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Affiliate Code</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={affiliate.affiliate_code} 
                    readOnly 
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Affiliate Link</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={`${window.location.origin}?ref=${affiliate.affiliate_code}`}
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Label>Share on Social Media</Label>
                <div className="flex space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateShareLink('twitter', affiliate.affiliate_code)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateShareLink('facebook', affiliate.affiliate_code)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateShareLink('linkedin', affiliate.affiliate_code)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateShareLink('email', affiliate.affiliate_code)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>
                Your referral performance over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length > 0 ? (
                <div className="space-y-4">
                  {metrics.slice(0, 10).map((metric) => (
                    <div key={metric.metric_date} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{metric.metric_date}</div>
                        <div className="text-sm text-muted-foreground">
                          {metric.clicks} clicks • {metric.conversions} conversions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${metric.revenue.toFixed(2)} revenue</div>
                        <div className="text-sm text-muted-foreground">
                          ${metric.commissions_earned.toFixed(2)} commission
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No referral data yet. Start sharing your affiliate links!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Track your commission payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No payouts yet. Minimum payout threshold is $50.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};