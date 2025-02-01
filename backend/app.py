from flask import Flask, request, jsonify, render_template
from langchain.prompts import PromptTemplate
# from langchain.chat_models import ChatGoogleGenerativeAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import json

app = Flask(__name__)

load_dotenv()
# Ensure the API key is stored securely as an environment variable

@app.route('/api/generate_blog', methods=['POST', 'GET'])
def process_quiz():
    print("W")
    try:
        # Parse JSON data from the request
        data = request.get_json()

        if not data or 'preferences' not in data or 'quizResults' not in data:
            return jsonify({"message": "Preferences and quiz results are required"}), 400

        preferences = data['preferences']
        quiz_results = data['quizResults']

        topic = preferences.get('topic')
        current_knowledge = preferences.get('currentKnowledge')
        expected_content_level = preferences.get('expectedContentLevel')

        # Validate necessary fields
        if not topic or not current_knowledge or not expected_content_level:
            return jsonify({"message": "Incomplete preferences data"}), 400

        # Define the prompt template
        template = PromptTemplate(
            template="""
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
            """,
            input_variables=['topic', 'currentLevel', 'targetLevel', 'quizResult']
        )

        # Format the prompt with input data
        formatted_prompt = template.format(
            topic=topic,
            currentLevel=current_knowledge,
            targetLevel=expected_content_level,
            quizResult=quiz_results
        )

        # Initialize the Google Generative AI model
        # llm = ChatGroq(
        #     temperature=0.3,
        #     model_name="llama-3.1-70b-versatile",
        #     groq_api_key=os.getenv("GROQ_API_KEY")
        # )
        llm = ChatGoogleGenerativeAI(model = "gemini-pro", temperature = 0.3)

        # Generate the content
        response_content = llm.invoke(formatted_prompt)

        # Return the AI-generated content
        return jsonify({
            "message": "Quiz results processed successfully",
            "receivedData": response_content
        }), 200

    except Exception as e:
        # Comprehensive error handling
        return jsonify({
            "message": "Error processing quiz results",
            "error": str(e)
        }), 500




@app.route('/generate_mcqs', methods =['POST', 'GET'])
def generate_mcqs():
    try:
        # Parse the JSON payload from the request
        data = request.json
        topic = data.get('topic')
        current_knowledge = data.get('currentKnowledge')
        expected_content_level = data.get('expectedContentLevel')

        if not topic or not current_knowledge or not expected_content_level:
            return jsonify({"error": "Missing required fields in request"}), 400

        # Log the received preferences
        print('Received preferences:', {
            "topic": topic,
            "currentKnowledge": current_knowledge,
            "expectedContentLevel": expected_content_level
        })

        # Create a prompt template
        template = PromptTemplate(
            template="""
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

Now, generate 10 MCQs based on the inputs. now along with the mcqs generate the blog also
""",
            input_variables=['topic_name', 'current_level', 'desired_level']
        )

        # Format the prompt
        formatted_prompt = template.format(
            topic_name=topic,
            current_level=current_knowledge,
            desired_level=expected_content_level
        )

        # Initialize the ChatGoogleGenerativeAI instance
        llm = ChatGoogleGenerativeAI(model = "gemini-pro", temperature = 0.3)

        # Invoke the chat model
        response = llm.invoke(formatted_prompt)
        questions = response.content
        print(questions)
        # Process the response
        # question_w = questions[7:-3]
        # print("Raw Questions:", question_w)

        # modified_string = str(questions).strip()
        # print("modified string", modified_string)
        # questions_data = json.loads(question_w)
        # print("Questions:", questions_data)
        # return render_template('w.html', questions_data=questions_data)
        return jsonify({
            "message": "MCQs generated successfully",
            "data": questions
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to generate MCQs", "details": str(e)}), 500
@app.route('/')
def home():
    return render_template('base.html')
# Add CORS handling if needed
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
