
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MinimalHomePage extends Component {
  render() {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Simple header */}
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
            <Link
              to="/login"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
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
              Your AI Mental Health Companion
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Advanced AI therapy with crisis detection, cultural awareness, 
              and personalized care available 24/7.
            </p>
            <Link
              to="/login"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '18px',
                display: 'inline-block'
              }}
            >
              Get Started
            </Link>
          </div>
        </main>

        {/* Simple footer */}
        <footer style={{
          backgroundColor: 'white',
          padding: '20px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            © 2024 TherapySync. Your mental health matters.
          </p>
        </footer>
      </div>
    );
  }
}

export default MinimalHomePage;
