"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Blog from './blog'; // Import the Blog component

interface QuizProps {
  topic: string;
  currentLevel: string;
  desiredLevel: string;
}

interface Question {
  question: string;
  correct_ans: string;
  options: string[];
}

interface QuizResponse {
  [key: string]: Question;
}

const Quiz = ({ topic, currentLevel, desiredLevel }: QuizProps) => {
  const [questions, setQuestions] = useState<QuizResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showBlog, setShowBlog] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/question_generation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic_name: topic,
            current_level: currentLevel,
            required_level: desiredLevel,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data.questions);
        setError(null);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, currentLevel, desiredLevel]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < Object.keys(questions).length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowBlog(true); // Show the Blog component instead of results
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If showBlog is true, render the Blog component
  if (showBlog) {
    return <Blog topic={topic} currentLevel={currentLevel} desiredLevel={desiredLevel} />;
  }

  const currentQ = questions[`Q${currentQuestion + 1}`];
  if (!currentQ) return null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>{topic} Quiz</CardTitle>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {Object.keys(questions).length}
          </div>
        </div>
        <Progress 
          value={(currentQuestion + 1) / Object.keys(questions).length * 100} 
          className="h-2"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">{currentQ.question}</div>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion]}
            >
              {currentQuestion === Object.keys(questions).length - 1 ? "Start Learning" : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;