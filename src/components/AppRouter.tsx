
import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';

class AppRouter extends Component {
  render() {
    return (
      <MinimalErrorBoundary>
        <Routes>
          <Route 
            path="/" 
            element={<Index />} 
          />
          <Route 
            path="/auth" 
            element={<Auth />} 
          />
          <Route 
            path="/login" 
            element={<Login />} 
          />
          <Route 
            path="/register" 
            element={<Register />} 
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

export default AppRouter;
