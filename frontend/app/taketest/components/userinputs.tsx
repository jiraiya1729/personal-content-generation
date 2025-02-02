"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface UserInputProps {
  onSubmit: (inputData: { topic: string; currentLevel: string; desiredLevel: string }) => void;
}

const UserInput = ({ onSubmit }: UserInputProps) => {
  const [topic, setTopic] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [desiredLevel, setDesiredLevel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ topic, currentLevel, desiredLevel });
  };

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121712] p-4">
      <Card className="w-full max-w-md bg-[#1A1F1A] border border-[rgba(255,255,255,0.1)] shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-[#E8E8E8]">
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium text-[#E8E8E8]">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-[#232923] border-[rgba(255,255,255,0.15)] text-[#E8E8E8] focus:ring-[#00E676] focus:border-[#00E676] hover:border-[#00E676] transition-colors"
                placeholder="Enter your topic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_level" className="text-sm font-medium text-[#E8E8E8]">
                Current Level
              </Label>
              <Select value={currentLevel} onValueChange={setCurrentLevel}>
                <SelectTrigger 
                  className="w-full bg-[#232923] border-[rgba(255,255,255,0.15)] text-[#E8E8E8] hover:border-[#00E676] focus:ring-[#00E676] transition-colors"
                >
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F1A] border-[rgba(255,255,255,0.15)]">
                  {levels.map((level) => (
                    <SelectItem 
                      key={level} 
                      value={level}
                      className="text-[#E8E8E8] focus:bg-[#2A332A] focus:text-[#00E676]"
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desired_level" className="text-sm font-medium text-[#E8E8E8]">
                Desired Level
              </Label>
              <Select value={desiredLevel} onValueChange={setDesiredLevel}>
                <SelectTrigger 
                  className="w-full bg-[#232923] border-[rgba(255,255,255,0.15)] text-[#E8E8E8] hover:border-[#00E676] focus:ring-[#00E676] transition-colors"
                >
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F1A] border-[rgba(255,255,255,0.15)]">
                  {levels.map((level) => (
                    <SelectItem 
                      key={level} 
                      value={level}
                      className="text-[#E8E8E8] focus:bg-[#2A332A] focus:text-[#00E676]"
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00E676] text-black hover:bg-[#00FF8D] active:bg-[#00B167] transition-colors duration-200"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInput;