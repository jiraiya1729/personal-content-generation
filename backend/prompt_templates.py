
# inputs : topic_name, current_level, desired_level
question_generation_prompt = '''
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

'''




# inputs = topic, currentLevel, targetLevel
blog_generation_prompt = '''
        You are an AI content creator specializing in personalized education. 
  
      **Objective**: Generate content tailored to a user who wants to improve their understanding of the topic "{topic}".
  
      **User Profile**:
      - Current Level: {currentLevel}
      - Target Level: {targetLevel}
      
      **Content Requirements**:
      1. Start with a brief explanation of the topic {topic} suitable for someone at the {currentLevel} level.
      2. Gradually introduce advanced concepts and examples that help the user progress towards the {targetLevel} level.
      3. Include practical examples or scenarios that align with the user's learning path.
      4. Provide tips or strategies to solidify their understanding.
      5. End with a summary and a brief quiz (3-5 questions) to assess if they have moved closer to the {targetLevel} level.
  
      Be concise yet detailed enough to ensure the user gains practical and theoretical knowledge of {topic}.


'''