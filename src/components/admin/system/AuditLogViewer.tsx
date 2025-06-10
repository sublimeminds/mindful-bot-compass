
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash,
  UserPlus,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetchAuditLogs();
  }, [page]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * logsPerPage, page * logsPerPage - 1);

      if (error) {
        console.error('Error fetching audit logs:', error);
        // Use mock data if no logs exist
        setLogs(generateMockLogs());
      } else {
        setLogs(data || generateMockLogs());
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLogs(generateMockLogs());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLogs = (): AuditLog[] => {
    const actions = ['view', 'create', 'update', 'delete'];
    const resources = ['users', 'content', 'system', 'analytics'];
    const mockLogs: AuditLog[] = [];

    for (let i = 0; i < 10; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const resource = resources[Math.floor(Math.random() * resources.length)];
      const date = new Date();
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));

      mockLogs.push({
        id: `log_${i}`,
        admin_user_id: 'admin_user_1',
        action,
        resource_type: resource,
        resource_id: `${resource}_${Math.floor(Math.random() * 1000)}`,
        details: {
          description: `${action.charAt(0).toUpperCase() + action.slice(1)}d ${resource}`,
          changes: action === 'update' ? { status: 'active' } : undefined
        },
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        user_agent: 'Mozilla/5.0 (Admin Dashboard)',
        created_at: date.toISOString()
      });
    }

    return mockLogs;
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'create': return <UserPlus className="h-4 w-4" />;
      case 'update': return <Edit className="h-4 w-4" />;
      case 'delete': return <Trash className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view': return 'bg-blue-500';
      case 'create': return 'bg-green-500';
      case 'update': return 'bg-yellow-500';
      case 'delete': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-600 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="h-5 w-5 mr-2 text-orange-400" />
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredLogs.map((log, index) => (
              <div
                key={log.id}
                className={`p-4 border-b border-gray-700 ${
                  index === filteredLogs.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">
                          {log.details?.description || `${log.action} ${log.resource_type}`}
                        </span>
                        <Badge className={`text-xs ${getActionColor(log.action)} text-white border-0`}>
                          {log.action}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Resource: {log.resource_type}</div>
                        {log.resource_id && <div>ID: {log.resource_id}</div>}
                        {log.ip_address && <div>IP: {log.ip_address}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>{new Date(log.created_at).toLocaleDateString()}</div>
                    <div>{new Date(log.created_at).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {((page - 1) * logsPerPage) + 1} to {Math.min(page * logsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={filteredLogs.length < logsPerPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogViewer;
