import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Play, Save, Zap, GitBranch, Clock, 
  Users, MessageSquare, Target, Settings,
  ArrowDown, ArrowRight, Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'split';
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    config: Record<string, any>;
  };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  nodes: WorkflowNode[];
  stats: {
    executions: number;
    successRate: number;
    lastRun?: Date;
  };
}

const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const { toast } = useToast();

  const nodeTypes = [
    {
      type: 'trigger',
      icon: <Zap className="w-4 h-4" />,
      title: 'Trigger',
      description: 'Start the workflow',
      color: 'bg-green-100 text-green-800'
    },
    {
      type: 'condition',
      icon: <GitBranch className="w-4 h-4" />,
      title: 'Condition',
      description: 'Branch based on criteria',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'action',
      icon: <MessageSquare className="w-4 h-4" />,
      title: 'Send Notification',
      description: 'Send a notification',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'delay',
      icon: <Clock className="w-4 h-4" />,
      title: 'Wait',
      description: 'Add a delay',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      type: 'split',
      icon: <Users className="w-4 h-4" />,
      title: 'A/B Split',
      description: 'Split users into groups',
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const sampleWorkflows: Workflow[] = [
    {
      id: 'onboarding-flow',
      name: 'New User Onboarding',
      description: 'Welcome sequence for new users',
      isActive: true,
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 50 },
          data: {
            title: 'User Signs Up',
            config: { event: 'user_registered' }
          },
          connections: ['delay-1']
        },
        {
          id: 'delay-1',
          type: 'delay',
          position: { x: 100, y: 150 },
          data: {
            title: 'Wait 1 Hour',
            config: { duration: 3600 }
          },
          connections: ['action-1']
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 100, y: 250 },
          data: {
            title: 'Send Welcome Email',
            config: { 
              channels: ['email'],
              title: 'Welcome to TherapySync!',
              message: 'Start your wellness journey today.'
            }
          },
          connections: ['condition-1']
        },
        {
          id: 'condition-1',
          type: 'condition',
          position: { x: 100, y: 350 },
          data: {
            title: 'Check First Session',
            config: { 
              condition: 'session_completed',
              waitTime: 72 
            }
          },
          connections: ['action-2', 'action-3']
        },
        {
          id: 'action-2',
          type: 'action',
          position: { x: 50, y: 450 },
          data: {
            title: 'Congratulations Message',
            config: { 
              channels: ['push'],
              title: 'Great first session!',
              message: 'You\'re on your way to better wellness.'
            }
          },
          connections: []
        },
        {
          id: 'action-3',
          type: 'action',
          position: { x: 150, y: 450 },
          data: {
            title: 'Encouragement Reminder',
            config: { 
              channels: ['email', 'push'],
              title: 'Ready to get started?',
              message: 'Your first session is waiting for you.'
            }
          },
          connections: []
        }
      ],
      stats: {
        executions: 245,
        successRate: 87.3,
        lastRun: new Date()
      }
    }
  ];

  React.useEffect(() => {
    setWorkflows(sampleWorkflows);
  }, []);

  const createNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: 'Describe your workflow here',
      isActive: false,
      nodes: [],
      stats: {
        executions: 0,
        successRate: 0
      }
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsBuilding(true);
  };

  const addNode = (type: string, position: { x: number; y: number }) => {
    if (!selectedWorkflow) return;

    const nodeConfig = nodeTypes.find(nt => nt.type === type);
    if (!nodeConfig) return;

    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: {
        title: nodeConfig.title,
        description: nodeConfig.description,
        config: {}
      },
      connections: []
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode]
    };

    setSelectedWorkflow(updatedWorkflow);
    setWorkflows(prev => 
      prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w)
    );
  };

  const saveWorkflow = () => {
    if (!selectedWorkflow) return;

    toast({
      title: "Workflow Saved",
      description: `${selectedWorkflow.name} has been saved successfully`,
    });
  };

  const testWorkflow = () => {
    if (!selectedWorkflow) return;

    toast({
      title: "Workflow Test Started",
      description: "Testing workflow with sample user data",
    });
  };

  const renderWorkflowNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes.find(nt => nt.type === node.type);
    if (!nodeType) return null;

    return (
      <div
        key={node.id}
        className={`absolute border-2 border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          minWidth: '150px'
        }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-1 rounded ${nodeType.color}`}>
            {nodeType.icon}
          </div>
          <span className="font-medium text-sm">{node.data.title}</span>
        </div>
        
        {node.data.description && (
          <p className="text-xs text-gray-600">{node.data.description}</p>
        )}
        
        {/* Connection indicators */}
        {node.connections.length > 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <ArrowDown className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  if (isBuilding && selectedWorkflow) {
    return (
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="mb-6">
            <Button 
              onClick={() => setIsBuilding(false)} 
              variant="outline" 
              size="sm"
              className="mb-4"
            >
              ← Back to List
            </Button>
            
            <Input
              value={selectedWorkflow.name}
              onChange={(e) => setSelectedWorkflow(prev => 
                prev ? { ...prev, name: e.target.value } : null
              )}
              className="mb-2"
            />
            
            <Textarea
              value={selectedWorkflow.description}
              onChange={(e) => setSelectedWorkflow(prev => 
                prev ? { ...prev, description: e.target.value } : null
              )}
              className="mb-4"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-700 mb-3">Add Components</h3>
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.type}
                className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${nodeType.color}`}
                onClick={() => addNode(nodeType.type, { x: 100, y: 100 + selectedWorkflow.nodes.length * 100 })}
              >
                <div className="flex items-center space-x-2">
                  {nodeType.icon}
                  <div>
                    <p className="font-medium text-sm">{nodeType.title}</p>
                    <p className="text-xs opacity-75">{nodeType.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <Button onClick={saveWorkflow} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
            <Button onClick={testWorkflow} variant="outline" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Test Workflow
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-50 relative overflow-auto">
          <div className="absolute inset-0 p-8">
            <div className="relative w-full h-full">
              {selectedWorkflow.nodes.map(renderWorkflowNode)}
              
              {selectedWorkflow.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                    <p className="text-sm">Add components from the sidebar to create your automation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Workflow Builder</h1>
          <p className="text-gray-600">Create automated notification workflows with visual builder</p>
        </div>
        
        <Button onClick={createNewWorkflow}>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Workflow List */}
      <div className="grid gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{workflow.name}</span>
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setIsBuilding(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testWorkflow()}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Components</p>
                  <p className="font-medium">{workflow.nodes.length} nodes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Executions</p>
                  <p className="font-medium">{workflow.stats.executions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="font-medium">{workflow.stats.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Run</p>
                  <p className="font-medium">
                    {workflow.stats.lastRun ? 
                      workflow.stats.lastRun.toLocaleDateString() : 'Never'
                    }
                  </p>
                </div>
              </div>
              
              {/* Mini workflow preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Workflow Preview</h4>
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {workflow.nodes.slice(0, 5).map((node, index) => {
                    const nodeType = nodeTypes.find(nt => nt.type === node.type);
                    return nodeType ? (
                      <React.Fragment key={node.id}>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${nodeType.color}`}>
                          {nodeType.icon}
                          <span>{node.data.title}</span>
                        </div>
                        {index < Math.min(workflow.nodes.length - 1, 4) && (
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        )}
                      </React.Fragment>
                    ) : null;
                  })}
                  {workflow.nodes.length > 5 && (
                    <span className="text-xs text-gray-500">+{workflow.nodes.length - 5} more</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkflowBuilder;