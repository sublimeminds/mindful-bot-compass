
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  FileText, 
  Heart, 
  Pill, 
  AlertTriangle,
  Shield,
  Users,
  Clock,
  CheckCircle
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
  fhir_resource_type?: string;
  data_payload: any;
  last_updated: string;
  sync_status: string;
}

const EHRIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<EHRConnection[]>([]);
  const [ehrData, setEhrData] = useState<EHRData[]>([]);
  const [loading, setLoading] = useState(true);

  const ehrProviders = [
    {
      id: 'epic',
      name: 'Epic MyChart',
      icon: FileText,
      description: 'Connect to Epic Electronic Health Records system',
      features: ['Patient Portal Access', 'Lab Results', 'Medication Lists', 'Visit History'],
      color: 'bg-blue-600',
      marketShare: '31%'
    },
    {
      id: 'cerner',
      name: 'Cerner PowerChart',
      icon: Heart,
      description: 'Cerner EHR integration for comprehensive health data',
      features: ['Real-time Data', 'Clinical Notes', 'Allergies', 'Vital Signs'],
      color: 'bg-red-500',
      marketShare: '25%'
    },
    {
      id: 'allscripts',
      name: 'Allscripts',
      icon: Pill,
      description: 'Allscripts electronic health records integration',
      features: ['Prescription History', 'Care Plans', 'Immunizations', 'Procedures'],
      color: 'bg-green-500',
      marketShare: '8%'
    }
  ];

  const dataTypes = [
    { type: 'vitals', icon: Heart, label: 'Vital Signs', count: 12 },
    { type: 'medications', icon: Pill, label: 'Medications', count: 5 },
    { type: 'allergies', icon: AlertTriangle, label: 'Allergies', count: 2 },
    { type: 'conditions', icon: FileText, label: 'Conditions', count: 3 }
  ];

  useEffect(() => {
    if (user) {
      loadEHRConnections();
      loadEHRData();
    }
  }, [user]);

  const loadEHRConnections = async () => {
    try {
      // Mock data until database types are updated
      setConnections([]);
    } catch (error) {
      console.error('Error loading EHR connections:', error);
    }
  };

  const loadEHRData = async () => {
    try {
      // Mock data until database types are updated
      setEhrData([]);
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

      // Simulate OAuth connection
      const newConnection: EHRConnection = {
        id: `${providerId}_${Math.random().toString(36).substr(2, 9)}`,
        provider: provider.name,
        connection_status: 'connected',
        patient_id: `patient_${Math.random().toString(36).substr(2, 6)}`,
        last_sync_at: new Date().toISOString(),
        sync_frequency: 'daily'
      };

      setConnections([...connections, newConnection]);
      
      toast({
        title: "EHR Connected",
        description: `${provider.name} has been connected successfully. Data sync will begin shortly.`,
      });

      // Simulate initial data sync
      setTimeout(() => syncEHRData(newConnection.id), 2000);

    } catch (error) {
      console.error('Error connecting EHR:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to EHR system. Please try again.",
        variant: "destructive"
      });
    }
  };

  const syncEHRData = async (connectionId: string) => {
    try {
      // Simulate syncing various data types
      const mockData: EHRData[] = [
        {
          id: 'vitals_1',
          data_type: 'vitals',
          fhir_resource_type: 'Observation',
          data_payload: { bloodPressure: '120/80', heartRate: 72, temperature: '98.6°F' },
          last_updated: new Date().toISOString(),
          sync_status: 'synced'
        },
        {
          id: 'medication_1',
          data_type: 'medications',
          fhir_resource_type: 'MedicationStatement',
          data_payload: { name: 'Sertraline 50mg', frequency: 'Daily', prescriber: 'Dr. Smith' },
          last_updated: new Date().toISOString(),
          sync_status: 'synced'
        }
      ];

      setEhrData([...ehrData, ...mockData]);

      toast({
        title: "Data Synced",
        description: "Your health data has been synchronized successfully",
      });

    } catch (error) {
      console.error('Error syncing EHR data:', error);
    }
  };

  const updateSyncFrequency = async (connectionId: string, frequency: string) => {
    try {
      setConnections(connections.map(conn => 
        conn.id === connectionId ? { ...conn, sync_frequency: frequency } : conn
      ));

      toast({
        title: "Sync Settings Updated",
        description: `Data sync frequency changed to ${frequency}`,
      });
    } catch (error) {
      console.error('Error updating sync frequency:', error);
    }
  };

  const getConnection = (providerId: string) => {
    return connections.find(c => c.provider.toLowerCase().includes(providerId.toLowerCase()));
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
          const connection = getConnection(provider.id);
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
                      <div className="flex items-center space-x-2">
                        <Badge variant={isConnected ? "default" : "outline"} className="text-xs">
                          {isConnected ? 'Connected' : 'Available'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {provider.marketShare} market
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-therapy-600">{provider.description}</p>
                
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Supported Data</h5>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Patient ID</span>
                      <span className="text-sm font-mono">{connection.patient_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync</span>
                      <span className="text-sm text-gray-600">
                        {connection.last_sync_at ? 
                          new Date(connection.last_sync_at).toLocaleDateString() : 
                          'Never'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sync Frequency</span>
                      <select 
                        className="text-sm border rounded px-2 py-1"
                        value={connection.sync_frequency}
                        onChange={(e) => updateSyncFrequency(connection.id, e.target.value)}
                      >
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
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

      {/* Data Summary */}
      {ehrData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Health Data Overview</span>
              <Badge variant="outline" className="ml-auto">
                {ehrData.length} Records
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dataTypes.map((dataType) => {
                const Icon = dataType.icon;
                const count = ehrData.filter(d => d.data_type === dataType.type).length;
                
                return (
                  <div key={dataType.type} className="p-4 border rounded-lg text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-therapy-600" />
                    <h4 className="font-medium text-sm">{dataType.label}</h4>
                    <p className="text-2xl font-bold text-therapy-600">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Health Data */}
      {ehrData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Health Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ehrData.slice(0, 5).map((record) => (
              <div key={record.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {record.data_type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {record.fhir_resource_type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {Object.entries(record.data_payload).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={record.sync_status === 'synced' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {record.sync_status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(record.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-green-700">
                All health data is encrypted and stored in compliance with HIPAA regulations.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Data Control</h4>
              <p className="text-sm text-blue-700">
                You maintain full control over which data is shared and can revoke access anytime.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Data Retention</h4>
              <p className="text-sm text-gray-600">
                Health data is retained for therapy purposes only and deleted upon request.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EHRIntegration;
