'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api'; // Import the api utility for consistency
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
    
    if (value && !value.endsWith('@gmail.com')) {
      setEmailError('Only Gmail addresses (@gmail.com) are allowed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Validate Gmail
    if (!email.endsWith('@gmail.com')) {
      toast.error('Only Gmail addresses (@gmail.com) are allowed');
      return;
    }
    
    setLoading(true);

    try {
      // Use the apiRequest utility for consistency with other pages
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="mb-5 flex items-center justify-center">
          <img src="/images/logo.png" alt="TheBakeStory Logo" className="h-16 w-auto mr-3" />
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Pacifico',_cursive]">The Bake Story</h1> */}
        </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address*
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="example@gmail.com"
                required
                disabled={loading}
              />
              {emailError && (
                <p className="text-xs text-red-600 mt-1">{emailError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Only Gmail addresses are accepted</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-amber-500)] text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center space-y-2">
            <Link 
              href="/login" 
              className="text-[var(--color-amber-500)] hover:text-amber-600 font-medium block"
            >
              Back to Login
            </Link>
            <Link 
              href="/signup" 
              className="text-gray-600 hover:text-gray-700 text-sm block"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
