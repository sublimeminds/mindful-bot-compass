
import React from 'react';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import CrisisInterventionDashboard from '@/components/safety/CrisisInterventionDashboard';
import { Shield, AlertTriangle } from 'lucide-react';

const AdminCrisisManagement = () => {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Crisis Management Dashboard</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real-time crisis monitoring, intervention tools, and emergency response management.
            </p>
          </div>

          <CrisisInterventionDashboard />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminCrisisManagement;
