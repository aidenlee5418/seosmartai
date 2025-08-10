"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Toaster, toast } from './ui/sonner'

interface AuthPageProps {
  onUserChange: (user: any, session: any) => void;
  onBackToLanding: () => void;
}


function useInviteAccept() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (!invite) return;
    // On auth state change after login, call accept
    (async () => {
      const token = (await import('../utils/supabase/client')).supabase;
      const session = (await token.auth.getSession()).data.session;
      if (!session) return;
      await fetch(`/functions/v1/accept-invite?token=${invite}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    })();
  }, []);
}
export function AuthPage({ onUserChange, onBackToLanding }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // For signup, create user via server endpoint first
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-fb0be124/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password, name })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Signup failed');
        }

        toast.success('Account created successfully! Please sign in.');
        setIsSignUp(false);
        
        // Clear the form
        setName('');
        setPassword('');
      } else {
        // For signin, use Supabase client
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) {
          console.error('Signin error:', error);
          throw new Error(error.message);
        }

        if (data?.session && data?.user) {
          onUserChange(data.user, data.session);
          toast.success('Welcome to SmartSEO AI!');
        } else {
          throw new Error('No session returned from signin');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      // Handle specific error cases
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Please check your email and confirm your account.');
      } else if (errorMessage.includes('User already registered')) {
        toast.error('An account with this email already exists. Please sign in instead.');
        setIsSignUp(false);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) {
        console.error('Google auth error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Google authentication failed. Please try again.');
    }
  };

  useInviteAccept();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">SmartSEO AI</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={onBackToLanding}
            className="text-gray-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                {isSignUp ? '7-Day Free Trial' : 'Welcome Back'}
              </Badge>
              <h1 className="text-3xl font-bold text-black mb-4">
                {isSignUp ? 'Get Started in Minutes.' : 'Sign in to your dashboard.'}
              </h1>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Your 7-day free trial starts now. No credit card required.' 
                  : 'Continue optimizing your SEO like a machine.'
                }
              </p>
            </div>

            {/* Google SSO Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full mb-6 py-3 border-2 rounded-xl hover:bg-gray-50"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleAuth} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                    required={isSignUp}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete={isSignUp ? "email" : "username"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50"
                  required
                  placeholder="Enter your password"
                  minLength={6}
                  disabled={loading}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg rounded-xl font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Start Free Trial' : 'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  // Clear form when switching modes
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Start free trial"}
              </button>
            </div>

            {isSignUp && (
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">7-day free trial includes:</p>
                    <ul className="space-y-1 text-green-700">
                      <li>• Unlimited SEO audits</li>
                      <li>• AI content generation</li>
                      <li>• Competitor analysis</li>
                      <li>• All premium features</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-gray-500">
              By {isSignUp ? 'signing up' : 'signing in'}, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>.
            </div>
          </div>
        </div>

        {/* Right Side - Dashboard Preview */}
        <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-12">
          <div className="max-w-lg w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-500">SmartSEO AI Dashboard</div>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-black mb-4">SEO Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">94</div>
                      <div className="text-sm text-gray-600">SEO Score</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">847</div>
                      <div className="text-sm text-gray-600">Keywords</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Content Analysis</span>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Technical Audit</span>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Competitor Research</span>
                    <Badge className="bg-blue-600">Running</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}