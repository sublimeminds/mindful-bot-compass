
import React from 'react';
import UltraSimpleHeader from '@/components/UltraSimpleHeader';
import UltraSimpleFooter from '@/components/UltraSimpleFooter';

// Ultra-simple landing page without any hooks or complex dependencies
const UltraSimpleIndex = () => {
  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  const handleTryAI = () => {
    window.location.href = '/therapysync-ai';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)'
    }}>
      <UltraSimpleHeader />
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            ⚡ Advanced AI Voice Technology
          </div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Transform Your Mental Health
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              with AI-Powered Therapy
            </span>
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            marginBottom: '32px',
            maxWidth: '700px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Experience personalized therapy with advanced AI technology, natural voice conversations, 
            and 24/7 crisis support. Your mental wellness journey starts here.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '48px'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ♥ Start Your Journey →
            </button>
            <button
              onClick={handleTryAI}
              style={{
                background: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🧠 Try TherapySync AI
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ HIPAA Compliant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ End-to-End Encryption
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ Evidence-Based Approaches
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ 24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '60px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          textAlign: 'center'
        }}>
          {[
            { number: "98%", label: "AI Accuracy Rate", icon: "🧠" },
            { number: "29", label: "Languages Supported", icon: "🌐" },
            { number: "24/7", label: "Crisis Support", icon: "🛡️" },
            { number: "8", label: "AI Therapists", icon: "👥" }
          ].map((stat, index) => (
            <div key={index}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {stat.number}
              </div>
              <div style={{ color: '#6b7280' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>
            Ready to Transform Your Mental Health?
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            Join thousands who have found healing, growth, and peace through our AI-powered therapy platform.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                background: 'white',
                color: '#3b82f6',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ♥ Start Free Trial
            </button>
            <button
              onClick={() => window.location.href = '/plans'}
              style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              👑 View Plans
            </button>
          </div>
        </div>
      </section>

      <UltraSimpleFooter />
    </div>
  );
};

export default UltraSimpleIndex;
