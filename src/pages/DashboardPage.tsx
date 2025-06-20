
import React from 'react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DashboardPage = () => {
  const { user } = useSimpleApp();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="mb-4">You are logged in as: {user?.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-600">Your dashboard features will be available soon.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Manage your account and preferences.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
