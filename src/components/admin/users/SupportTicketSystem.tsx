
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Ticket, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  MessageSquare,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  ticketId: string;
  content: string;
  respondedBy: 'user' | 'admin';
  adminName?: string;
  createdAt: string;
}

const SupportTicketSystem = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Simulated ticket data
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Alice Johnson',
          userEmail: 'alice@example.com',
          subject: 'Unable to complete therapy session',
          description: 'The app crashes every time I try to start a therapy session. This has been happening for the past 3 days.',
          category: 'technical',
          priority: 'high',
          status: 'open',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          responses: [
            {
              id: '1',
              ticketId: '1',
              content: 'The app crashes every time I try to start a therapy session. This has been happening for the past 3 days.',
              respondedBy: 'user',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Bob Smith',
          userEmail: 'bob@example.com',
          subject: 'Billing question about premium upgrade',
          description: 'I was charged twice for my premium subscription this month.',
          category: 'billing',
          priority: 'medium',
          status: 'in_progress',
          assignedTo: 'Admin User',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          responses: [
            {
              id: '2',
              ticketId: '2',
              content: 'I was charged twice for my premium subscription this month.',
              respondedBy: 'user',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              ticketId: '2',
              content: 'I\'m looking into this billing issue for you. Can you please provide your payment method details?',
              respondedBy: 'admin',
              adminName: 'Admin User',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Carol Brown',
          userEmail: 'carol@example.com',
          subject: 'Feature request: Dark mode',
          description: 'Would love to have a dark mode option for the app.',
          category: 'feature',
          priority: 'low',
          status: 'resolved',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          responses: [
            {
              id: '4',
              ticketId: '3',
              content: 'Would love to have a dark mode option for the app.',
              respondedBy: 'user',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '5',
              ticketId: '3',
              content: 'Thank you for the suggestion! Dark mode is on our roadmap for the next release.',
              respondedBy: 'admin',
              adminName: 'Admin User',
              createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        )
      );

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: "Status updated",
        description: `Ticket marked as ${status.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const addResponse = async () => {
    if (!newResponse.trim() || !selectedTicket) return;

    setIsLoading(true);
    try {
      const response: TicketResponse = {
        id: Date.now().toString(),
        ticketId: selectedTicket.id,
        content: newResponse,
        respondedBy: 'admin',
        adminName: 'Admin User',
        createdAt: new Date().toISOString()
      };

      const updatedTicket = {
        ...selectedTicket,
        responses: [...selectedTicket.responses, response],
        updatedAt: new Date().toISOString(),
        status: 'in_progress' as const
      };

      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        )
      );

      setSelectedTicket(updatedTicket);
      setNewResponse('');

      toast({
        title: "Response added",
        description: "Your response has been sent to the user.",
      });
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: "Failed to add response",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <AlertCircle className="h-4 w-4" />;
      case 'billing': return <Ticket className="h-4 w-4" />;
      case 'feature': return <Flag className="h-4 w-4" />;
      case 'bug': return <AlertCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Support Tickets</h2>
          <p className="text-gray-400">Manage user support requests and issues</p>
        </div>
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Support Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 ${
                      selectedTicket?.id === ticket.id ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(ticket.category)}
                          <h4 className="font-medium text-white text-sm truncate">
                            {ticket.subject}
                          </h4>
                        </div>
                        <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{ticket.userName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {selectedTicket.userName} ({selectedTicket.userEmail})
                        </span>
                      </div>
                      <Badge className={`${getPriorityColor(selectedTicket.priority)} text-white`}>
                        {selectedTicket.priority}
                      </Badge>
                      <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Ticket conversation */}
                  <ScrollArea className="h-[400px] border border-gray-600 rounded p-4">
                    <div className="space-y-4">
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`flex ${response.respondedBy === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              response.respondedBy === 'admin'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium">
                                {response.respondedBy === 'admin' 
                                  ? response.adminName || 'Admin'
                                  : selectedTicket.userName
                                }
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(response.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{response.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Response form */}
                  <div className="space-y-2">
                    <Textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Type your response..."
                      className="bg-gray-700 border-gray-600"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button onClick={addResponse} disabled={isLoading || !newResponse.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-gray-400">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a ticket to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTicketSystem;
