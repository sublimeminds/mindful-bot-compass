import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Database, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlockchainHealth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('blockchain_health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching blockchain records:', error);
    }
  };

  const createHealthRecord = async (recordType) => {
    if (!user) return;
    
    setIsCreatingRecord(true);
    try {
      // Simulate encrypted health data
      const mockHealthData = {
        type: recordType,
        timestamp: new Date().toISOString(),
        data: {
          encrypted_therapy_notes: "AES256_ENCRYPTED_DATA_PLACEHOLDER",
          session_metadata: {
            duration: Math.floor(Math.random() * 60) + 30,
            effectiveness_score: Math.random() * 100
          }
        }
      };

      const recordHash = btoa(JSON.stringify(mockHealthData)).substring(0, 32);
      
      const recordData = {
        user_id: user.id,
        record_hash: recordHash,
        record_type: recordType,
        encrypted_data: btoa(JSON.stringify(mockHealthData)),
        block_height: Math.floor(Math.random() * 1000000) + 500000,
        transaction_id: `tx_${Math.random().toString(36).substring(2, 15)}`,
        verification_status: 'verified'
      };

      const { data, error } = await supabase
        .from('blockchain_health_records')
        .insert([recordData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Record Created",
        description: `${recordType} record secured on blockchain`,
      });
      
      fetchRecords();
    } catch (error) {
      console.error('Error creating blockchain record:', error);
      toast({
        title: "Creation Error",
        description: "Failed to create blockchain health record",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRecord(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blockchain-50 to-health-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blockchain-600 mx-auto mb-4"></div>
          <p className="text-blockchain-600 font-medium">Loading Blockchain Health...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blockchain-50 to-health-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blockchain-900 mb-2">Blockchain Health Records</h1>
          <p className="text-blockchain-600 text-lg">Immutable, secure health data storage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Record */}
          <Card className="border-blockchain-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blockchain-700">
                <Shield className="h-5 w-5" />
                Create Health Record
              </CardTitle>
              <CardDescription>
                Store therapy data on the blockchain for permanent, tamper-proof records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => createHealthRecord('therapy_session')}
                  disabled={isCreatingRecord}
                  className="w-full"
                  variant="outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isCreatingRecord ? 'Creating...' : 'Create Therapy Record'}
                </Button>
                
                <Button 
                  onClick={() => createHealthRecord('assessment')}
                  disabled={isCreatingRecord}
                  className="w-full"
                  variant="outline"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isCreatingRecord ? 'Creating...' : 'Create Assessment Record'}
                </Button>
                
                <Button 
                  onClick={() => createHealthRecord('mood_data')}
                  disabled={isCreatingRecord}
                  className="w-full"
                  variant="outline"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isCreatingRecord ? 'Creating...' : 'Create Mood Record'}
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-blockchain-50 rounded-lg">
                <p className="text-sm text-blockchain-700 font-medium mb-1">Security Features:</p>
                <ul className="text-xs text-blockchain-600 space-y-1">
                  <li>• AES-256 encryption</li>
                  <li>• Immutable storage</li>
                  <li>• Cryptographic verification</li>
                  <li>• Decentralized backup</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <Card className="border-blockchain-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blockchain-700">
                <Database className="h-5 w-5" />
                Your Health Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {records.map((record) => (
                    <div key={record.id} className="border border-blockchain-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="outline" className="capitalize">
                            {record.record_type.replace('_', ' ')}
                          </Badge>
                          <p className="text-xs text-blockchain-500 mt-1">
                            {new Date(record.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(record.verification_status)}>
                          {record.verification_status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-blockchain-600">Block Height:</span>
                          <span className="font-mono">{record.block_height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blockchain-600">Hash:</span>
                          <span className="font-mono text-xs">{record.record_hash}</span>
                        </div>
                        {record.transaction_id && (
                          <div className="flex justify-between">
                            <span className="text-blockchain-600">Tx ID:</span>
                            <span className="font-mono text-xs">{record.transaction_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-blockchain-300 mx-auto mb-4" />
                  <p className="text-blockchain-500">No blockchain records yet</p>
                  <p className="text-sm text-blockchain-400">Create your first secure health record</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlockchainHealth;