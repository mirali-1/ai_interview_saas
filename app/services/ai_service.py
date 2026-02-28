import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_interview(role: str, experience: str, tech_stack: str):

    prompt = f"""
    Generate a structured technical interview for:

    Role: {role}
    Experience Level: {experience}
    Tech Stack: {tech_stack}

    Include:
    - 5 Technical Questions
    - 3 Behavioral Questions
    - 2 Coding Problems
    - Provide brief model answers
    """

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a senior technical interviewer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return {
        "role": role,
        "experience": experience,
        "tech_stack": tech_stack,
        "interview_content": completion.choices[0].message.content
    }