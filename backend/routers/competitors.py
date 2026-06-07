from fastapi import APIRouter, Depends, HTTPException
from database.models import User
from routers.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/competitors", tags=["competitors"])

class CompetitorAdd(BaseModel):
    username: str

# In-memory mock for now to save DB schema complexity on a non-core feature
MOCK_COMPETITORS = []

@router.post("/add")
async def add_competitor(comp: CompetitorAdd, current_user: User = Depends(get_current_user)):
    if comp.username not in MOCK_COMPETITORS:
        MOCK_COMPETITORS.append(comp.username)
    return {"status": "success", "username": comp.username}

@router.get("/list")
async def list_competitors(current_user: User = Depends(get_current_user)):
    return MOCK_COMPETITORS

@router.get("/compare/{username}")
async def compare_competitor(username: str, current_user: User = Depends(get_current_user)):
    if username not in MOCK_COMPETITORS:
        raise HTTPException(status_code=404, detail="Competitor not found")
        
    return {
        "username": username,
        "estimated_posting_frequency": "4 times/week",
        "primary_formats": ["Reels", "Carousels"],
        "top_themes": ["Educational", "Behind the Scenes"]
    }
