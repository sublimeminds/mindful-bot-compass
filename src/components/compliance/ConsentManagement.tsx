import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Eye,
  Mail,
  BarChart3,
  Share2,
  Cookie,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsentRecord {
  consent_type: string;
  granted: boolean;
  granted_at?: string;
  withdrawn_at?: string;
  updated_at: string;
}

const ConsentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const consentTypes = [
    {
      type: 'analytics_consent',
      title: 'Analytics & Performance',
      description: 'Allow us to collect anonymized usage data to improve app performance',
      icon: BarChart3,
      color: 'blue'
    },
    {
      type: 'marketing_consent',
      title: 'Marketing Communications',
      description: 'Receive newsletters, feature updates, and wellness tips via email',
      icon: Mail,
      color: 'green'
    },
    {
      type: 'third_party_sharing',
      title: 'Research Participation',
      description: 'Share anonymized data with research partners to advance mental health science',
      icon: Share2,
      color: 'purple'
    },
    {
      type: 'functional_cookies',
      title: 'Functional Cookies',
      description: 'Store preferences and settings to enhance your user experience',
      icon: Cookie,
      color: 'orange'
    },
    {
      type: 'personalization',
      title: 'Content Personalization',
      description: 'Customize content and recommendations based on your preferences',
      icon: Eye,
      color: 'pink'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchConsentRecords();
    }
  }, [user]);

  const fetchConsentRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('user_consent')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConsentRecords(data || []);
    } catch (error) {
      console.error('Error fetching consent records:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (consentType: string, granted: boolean) => {
    try {
      await supabase.rpc('update_consent', {
        user_id_param: user?.id,
        consent_type_param: consentType,
        granted_param: granted,
        user_ip: null, // Would get real IP in production
        user_agent_param: navigator.userAgent
      });

      // Update local state
      const updatedRecords = consentRecords.filter(r => r.consent_type !== consentType);
      updatedRecords.push({
        consent_type: consentType,
        granted,
        granted_at: granted ? new Date().toISOString() : undefined,
        withdrawn_at: !granted ? new Date().toISOString() : undefined,
        updated_at: new Date().toISOString()
      });
      setConsentRecords(updatedRecords);

      toast({
        title: granted ? "Consent Granted" : "Consent Withdrawn",
        description: `Your ${consentType.replace('_', ' ')} preference has been updated.`,
      });
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: "Error",
        description: "Failed to update consent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getConsentStatus = (consentType: string) => {
    const record = consentRecords.find(r => r.consent_type === consentType);
    return record?.granted || false;
  };

  const getConsentDate = (consentType: string) => {
    const record = consentRecords.find(r => r.consent_type === consentType);
    if (!record) return null;
    
    const date = record.granted ? record.granted_at : record.withdrawn_at;
    return date ? new Date(date).toLocaleDateString() : null;
  };

  const getStatusIcon = (consentType: string) => {
    const granted = getConsentStatus(consentType);
    return granted ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (consentType: string) => {
    const granted = getConsentStatus(consentType);
    return (
      <Badge 
        variant={granted ? "default" : "secondary"}
        className={granted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      >
        {granted ? "Granted" : "Declined"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Consent Management Center</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your consent preferences for data processing activities. You can withdraw consent at any time.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {consentTypes.map((item) => {
          const IconComponent = item.icon;
          const isGranted = getConsentStatus(item.type);
          const lastUpdated = getConsentDate(item.type);
          
          return (
            <div 
              key={item.type}
              className="flex items-start justify-between p-4 border rounded-lg space-x-4"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                  <IconComponent className={`h-5 w-5 text-${item.color}-600`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Label className="font-medium">{item.title}</Label>
                    {getStatusIcon(item.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {lastUpdated && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Last updated: {lastUpdated}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusBadge(item.type)}
                <Switch
                  checked={isGranted}
                  onCheckedChange={(value) => updateConsent(item.type, value)}
                />
              </div>
            </div>
          );
        })}

        {/* Consent History Summary */}
        <div className="border-t pt-6 mt-6">
          <h4 className="font-medium mb-4 flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Consent Summary</span>
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {consentRecords.filter(r => r.granted).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Consents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {consentRecords.filter(r => !r.granted).length}
              </div>
              <div className="text-sm text-muted-foreground">Declined</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {consentRecords.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-900">Your Rights</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You can withdraw consent at any time without affecting the lawfulness of processing</li>
                <li>• Withdrawing consent may limit certain app features but won't affect core functionality</li>
                <li>• All consent decisions are logged with timestamps for transparency</li>
                <li>• You can request a copy of all your consent records at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentManagement;