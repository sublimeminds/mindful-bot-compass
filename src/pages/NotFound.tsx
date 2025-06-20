
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-therapy-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-therapy-800 mb-4">Page Not Found</h2>
          <p className="text-therapy-600 mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. Let's get you back on track.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
            >
              Go Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="border-therapy-300 text-therapy-700 hover:bg-therapy-50"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
