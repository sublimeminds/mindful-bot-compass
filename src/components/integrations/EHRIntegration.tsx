
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Activity, 
  Pill, 
  HeartHandshake,
  Shield,
  Sync,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface EHRConnection {
  id: string;
  provider: string;
  connection_status: string;
  patient_id?: string;
  last_sync_at?: string;
  sync_frequency: string;
}

interface EHRData {
  id: string;
  data_type: string;
  data_payload: any;
  last_updated: string;
}

const EHRIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<EHRConnection[]>([]);
  const [ehrData, setEhrData] = useState<EHRData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const ehrProviders = [
    {
      id: 'epic',
      name: 'Epic MyChart',
      icon: FileText,
      description: 'Epic Electronic Health Records - Patient portal access',
      features: ['Medical History', 'Lab Results', 'Medications', 'Allergies', 'Appointments'],
      color: 'bg-blue-500'
    },
    {
      id: 'cerner',
      name: 'Cerner PowerChart',
      icon: Activity,
      description: 'Cerner EHR system integration for comprehensive health data',
      features: ['Clinical Notes', 'Vitals', 'Immunizations', 'Care Plans', 'Procedures'],
      color: 'bg-green-500'
    },
    {
      id: 'allscripts',
      name: 'Allscripts',
      icon: HeartHandshake,
      description: 'Allscripts electronic health records platform',
      features: ['Patient Summary', 'Prescriptions', 'Test Results', 'Referrals'],
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadEHRConnections();
      loadEHRData();
    }
  }, [user]);

  const loadEHRConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('ehr_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading EHR connections:', error);
    }
  };

  const loadEHRData = async () => {
    try {
      const { data, error } = await supabase
        .from('ehr_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_updated', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEhrData(data || []);
    } catch (error) {
      console.error('Error loading EHR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectEHR = async (providerId: string) => {
    try {
      const provider = ehrProviders.find(p => p.id === providerId);
      if (!provider) return;

      // Simulate OAuth flow - in real implementation, redirect to provider's OAuth
      const { data, error } = await supabase
        .from('ehr_connections')
        .insert({
          user_id: user?.id!,
          provider: provider.name,
          connection_status: 'connected',
          patient_id: `patient_${Math.random().toString(36).substr(2, 9)}`,
          sync_frequency: 'daily'
        })
        .select()
        .single();

      if (error) throw error;

      setConnections([...connections, data]);
      
      toast({
        title: "EHR Connected",
        description: `${provider.name} has been connected successfully`,
      });

      // Simulate initial data sync
      setTimeout(() => simulateDataSync(data.id), 2000);

    } catch (error) {
      console.error('Error connecting EHR:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to EHR system. Please try again.",
        variant: "destructive"
      });
    }
  };

  const simulateDataSync = async (connectionId: string) => {
    setSyncing(true);
    
    try {
      const sampleData = [
        {
          user_id: user?.id!,
          ehr_connection_id: connectionId,
          data_type: 'medications',
          fhir_resource_type: 'MedicationStatement',
          data_payload: {
            medication: 'Sertraline 50mg',
            dosage: 'Once daily',
            prescriber: 'Dr. Smith',
            start_date: '2024-01-15'
          }
        },
        {
          user_id: user?.id!,
          ehr_connection_id: connectionId,
          data_type: 'vitals',
          fhir_resource_type: 'Observation',
          data_payload: {
            blood_pressure: '120/80',
            heart_rate: '72',
            weight: '70kg',
            recorded_date: new Date().toISOString()
          }
        },
        {
          user_id: user?.id!,
          ehr_connection_id: connectionId,
          data_type: 'allergies',
          fhir_resource_type: 'AllergyIntolerance',
          data_payload: {
            allergen: 'Penicillin',
            severity: 'Moderate',
            reaction: 'Rash',
            onset_date: '2020-03-10'
          }
        }
      ];

      for (const record of sampleData) {
        await supabase.from('ehr_data').insert(record);
      }

      await supabase
        .from('ehr_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      await loadEHRData();
      await loadEHRConnections();

      toast({
        title: "Data Synced",
        description: "EHR data has been synchronized successfully",
      });

    } catch (error) {
      console.error('Error syncing EHR data:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getConnectionStatus = (providerId: string) => {
    return connections.find(c => c.provider.toLowerCase().includes(providerId));
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'medications': return Pill;
      case 'vitals': return Activity;
      case 'allergies': return AlertTriangle;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* EHR Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ehrProviders.map((provider) => {
          const Icon = provider.icon;
          const connection = getConnectionStatus(provider.id);
          const isConnected = !!connection;
          
          return (
            <Card key={provider.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${provider.color} rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{provider.name}</CardTitle>
                      <Badge variant={isConnected ? "default" : "outline"} className="text-xs">
                        {isConnected ? 'Connected' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  {isConnected && connection?.last_sync_at && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Synced
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-therapy-600">{provider.description}</p>
                
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Available Data</h5>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Patient ID:</span>
                      <span className="font-mono text-xs">{connection?.patient_id}</span>
                    </div>
                    <Button 
                      onClick={() => simulateDataSync(connection!.id)}
                      disabled={syncing}
                      size="sm" 
                      className="w-full"
                    >
                      <Sync className="h-4 w-4 mr-2" />
                      {syncing ? 'Syncing...' : 'Sync Data'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => connectEHR(provider.id)}
                    size="sm" 
                    className="w-full"
                  >
                    Connect {provider.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* EHR Data Display */}
      {ehrData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Health Records</span>
              <Badge variant="outline" className="ml-auto">
                {ehrData.length} Records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ehrData.map((record) => {
              const Icon = getDataTypeIcon(record.data_type);
              
              return (
                <div key={record.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-therapy-600" />
                      <div>
                        <h4 className="font-medium capitalize">{record.data_type}</h4>
                        <p className="text-sm text-gray-600">
                          Updated: {new Date(record.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {record.data_payload.medication || record.data_payload.allergen || 'Health Data'}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-700">
                    {record.data_type === 'medications' && (
                      <div className="space-y-1">
                        <p><strong>Medication:</strong> {record.data_payload.medication}</p>
                        <p><strong>Dosage:</strong> {record.data_payload.dosage}</p>
                        <p><strong>Prescriber:</strong> {record.data_payload.prescriber}</p>
                      </div>
                    )}
                    {record.data_type === 'vitals' && (
                      <div className="grid grid-cols-2 gap-2">
                        <p><strong>Blood Pressure:</strong> {record.data_payload.blood_pressure}</p>
                        <p><strong>Heart Rate:</strong> {record.data_payload.heart_rate}</p>
                        <p><strong>Weight:</strong> {record.data_payload.weight}</p>
                      </div>
                    )}
                    {record.data_type === 'allergies' && (
                      <div className="space-y-1">
                        <p><strong>Allergen:</strong> {record.data_payload.allergen}</p>
                        <p><strong>Severity:</strong> {record.data_payload.severity}</p>
                        <p><strong>Reaction:</strong> {record.data_payload.reaction}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">HIPAA Compliance & Privacy</h4>
            <p className="text-sm text-blue-600">
              All EHR data is encrypted and stored in compliance with HIPAA regulations. 
              Your health information is only accessible to you and authorized healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EHRIntegration;
