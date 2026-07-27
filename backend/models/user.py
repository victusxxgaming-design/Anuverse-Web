from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: datetime
    google_id: Optional[str] = None
    discord_id: Optional[str] = None

    class Config:
        populate_by_name = True


class UserInDB(BaseModel):
    name: str
    email: str
    password_hash: str
    role: Literal["user", "admin"] = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    google_id: Optional[str] = None
    discord_id: Optional[str] = None
