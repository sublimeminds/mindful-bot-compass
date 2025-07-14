import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TranslationJob {
  id: string;
  job_name: string;
  job_type: string;
  source_language: string;
  target_languages: string[];
  total_items: number;
  completed_items: number;
  failed_items: number;
  status: string;
  job_config: any;
  results_summary: any;
  error_details: any;
  estimated_cost: number;
  actual_cost: number;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

interface TranslationJobsManagerProps {
  onStatsUpdate: () => void;
}

const TranslationJobsManager: React.FC<TranslationJobsManagerProps> = ({ onStatsUpdate }) => {
  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<TranslationJob | null>(null);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('translation_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading translation jobs:', error);
      toast.error('Failed to load translation jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressPercentage = (job: TranslationJob) => {
    if (job.total_items === 0) return 0;
    return Math.round((job.completed_items / job.total_items) * 100);
  };

  const handleJobAction = async (jobId: string, action: 'pause' | 'resume' | 'cancel') => {
    try {
      // In a real implementation, this would call the edge function to control the job
      toast.info(`Job ${action} functionality would be implemented here`);
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      toast.error(`Failed to ${action} job`);
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Translation Jobs</h2>
          <p className="text-gray-400">Monitor and manage bulk translation operations</p>
        </div>
        <Button onClick={loadJobs} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Job Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h3 className="text-lg font-medium text-white">{job.job_name}</h3>
                      <p className="text-sm text-gray-400">
                        {job.job_type.replace('_', ' ').toUpperCase()} • 
                        {job.source_language} → {job.target_languages.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(job.status)}>
                      {job.status.toUpperCase()}
                    </Badge>
                    {job.status === 'running' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJobAction(job.id, 'pause')}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {job.status === 'paused' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJobAction(job.id, 'resume')}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Progress: {job.completed_items} / {job.total_items} items
                    </span>
                    <span className="text-gray-400">
                      {getProgressPercentage(job)}%
                    </span>
                  </div>
                  <Progress value={getProgressPercentage(job)} className="h-2" />
                  {job.failed_items > 0 && (
                    <p className="text-sm text-red-400">
                      {job.failed_items} items failed
                    </p>
                  )}
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-white">{new Date(job.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <p className="text-white">
                      {formatDuration(job.created_at, job.completed_at)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Estimated Cost:</span>
                    <p className="text-white">
                      ${job.estimated_cost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Actual Cost:</span>
                    <p className="text-white">
                      ${job.actual_cost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedJob?.id === job.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                    {/* Job Configuration */}
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Configuration</h4>
                      <div className="bg-gray-700 p-3 rounded text-sm">
                        <pre className="text-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(job.job_config, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Results Summary */}
                    {job.results_summary && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Results Summary</h4>
                        <div className="bg-gray-700 p-3 rounded text-sm">
                          <pre className="text-gray-300 whitespace-pre-wrap">
                            {JSON.stringify(job.results_summary, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Error Details */}
                    {job.error_details && (
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Error Details</h4>
                        <div className="bg-red-900/20 border border-red-500/20 p-3 rounded text-sm">
                          <pre className="text-red-300 whitespace-pre-wrap">
                            {JSON.stringify(job.error_details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {jobs.length === 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No translation jobs found</p>
              <p className="text-sm text-gray-500 mt-2">
                Start a bulk translation to see jobs here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranslationJobsManager;