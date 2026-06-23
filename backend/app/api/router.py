from fastapi import APIRouter

from app.api.routes import auth, content, profile, stats

api_router = APIRouter()

# --- Dev A ---
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(content.router, tags=["content"])  # /reviews, /resources

# --- Dev B ---
# from app.api.routes import mentors, bookings
# api_router.include_router(mentors.router, prefix="/mentors", tags=["mentors"])
# api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
