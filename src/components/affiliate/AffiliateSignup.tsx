import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle,
  User,
  Briefcase,
  Target,
  FileText,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FormData {
  // Step 1: Personal Info
  businessName: string;
  websiteUrl: string;
  socialProfiles: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  
  // Step 2: Experience
  marketingExperience: string;
  marketingChannels: string[];
  expectedMonthlyReferrals: number;
  previousAffiliateExperience: string;
  
  // Step 3: Tax Info
  taxId: string;
  
  // Step 4: Marketing Plan
  marketingPlan: string;
  
  // Step 5: Agreement
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

const MARKETING_CHANNELS = [
  'Social Media',
  'Email Marketing',
  'Content Marketing',
  'Paid Advertising',
  'SEO/Organic',
  'Influencer Marketing',
  'YouTube',
  'Podcast',
  'Blog',
  'Community/Forums',
  'Word of Mouth',
  'Other'
];

const EXPERIENCE_LEVELS = [
  'No prior experience',
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '5+ years',
  'Expert (10+ years)'
];

export const AffiliateSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    websiteUrl: '',
    socialProfiles: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      tiktok: ''
    },
    marketingExperience: '',
    marketingChannels: [],
    expectedMonthlyReferrals: 10,
    previousAffiliateExperience: '',
    taxId: '',
    marketingPlan: '',
    agreedToTerms: false,
    agreedToPrivacy: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.businessName.trim()) {
          newErrors.businessName = 'Business name is required';
        }
        break;
      
      case 2:
        if (!formData.marketingExperience) {
          newErrors.marketingExperience = 'Please select your marketing experience';
        }
        if (formData.marketingChannels.length === 0) {
          newErrors.marketingChannels = 'Please select at least one marketing channel';
        }
        if (formData.expectedMonthlyReferrals < 1) {
          newErrors.expectedMonthlyReferrals = 'Expected referrals must be at least 1';
        }
        break;
      
      case 4:
        if (!formData.marketingPlan.trim() || formData.marketingPlan.length < 100) {
          newErrors.marketingPlan = 'Please provide a detailed marketing plan (minimum 100 characters)';
        }
        break;
      
      case 5:
        if (!formData.agreedToTerms) {
          newErrors.agreedToTerms = 'You must agree to the terms and conditions';
        }
        if (!formData.agreedToPrivacy) {
          newErrors.agreedToPrivacy = 'You must agree to the privacy policy';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChannelToggle = (channel: string) => {
    const isSelected = formData.marketingChannels.includes(channel);
    if (isSelected) {
      updateFormData('marketingChannels', formData.marketingChannels.filter(c => c !== channel));
    } else {
      updateFormData('marketingChannels', [...formData.marketingChannels, channel]);
    }
  };

  const submitApplication = async () => {
    if (!validateStep(5)) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to submit your application');
        return;
      }

      const { error } = await supabase
        .from('affiliate_applications')
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          website_url: formData.websiteUrl,
          social_profiles: formData.socialProfiles,
          marketing_experience: formData.marketingExperience,
          marketing_channels: formData.marketingChannels,
          expected_monthly_referrals: formData.expectedMonthlyReferrals,
          previous_affiliate_experience: formData.previousAffiliateExperience,
          tax_id: formData.taxId,
          marketing_plan: formData.marketingPlan,
          application_data: {
            submitted_at: new Date().toISOString(),
            terms_agreed: formData.agreedToTerms,
            privacy_agreed: formData.agreedToPrivacy
          }
        });

      if (error) throw error;

      toast.success('Application submitted successfully!');
      navigate('/affiliate/dashboard', { 
        state: { message: 'Your application has been submitted and is under review.' }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <p className="text-muted-foreground">Tell us about yourself and your business</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business/Brand Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  placeholder="Your business or personal brand name"
                  className={errors.businessName ? 'border-red-500' : ''}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                  placeholder="https://your-website.com"
                  type="url"
                />
              </div>

              <div className="space-y-3">
                <Label>Social Media Profiles (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(formData.socialProfiles).map((platform) => (
                    <div key={platform}>
                      <Label htmlFor={platform} className="text-sm capitalize">
                        {platform}
                      </Label>
                      <Input
                        id={platform}
                        value={formData.socialProfiles[platform as keyof typeof formData.socialProfiles]}
                        onChange={(e) => updateFormData(`socialProfiles.${platform}`, e.target.value)}
                        placeholder={`Your ${platform} profile URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Marketing Experience</h3>
                <p className="text-muted-foreground">Help us understand your marketing background</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Marketing Experience Level *</Label>
                <Select 
                  value={formData.marketingExperience} 
                  onValueChange={(value) => updateFormData('marketingExperience', value)}
                >
                  <SelectTrigger className={errors.marketingExperience ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.marketingExperience && (
                  <p className="text-sm text-red-500 mt-1">{errors.marketingExperience}</p>
                )}
              </div>

              <div>
                <Label>Marketing Channels You Use *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {MARKETING_CHANNELS.map((channel) => (
                    <div 
                      key={channel}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.marketingChannels.includes(channel)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleChannelToggle(channel)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={formData.marketingChannels.includes(channel)}
                          onChange={() => {}} // Handled by parent click
                        />
                        <span className="text-sm">{channel}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.marketingChannels && (
                  <p className="text-sm text-red-500 mt-1">{errors.marketingChannels}</p>
                )}
              </div>

              <div>
                <Label htmlFor="expectedReferrals">Expected Monthly Referrals *</Label>
                <div className="mt-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.expectedMonthlyReferrals}
                    onChange={(e) => updateFormData('expectedMonthlyReferrals', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>1</span>
                    <span className="font-medium">{formData.expectedMonthlyReferrals} referrals</span>
                    <span>100+</span>
                  </div>
                </div>
                {errors.expectedMonthlyReferrals && (
                  <p className="text-sm text-red-500 mt-1">{errors.expectedMonthlyReferrals}</p>
                )}
              </div>

              <div>
                <Label htmlFor="previousExperience">Previous Affiliate Experience</Label>
                <Textarea
                  id="previousExperience"
                  value={formData.previousAffiliateExperience}
                  onChange={(e) => updateFormData('previousAffiliateExperience', e.target.value)}
                  placeholder="Tell us about any previous affiliate marketing experience..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Tax Information</h3>
                <p className="text-muted-foreground">Required for payment processing and tax reporting</p>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This information is required for tax reporting purposes. All data is encrypted and stored securely.
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="taxId">Tax ID / SSN (Optional)</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => updateFormData('taxId', e.target.value)}
                placeholder="XXX-XX-XXXX or XX-XXXXXXX"
                type="password"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Required for earnings over $600/year. You can provide this later if needed.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Marketing Strategy</h3>
                <p className="text-muted-foreground">Share your plan for promoting our platform</p>
              </div>
            </div>

            <div>
              <Label htmlFor="marketingPlan">Your Marketing Plan *</Label>
              <Textarea
                id="marketingPlan"
                value={formData.marketingPlan}
                onChange={(e) => updateFormData('marketingPlan', e.target.value)}
                placeholder="Describe how you plan to promote our therapy platform. Include details about your target audience, content strategy, promotional channels, and any unique approaches you'll use..."
                rows={6}
                className={errors.marketingPlan ? 'border-red-500' : ''}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.marketingPlan && (
                  <p className="text-sm text-red-500">{errors.marketingPlan}</p>
                )}
                <p className="text-sm text-muted-foreground ml-auto">
                  {formData.marketingPlan.length}/100 minimum characters
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Marketing Ideas to Get You Started:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share personal wellness stories and include your affiliate link</li>
                <li>• Create educational content about mental health awareness</li>
                <li>• Write reviews about the platform on your blog or social media</li>
                <li>• Email your subscriber list about the platform's benefits</li>
                <li>• Participate in relevant online communities and forums</li>
                <li>• Create video testimonials or tutorials</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Terms & Agreement</h3>
                <p className="text-muted-foreground">Review and accept our terms to complete your application</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                <h4 className="font-medium mb-2">Affiliate Program Terms Summary:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Commission rates range from 5% to 30% based on performance tiers</li>
                  <li>• Minimum payout threshold varies by tier ($10-$50)</li>
                  <li>• Payments are processed monthly via PayPal or bank transfer</li>
                  <li>• You must disclose affiliate relationships in your promotional content</li>
                  <li>• Fraudulent activity will result in immediate termination</li>
                  <li>• We reserve the right to modify commission structures with 30-day notice</li>
                  <li>• You may not bid on our brand terms in paid advertising</li>
                  <li>• Self-referrals and fake accounts are strictly prohibited</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => updateFormData('agreedToTerms', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                      I agree to the Affiliate Program Terms and Conditions *
                    </Label>
                    {errors.agreedToTerms && (
                      <p className="text-sm text-red-500 mt-1">{errors.agreedToTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreedToPrivacy}
                    onCheckedChange={(checked) => updateFormData('agreedToPrivacy', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                      I agree to the Privacy Policy and data processing terms *
                    </Label>
                    {errors.agreedToPrivacy && (
                      <p className="text-sm text-red-500 mt-1">{errors.agreedToPrivacy}</p>
                    )}
                  </div>
                </div>
              </div>

              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Once submitted, our team will review your application within 24-48 hours. You'll receive an email notification about the decision.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/affiliate-program')}
              >
                Exit
              </Button>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle>Join Our Affiliate Program</CardTitle>
            <CardDescription>
              Complete this application to start earning commissions
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={submitApplication} 
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};