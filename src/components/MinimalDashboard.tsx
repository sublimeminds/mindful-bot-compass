
import React, { Component } from 'react';
import { MinimalAuthContext } from '@/components/MinimalAuthProvider';

class MinimalDashboard extends Component {
  static contextType = MinimalAuthContext;
  declare context: React.ContextType<typeof MinimalAuthContext>;

  render() {
    const { user, logout } = this.context;

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              TherapySync Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ color: '#6b7280' }}>
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              Welcome to Your Mental Health Journey
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '30px'
            }}>
              This is your minimal dashboard. The app is now running reliably with a simple foundation.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '6px'
              }}>
                <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Start Session</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Begin your AI therapy session
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '6px'
              }}>
                <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Track Mood</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Log your current mood and feelings
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '6px'
              }}>
                <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>View Progress</h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  See your mental health journey
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default MinimalDashboard;
