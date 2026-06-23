from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import CurrentUser, DbSession
from app.core.security import create_access_token
from app.crud import user as user_crud
from app.schemas.auth import Token, UserCreate, UserRead

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: DbSession):
    if user_crud.get_by_email(db, data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует",
        )
    user = user_crud.create_user(db, data)
    return Token(access_token=create_access_token(user.id))


@router.post("/login", response_model=Token)
def login(
    db: DbSession,
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    # OAuth2PasswordRequestForm: поле username используем как email
    user = user_crud.authenticate(db, form.username, form.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserRead)
def me(current_user: CurrentUser):
    return current_user
