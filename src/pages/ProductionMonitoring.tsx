import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ProductionMonitoringDashboard from '@/components/monitoring/ProductionMonitoringDashboard';

const ProductionMonitoring = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-monitoring-50 to-system-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-monitoring-600 mx-auto mb-4"></div>
          <p className="text-monitoring-600 font-medium">Loading Production Monitoring...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ProductionMonitoringDashboard />;
};

export default ProductionMonitoring;