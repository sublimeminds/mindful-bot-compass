import React, { Component } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {}

interface State {
  isSignUp: boolean;
  loading: boolean;
  error: string;
  success: string;
}

// Completely hook-free auth form using class component
export class StaticAuthForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSignUp: true,
      loading: false,
      error: '',
      success: ''
    };
  }

  // Vanilla form submission without hooks
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ loading: true, error: '', success: '' });

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    try {
      if (this.state.isSignUp) {
        // Sign Up
        if (password !== confirmPassword) {
          this.setState({ 
            error: 'Passwords do not match', 
            loading: false 
          });
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          this.setState({ error: error.message, loading: false });
          return;
        }

        this.setState({ 
          success: 'Account created! Please check your email to verify.',
          loading: false 
        });
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 2000);
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          this.setState({ error: error.message, loading: false });
          return;
        }

        this.setState({ 
          success: 'Welcome back! Redirecting...',
          loading: false 
        });
        
        // Redirect after success
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect') || '/dashboard';
          window.location.href = redirect;
        }, 1000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      this.setState({ 
        error: 'Something went wrong. Please try again.',
        loading: false 
      });
    }
  };

  toggleMode = () => {
    this.setState({ 
      isSignUp: !this.state.isSignUp,
      error: '',
      success: ''
    });
  };

  getSelectedPlan = () => {
    try {
      const saved = localStorage.getItem('selectedPlan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  render() {
    const { isSignUp, loading, error, success } = this.state;
    const selectedPlan = this.getSelectedPlan();

    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 via-therapy-50 to-flow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </CardTitle>
              <p className="text-slate-600 text-lg">
                {isSignUp 
                  ? 'Join thousands who have found healing with TherapySync' 
                  : 'Continue your mental wellness journey'
                }
              </p>
              {selectedPlan && (
                <div className="mt-4 p-4 bg-gradient-to-r from-therapy-50 to-harmony-50 rounded-xl border border-therapy-200">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-therapy-600 mr-2" />
                    <span className="font-medium text-therapy-700">Plan Selected</span>
                  </div>
                  <p className="text-sm font-bold text-therapy-800">
                    {selectedPlan.name} - {selectedPlan.price}{selectedPlan.period}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Email/Password Form */}
              <form onSubmit={this.handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-therapy-300 focus:outline-none"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-therapy-300 focus:outline-none"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-therapy-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-therapy-300 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md focus:border-therapy-300 focus:outline-none"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold mt-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
                </button>
              </form>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={this.toggleMode}
                  className="text-therapy-600 hover:text-therapy-700 font-medium transition-colors"
                  disabled={loading}
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : 'Need an account? Sign up'
                  }
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="text-center mt-6 text-sm text-slate-500">
            <p>Protected by enterprise-grade security • HIPAA compliant</p>
          </div>
        </div>
      </div>
    );
  }
}

export default StaticAuthForm;