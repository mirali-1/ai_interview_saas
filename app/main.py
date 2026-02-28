from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path

# Import routers
from app.routes import auth
from app.routes import interview

# Import database
from app.database import Base, engine

# -----------------------------
# Create FastAPI App
# -----------------------------
app = FastAPI(title="AI Interview SaaS")

# -----------------------------
# Create DB Tables Automatically
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# CORS (Allow frontend requests)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔐 Change to your Railway domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Include API Routers
# -----------------------------
app.include_router(auth.router)
app.include_router(interview.router)

# -----------------------------
# Serve Frontend
# -----------------------------

# Path to frontend folder
frontend_path = Path(__file__).resolve().parent.parent / "frontend"

# Serve static files (CSS + JS)
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Root route → index.html
@app.get("/")
def serve_index():
    return FileResponse(frontend_path / "index.html")

# Dashboard route → dashboard.html
@app.get("/dashboard")
def serve_dashboard():
    return FileResponse(frontend_path / "dashboard.html")