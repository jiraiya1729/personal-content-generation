'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  if (!user && !userSession) {
    router.push('/signup');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Your App</h1>
        <button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem('user');
          }}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Welcome to Your Personalized Dashboard</h2>
          <button
            onClick={() => router.push('/create-lesson')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Create a Personalized Lesson
          </button>
        </div>
      </main>
    </div>
  );
}
