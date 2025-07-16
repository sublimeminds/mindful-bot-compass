import React from 'react';
import AdminLayoutEnhanced from '@/components/admin/AdminLayoutEnhanced';
import FraudMonitoringDashboard from '@/components/admin/fraud/FraudMonitoringDashboard';

const AdminFraudMonitoring = () => {
  return (
    <AdminLayoutEnhanced>
      <FraudMonitoringDashboard />
    </AdminLayoutEnhanced>
  );
};

export default AdminFraudMonitoring;