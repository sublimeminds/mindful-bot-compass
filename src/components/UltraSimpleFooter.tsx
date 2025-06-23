
import React from 'react';

// Ultra-simple footer without any hooks or external dependencies
const UltraSimpleFooter = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937, #374151)',
      color: 'white',
      padding: '40px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Brand Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>T</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>TherapySync</h3>
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            margin: 0
          }}>
            AI-powered mental health platform with advanced voice technology.
          </p>
        </div>

        {/* Simple Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'white'
            }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="/therapysync-ai" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                TherapySync AI
              </a>
              <a href="/therapy" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                AI Therapy Chat
              </a>
              <a href="/dashboard" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                Dashboard
              </a>
            </div>
          </div>

          <div>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: 'white'
            }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="/help" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                Help Center
              </a>
              <a href="/crisis-resources" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                Crisis Support
              </a>
              <a href="/contact" style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                fontSize: '12px'
              }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '12px',
            margin: 0
          }}>
            © 2024 TherapySync. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
              Made with ♥ for mental wellness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UltraSimpleFooter;
