'use client';

import React, { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [SignInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
//   const router = useRouter()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
     
        const res = await SignInWithEmailAndPassword(email, password)
        console.log(res);
        setEmail('');
        setPassword(''); 
        router.push('/');
        // router.push('/');


    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold">Sign In</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-400">
            Don’t have an account?{' '}
            <a href="/auth/signup" className="text-indigo-400 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignUp;