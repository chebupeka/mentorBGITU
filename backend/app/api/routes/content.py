from fastapi import APIRouter, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.content import KnowledgeResource, Review
from app.schemas.content import (
    ResourceCreate,
    ResourceRead,
    ReviewCreate,
    ReviewRead,
)

router = APIRouter()


# ---------- Reviews ----------
@router.get("/reviews", response_model=list[ReviewRead])
def list_reviews(db: DbSession):
    return db.scalars(
        select(Review).where(Review.is_published.is_(True)).order_by(Review.id.desc())
    ).all()


@router.post("/reviews", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(data: ReviewCreate, current_user: CurrentUser, db: DbSession):
    review = Review(**data.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


# ---------- Knowledge resources ----------
@router.get("/resources", response_model=list[ResourceRead])
def list_resources(db: DbSession):
    return db.scalars(
        select(KnowledgeResource).order_by(
            KnowledgeResource.order.asc(), KnowledgeResource.id.asc()
        )
    ).all()


@router.post(
    "/resources", response_model=ResourceRead, status_code=status.HTTP_201_CREATED
)
def create_resource(data: ResourceCreate, current_user: CurrentUser, db: DbSession):
    resource = KnowledgeResource(**data.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource
