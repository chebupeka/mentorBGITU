from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    author_name: str = Field(max_length=150)
    author_sub: str = Field(default="", max_length=150)
    text: str


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ResourceBase(BaseModel):
    title: str = Field(max_length=150)
    description: str = ""
    url: str = "#"
    icon: str | None = None
    order: int = 0


class ResourceCreate(ResourceBase):
    pass


class ResourceRead(ResourceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
