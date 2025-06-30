
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, Mail, Search, FileText, AlertCircle, CheckCircle, Clock, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveChatWidget from '@/components/support/LiveChatWidget';
import FAQSection from '@/components/support/FAQSection';
import SupportTicketForm from '@/components/support/SupportTicketForm';

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  useSafeSEO({
    title: 'Support Center - TherapySync Help & Resources',
    description: 'Get comprehensive support for your mental health journey. FAQ, live chat, tickets, and crisis resources.',
    keywords: 'mental health support, therapy help, crisis support, AI therapy assistance, helpdesk'
  });

  const supportStats = [
    { label: 'Avg Response Time', value: '< 2 hours', icon: Clock },
    { label: 'Issues Resolved', value: '98.5%', icon: CheckCircle },
    { label: 'Crisis Support', value: '24/7', icon: AlertCircle },
    { label: 'Languages', value: '29', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support Center
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                We're Here to Help You Heal
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Get instant support for your mental health journey. Our AI-powered help system connects you 
              with the right resources, from automated solutions to human counselors.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles, FAQs, or describe your issue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-therapy-200 focus:border-therapy-500 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Support Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {supportStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 therapy-gradient-bg rounded-xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold therapy-text-gradient mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Support Tabs */}
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                <TabsTrigger value="faq" className="data-[state=active]:therapy-gradient-bg data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  FAQ & Help
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:therapy-gradient-bg data-[state=active]:text-white">
                  <Bot className="h-4 w-4 mr-2" />
                  Live Chat
                </TabsTrigger>
                <TabsTrigger value="ticket" className="data-[state=active]:therapy-gradient-bg data-[state=active]:text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Create Ticket
                </TabsTrigger>
                <TabsTrigger value="crisis" className="data-[state=active]:therapy-gradient-bg data-[state=active]:text-white">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Crisis Support
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq">
                <FAQSection searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="chat">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-6 w-6 mr-2 text-therapy-600" />
                      AI-Powered Live Support
                    </CardTitle>
                    <p className="text-slate-600">
                      Get instant help from our AI support agent, with seamless escalation to human counselors when needed.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <LiveChatWidget />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ticket">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-6 w-6 mr-2 text-therapy-600" />
                      Create Support Ticket
                    </CardTitle>
                    <p className="text-slate-600">
                      Submit a detailed support request for complex issues that require thorough investigation.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <SupportTicketForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crisis">
                <Card className="bg-red-50 border-red-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-700">
                      <AlertCircle className="h-6 w-6 mr-2" />
                      Crisis Support - Available 24/7
                    </CardTitle>
                    <p className="text-red-600">
                      If you're experiencing a mental health crisis or having thoughts of self-harm, immediate help is available.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        size="lg" 
                        className="bg-red-600 hover:bg-red-700 text-white h-16"
                        onClick={() => navigate('/crisis-support')}
                      >
                        <Phone className="h-6 w-6 mr-2" />
                        Crisis Hotline Resources
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-red-300 text-red-700 hover:bg-red-50 h-16"
                        onClick={() => navigate('/crisis-resources')}
                      >
                        <User className="h-6 w-6 mr-2" />
                        Emergency Contacts
                      </Button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-700 mb-2">Immediate Crisis Resources:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        <li>• National Suicide Prevention Lifeline: 988</li>
                        <li>• Crisis Text Line: Text HOME to 741741</li>
                        <li>• Emergency Services: 911</li>
                        <li>• SAMHSA National Helpline: 1-800-662-4357</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
