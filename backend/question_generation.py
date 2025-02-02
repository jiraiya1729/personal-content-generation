from langchain.prompts import ChatPromptTemplate
from llm import model
from prompt_templates import question_generation_prompt
import json 


def mcq_question_generation(topic_name, current_level, desired_level):
    print(topic_name, current_level, desired_level)
    prompt_template = ChatPromptTemplate.from_template(question_generation_prompt)
    final_prompt = prompt_template.invoke(
        {
            "topic_name" : topic_name,
            "current_level": current_level,
            "desired_level": desired_level,
            
        }
    )
    result = model.invoke(final_prompt)
    mcq_string = result.content
    questions = mcq_string[7:-3]
    
    return json.loads(questions)




# questions = question_generation("quantum physics", "basic", "advance")
# print(questions["Q2"])
