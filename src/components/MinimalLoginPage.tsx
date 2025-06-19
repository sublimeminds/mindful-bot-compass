
import React, { Component, FormEvent } from 'react';
import { SimpleAppContext } from '@/components/SimpleAppProvider';

interface State {
  email: string;
  password: string;
  loading: boolean;
  error: string;
}

class MinimalLoginPage extends Component<{}, State> {
  static contextType = SimpleAppContext;
  declare context: React.ContextType<typeof SimpleAppContext>;

  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      error: '',
    };
  }

  private handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });

    try {
      await this.context.login(this.state.email, this.state.password);
      // Navigation will be handled by the app state change
    } catch (error) {
      this.setState({ 
        error: 'Login failed. Please try again.',
        loading: false 
      });
    }
  };

  render() {
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
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            color: '#1f2937'
          }}>
            Welcome to TherapySync
          </h1>

          <form onSubmit={this.handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                type="email"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Password
              </label>
              <input
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            {this.state.error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {this.state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={this.state.loading}
              style={{
                width: '100%',
                backgroundColor: this.state.loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: this.state.loading ? 'not-allowed' : 'pointer'
              }}
            >
              {this.state.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Use any email and password to sign in
          </p>
        </div>
      </div>
    );
  }
}

export default MinimalLoginPage;
