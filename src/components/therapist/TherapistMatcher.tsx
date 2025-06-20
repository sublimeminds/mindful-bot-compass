import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const TherapistMatcher = () => {
  const { user } = useSimpleApp();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock therapist data loading
    const loadTherapists = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTherapists([
          { id: '1', name: 'Dr. Smith', specialty: 'Anxiety' },
          { id: '2', name: 'Dr. Jones', specialty: 'Depression' }
        ]);
      } catch (error) {
        console.error('Error loading therapists:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTherapists();
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find a Therapist</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading therapists...</div>
        ) : (
          <ul>
            {therapists.map((therapist) => (
              <li key={therapist.id}>
                {therapist.name} - {therapist.specialty}
              </li>
            ))}
          </ul>
        )}
        <Button>Connect</Button>
      </CardContent>
    </Card>
  );
};

export default TherapistMatcher;
