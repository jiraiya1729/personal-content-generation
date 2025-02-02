from fastapi import FastAPI
from question_generation import mcq_question_generation
from blog_generation import topic_blog_generation
import json

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/question_generation")
def read_item(data_string):
    print(data_string)
    data = json.loads(data_string)
    print(data, type(data))
    questions = mcq_question_generation(topic_name= data["topic_name"], current_level= data["current_level"], desired_level=data["required_level"])
    return {"questions": questions}

@app.post("/blog_generation")
def create_item(data_string):
    print(data_string, type(data_string))
    data = json.loads(data_string)
    print(data, type(data))
    blog = topic_blog_generation(topic=data["topic"], currentLevel=data["currentLevel"], targetLevel=data["targetLevel"])
    # print(blog)
    return {"blog": blog}
