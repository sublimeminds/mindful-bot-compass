
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Ticket
} from 'lucide-react';
import { SupportService, SupportTicket } from '@/services/supportService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SupportLayout from '@/components/layout/SupportLayout';

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });

  useEffect(() => {
    if (user) {
      loadUserTickets();
    }
  }, [user]);

  const loadUserTickets = async () => {
    if (!user) return;
    
    try {
      const data = await SupportService.getUserSupportTickets(user.id);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a support ticket",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const ticket = await SupportService.createSupportTicket({
        userId: user.id,
        subject: formData.subject,
        description: formData.description,
        category: formData.category as any,
        priority: formData.priority,
        status: 'open'
      });

      if (ticket) {
        toast({
          title: "Ticket Created",
          description: `Your support ticket #${ticket.id.substring(0, 8)} has been created successfully`,
        });
        
        setFormData({
          subject: '',
          description: '',
          category: '',
          priority: 'medium'
        });
        
        loadUserTickets();
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SupportLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-8 w-8 text-therapy-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-700 to-therapy-900 bg-clip-text text-transparent">
                Contact Support
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Get help from our support team or browse your existing tickets
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card className="border-therapy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-therapy-900">
                  <Send className="h-5 w-5" />
                  <span>Submit a Support Ticket</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-therapy-900">Subject *</label>
                    <Input
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="border-therapy-200 focus:border-therapy-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-therapy-900">Category *</label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="border-therapy-200 focus:border-therapy-500">
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-therapy-900">Priority</label>
                    <Select 
                      value={formData.priority} 
                      onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                    >
                      <SelectTrigger className="border-therapy-200 focus:border-therapy-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-therapy-900">Description *</label>
                    <Textarea
                      placeholder="Please provide detailed information about your issue..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[120px] border-therapy-200 focus:border-therapy-500"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white" 
                    disabled={loading || !user}
                  >
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                  </Button>

                  {!user && (
                    <p className="text-sm text-gray-500 text-center">
                      Please log in to submit a support ticket
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Support Info */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <Card className="border-therapy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-therapy-900">Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-therapy-600" />
                    <div>
                      <p className="font-medium text-therapy-900">Email Support</p>
                      <p className="text-sm text-gray-600">support@therapyai.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-therapy-600" />
                    <div>
                      <p className="font-medium text-therapy-900">Live Chat</p>
                      <p className="text-sm text-gray-600">Available during business hours</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-therapy-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-therapy-900">Before You Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    You might find your answer faster in our self-help resources:
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-therapy-200 text-therapy-600 hover:bg-therapy-50" 
                      onClick={() => window.location.href = '/faq'}
                    >
                      Browse FAQ
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-therapy-200 text-therapy-600 hover:bg-therapy-50" 
                      onClick={() => window.location.href = '/help'}
                    >
                      Help Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* User Tickets */}
          {user && tickets.length > 0 && (
            <Card className="border-therapy-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-therapy-900">
                  <Ticket className="h-5 w-5" />
                  <span>Your Support Tickets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pb-8">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-therapy-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-therapy-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Ticket #{ticket.id.substring(0, 8)}</span>
                        <span>Created {ticket.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SupportLayout>
  );
};

export default Contact;
