'use client';

import React, { useState } from 'react';
import { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/navigation';
import Quiz from '@/components/Quiz';

const TakeTest = () => {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentKnowledge, setCurrentKnowledge] = useState('');
  const [expectedContentLevel, setExpectedContentLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);
  const [quizquestions, setquizquestions] = useState<{ [key: string]: any }>({});;
  const [content_preferences, setContentPreferences] = useState({
    topic: '',
    currentKnowledge: '',
    expectedContentLevel: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const preferences = {
      topic: selectedTopic,
      currentKnowledge,
      expectedContentLevel,
    };
    setContentPreferences({
      topic: selectedTopic,
      currentKnowledge,
      expectedContentLevel,
    });
  
    try {
      const response = await fetch('/api/generate_test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit preferences');
      }
  
      const data_questions = await response.json();
      
      // Use functional update and log in the update function
      setquizquestions(prevQuestions => {
        console.log('Previous questions:', prevQuestions);
        console.log('New questions:', data_questions);
        return data_questions;
      });
  
      setIsRequestSuccessful(true);
      alert('Your preferences have been sent!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6">Take Test</h2>
        {error && <p className="text-red-500">{error}</p>}
        {!isRequestSuccessful && (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="topic">
            Select a Topic
          </label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Choose a topic
            </option>
            <option value="svm">Support Vector Machine (SVM)</option>
            <option value="bayes">Bayes Theorem</option>
            <option value="decision-tree">Decision Tree</option>
          </select>
        </div>

        {/* Current Knowledge */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="current-knowledge">
            Current Knowledge
          </label>
          <select
            id="current-knowledge"
            value={currentKnowledge}
            onChange={(e) => setCurrentKnowledge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Choose your level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Expected Content Level */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="content-level">
            Expected Content Level
          </label>
          <select
            id="content-level"
            value={expectedContentLevel}
            onChange={(e) => setExpectedContentLevel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Choose content level
            </option>
            <option value="basic">Basic</option>
            <option value="medium">Medium</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {loading ? 'Creating Test' : 'Submit Preferences'}
          </button>
        </div>
        <div>
         
        </div>
      </form>
      )}
       
        <div>
         
      <h1>Backend Request Status</h1>
      {isRequestSuccessful && (
        <Quiz questions={quizquestions} preferences = {content_preferences} />
      )}
    </div>
      </div>
      
    </div>
  );
};

export default TakeTest;