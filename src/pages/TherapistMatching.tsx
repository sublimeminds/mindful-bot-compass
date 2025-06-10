
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TherapistMatcher from '@/components/therapist/TherapistMatcher';

const TherapistMatching = () => {
  const navigate = useNavigate();

  const handleTherapistSelected = (therapistId: string) => {
    console.log('Selected therapist:', therapistId);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <TherapistMatcher 
          onTherapistSelected={handleTherapistSelected}
          onClose={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default TherapistMatching;
