import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Blog = ({ topic, currentLevel, desiredLevel }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogContent = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/blog_generation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
            currentLevel: currentLevel,
            targetLevel: desiredLevel,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContent(data["blog"]);
        setError(null);
      } catch (error) {
        console.error("Error fetching blog content:", error);
        setError("Failed to load learning content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogContent();
  }, [topic, currentLevel, desiredLevel]);

  const formatContent = (text) => {
    const sections = text.split('**').map((section, index) => {
      if (index % 2 === 1 && section.includes('\n')) {
        const sectionText = section.replace('\n', '');
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-6 text-[#00E676] tracking-tight">
            {sectionText}
          </h2>
        );
      } else if (index % 2 === 1) {
        return <strong key={index} className="text-[#00E676]">{section}</strong>;
      }
      
      return section.split('\n').map((line, lineIndex) => {
        if (line.trim().startsWith('*')) {
          return (
            <li key={`${index}-${lineIndex}`} className="ml-8 mb-3 text-[#E8E8E8] hover:text-[#00E676] transition-colors duration-200">
              {line.replace('* ', '')}
            </li>
          );
        } else if (line.trim().match(/^\d+\./)) {
          return (
            <li key={`${index}-${lineIndex}`} className="ml-8 mb-3 list-decimal text-[#E8E8E8] hover:text-[#00E676] transition-colors duration-200">
              {line.replace(/^\d+\.\s*/, '')}
            </li>
          );
        } else if (line.trim()) {
          return (
            <p key={`${index}-${lineIndex}`} className="mb-5 leading-7 text-[#A0A0A0] hover:text-[#E8E8E8] transition-colors duration-200">
              {line}
            </p>
          );
        }
        return null;
      });
    });

    return sections;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121712] via-[#1A1F1A] to-[#121712] bg-[linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]">
        <Alert variant="destructive" className="max-w-4xl mx-auto mt-4 bg-[#232923] border-[#FF5252] text-[#FF5252]">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121712] via-[#1A1F1A] to-[#121712] bg-[linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-[#00E676]" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-[#00E676] opacity-20" />
          </div>
          <p className="mt-4 text-[#A0A0A0] animate-pulse">Generating content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#121712] via-[#1A1F1A] to-[#121712] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#00E676] opacity-[0.015] blur-[150px] rounded-full" />
      
      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto px-6">
        <Card className="bg-[#1A1F1A] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)] hover:border-[rgba(255,255,255,0.15)]">
          <CardHeader className="border-b border-[rgba(255,255,255,0.1)] pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#00E676] to-[#00C853] bg-clip-text text-transparent">
              Learning Path: {topic}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm text-[#707070]">From</div>
              <span className="px-3 py-1 rounded-full bg-[#232923] text-[#00E676] text-sm">
                {currentLevel}
              </span>
              <div className="text-sm text-[#707070]">to</div>
              <span className="px-3 py-1 rounded-full bg-[#232923] text-[#00E676] text-sm">
                {desiredLevel}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose max-w-none text-[#E8E8E8]">
              {formatContent(content)}
            </div>
            <div className="mt-8 flex justify-end border-t border-[rgba(255,255,255,0.1)] pt-6">
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#232923] text-[#00E676] hover:bg-[#2A332A] hover:text-[#00FF8D] border border-[#00E676] transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,230,118,0.2)]"
                variant="outline"
              >
                Start New Topic
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;