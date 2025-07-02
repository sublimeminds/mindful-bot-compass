import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EnterpriseB2BDashboard from '@/components/enterprise/EnterpriseB2BDashboard';

const EnterpriseB2B = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-enterprise-50 to-b2b-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enterprise-600 mx-auto mb-4"></div>
          <p className="text-enterprise-600 font-medium">Loading Enterprise Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <EnterpriseB2BDashboard />;
};

export default EnterpriseB2B;