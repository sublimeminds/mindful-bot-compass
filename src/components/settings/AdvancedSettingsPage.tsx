import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Database,
  Zap,
  Download,
  Trash2
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import PaymentMethodManager from '@/components/billing/PaymentMethodManager';
import EnhancedBillingHistory from '@/components/billing/EnhancedBillingHistory';
import { AdvancedSubscriptionManager } from '@/components/subscription/AdvancedSubscriptionManager';
import BillingAddressManager from '@/components/billing/BillingAddressManager';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import AccountSettings from '@/components/settings/AccountSettings';

const AdvancedSettingsPage = () => {
  const { user } = useSimpleApp();
  const [activeTab, setActiveTab] = useState('account');

  const settingsTabs = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      component: AccountSettings
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: CreditCard,
      component: AdvancedSubscriptionManager
    },
    {
      id: 'payment-methods',
      label: 'Payment Methods',
      icon: CreditCard,
      component: PaymentMethodManager
    },
    {
      id: 'billing',
      label: 'Billing History',
      icon: CreditCard,
      component: EnhancedBillingHistory
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: NotificationSettings
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      component: PrivacySettings
    }
  ];

  const ActiveComponent = settingsTabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="h-8 w-8 text-therapy-600" />
            <h1 className="text-3xl font-bold text-therapy-600">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account, billing, and preferences
          </p>
        </div>

        {/* Settings Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-none hover:bg-accent transition-colors ${
                        activeTab === tab.id ? 'bg-accent border-r-2 border-therapy-600' : ''
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className={`text-sm ${activeTab === tab.id ? 'font-medium' : ''}`}>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge variant="secondary">Pro</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm">Jan 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsPage;