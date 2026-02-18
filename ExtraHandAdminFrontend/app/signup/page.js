'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 8;
    
    const checks = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, minLength];
    const passedChecks = checks.filter(Boolean).length;
    
    if (passedChecks === 5) return 'Strong ✓';
    if (passedChecks >= 3) return 'Medium';
    return 'Weak';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    if (name === 'email') {
      setEmailError('');
      if (value && !value.endsWith('@gmail.com')) {
        setEmailError('Only Gmail addresses (@gmail.com) are allowed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    
    // Validate Gmail
    if (!form.email.endsWith('@gmail.com')) {
      toast.error('Only Gmail addresses (@gmail.com) are allowed');
      setStatus({ loading: false, message: '', error: '' });
      return;
    }

    try {
      const res = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      toast.success(data.message);
      setStatus({ loading: false, message: '', error: '' });
      setForm({ name: '', email: '', password: '' });
      setPasswordStrength('');
      // Redirect to login page after successful signup
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      setStatus({ loading: false, message: '', error: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8 flex items-center justify-center">
          <img src="/images/logo.png" alt="TheBakeStory Logo" className="h-16 w-auto mr-3" />
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Pacifico',_cursive]">The Bake Story</h1> */}
        </div>
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 text-center">Join TheBakeStory Team</h1>
        {/* <p className="text-sm text-gray-600 mb-6">Create your account to get started with TheBakeStory.</p> */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address*</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="example@gmail.com"
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
                minLength={8}
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="@Sn123hsn#"
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
            {passwordStrength && (
              <p className={`text-xs mt-1 ${
                passwordStrength.includes('Strong') ? 'text-green-600' : 
                passwordStrength.includes('Medium') ? 'text-amber-600' : 'text-red-600'
              }`}>
                Strength: {passwordStrength}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must include: uppercase, lowercase, number & special character (!@#$%...)
            </p>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-[var(--color-amber-500)] text-white py-2 rounded hover:bg-amber-600 disabled:opacity-60"
          >
            {status.loading ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

