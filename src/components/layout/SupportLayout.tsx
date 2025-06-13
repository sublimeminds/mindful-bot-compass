
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SupportLayoutProps {
  children: React.ReactNode;
}

const SupportLayout: React.FC<SupportLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default SupportLayout;
