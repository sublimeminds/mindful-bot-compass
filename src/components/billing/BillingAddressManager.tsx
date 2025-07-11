import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { AdvancedBillingService, BillingAddress } from '@/services/advancedBillingService';

const BillingAddressManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<BillingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<BillingAddress | null>(null);
  const [newAddress, setNewAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    taxId: '',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const addressData = await AdvancedBillingService.getBillingAddresses(user.id);
      setAddresses(addressData);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load billing addresses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;

    try {
      if (editingAddress) {
        await AdvancedBillingService.updateBillingAddress(user.id, editingAddress.id, newAddress);
      } else {
        await AdvancedBillingService.createBillingAddress(user.id, newAddress);
      }

      await loadAddresses();
      setShowAddDialog(false);
      setEditingAddress(null);
      setNewAddress({
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        taxId: '',
        isDefault: false
      });

      toast({
        title: "Success",
        description: editingAddress ? "Address updated successfully." : "Address added successfully.",
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: BillingAddress) => {
    setEditingAddress(address);
    setNewAddress({
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode,
      country: address.country,
      taxId: address.taxId || '',
      isDefault: address.isDefault
    });
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading addresses...</p>
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
            <MapPin className="h-5 w-5 mr-2" />
            Billing Addresses
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    value={newAddress.line1}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    value={newAddress.line2}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                    placeholder="Apt 4B"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="NY"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="10001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={newAddress.country} onValueChange={(value) => setNewAddress(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number (Optional)</Label>
                  <Input
                    id="taxId"
                    value={newAddress.taxId}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, taxId: e.target.value }))}
                    placeholder="Tax identification number"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAddDialog(false);
                    setEditingAddress(null);
                    setNewAddress({
                      line1: '',
                      line2: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: 'US',
                      taxId: '',
                      isDefault: false
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveAddress}
                    disabled={!newAddress.line1 || !newAddress.city || !newAddress.postalCode}
                  >
                    {editingAddress ? 'Update' : 'Add'} Address
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No billing addresses added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add an address for billing and tax purposes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {address.isDefault && (
                      <Badge variant="secondary" className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    <div>{address.line1}</div>
                    {address.line2 && <div>{address.line2}</div>}
                    <div>{address.city}, {address.state} {address.postalCode}</div>
                    <div>{address.country}</div>
                    {address.taxId && (
                      <div className="text-muted-foreground mt-1">
                        Tax ID: {address.taxId}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4" />
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

export default BillingAddressManager;