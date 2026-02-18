'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'email') {
      setEmailError('');
      if (value && !value.endsWith('@gmail.com')) {
        setEmailError('Only Gmail addresses (@gmail.com) are allowed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    
    // Validate Gmail
    if (!form.email.endsWith('@gmail.com')) {
      toast.error('Only Gmail addresses (@gmail.com) are allowed');
      setStatus({ loading: false, error: '', success: '' });
      return;
    }
    
    try {
      const res = await apiRequest('/api/auth/login/', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store tokens and user data
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Login successful');
      setStatus({ loading: false, error: '', success: '' });
      
      // Role-based redirect
      const userRole = data.user.role;
      setTimeout(() => {
        if (userRole === 'manager') {
          window.location.href = '/superadmin';
        } else if (userRole === 'writer') {
          window.location.href = '/admin/articles';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      toast.error(err.message);
      setStatus({ loading: false, error: '', success: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] p-6">
      <div className="w-full max-w-md bg-white shadow rounded p-8">
        <div className="mb-8 flex items-center justify-center">
          <img src="/images/logo.png" alt="TheBakeStory Logo" className="h-16 w-auto mr-3" />
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Pacifico',_cursive]">The Bake Story</h1> */}
        </div>
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 text-center">Welcome Back to TheBakeStory!</h1>
        {/* <p className="text-sm text-gray-600 mb-6">Sign in to access your account.</p> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address*</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="yourname@gmail.com"
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Only Gmail addresses are accepted</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-1 text-right">
              <Link href="/forgot-password" className="text-xs text-[var(--color-amber-500)] hover:text-amber-600">
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-[var(--color-amber-500)] text-white py-2 rounded hover:bg-amber-600 disabled:opacity-60"
          >
            {status.loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">
          Need an account?{' '}
          <Link className="text-[var(--color-amber-500)] hover:text-amber-600 hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

