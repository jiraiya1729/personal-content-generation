// app/api/generate/route.js
import { NextResponse } from 'next/server';
// import str;

// genai imports
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the JSON payload
    const { topic, currentKnowledge, expectedContentLevel } = body;

    console.log('Received preferences:', { topic, currentKnowledge, expectedContentLevel });

    // Create a prompt template for generating MCQs based on the provided topic and user preferences
    const template = new PromptTemplate({
      template: `
You are a highly skilled educational content creator specializing in machine learning topics. Your task is to generate 10 high-quality multiple-choice questions (MCQs) for assessing a user's knowledge on a given topic.

### Inputs:
- **Topic Name**: {topic_name}
- **User's Current Level**: {current_level} (e.g., Beginner, Intermediate, Advanced)
- **User's Desired Level**: {desired_level} (e.g., Intermediate, Advanced)

### Instructions:
1. The MCQs should:
   - Start from the user's current level of understanding.
   - Gradually progress toward questions of the desired level to identify knowledge gaps.
   - Cover fundamental concepts, practical applications, and advanced insights (if applicable).
2. Each question must have:
   - A clear question statement.
   - Four answer options (A, B, C, D), with only one correct answer.
   - The correct answer clearly marked.
3. Avoid overly simple or overly complex language; the questions should align with the user's progression from {current_level} to {desired_level}.
4. Ensure questions are domain-relevant and free from errors.

### Output Format:
Return the result as a JSON-like object, where:
- Each question is a key (e.g., "Q1", "Q2").
- The value is another object with:
  - "question": [The question statement].
  - "options": [Array of four options].
  - "correct_answer": [The correct option letter (A, B, C, or D)].

Now, generate 10 MCQs based on the inputs.
      `,
      inputVariables: ['topic_name', 'current_level', 'desired_level'],
    });

    // Format the prompt with user inputs
    const formattedPrompt = await template.format({
      topic_name: topic,
      current_level: currentKnowledge,
      desired_level: expectedContentLevel,
    });

    // Initialize the ChatGoogleGenerativeAI instance with API key from environment variables
    const chatModel = new ChatGoogleGenerativeAI({
      apiKey: "AIzaSyD6pxrSNrqAz5pEjAB1AyPpkszltdpFYgs", // Use environment variable for security
    });

    // Invoke the chat model with the formatted prompt
    const response = await chatModel.invoke(formattedPrompt);

    // Extract the questions from the response
    const questions = response.content || response; // Adjust based on actual response structure
    console.log(questions);
    console.log(typeof questions)
    const modifiedString = String(questions).slice(7, -3);
    const data_json = JSON.parse(modifiedString)
    console.log(data_json.Q1);

    // Return the generated MCQs in the response
    return NextResponse.json({
      message: 'MCQs generated successfully',
      data_json,
    });
    
  } catch (error) {
    console.error('Error processing preferences:', error);
    return NextResponse.json(
      { error: 'Failed to process preferences' },
      { status: 500 }
    );
  }
}
