import React from 'react';

// Ultra-minimal emergency app with zero dependencies
const EmergencyApp = () => {
  console.log('EmergencyApp: Rendering emergency app...');
  
  const handleNavigation = (path: string) => {
    console.log('EmergencyApp: Navigating to', path);
    try {
      window.history.pushState({}, '', path);
      window.location.reload();
    } catch (error) {
      console.error('EmergencyApp: Navigation failed', error);
      window.location.href = path;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff, #ecfdf5)', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '1rem 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <button 
            onClick={() => handleNavigation('/')}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1e40af',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🧠 TherapySync
          </button>
          
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => handleNavigation('/features')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#475569',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem'
              }}
            >
              Features
            </button>
            <button 
              onClick={() => handleNavigation('/pricing')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#475569',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem'
              }}
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavigation('/auth')}
              style={{ 
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)', 
                border: 'none', 
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.375rem',
                fontWeight: '600'
              }}
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ padding: '4rem 1rem' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          textAlign: 'center' 
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)', 
            borderRadius: '50%', 
            margin: '0 auto 2rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            🧠
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #1e40af, #0891b2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your AI Therapy Companion
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#64748b', 
            maxWidth: '600px', 
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Experience personalized mental health support with advanced AI therapy, 
            voice technology, and 24/7 crisis support.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => handleNavigation('/onboarding')}
              style={{ 
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)', 
                border: 'none', 
                color: 'white',
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              ❤️ Start Free Trial
            </button>
            <button 
              onClick={() => handleNavigation('/demo')}
              style={{ 
                background: 'white', 
                border: '2px solid #e2e8f0', 
                color: '#475569',
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              💬 Try Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section style={{ 
        padding: '4rem 1rem', 
        background: 'rgba(255, 255, 255, 0.5)' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '3rem',
            background: 'linear-gradient(to right, #1e40af, #0891b2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Advanced Mental Health Features
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              { icon: '🧠', title: 'Advanced AI Therapy', desc: 'Personalized therapy sessions with AI trained in multiple therapeutic approaches.' },
              { icon: '🎧', title: 'Voice Technology', desc: 'Natural voice conversations with emotion detection in 29 languages.' },
              { icon: '🛡️', title: '24/7 Crisis Support', desc: 'Immediate crisis intervention with automated detection and safety planning.' },
              { icon: '🌍', title: 'Cultural Sensitivity', desc: 'AI trained to understand diverse cultural backgrounds and provide appropriate support.' },
              { icon: '👥', title: 'Family Plans', desc: 'Comprehensive family mental health support with adaptive pricing.' },
              { icon: '💖', title: 'Mood Analytics', desc: 'Advanced mood tracking with AI-powered insights and recommendations.' }
            ].map((feature, index) => (
              <div key={index} style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '1rem', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem' 
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem' 
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#64748b', 
                  lineHeight: '1.5' 
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: '#1e293b', 
        color: 'white', 
        padding: '2rem 1rem', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <p style={{ marginBottom: '1rem' }}>
            🧠 TherapySync - AI-Powered Mental Health Support
          </p>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.875rem' 
          }}>
            © 2024 TherapySync. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EmergencyApp;