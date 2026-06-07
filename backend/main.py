from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, instagram, analytics, ai_recommendations, content_strategy, competitors

app = FastAPI(title="AixMedia Production API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(instagram.router)
app.include_router(analytics.router)
app.include_router(ai_recommendations.router)
app.include_router(content_strategy.router)
app.include_router(competitors.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "AixMedia Backend"}
