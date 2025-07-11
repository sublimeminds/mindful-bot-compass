import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Cookie, Settings, Shield, BarChart3, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsentPopup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [loading, setLoading] = useState(false);

  // Check if consent has been given
  useEffect(() => {
    const checkConsentStatus = async () => {
      // Check localStorage first for non-authenticated users
      const localConsent = localStorage.getItem('cookie-consent');
      if (localConsent) {
        const consent = JSON.parse(localConsent);
        setPreferences(consent);
        return;
      }

      // If user is authenticated, check database
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_consent')
            .select('*')
            .eq('user_id', user.id)
            .eq('consent_type', 'cookies')
            .single();

          if (!error && data) {
            // User has already given consent
            return;
          }
        } catch (error) {
          console.error('Error checking consent:', error);
        }
      }

      // Show banner if no consent found
      setShowBanner(true);
    };

    checkConsentStatus();
  }, [user]);

  const handleAcceptAll = async () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    await saveConsent(allAccepted);
  };

  const handleAcceptSelected = async () => {
    await saveConsent(preferences);
  };

  const handleRejectAll = async () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    await saveConsent(essentialOnly);
  };

  const saveConsent = async (prefs: CookiePreferences) => {
    setLoading(true);
    
    try {
      // Save to localStorage immediately
      localStorage.setItem('cookie-consent', JSON.stringify(prefs));
      localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());

      // If user is authenticated, save to database
      if (user) {
        const { error } = await supabase.rpc('update_consent', {
          user_id_param: user.id,
          consent_type_param: 'cookies',
          granted_param: true,
          user_ip: null, // Browser can't access real IP
          user_agent_param: navigator.userAgent,
        });

        if (error) {
          console.error('Error saving consent to database:', error);
        }

        // Save detailed cookie preferences
        const { error: prefError } = await supabase
          .from('privacy_preferences')
          .upsert({
            user_id: user.id,
            analytics_consent: prefs.analytics,
            marketing_consent: prefs.marketing,
            cookie_preferences: prefs as any,
          }, {
            onConflict: 'user_id'
          });

        if (prefError) {
          console.error('Error saving cookie preferences:', prefError);
        }
      }

      setShowBanner(false);
      setShowSettings(false);
      
      toast({
        title: "Cookie preferences saved",
        description: "Your cookie preferences have been updated successfully.",
      });

      // Apply preferences to analytics and marketing tools
      applyPreferences(prefs);
    } catch (error) {
      console.error('Error saving consent:', error);
      toast({
        title: "Error",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Apply analytics preferences
    if (prefs.analytics) {
      // Enable analytics tracking
      console.log('Analytics cookies enabled');
    } else {
      // Disable analytics tracking
      console.log('Analytics cookies disabled');
    }

    // Apply marketing preferences
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    } else {
      // Disable marketing cookies
      console.log('Marketing cookies disabled');
    }

    // Functional cookies
    if (prefs.functional) {
      console.log('Functional cookies enabled');
    } else {
      console.log('Functional cookies disabled');
    }
  };

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      required: true,
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      icon: Settings,
      required: false,
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and marketing content.',
      icon: Target,
      required: false,
    },
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
        <Card className="max-w-7xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <Cookie className="h-6 w-6 text-therapy-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">We use cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your browsing experience, provide personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRejectAll}
                  disabled={loading}
                >
                  Reject All
                </Button>
                
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cookie Preferences</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Manage your cookie preferences below. You can change these settings at any time.
                      </p>
                      
                      {cookieCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <div key={category.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5 text-therapy-600" />
                                <div>
                                  <h4 className="font-medium">{category.title}</h4>
                                  {category.required && (
                                    <Badge variant="secondary" className="text-xs mt-1">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Switch
                                checked={preferences[category.id as keyof CookiePreferences]}
                                onCheckedChange={(checked) => {
                                  if (!category.required) {
                                    setPreferences(prev => ({
                                      ...prev,
                                      [category.id]: checked
                                    }));
                                  }
                                }}
                                disabled={category.required}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        );
                      })}
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleAcceptSelected} 
                          disabled={loading}
                          className="flex-1"
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleAcceptAll}
                  disabled={loading}
                  size="sm"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsentPopup;