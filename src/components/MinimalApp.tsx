
import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import MinimalLoginPage from '@/components/MinimalLoginPage';
import { MinimalAuthContext } from '@/components/MinimalAuthProvider';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';

class MinimalApp extends Component {
  static contextType = MinimalAuthContext;
  declare context: React.ContextType<typeof MinimalAuthContext>;

  render() {
    const { user, loading } = this.context;

    if (loading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      );
    }

    return (
      <MinimalErrorBoundary>
        <Routes>
          <Route 
            path="/" 
            element={<Index />} 
          />
          <Route 
            path="/login" 
            element={<MinimalLoginPage />} 
          />
          <Route 
            path="/auth" 
            element={<MinimalLoginPage />} 
          />
          <Route 
            path="/dashboard" 
            element={<Index />} 
          />
          <Route 
            path="*" 
            element={<Index />} 
          />
        </Routes>
      </MinimalErrorBoundary>
    );
  }
}

export default MinimalApp;
