import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Plus, Trash2, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { AdvancedBillingService, PaymentMethod } from '@/services/advancedBillingService';

const PaymentMethodManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingMethod, setAddingMethod] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    holderName: ''
  });

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const methods = await AdvancedBillingService.getPaymentMethods(user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast({
        title: "Error",
        description: "Failed to load payment methods.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user) return;

    setAddingMethod(true);
    try {
      await AdvancedBillingService.createPaymentMethod({
        userId: user.id,
        type: newMethod.type,
        card: {
          number: newMethod.cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(newMethod.expiryMonth),
          exp_year: parseInt(newMethod.expiryYear),
          cvc: newMethod.cvc
        },
        billing_details: {
          name: newMethod.holderName
        }
      });

      await loadPaymentMethods();
      setShowAddDialog(false);
      setNewMethod({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        holderName: ''
      });

      toast({
        title: "Success",
        description: "Payment method added successfully.",
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method.",
        variant: "destructive",
      });
    } finally {
      setAddingMethod(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    if (!user) return;

    try {
      await AdvancedBillingService.setDefaultPaymentMethod(user.id, methodId);
      await loadPaymentMethods();
      
      toast({
        title: "Success",
        description: "Default payment method updated.",
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!user) return;

    try {
      await AdvancedBillingService.deletePaymentMethod(user.id, methodId);
      await loadPaymentMethods();
      
      toast({
        title: "Success",
        description: "Payment method removed.",
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method.",
        variant: "destructive",
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const icons: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      default: '💳'
    };
    return icons[brand?.toLowerCase()] || icons.default;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading payment methods...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Methods
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod(prev => ({
                      ...prev,
                      cardNumber: formatCardNumber(e.target.value)
                    }))}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select value={newMethod.expiryMonth} onValueChange={(value) => setNewMethod(prev => ({ ...prev, expiryMonth: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select value={newMethod.expiryYear} onValueChange={(value) => setNewMethod(prev => ({ ...prev, expiryYear: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={newMethod.cvc}
                      onChange={(e) => setNewMethod(prev => ({
                        ...prev,
                        cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                      }))}
                      maxLength={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="holderName">Cardholder Name</Label>
                    <Input
                      id="holderName"
                      placeholder="John Doe"
                      value={newMethod.holderName}
                      onChange={(e) => setNewMethod(prev => ({
                        ...prev,
                        holderName: e.target.value
                      }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddPaymentMethod}
                    disabled={addingMethod || !newMethod.cardNumber || !newMethod.expiryMonth || !newMethod.expiryYear || !newMethod.cvc}
                  >
                    {addingMethod ? "Adding..." : "Add Method"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No payment methods added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add a payment method to manage your subscription</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getCardBrandIcon(method.cardBrand || 'default')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {method.cardBrand?.toUpperCase()} ending in {method.cardLast4}
                      </span>
                      {method.isDefault && (
                        <Badge variant="secondary" className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.cardExpMonth?.toString().padStart(2, '0')}/{method.cardExpYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteMethod(method.id)}
                    disabled={method.isDefault && paymentMethods.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodManager;