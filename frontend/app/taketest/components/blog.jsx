"use client"

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
        console.log(data["blog"])
        setContent(data["blog"]);
        console.log(content)
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
      // If it's an odd index and the section ends with a newline, it's a header
      if (index % 2 === 1 && section.includes('\n')) {
        const sectionText = section.replace('\n', '');
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-4 text-primary">
            {sectionText}
          </h2>
        );
      }
      // If it's an odd index, it's bold text
      else if (index % 2 === 1) {
        return <strong key={index}>{section}</strong>;
      }
      
      // Process regular text sections
      return section.split('\n').map((line, lineIndex) => {
        if (line.trim().startsWith('*')) {
          // It's a bullet point
          return (
            <li key={`${index}-${lineIndex}`} className="ml-6 mb-2">
              {line.replace('* ', '')}
            </li>
          );
        } else if (line.trim().match(/^\d+\./)) {
          // It's a numbered list item
          return (
            <li key={`${index}-${lineIndex}`} className="ml-6 mb-2 list-decimal">
              {line.replace(/^\d+\.\s*/, '')}
            </li>
          );
        } else if (line.trim()) {
          // It's a regular paragraph
          return (
            <p key={`${index}-${lineIndex}`} className="mb-4 leading-7">
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
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-4">
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Learning Path: {topic}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            From {currentLevel} to {desiredLevel}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {formatContent(content)}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Start New Topic
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;