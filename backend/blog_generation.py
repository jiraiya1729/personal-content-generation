from llm import model
from prompt_templates import blog_generation_prompt
from langchain.prompts import ChatPromptTemplate


def topic_blog_generation(topic, currentLevel, targetLevel):
    print(topic, currentLevel, targetLevel)
    prompt_template = ChatPromptTemplate.from_template(blog_generation_prompt)
    final_prompt = prompt_template.invoke(
        {
            "topic": topic,
            "currentLevel": currentLevel,
            "targetLevel": targetLevel,
        }
    )
    
    result = model.invoke(final_prompt)
    print(result.content)
    return result.content
    
    

# topic_blog_generation("quantum physics", "basic", "advance")
{
            "topic": "quantum physics",
            "currentLevel": "basic",
            "targetLevel": "advance"
        }


{"topic_name": "Machine Learning", "current_level": 2, "required_level": 5}