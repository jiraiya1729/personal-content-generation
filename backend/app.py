from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from question_generation import mcq_question_generation
from blog_generation import topic_blog_generation
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific domains for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define request models
class QuestionRequest(BaseModel):
    topic_name: str
    current_level: str
    required_level: str

class BlogRequest(BaseModel):
    topic: str
    currentLevel: str
    targetLevel: str

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/question_generation")
def generate_questions(request: QuestionRequest):
    questions = mcq_question_generation(
        topic_name=request.topic_name,
        current_level=request.current_level,
        desired_level=request.required_level
    )
    print(questions)
    return {"questions": questions}

@app.post("/blog_generation")
def generate_blog(request: BlogRequest):
    print(request)
    blog = topic_blog_generation(
        topic=request.topic,
        currentLevel=request.currentLevel,
        targetLevel=request.targetLevel
    )
    print(blog)
    return {"blog": blog}