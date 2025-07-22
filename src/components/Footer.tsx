
import React from 'react';

const Footer = () => {
  console.log('🚨 EMERGENCY DEBUG: Footer component rendering');
  
  return (
    <footer className="w-full bg-green-500 text-white p-4 border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-lg font-bold">🚨 EMERGENCY: FOOTER IS VISIBLE</h3>
        <p>If you can see this, the footer layout structure works</p>
      </div>
    </footer>
  );
};

export default Footer;
