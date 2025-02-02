// app/taketest/components/UserInput.tsx
"use client"
import { useState } from 'react';

interface UserInputProps {
  onSubmit: (inputData: { topic: string; currentLevel: string; desiredLevel: string }) => void;
}

const UserInput = ({ onSubmit }: UserInputProps) => {
  const [topic, setTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pass the user input data back to the parent
    onSubmit({ topic, currentLevel, desiredLevel });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
          Topic
        </label>
        <input
          type="text"
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <div>
        <label htmlFor="current_level" className="block text-sm font-medium text-gray-700">
          Current Level
        </label>
        <select
          id="current_level"
          value={currentLevel}
          onChange={(e) => setCurrentLevel(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label htmlFor="desired_level" className="block text-sm font-medium text-gray-700">
          Desired Level
        </label>
        <select
          id="desired_level"
          value={desiredLevel}
          onChange={(e) => setDesiredLevel(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default UserInput;
