
import React from 'react';

const Footer = () => {
  console.log('🔍 Footer: Component rendering - SHOULD BE VISIBLE AT BOTTOM');
  
  return (
    <footer 
      style={{ 
        width: '100%', 
        backgroundColor: '#ffffff', 
        borderTop: '1px solid #e5e7eb',
        minHeight: '200px',
        display: 'block',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
              TherapySync
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              AI-powered mental health support designed to help you on your wellness journey.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '500', marginBottom: '12px', color: '#111827' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/#features" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Features</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/#pricing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Pricing</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/security" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Security</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '500', marginBottom: '12px', color: '#111827' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/help" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Help Center</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/contact" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/privacy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '32px', paddingTop: '32px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            &copy; 2024 TherapySync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
