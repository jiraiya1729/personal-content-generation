'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">Personalized Lesson Creation</h2>
        <p className="text-lg mb-6">
          To create a personalized lesson plan tailored to your needs, we need to understand your current level.
        </p>
        <button
          onClick={() => router.push('/taketest')}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Write Test
        </button>
      </div>
    </div>
  );
};

export default Page;
