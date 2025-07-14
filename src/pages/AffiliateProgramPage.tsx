import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star, 
  Crown, 
  Zap,
  Gift,
  Target,
  Calculator,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const EarningsCalculator = ({ tiers }: { tiers: AffiliateTier[] }) => {
  const [referrals, setReferrals] = useState(10);
  const [avgOrderValue, setAvgOrderValue] = useState(99);

  const calculateEarnings = () => {
    const revenue = referrals * avgOrderValue;
    const applicableTier = tiers
      .filter(t => revenue >= t.min_revenue && referrals >= t.min_referrals)
      .sort((a, b) => b.priority_level - a.priority_level)[0];

    if (!applicableTier) return { monthly: 0, yearly: 0, tier: 'Starter' };

    const commission = revenue * (applicableTier.base_commission_rate + applicableTier.bonus_commission_rate);
    return {
      monthly: commission,
      yearly: commission * 12,
      tier: applicableTier.name
    };
  };

  const earnings = calculateEarnings();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Earnings Calculator
        </CardTitle>
        <CardDescription>
          See your potential monthly earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Monthly Referrals</label>
          <input
            type="range"
            min="1"
            max="100"
            value={referrals}
            onChange={(e) => setReferrals(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">{referrals} referrals</div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Average Order Value</label>
          <input
            type="range"
            min="29"
            max="299"
            value={avgOrderValue}
            onChange={(e) => setAvgOrderValue(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">${avgOrderValue}</div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Tier</span>
            <Badge variant="secondary">{earnings.tier}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Monthly Earnings</span>
            <span className="font-bold text-lg text-primary">${earnings.monthly.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Yearly Potential</span>
            <span className="font-bold text-xl text-green-600">${earnings.yearly.toFixed(0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TierCard = ({ tier, isPopular = false }: { tier: AffiliateTier; isPopular?: boolean }) => {
  const tierIcons = {
    Starter: Users,
    Bronze: Target,
    Silver: TrendingUp,
    Gold: Star,
    Platinum: Crown,
    Diamond: Sparkles
  };

  const TierIcon = tierIcons[tier.name as keyof typeof tierIcons] || Users;

  return (
    <Card className={`relative ${isPopular ? 'ring-2 ring-primary scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <TierIcon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription className="text-sm">{tier.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {((tier.base_commission_rate + tier.bonus_commission_rate) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Total Commission</div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Min Referrals:</span>
            <span className="font-medium">{tier.min_referrals}</span>
          </div>
          <div className="flex justify-between">
            <span>Min Revenue:</span>
            <span className="font-medium">${tier.min_revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Payout Threshold:</span>
            <span className="font-medium">${tier.benefits.payment_threshold}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Benefits:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-600" />
              <span>{tier.benefits.marketing_materials} marketing materials</span>
            </div>
            {tier.benefits.priority_support && (
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-600" />
                <span>Priority support</span>
              </div>
            )}
            {tier.benefits.account_manager && (
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-600" />
                <span>Personal account manager</span>
              </div>
            )}
            {tier.benefits.custom_landing_pages && (
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-600" />
                <span>Custom landing pages</span>
              </div>
            )}
            {tier.benefits.monthly_calls && (
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3 text-green-600" />
                <span>Monthly strategy calls</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AffiliateProgramPage = () => {
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    totalPaidOut: 0,
    averageEarnings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('affiliate_tiers')
        .select('*')
        .eq('is_active', true)
        .order('priority_level');

      if (tiersError) throw tiersError;
      setTiers(tiersData || []);

      // Load stats (mock data for now)
      setStats({
        totalAffiliates: 1247,
        totalPaidOut: 285000,
        averageEarnings: 1850
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProgram = () => {
    navigate('/affiliate/signup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Earn up to 30% Commission
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Turn Your Network Into
                  <span className="text-primary"> Passive Income</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Join our affiliate program and earn substantial commissions by referring people to our therapy platform. No experience required - we provide everything you need to succeed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleJoinProgram} className="flex items-center gap-2">
                  Join the Program
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalAffiliates.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Active Affiliates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${stats.totalPaidOut.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Paid Out</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${stats.averageEarnings.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Avg Monthly Earnings</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <EarningsCalculator tiers={tiers} />
            </div>
          </div>
        </div>
      </section>

      {/* Tier Showcase */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              6-Tier Commission Structure
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advance through our tier system and unlock higher commissions, exclusive benefits, and premium support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <TierCard 
                key={tier.id} 
                tier={tier} 
                isPopular={tier.name === 'Silver'} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose Our Affiliate Program?
            </h2>
            <p className="text-xl text-muted-foreground">
              We provide everything you need to succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">High Commissions</h3>
              <p className="text-muted-foreground">
                Earn up to 30% commission on every successful referral with our industry-leading rates
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Marketing Materials</h3>
              <p className="text-muted-foreground">
                Access professional banners, email templates, and social media content to maximize conversions
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, conversions, and earnings with detailed analytics and performance insights
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Approval</h3>
              <p className="text-muted-foreground">
                Get approved quickly and start earning commissions within hours of joining
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Get help from our affiliate success team and exclusive training resources
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Tier Progression</h3>
              <p className="text-muted-foreground">
                Unlock exclusive benefits, higher commissions, and premium support as you grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of affiliates already earning passive income with our program
          </p>
          <Button size="lg" onClick={handleJoinProgram} className="px-8">
            Get Started Now
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};