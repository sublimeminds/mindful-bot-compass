import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Package,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataExportRequestProps {
  exportRequests: any[];
  onRequestCreated: () => void;
}

const DataExportRequest: React.FC<DataExportRequestProps> = ({ 
  exportRequests, 
  onRequestCreated 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [exportType, setExportType] = useState('full_export');

  const createExportRequest = async () => {
    if (!user) return;

    setCreating(true);
    try {
      // Create export request
      const { data, error } = await supabase.rpc('request_data_export', {
        user_id_param: user.id,
        export_type: exportType
      });

      if (error) throw error;

      // Process the export
      const { data: exportData, error: exportError } = await supabase.functions.invoke('gdpr-data-export', {
        body: {
          requestId: data,
          exportType
        }
      });

      if (exportError) throw exportError;

      toast({
        title: "Data Export Created",
        description: "Your data export has been generated and is ready for download.",
      });

      onRequestCreated();
    } catch (error) {
      console.error('Error creating export:', error);
      toast({
        title: "Export Failed",
        description: "Failed to create data export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const downloadExport = async (request: any) => {
    setDownloading(request.id);
    try {
      // In a real implementation, this would download from cloud storage
      // For now, we'll regenerate the export
      const { data, error } = await supabase.functions.invoke('gdpr-data-export', {
        body: {
          requestId: request.id,
          exportType: request.request_type
        }
      });

      if (error) throw error;

      // Create and download file
      const blob = new Blob([data.downloadData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `therapysync-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your data export file is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading export:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download data export. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Create New Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Request Data Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download all your personal data in a machine-readable format as required by GDPR Article 15.
            This includes your profile, therapy sessions, mood entries, goals, and all other data we store.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Type</label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_export">Complete Data Export</SelectItem>
                <SelectItem value="profile_only">Profile Data Only</SelectItem>
                <SelectItem value="therapy_data">Therapy Sessions & Mood Data</SelectItem>
                <SelectItem value="goals_achievements">Goals & Achievements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={createExportRequest}
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Export...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Create Data Export
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Export History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {exportRequests.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No data exports requested yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exportRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <div className="font-medium">
                        {request.request_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(request.requested_at).toLocaleDateString()}</span>
                        </span>
                        {request.file_size_bytes && (
                          <span className="flex items-center space-x-1">
                            <HardDrive className="h-3 w-3" />
                            <span>{formatFileSize(request.file_size_bytes)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    
                    {request.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadExport(request)}
                        disabled={downloading === request.id}
                      >
                        {downloading === request.id ? (
                          <>
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">About Data Exports</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Exports are provided in JSON format for machine readability</li>
                <li>• Files are available for download for 7 days after creation</li>
                <li>• All exports are encrypted and only accessible to you</li>
                <li>• You can request unlimited exports at any time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportRequest;