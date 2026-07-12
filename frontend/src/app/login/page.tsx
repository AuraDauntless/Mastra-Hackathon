"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', { email, password, callbackUrl: '/dashboard/billing' });
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 relative z-10">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full bg-gray-950/80 backdrop-blur-2xl border border-gray-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-6">
            <ShieldAlert className="text-red-500" size={32} /> Dauntless Ops
          </Link>
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="text-gray-400 mt-2">Sign in to manage your APIs and billing.</p>
        </div>

        <div className="space-y-4 mb-8">
          <button 
            onClick={() => signIn('credentials', { email: 'github_user@example.com', password: 'password', callbackUrl: '/dashboard/billing' })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            Continue with GitHub
          </button>
          
          <button 
            onClick={() => signIn('credentials', { email: 'google_user@gmail.com', password: 'password', callbackUrl: '/dashboard/billing' })}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-8">
            <div className="border-t border-gray-800 w-full"></div>
            <span className="bg-gray-950 px-3 text-gray-500 text-sm absolute">or login with email</span>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="admin or test@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-gray-500 mt-8 text-sm">
            Don't have an account? <Link href="/pricing" className="text-purple-400 hover:text-purple-300">View Plans</Link>
        </p>
      </div>
    </div>
  );
}
