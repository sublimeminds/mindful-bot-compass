
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Simplified billing history without auth context dependency
const SimpleBillingHistory = () => {
  // Mock data for now
  const billingHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 29.99,
      status: 'paid',
      plan: 'Basic Plan'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: 29.99,
      status: 'paid',
      plan: 'Basic Plan'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billingHistory.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{bill.plan}</div>
                <div className="text-sm text-muted-foreground">{bill.date}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${bill.amount}</div>
                <Badge className={getStatusColor(bill.status)}>
                  {bill.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleBillingHistory;
