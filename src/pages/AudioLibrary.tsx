
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AudioContentLibrary from '@/components/audio/AudioContentLibrary';
import { useAuth } from '@/hooks/useAuth';

const AudioLibrary = () => {
  const { user } = useAuth();

  useSafeSEO({
    title: 'Audio Content Library - Therapeutic Podcasts & Meditations | TherapySync',
    description: 'Access our comprehensive library of therapeutic audio content including guided meditations, educational podcasts, and therapy technique exercises powered by ElevenLabs AI.',
    keywords: 'therapeutic audio, meditation library, therapy podcasts, guided meditations, mental health audio, AI voice therapy, ElevenLabs'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AudioContentLibrary userId={user?.id} />
      </main>
      
      <Footer />
    </div>
  );
};

export default AudioLibrary;
