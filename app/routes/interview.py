from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.interview_schema import InterviewRequest, InterviewResponse
from app.services.ai_service import generate_interview
from app.core.security import get_current_user
from app.models.user import User
from app.models.interview import Interview
from app.db.database import SessionLocal

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/generate", response_model=InterviewResponse)
def generate(
    request: InterviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1️⃣ Generate AI interview
    result = generate_interview(
        role=request.role,
        experience=request.experience,
        tech_stack=request.tech_stack
    )

    # 2️⃣ Save to database
    interview = Interview(
        role=result["role"],
        experience=result["experience"],
        tech_stack=result["tech_stack"],
        interview_content=result["interview_content"],
        user_id=current_user.id
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    # 3️⃣ Return structured response
    return result


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interviews = db.query(Interview).filter(
        Interview.user_id == current_user.id
    ).all()

    return interviews