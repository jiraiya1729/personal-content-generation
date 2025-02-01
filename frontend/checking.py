from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from dotenv import load_dotenv


load_dotenv()

template = ''' 
Generate quiz questions based on the following text. Create [question_count] questions of type [type_of_question] and ensure they match the [difficulty_level] difficulty. The questions should be well-structured, accurate, and contextually relevant to the text. For multiple-choice questions, provide four options, with one correct answer. For other question types, adhere to their standard format. Avoid repetition and ensure clarity in all questions.

**Text:**

{context}

**Output Format:**

1. List each question with a sequential number and generate based on type of question given.
2. For MCQs:
   - Provide four answer options (A, B, C, D).
   - Clearly indicate the correct answer.
3. For True/False, Fill in the Blanks, or Short Answer:
   - Directly provide the question and the corresponding answer.

For this context type of questions are : {type_of_question} and given output in json format 

'''
prompt_template = ChatPromptTemplate.from_template(template)
# print(prompt_template)
context = ''' 

The Transformer set new benchmarks for machine translation tasks. For the WMT 2014 English-to-German dataset, it achieved a BLEU score of 28.4, surpassing all previous models, including ensembles. Similarly, it achieved a BLEU score of 41.8 on the English-to-French dataset.

Beyond machine translation, the Transformer demonstrated its generalizability by achieving strong results on tasks like English constituency parsing. Its attention mechanism provided interpretable outputs, revealing the model's ability to capture syntactic and semantic structures.

'''
question_count = 4
type_of_question = "MCQs"
difficulty_level = "easy"

prompt = prompt_template.invoke({'context': context , 'difficulty_level': difficulty_level, 'question_count': question_count, 'type_of_question': type_of_question})
print(prompt)
model = ChatGoogleGenerativeAI(model = "gemini-pro", temperature=0.1)

result = model.invoke(prompt)
print(result.content)