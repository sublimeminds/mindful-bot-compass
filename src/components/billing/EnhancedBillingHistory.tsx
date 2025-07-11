import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Receipt, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  CreditCard
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { AdvancedBillingService, Invoice, FailedPayment } from '@/services/advancedBillingService';
import { format } from 'date-fns';

const EnhancedBillingHistory = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [failedPayments, setFailedPayments] = useState<FailedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  useEffect(() => {
    if (user) {
      loadBillingData();
    }
  }, [user]);

  const loadBillingData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [invoicesData, failedData] = await Promise.all([
        AdvancedBillingService.getInvoices(user.id),
        AdvancedBillingService.getFailedPayments(user.id)
      ]);
      
      setInvoices(invoicesData);
      setFailedPayments(failedData);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Error",
        description: "Failed to load billing history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryFailedPayment = async (paymentId: string) => {
    try {
      await AdvancedBillingService.retryFailedPayment(paymentId);
      await loadBillingData();
      
      toast({
        title: "Payment Retry Initiated",
        description: "We'll attempt to process your payment again.",
      });
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast({
        title: "Error",
        description: "Failed to retry payment.",
        variant: "destructive",
      });
    }
  };

  const downloadInvoice = async (invoice: Invoice) => {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    } else {
      toast({
        title: "PDF Not Available",
        description: "Invoice PDF is being generated. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'void': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'uncollectible': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'open': return <Clock className="h-4 w-4" />;
      case 'void': return <X className="h-4 w-4" />;
      case 'uncollectible': return <AlertTriangle className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading billing history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Failed Payments Alert */}
      {failedPayments.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Payment Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {failedPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium">Failed payment: ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.failureReason} • {payment.retryCount} retry attempts
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => retryFailedPayment(payment.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Retry Payment
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Billing History
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
              <p className="text-sm text-muted-foreground mt-1">Your billing history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
                        {invoice.taxType && ` • ${invoice.taxType.toUpperCase()}: ${((invoice.taxRate || 0) * 100).toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">${invoice.amountTotal.toFixed(2)} {invoice.currency.toUpperCase()}</div>
                      {invoice.amountTax > 0 && (
                        <div className="text-sm text-muted-foreground">
                          ${invoice.amountSubtotal.toFixed(2)} + ${invoice.amountTax.toFixed(2)} tax
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Invoice Details - {invoice.invoiceNumber}</DialogTitle>
                          </DialogHeader>
                          {selectedInvoice && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Invoice Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <div>Date: {format(new Date(selectedInvoice.invoiceDate), 'MMM dd, yyyy')}</div>
                                    <div>Status: {selectedInvoice.status}</div>
                                    {selectedInvoice.paymentDueDate && (
                                      <div>Due: {format(new Date(selectedInvoice.paymentDueDate), 'MMM dd, yyyy')}</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Amount Breakdown</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>${selectedInvoice.amountSubtotal.toFixed(2)}</span>
                                    </div>
                                    {selectedInvoice.amountTax > 0 && (
                                      <div className="flex justify-between">
                                        <span>{selectedInvoice.taxType?.toUpperCase()} ({((selectedInvoice.taxRate || 0) * 100).toFixed(1)}%):</span>
                                        <span>${selectedInvoice.amountTax.toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-medium border-t pt-1">
                                      <span>Total:</span>
                                      <span>${selectedInvoice.amountTotal.toFixed(2)} {selectedInvoice.currency.toUpperCase()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedInvoice.lineItems && selectedInvoice.lineItems.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Line Items</h4>
                                  <div className="space-y-2">
                                    {selectedInvoice.lineItems.map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between p-2 bg-accent rounded">
                                        <span>{item.description}</span>
                                        <span>${(item.amount / 100).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {invoice.pdfUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBillingHistory;