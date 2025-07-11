import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TherapistMatcher from '@/components/therapist/TherapistMatcher';

const TherapistSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { matches, assessmentId } = location.state || {};

  const handleTherapistSelected = (therapistId: string) => {
    // Will be handled by TherapistSelectionFlow component
    console.log('Therapist selected:', therapistId);
  };

  const handleBack = () => {
    navigate('/therapist-discovery');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discovery
          </Button>
        </div>
        
        <TherapistMatcher
          assessmentMatches={matches}
          assessmentId={assessmentId}
          onTherapistSelected={handleTherapistSelected}
          onClose={handleBack}
        />
      </div>
    </div>
  );
};

export default TherapistSelectionPage;