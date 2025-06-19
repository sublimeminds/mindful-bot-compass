
import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import MinimalHomePage from '@/components/MinimalHomePage';
import MinimalDashboard from '@/components/MinimalDashboard';
import MinimalLoginPage from '@/components/MinimalLoginPage';
import { MinimalAuthContext } from '@/components/MinimalAuthProvider';

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
      <Routes>
        <Route 
          path="/" 
          element={user ? <MinimalDashboard /> : <MinimalHomePage />} 
        />
        <Route 
          path="/login" 
          element={<MinimalLoginPage />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <MinimalDashboard /> : <MinimalLoginPage />} 
        />
        <Route 
          path="*" 
          element={user ? <MinimalDashboard /> : <MinimalHomePage />} 
        />
      </Routes>
    );
  }
}

export default MinimalApp;
