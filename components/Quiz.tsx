import React, { useState } from 'react';

type Question = {
  question: string;
  options: string[];
  correct_answer: string; // Correct answer in 'A', 'B', 'C', 'D' format
};

type QuizProps = {
  questions: { [key: string]: Question }; // JSON object with string keys
};

type QuizResult = {
  question: string;
  selected_answer: string;
  correct_answer: string;
};

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  // Convert JSON object to an array of questions
  const questionArray = Object.values(questions["data_json"] || {});

  if (!questionArray.length) {
    return <div className="text-center text-lg text-gray-700">No questions to display</div>;
  }

  // State to track selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Function to handle answer selection
  const handleAnswerChange = (questionIndex: number, selectedOption: string) => {
    setSelectedAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [questionIndex]: selectedOption,
      };

      // Update quizResults with the new selected answer
      setQuizResults(
        questionArray.map((q, index) => {
          const selectedAnswer = updatedAnswers[index] || "";
          return {
            question: q.question,
            selected_answer: selectedAnswer,
            correct_answer: q.correct_answer,
            options: q.options, // Including options in quizResults for text mapping
          };
        })
      );

      return updatedAnswers;
    });
  };

  // Function to handle quiz submission
  const handleSubmit = async () => {
    let calculatedScore = 0;
    quizResults.forEach((result) => {
      if (result.selected_answer === result.correct_answer) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);

    // Send quizResults to the backend
    await sendResultsToBackend(quizResults);
  };

  // Function to send quiz results to the backend
  const sendResultsToBackend = async (quizResults: QuizResult[]) => {
    // Function to map letter answer to index
    const letterToIndex = (letter: string) => {
      const letterMap: { [key: string]: number } = { A: 0, B: 1, C: 2, D: 3 };
      return letterMap[letter.toUpperCase()] || -1; // Default to -1 if invalid letter
    };
  
    // Map the answer letters to the actual text
    const updatedQuizResults = quizResults.map((q) => {
      const options = q.options;
  
      // Debugging to check the options
      console.log("Options:", options);
      
      // Convert the selected and correct answers from letters (A, B, C, D) to indices (0, 1, 2, 3)
      const selectedAnswerIndex = letterToIndex(q.selected_answer);
      const correctAnswerIndex = letterToIndex(q.correct_answer);
  
      const selectedAnswerText = options[selectedAnswerIndex]; // Get the text for selected answer
      const correctAnswerText = options[correctAnswerIndex]; // Get the text for correct answer
  
      return {
        question: q.question,
        selected_answer: selectedAnswerText,
        correct_answer: correctAnswerText,
      };
    });
  
    try {
      // Wait for the fetch request to complete
      const response = await fetch('/api/generate_blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizResults: updatedQuizResults }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Await the response body and parse it to JSON
      const data = await response.json();
      console.log('Response from backend:', data);
  
      // Handle success (e.g., updating the UI, clearing quiz state, etc.)
    } catch (error) {
      // Handle any errors that occurred during the fetch request
      console.error('Error sending results to backend:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Quiz</h1>
        {submitted ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Score: {score} / {questionArray.length}</h2>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry Quiz
            </button>
          </div>
        ) : (
          <div>
            {questionArray.map((q, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {index + 1}. {q.question}
                </h3>
                <ul className="space-y-3">
                  {q.options.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                    return (
                      <li key={idx}>
                        <button
                          className={`block w-full px-4 py-2 text-left rounded focus:outline-none ${selectedAnswers[index] === optionLetter ? 'bg-blue-100 text-gray-800' : 'bg-gray-200 text-gray-700'} hover:bg-blue-200 focus:ring-2 focus:ring-blue-500`}
                          onClick={() => handleAnswerChange(index, optionLetter)}
                        >
                          {optionLetter}. {option}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 mt-6"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
