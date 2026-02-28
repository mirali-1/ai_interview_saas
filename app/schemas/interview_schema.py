from pydantic import BaseModel


class InterviewRequest(BaseModel):
    role: str
    experience: str
    tech_stack: str


class InterviewResponse(BaseModel):
    role: str
    experience: str
    tech_stack: str
    interview_content: str