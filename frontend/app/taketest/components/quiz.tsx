"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Blog from './blog';

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic_name: topic,
            current_level: currentLevel,
            required_level: desiredLevel,
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const LoadingState = () => (
    <div className="min-h-screen bg-[#121712] p-6">
      <Card className="max-w-2xl mx-auto bg-[#1A1F1A] border-[#00895C] border-2 shadow-lg">
        <CardHeader className="border-b border-[#232923]">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 w-48 bg-[#232923] rounded-md animate-pulse"></div>
            <div className="h-8 w-32 bg-[#232923] rounded-full animate-pulse"></div>
          </div>
          <div className="h-2 bg-[#232923] rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="h-12 w-12 rounded-full border-4 border-[#00E676] border-t-transparent animate-spin"></div>
            <div className="text-[#00E676] text-lg font-medium">generating your quiz...</div>
          </div>
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-16 bg-[#232923] rounded-lg animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div 
                    key={j}
                    className="h-14 bg-[#232923] rounded-lg animate-pulse"
                    style={{ animationDelay: `${(i + j) * 100}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
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
      setShowBlog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4 bg-[#FF5252] text-white border-none">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  if (showBlog) {
    return <Blog topic={topic} currentLevel={currentLevel} desiredLevel={desiredLevel} />;
  }

  const currentQ = questions[`Q${currentQuestion + 1}`];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-[#121712] p-6">
      <Card className="max-w-2xl mx-auto bg-[#1A1F1A] border-[#00895C] border-2 shadow-lg transition-all duration-300 hover:shadow-[#00E676]/10 hover:shadow-2xl">
        <CardHeader className="border-b border-[#232923]">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-[#E8E8E8] text-2xl font-bold">
              {topic} <span className="text-[#00E676]">Quiz</span>
            </CardTitle>
            <div className="text-[#A0A0A0] bg-[#232923] px-4 py-2 rounded-full text-sm">
              Question {currentQuestion + 1} of {Object.keys(questions).length}
            </div>
          </div>
          <Progress 
            value={(currentQuestion + 1) / Object.keys(questions).length * 100} 
            className="h-2 bg-[#232923]"
          />
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="text-xl font-medium text-[#E8E8E8] bg-[#232923] p-6 rounded-lg shadow-md">
            {currentQ.question}
          </div>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {currentQ.options.map((option, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-4 rounded-lg bg-[#232923] transition-all duration-300 hover:bg-[#2A332A] cursor-pointer border border-transparent hover:border-[#00E676]"
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`}
                  className="border-[#00E676] text-[#00E676] data-[state=checked]:bg-[#00E676]"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="text-[#E8E8E8] text-lg cursor-pointer w-full"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8 pt-4 border-t border-[#232923]">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 bg-transparent border-[#00E676] text-[#00E676] hover:bg-[#00895C] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion]}
              className="flex items-center space-x-2 bg-[#00E676] text-black hover:bg-[#00FF8D] transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#00E676]"
            >
              <span>{currentQuestion === Object.keys(questions).length - 1 ? "Start Learning" : "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;