import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Cookie, Settings, Shield, BarChart3, Target, Mail } from 'lucide-react';
import { toast } from "sonner";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookiePolicy = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Load saved preferences
    const savedPrefs = localStorage.getItem('cookie-consent');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString());
    
    toast.success("Cookie preferences saved", {
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      icon: Shield,
      required: true,
      examples: [
        'Session management and authentication',
        'Security and fraud prevention',
        'Load balancing and performance',
        'GDPR consent management'
      ]
    },
    {
      id: 'functional',
      title: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization features.',
      icon: Settings,
      required: false,
      examples: [
        'Language and locale preferences',
        'Theme and accessibility settings',
        'User interface customizations',
        'Saved form data and progress'
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting anonymous information.',
      icon: BarChart3,
      required: false,
      examples: [
        'Page views and session duration',
        'User journey and navigation patterns',
        'Feature usage and error tracking',
        'Performance monitoring'
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and measure campaign effectiveness.',
      icon: Target,
      required: false,
      examples: [
        'Personalized content recommendations',
        'Social media integration',
        'Email campaign tracking',
        'Third-party advertising partners'
      ]
    }
  ];

  const cookieDetails = [
    {
      name: '_session_id',
      purpose: 'User authentication and session management',
      category: 'Essential',
      duration: 'Session',
      domain: 'therapysync.com'
    },
    {
      name: 'csrf_token',
      purpose: 'Cross-Site Request Forgery protection',
      category: 'Essential',
      duration: 'Session',
      domain: 'therapysync.com'
    },
    {
      name: 'cookie_consent',
      purpose: 'Stores your cookie preferences',
      category: 'Essential',
      duration: '1 year',
      domain: 'therapysync.com'
    },
    {
      name: 'theme_preference',
      purpose: 'Remembers your dark/light mode preference',
      category: 'Functional',
      duration: '1 year',
      domain: 'therapysync.com'
    },
    {
      name: 'language_setting',
      purpose: 'Stores your language preference',
      category: 'Functional',
      duration: '1 year',
      domain: 'therapysync.com'
    },
    {
      name: '_ga',
      purpose: 'Google Analytics - User identification',
      category: 'Analytics',
      duration: '2 years',
      domain: '.therapysync.com'
    },
    {
      name: '_ga_*',
      purpose: 'Google Analytics - Session and campaign data',
      category: 'Analytics',
      duration: '2 years',
      domain: '.therapysync.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Cookie className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Learn about how we use cookies and manage your preferences.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()} | GDPR Compliant
          </p>
        </div>

        {/* Cookie Preferences Manager */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manage Your Cookie Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cookieCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                    <IconComponent className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{category.title}</h3>
                        <Switch
                          checked={preferences[category.id as keyof CookiePreferences]}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, [category.id]: checked }))
                          }
                          disabled={category.required}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <strong>Examples:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {category.examples.map((example, idx) => (
                            <li key={idx}>{example}</li>
                          ))}
                        </ul>
                      </div>
                      {category.required && (
                        <p className="text-xs text-amber-600 mt-2 font-medium">
                          ⚠️ Required for website functionality
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button onClick={savePreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPreferences({ essential: true, functional: false, analytics: false, marketing: false })}
              >
                Essential Only
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Cookies are small text files that are stored on your device when you visit a website. 
                They help websites remember your preferences and provide a better user experience. 
                Under GDPR and EU ePrivacy laws, we need your consent before using non-essential cookies.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="text-blue-800 mb-2">🇪🇺 EU Cookie Law Compliance</h4>
                <p className="text-blue-700 text-sm">
                  We comply with the EU Cookie Law (ePrivacy Directive) and GDPR. 
                  You have full control over which cookies we can use on your device.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>2. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="text-green-800 font-semibold mb-2">🍪 First-Party Cookies</h4>
                  <p className="text-green-700 text-sm">
                    Set directly by TherapySync for core functionality and user experience.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-purple-800 font-semibold mb-2">🌐 Third-Party Cookies</h4>
                  <p className="text-purple-700 text-sm">
                    Set by external services like analytics providers (only with your consent).
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-orange-800 font-semibold mb-2">⏱️ Session Cookies</h4>
                  <p className="text-orange-700 text-sm">
                    Temporary cookies deleted when you close your browser.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-blue-800 font-semibold mb-2">💾 Persistent Cookies</h4>
                  <p className="text-blue-700 text-sm">
                    Remain on your device until they expire or you delete them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Cookie List */}
          <Card>
            <CardHeader>
              <CardTitle>3. Detailed Cookie Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Cookie Name</th>
                      <th className="text-left p-2 font-semibold">Purpose</th>
                      <th className="text-left p-2 font-semibold">Category</th>
                      <th className="text-left p-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieDetails.map((cookie, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-xs">{cookie.name}</td>
                        <td className="p-2">{cookie.purpose}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            cookie.category === 'Essential' ? 'bg-green-100 text-green-800' :
                            cookie.category === 'Functional' ? 'bg-blue-100 text-blue-800' :
                            cookie.category === 'Analytics' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {cookie.category}
                          </span>
                        </td>
                        <td className="p-2">{cookie.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>4. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may use third-party services that set their own cookies. These services have their own privacy policies:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Helps us understand website usage and improve our services.
                  </p>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                     className="text-primary text-sm hover:underline">
                    View Google's Privacy Policy →
                  </a>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Supabase</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our backend infrastructure provider for secure data storage.
                  </p>
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" 
                     className="text-primary text-sm hover:underline">
                    View Supabase Privacy Policy →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>5. Your Cookie Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <h4 className="text-amber-800 mb-2">🔒 Your Control</h4>
                <p className="text-amber-700 text-sm">
                  You have full control over cookies. You can accept, reject, or customize your preferences at any time.
                </p>
              </div>
              
              <h4>Browser Controls:</h4>
              <ul>
                <li>Most browsers allow you to view, delete, and block cookies</li>
                <li>You can set your browser to notify you when cookies are being set</li>
                <li>Blocking all cookies may affect website functionality</li>
              </ul>
              
              <h4>Manage Preferences:</h4>
              <ul>
                <li>Use the preference manager at the top of this page</li>
                <li>Your choices are saved and remembered for future visits</li>
                <li>You can change your preferences at any time</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>6. Policy Updates</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this Cookie Policy to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the updated policy on our website 
                and updating the "Last Updated" date.
              </p>
              
              <p>
                For significant changes affecting your privacy rights, we will provide additional notice 
                through email or prominent website notices as required by GDPR.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For cookie and privacy-related questions
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    dpo@therapysync.com
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For help with cookie settings and technical issues
                  </p>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    support@therapysync.com
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;