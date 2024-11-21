import { NextRequest, NextResponse } from 'next/server'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
// Optional: Define a type for your quiz results
interface QuizResults {
  // Define the structure of your quiz results
  // For example:
  userId?: string;
  answers?: Array<{
    questionId: string;
    selectedOption: string;
  }>;
}
interface Preferences {
  topic: string;
  currentKnowledge: string;
  expectedContentLevel: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json() as { preferences: Preferences; quizResults: QuizResults };
    console.log("receivedData", data)
    const preferences = data["preferences"]
    console.log("these are the preferences", preferences, preferences["topic"])
    const  quizResults  = data["quizResults"];
    console.log("these are the questions", quizResults)

    // Server-side logging
    // console.log('Received Quiz Results:', quizResults);

    
    if (!quizResults) {
      return NextResponse.json(
        { message: 'Quiz results are required' }, 
        { status: 400 }
      );
    }
    const template = new PromptTemplate({
      template:  `
      You are an AI content creator specializing in personalized education. 
  
      **Objective**: Generate content tailored to a user who wants to improve their understanding of the topic "{topic}".
  
      **User Profile**:
      - Current Level: {currentLevel}
      - Target Level: {targetLevel}
      - Quiz Result: {quizResult} (evaluates their current grasp of the topic)
  
      **Content Requirements**:
      1. Start with a brief explanation of the topic {topic} suitable for someone at the {currentLevel} level.
      2. Gradually introduce advanced concepts and examples that help the user progress towards the {targetLevel} level.
      3. Include practical examples or scenarios that align with the user's learning path.
      4. Provide tips or strategies to solidify their understanding.
      5. End with a summary and a brief quiz (3-5 questions) to assess if they have moved closer to the {targetLevel} level.
  
      Be concise yet detailed enough to ensure the user gains practical and theoretical knowledge of {topic}.

      
    `,
      inputVariables: ['topic', 'currentLevel', 'targetLevel', 'quizResult'],
    });
    const formattedPrompt = await template.format({
      topic: preferences["topic"],
      currentLevel: preferences["currentKnowledge"],
      targetLevel: preferences["expectedContentLevel"],
      quizResult: quizResults
    });

    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: "AIzaSyD6pxrSNrqAz5pEjAB1AyPpkszltdpFYgs", // Use environment variable for security
    });
    const response_content = await chatModel.invoke(formattedPrompt);
    console.log(response_content)
    // Here you can add more complex processing
    // For example, saving to a database, generating a blog, etc.

    return NextResponse.json({ 
      message: 'Quiz results processed successfully',
      receivedData: response_content 
    }, { status: 200 });

  } catch (error) {
    // Comprehensive error handling
    console.error('Error processing quiz results:', error);
    
    return NextResponse.json(
      { 
        message: 'Error processing quiz results',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Optional: Add CORS handling if needed
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}