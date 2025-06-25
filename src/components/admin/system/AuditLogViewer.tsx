import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  resource: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  details: Record<string, unknown>;
}

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          action: 'user_login',
          user_id: 'user_123',
          resource: 'auth',
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          success: true,
          details: { method: 'email_password' }
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error loading audit logs",
        description: "Failed to fetch audit log data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const filteredLogs = logs.filter(log => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(searchTermLower) ||
      log.user_id.toLowerCase().includes(searchTermLower) ||
      log.resource.toLowerCase().includes(searchTermLower);

    const matchesFilter = filterType === 'all' || log.action === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Shield className="h-5 w-5 mr-2 text-blue-400" />
          Audit Log Viewer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="user_login">User Login</SelectItem>
              <SelectItem value="resource_access">Resource Access</SelectItem>
              <SelectItem value="data_change">Data Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-4 animate-spin" />
            Loading audit logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Info className="h-12 w-12 mx-auto mb-4" />
            No audit logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Action</th>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Resource</th>
                  <th scope="col" className="px-6 py-3">Timestamp</th>
                  <th scope="col" className="px-6 py-3">IP Address</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white">{log.action}</td>
                    <td className="px-6 py-4">{log.user_id}</td>
                    <td className="px-6 py-4">{log.resource}</td>
                    <td className="px-6 py-4">{log.timestamp}</td>
                    <td className="px-6 py-4">{log.ip_address}</td>
                    <td className="px-6 py-4">
                      {log.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
