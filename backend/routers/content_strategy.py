from fastapi import APIRouter, Depends
from routers.auth import get_current_user
from database.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/content", tags=["content"])

class ContentRequest(BaseModel):
    industry: str
    focus: str

@router.post("/reels")
async def generate_reels(req: ContentRequest, current_user: User = Depends(get_current_user)):
    return {
        "ideas": [
            f"5 things nobody tells you about {req.industry}",
            f"Behind the scenes of our {req.focus} process",
            f"The mistake that changed everything in {req.industry}"
        ]
    }

@router.post("/calendar")
async def get_calendar(req: ContentRequest, current_user: User = Depends(get_current_user)):
    from services.ai_engine import generate_content_calendar
    return generate_content_calendar()
