import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Billing = () => {
  const billingHistory = [
    { id: 1, date: '2024-01-15', amount: '$29.99', status: 'paid', plan: 'Pro Monthly' },
    { id: 2, date: '2023-12-15', amount: '$29.99', status: 'paid', plan: 'Pro Monthly' },
    { id: 3, date: '2023-11-15', amount: '$29.99', status: 'paid', plan: 'Pro Monthly' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-800">Billing & Payments</h1>
          <p className="text-slate-600 mt-2">Manage your subscription and billing information</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-therapy-600" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Pro Monthly</h3>
              <p className="text-slate-600">Full access to all AI therapists and features</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-therapy-600">$29.99</div>
              <div className="text-sm text-slate-500">per month</div>
              <Button className="mt-3">Manage Plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-therapy-600" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{bill.plan}</div>
                    <div className="text-sm text-slate-500">{bill.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{bill.amount}</div>
                  <Badge variant="outline" className="text-xs text-green-600">
                    {bill.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-therapy-600" />
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-slate-500">Expires 12/26</div>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;