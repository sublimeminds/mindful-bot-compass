
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Calendar, User, Activity, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  admin_user_id: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

const AuditLogViewer = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterResource, setFilterResource] = useState<string>('all');
  const { toast } = useToast();

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock audit logs
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          action: 'CREATE',
          resource_type: 'user',
          resource_id: 'user-123',
          admin_user_id: 'admin-1',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          details: { email: 'user@example.com' },
          created_at: new Date().toISOString()
        }
      ];
      
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = auditLogs.filter(log => {
    const actionMatch = filterAction === 'all' || log.action === filterAction;
    const resourceMatch = filterResource === 'all' || log.resource_type === filterResource;
    return actionMatch && resourceMatch;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Audit Log Viewer
        </CardTitle>
        <div className="flex space-x-4">
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterResource} onValueChange={setFilterResource}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="session">Sessions</SelectItem>
              <SelectItem value="integration">Integrations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No audit logs found.</div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="font-medium">{log.resource_type}</span>
                    {log.resource_id && (
                      <span className="text-sm text-gray-500">#{log.resource_id}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Admin: {log.admin_user_id}</span>
                  </div>
                  {log.ip_address && (
                    <div>IP: {log.ip_address}</div>
                  )}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
