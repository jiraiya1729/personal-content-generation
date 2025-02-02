"use client"
import { useState } from 'react';
import UserInput from './components/userinputs';
import Quiz from './components/quiz'; // Import the Quiz component

const TakeTestPage = () => {
  const [userInput, setUserInput] = useState({
    topic: '',
    currentLevel: '',
    desiredLevel: '',
  });
  const [generateQuiz, setGenerateQuiz] = useState(false);

  // This function will be called when the form is submitted
  const handleUserInputChange = (inputData: { topic: string; currentLevel: string; desiredLevel: string }) => {
    setUserInput(inputData);
    setGenerateQuiz(true);
  };

  return (
    <div>


      {/* Conditionally render UserInput or the Quiz component */}
      {!generateQuiz ? (
        <UserInput onSubmit={handleUserInputChange} />
      ) : (
        <Quiz 
          topic={userInput.topic} 
          currentLevel={userInput.currentLevel} 
          desiredLevel={userInput.desiredLevel} 
        />
      )}
    </div>
  );
};

export default TakeTestPage;