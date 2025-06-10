
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Download, 
  Save, 
  Play, 
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportWidget {
  id: string;
  type: 'metric' | 'chart' | 'table';
  title: string;
  dataSource: string;
  config: any;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  widgets: ReportWidget[];
  schedule?: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  created_at: string;
}

const CustomReportBuilder = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<CustomReport[]>([
    {
      id: '1',
      name: 'Executive Dashboard',
      description: 'High-level metrics for leadership team',
      widgets: [
        { id: '1', type: 'metric', title: 'Total Users', dataSource: 'users', config: {} },
        { id: '2', type: 'chart', title: 'Revenue Trend', dataSource: 'revenue', config: { type: 'line' } }
      ],
      schedule: 'weekly',
      recipients: ['exec@company.com'],
      created_at: '2024-01-01'
    }
  ]);

  const [isBuilding, setIsBuilding] = useState(false);
  const [currentReport, setCurrentReport] = useState<Partial<CustomReport>>({
    name: '',
    description: '',
    widgets: [],
    recipients: []
  });

  const [newWidget, setNewWidget] = useState<Partial<ReportWidget>>({
    type: 'metric',
    title: '',
    dataSource: ''
  });

  const availableDataSources = [
    { id: 'users', name: 'User Analytics', type: 'metric' },
    { id: 'sessions', name: 'Session Data', type: 'metric' },
    { id: 'revenue', name: 'Revenue Data', type: 'metric' },
    { id: 'notifications', name: 'Notification Analytics', type: 'metric' },
    { id: 'therapists', name: 'Therapist Performance', type: 'metric' },
    { id: 'goals', name: 'Goal Completion', type: 'metric' },
    { id: 'mood', name: 'Mood Tracking', type: 'metric' },
  ];

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: <LineChart className="h-4 w-4" /> },
    { id: 'bar', name: 'Bar Chart', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'pie', name: 'Pie Chart', icon: <PieChart className="h-4 w-4" /> },
    { id: 'area', name: 'Area Chart', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const addWidget = () => {
    if (!newWidget.title || !newWidget.dataSource) {
      toast({
        title: "Incomplete widget",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const widget: ReportWidget = {
      id: Date.now().toString(),
      type: newWidget.type || 'metric',
      title: newWidget.title,
      dataSource: newWidget.dataSource,
      config: newWidget.type === 'chart' ? { type: 'line' } : {}
    };

    setCurrentReport(prev => ({
      ...prev,
      widgets: [...(prev.widgets || []), widget]
    }));

    setNewWidget({
      type: 'metric',
      title: '',
      dataSource: ''
    });

    toast({
      title: "Widget added",
      description: "Widget has been added to your report.",
    });
  };

  const removeWidget = (widgetId: string) => {
    setCurrentReport(prev => ({
      ...prev,
      widgets: prev.widgets?.filter(w => w.id !== widgetId) || []
    }));
  };

  const saveReport = () => {
    if (!currentReport.name || !currentReport.widgets?.length) {
      toast({
        title: "Incomplete report",
        description: "Please add a name and at least one widget.",
        variant: "destructive",
      });
      return;
    }

    const report: CustomReport = {
      id: Date.now().toString(),
      name: currentReport.name,
      description: currentReport.description || '',
      widgets: currentReport.widgets,
      schedule: currentReport.schedule,
      recipients: currentReport.recipients || [],
      created_at: new Date().toISOString()
    };

    setReports(prev => [report, ...prev]);
    setCurrentReport({
      name: '',
      description: '',
      widgets: [],
      recipients: []
    });
    setIsBuilding(false);

    toast({
      title: "Report saved",
      description: "Your custom report has been saved successfully.",
    });
  };

  const generateReport = (reportId: string) => {
    toast({
      title: "Generating report",
      description: "Your report is being generated and will be ready shortly.",
    });
  };

  const exportReport = (reportId: string, format: 'pdf' | 'csv' | 'excel') => {
    toast({
      title: "Exporting report",
      description: `Your report is being exported as ${format.toUpperCase()}.`,
    });
  };

  if (isBuilding) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Build Custom Report</h3>
          <Button variant="outline" onClick={() => setIsBuilding(false)}>
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Configuration */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportName" className="text-white">Report Name</Label>
                <Input
                  id="reportName"
                  value={currentReport.name || ''}
                  onChange={(e) => setCurrentReport(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter report name..."
                />
              </div>

              <div>
                <Label htmlFor="reportDescription" className="text-white">Description</Label>
                <Textarea
                  id="reportDescription"
                  value={currentReport.description || ''}
                  onChange={(e) => setCurrentReport(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Report description..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-white">Schedule (Optional)</Label>
                <Select
                  value={currentReport.schedule || ''}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                    setCurrentReport(prev => ({ ...prev, schedule: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select schedule..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="recipients" className="text-white">Email Recipients</Label>
                <Input
                  id="recipients"
                  value={currentReport.recipients?.join(', ') || ''}
                  onChange={(e) => setCurrentReport(prev => ({ 
                    ...prev, 
                    recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="email1@domain.com, email2@domain.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Widget Builder */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Widget Type</Label>
                <Select
                  value={newWidget.type || 'metric'}
                  onValueChange={(value: 'metric' | 'chart' | 'table') => 
                    setNewWidget(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric Card</SelectItem>
                    <SelectItem value="chart">Chart</SelectItem>
                    <SelectItem value="table">Data Table</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="widgetTitle" className="text-white">Widget Title</Label>
                <Input
                  id="widgetTitle"
                  value={newWidget.title || ''}
                  onChange={(e) => setNewWidget(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter widget title..."
                />
              </div>

              <div>
                <Label className="text-white">Data Source</Label>
                <Select
                  value={newWidget.dataSource || ''}
                  onValueChange={(value) => setNewWidget(prev => ({ ...prev, dataSource: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select data source..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDataSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newWidget.type === 'chart' && (
                <div>
                  <Label className="text-white">Chart Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {chartTypes.map((chart) => (
                      <Button
                        key={chart.id}
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={() => setNewWidget(prev => ({ 
                          ...prev, 
                          config: { ...prev.config, type: chart.id }
                        }))}
                      >
                        {chart.icon}
                        <span>{chart.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={addWidget} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {currentReport.widgets?.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No widgets added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentReport.widgets?.map((widget) => (
                  <div
                    key={widget.id}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{widget.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWidget(widget.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="outline">{widget.type}</Badge>
                    <div className="mt-2 text-sm text-gray-400">
                      Source: {availableDataSources.find(s => s.id === widget.dataSource)?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsBuilding(false)}>
            Cancel
          </Button>
          <Button onClick={saveReport} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Custom Reports</h2>
          <p className="text-gray-400">Build and manage custom analytics reports</p>
        </div>
        <Button onClick={() => setIsBuilding(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-white">{report.name}</h3>
                    {report.schedule && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {report.schedule}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>{report.widgets.length} widgets</span>
                    <span>{report.recipients.length} recipients</span>
                    <span>Created {new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport(report.id)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Select onValueChange={(format: 'pdf' | 'csv' | 'excel') => exportReport(report.id, format)}>
                    <SelectTrigger className="w-auto">
                      <Download className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">Export as PDF</SelectItem>
                      <SelectItem value="csv">Export as CSV</SelectItem>
                      <SelectItem value="excel">Export as Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom reports created yet</p>
              <Button 
                onClick={() => setIsBuilding(true)} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomReportBuilder;
