
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { MinimalAuthContext } from '@/components/MinimalAuthProvider';

interface State {
  email: string;
  password: string;
  error: string;
  isLoading: boolean;
}

class MinimalLoginPage extends Component<{}, State> {
  static contextType = MinimalAuthContext;
  declare context: React.ContextType<typeof MinimalAuthContext>;

  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      isLoading: false,
    };
  }

  private handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { login } = this.context;

    if (!email || !password) {
      this.setState({ error: 'Please fill in all fields' });
      return;
    }

    this.setState({ isLoading: true, error: '' });

    try {
      await login(email, password);
    } catch (error) {
      this.setState({ 
        error: 'Login failed. Please try again.',
        isLoading: false 
      });
    }
  };

  render() {
    const { user } = this.context;
    const { email, password, error, isLoading } = this.state;

    // Redirect if already logged in
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            color: '#1f2937'
          }}>
            Sign In to TherapySync
          </h2>

          <form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#374151',
                fontSize: '14px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#374151',
                fontSize: '14px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Demo: Use any email and password to sign in
          </p>
        </div>
      </div>
    );
  }
}

export default MinimalLoginPage;
