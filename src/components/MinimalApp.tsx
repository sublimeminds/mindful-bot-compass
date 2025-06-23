
import React, { Component } from 'react';

interface State {
  isReactReady: boolean;
  stage: 'init' | 'basic' | 'full';
}

// Ultra-minimal app component using class-based approach to avoid hooks during initialization
class MinimalApp extends Component<{}, State> {
  state: State = {
    isReactReady: false,
    stage: 'init'
  };

  componentDidMount() {
    console.log('MinimalApp: Starting React initialization...');
    
    // Stage 1: Validate React is working
    setTimeout(() => {
      console.log('MinimalApp: React validation complete');
      this.setState({ isReactReady: true, stage: 'basic' });
      
      // Stage 2: Load basic components
      setTimeout(() => {
        console.log('MinimalApp: Loading full application...');
        this.setState({ stage: 'full' });
      }, 100);
    }, 50);
  }

  render() {
    const { isReactReady, stage } = this.state;

    if (!isReactReady) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Initializing TherapySync...</p>
          </div>
        </div>
      );
    }

    if (stage === 'basic') {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
          fontFamily: 'system-ui, sans-serif'
        }}>
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
                TherapySync
              </h1>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}>
                Get Started
              </button>
            </div>
          </header>
          
          <main style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
          }}>
            <div style={{
              maxWidth: '600px',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                Loading Full Experience...
              </h2>
              <p style={{
                fontSize: '20px',
                color: '#6b7280',
                marginBottom: '40px'
              }}>
                Preparing your AI mental health companion
              </p>
            </div>
          </main>
        </div>
      );
    }

    // Stage 3: Load full application with lazy loading
    return this.renderFullApp();
  }

  private renderFullApp() {
    try {
      // Dynamically import and render the full app
      const FullApp = React.lazy(() => import('./FullApp'));
      
      return (
        <React.Suspense fallback={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Loading application...
          </div>
        }>
          <FullApp />
        </React.Suspense>
      );
    } catch (error) {
      console.error('MinimalApp: Error loading full app', error);
      return this.renderErrorFallback();
    }
  }

  private renderErrorFallback() {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee2e2',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>
            Application Error
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            There was an error loading the application. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default MinimalApp;
