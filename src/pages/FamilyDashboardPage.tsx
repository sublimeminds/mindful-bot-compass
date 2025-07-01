
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Eye, Bell } from 'lucide-react';

const FamilyDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50/30 to-balance-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Family Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monitor and support your family's mental wellness journey with privacy-focused tools and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Family Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage family accounts and permissions</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Eye className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle>Progress Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View family wellness trends and milestones</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Customizable privacy and sharing settings</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Bell className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>Wellness Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Receive important updates and notifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FamilyDashboardPage;
