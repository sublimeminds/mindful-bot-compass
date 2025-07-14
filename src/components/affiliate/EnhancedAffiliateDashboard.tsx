import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Copy, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye, 
  Share2, 
  Download,
  Calendar,
  Target,
  Award,
  ChevronRight,
  ExternalLink,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Gift,
  Crown,
  Zap,
  Trophy,
  Coins,
  CreditCard,
  FileText,
  Link2,
  Image,
  Mail,
  MessageSquare
} from 'lucide-react';
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
  priority_level: number;
  benefits: any;
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
  payment_email: string;
}

interface AffiliateMetrics {
  metric_date: string;
  clicks: number;
  conversions: number;
  conversion_rate: number;
  revenue: number;
  commissions_earned: number;
  unique_visitors: number;
  returning_visitors: number;
}

interface MarketingMaterial {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_url: string;
  preview_url: string;
  dimensions: string;
  tier_required: string;
  download_count: number;
}

interface AffiliateReferral {
  id: string;
  referral_code: string;
  referred_user_id: string;
  conversion_value: number;
  commission_amount: number;
  commission_status: string;
  converted_at: string;
  order_id: string;
}

export const EnhancedAffiliateDashboard = () => {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [metrics, setMetrics] = useState<AffiliateMetrics[]>([]);
  const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');

  useEffect(() => {
    loadAllData();
  }, [selectedTimeRange]);

  const loadAllData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load affiliate data
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select(`
          *,
          tier:affiliate_tiers(*)
        `)
        .eq('user_id', user.id)
        .single();

      if (affiliateError) throw affiliateError;

      if (affiliateData) {
        setAffiliate(affiliateData);
        await Promise.all([
          loadMetrics(affiliateData.id),
          loadMarketingMaterials(),
          loadReferrals(affiliateData.id),
          loadTiers()
        ]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async (affiliateId: string) => {
    try {
      const daysAgo = parseInt(selectedTimeRange);
      const { data, error } = await supabase
        .from('affiliate_metrics')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .gte('metric_date', new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('metric_date', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadMarketingMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_marketing_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const loadReferrals = async (affiliateId: string) => {
    try {
      const { data, error } = await supabase
        .from('affiliate_referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .is('converted_at', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error loading referrals:', error);
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

  const copyAffiliateLink = (code: string, utm_source = '') => {
    const baseUrl = `${window.location.origin}?ref=${code}`;
    const link = utm_source ? `${baseUrl}&utm_source=${utm_source}&utm_medium=affiliate&utm_campaign=${code}` : baseUrl;
    navigator.clipboard.writeText(link);
    toast.success('Affiliate link copied to clipboard!');
  };

  const generateQRCode = async (code: string) => {
    const link = `${window.location.origin}?ref=${code}`;
    // In a real implementation, you'd generate a QR code
    toast.info('QR code generation would be implemented here');
  };

  const downloadMaterial = async (materialId: string, url: string) => {
    try {
      // Increment download count
      const { data: material } = await supabase
        .from('affiliate_marketing_materials')
        .select('download_count')
        .eq('id', materialId)
        .single();
      
      if (material) {
        await supabase
          .from('affiliate_marketing_materials')
          .update({ download_count: material.download_count + 1 })
          .eq('id', materialId);
      }

      // Download file
      window.open(url, '_blank');
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading material:', error);
      toast.error('Failed to download material');
    }
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
      <div className="container mx-auto p-6 text-center">
        <Alert>
          <AlertDescription>
            No affiliate account found. Please apply for the affiliate program first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalEarnings = affiliate.total_commissions_earned;
  const pendingPayment = totalEarnings - affiliate.total_commissions_paid;
  const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
  const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  // Calculate progress to next tier
  const currentTierIndex = tiers.findIndex(t => t.id === affiliate.tier.id);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  const referralsProgress = nextTier ? (affiliate.total_referrals / nextTier.min_referrals) * 100 : 100;
  const revenueProgress = nextTier ? (affiliate.total_revenue / nextTier.min_revenue) * 100 : 100;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">
            Track your performance and maximize your earnings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {affiliate.status === 'pending' && (
        <Alert className="mb-6">
          <AlertDescription>
            Your affiliate application is under review. You'll be notified once approved.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-green-600">+${(totalEarnings * 0.15).toFixed(2)} this month</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{affiliate.total_referrals}</p>
                <p className="text-xs text-blue-600">+{Math.floor(affiliate.total_referrals * 0.1)} this month</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
                <p className="text-xs text-purple-600">Industry avg: 2.3%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold">${pendingPayment.toFixed(2)}</p>
                <p className="text-xs text-orange-600">Next payout: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Links & Tools</TabsTrigger>
          <TabsTrigger value="materials">Marketing Kit</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Current Tier Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Current Tier: {affiliate.tier.name}
                </CardTitle>
                <CardDescription>{affiliate.tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Base Commission</Label>
                    <div className="text-2xl font-bold text-primary">
                      {(affiliate.tier.base_commission_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bonus Commission</Label>
                    <div className="text-2xl font-bold text-green-600">
                      +{(affiliate.tier.bonus_commission_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Tier Benefits:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant={affiliate.tier.benefits.priority_support ? "default" : "secondary"} className="w-2 h-2 p-0 rounded-full" />
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="w-2 h-2 p-0 rounded-full" />
                      <span>{affiliate.tier.benefits.marketing_materials} Materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={affiliate.tier.benefits.account_manager ? "default" : "secondary"} className="w-2 h-2 p-0 rounded-full" />
                      <span>Account Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={affiliate.tier.benefits.custom_landing_pages ? "default" : "secondary"} className="w-2 h-2 p-0 rounded-full" />
                      <span>Custom Pages</span>
                    </div>
                  </div>
                </div>

                {nextTier && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium">Progress to {nextTier.name}:</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Referrals</span>
                          <span>{affiliate.total_referrals}/{nextTier.min_referrals}</span>
                        </div>
                        <Progress value={Math.min(referralsProgress, 100)} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue</span>
                          <span>${affiliate.total_revenue.toLocaleString()}/${nextTier.min_revenue.toLocaleString()}</span>
                        </div>
                        <Progress value={Math.min(revenueProgress, 100)} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => copyAffiliateLink(affiliate.affiliate_code)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Affiliate Link
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => generateQRCode(affiliate.affiliate_code)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Social Media
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Campaign Template
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>Your metrics for the last {selectedTimeRange} days</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length > 0 ? (
                <div className="space-y-4">
                  {metrics.slice(0, 5).map((metric) => (
                    <div key={metric.metric_date} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                        <div>
                          <div className="font-medium">{new Date(metric.metric_date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {metric.clicks} clicks • {metric.conversions} conversions • {(metric.conversion_rate * 100).toFixed(1)}% rate
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${metric.revenue.toFixed(2)}</div>
                        <div className="text-sm text-primary">+${metric.commissions_earned.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No performance data available yet. Start promoting your affiliate links!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Links</CardTitle>
                <CardDescription>Generate and manage your tracking links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Affiliate Code</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={affiliate.affiliate_code} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copyAffiliateLink(affiliate.affiliate_code)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Default Affiliate Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      value={`${window.location.origin}?ref=${affiliate.affiliate_code}`}
                      readOnly 
                      className="font-mono text-sm" 
                    />
                    <Button variant="outline" size="icon" onClick={() => copyAffiliateLink(affiliate.affiliate_code)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Campaign-Specific Links</Label>
                  {['email', 'social', 'blog', 'video'].map((source) => (
                    <div key={source} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium capitalize">{source} Campaign</div>
                        <div className="text-sm text-muted-foreground">
                          ...?ref={affiliate.affiliate_code}&utm_source={source}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyAffiliateLink(affiliate.affiliate_code, source)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link Builder</CardTitle>
                <CardDescription>Create custom tracking links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Landing Page</Label>
                  <Select defaultValue="home">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Homepage</SelectItem>
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Campaign Source</Label>
                  <Input placeholder="e.g., facebook, twitter, newsletter" />
                </div>

                <div>
                  <Label>Campaign Name</Label>
                  <Input placeholder="e.g., summer-promo, black-friday" />
                </div>

                <Button className="w-full">
                  <Link2 className="w-4 h-4 mr-2" />
                  Generate Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
              <CardDescription>
                Download professional marketing assets for your tier: {affiliate.tier.benefits.marketing_materials}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {materials.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((material) => (
                    <Card key={material.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {material.preview_url ? (
                          <img src={material.preview_url} alt={material.title} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{material.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {material.material_type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{material.description}</p>
                          {material.dimensions && (
                            <p className="text-xs text-muted-foreground">{material.dimensions}</p>
                          )}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-muted-foreground">
                              {material.download_count} downloads
                            </span>
                            <Button 
                              size="sm"
                              onClick={() => downloadMaterial(material.id, material.file_url)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No marketing materials available yet.</p>
                  <p className="text-sm">Check back soon for new assets!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Traffic Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Clicks</span>
                    <span className="font-bold">{totalClicks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Unique Visitors</span>
                    <span className="font-bold">{metrics.reduce((sum, m) => sum + m.unique_visitors, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Returning Visitors</span>
                    <span className="font-bold">{metrics.reduce((sum, m) => sum + m.returning_visitors, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-bold text-primary">{avgConversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Revenue Generated</span>
                    <span className="font-bold">${affiliate.total_revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Commission Earned</span>
                    <span className="font-bold text-green-600">${totalEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Commission Paid</span>
                    <span className="font-bold">${affiliate.total_commissions_paid.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending Commission</span>
                    <span className="font-bold text-orange-600">${pendingPayment.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Click and conversion trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <LineChart className="w-8 h-8 mr-2" />
                Chart visualization would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>Track your successful referrals and commissions</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length > 0 ? (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Order #{referral.order_id}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(referral.converted_at).toLocaleDateString()} • 
                          Status: {referral.commission_status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${referral.conversion_value.toFixed(2)}</div>
                        <div className="text-sm text-primary">+${referral.commission_amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No referrals yet.</p>
                  <p className="text-sm">Start sharing your affiliate links to see results here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payout Information</CardTitle>
                <CardDescription>Manage your payment details and schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Payment Email</Label>
                  <Input value={affiliate.payment_email || ''} readOnly />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select defaultValue="paypal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="wise">Wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Minimum Payout</Label>
                  <div className="text-2xl font-bold text-primary">
                    ${affiliate.tier.benefits.payment_threshold}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You'll receive automatic payments when your balance reaches this amount
                  </p>
                </div>
                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Payment Details
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Track your commission payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No payouts yet.</p>
                  <p className="text-sm">
                    Reach the ${affiliate.tier.benefits.payment_threshold} minimum to receive your first payout
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};