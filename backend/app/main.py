from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import academics, auth, diagrams, experience, homelab, profile, projects, skills

settings = get_settings()

app = FastAPI(title="Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
for module in (profile, experience, projects, homelab, skills, academics, diagrams):
    app.include_router(module.router)
    app.include_router(module.admin_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
