from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from passlib.context import CryptContext

from backend.database import get_db
from backend.models.user import UserCreate, UserLogin, UserOut, UserInDB

router = APIRouter(prefix="/users", tags=["users"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash(password: str) -> str:
    return pwd_ctx.hash(password)


def _verify(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


def _user_out(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        role=doc.get("role", "user"),
        created_at=doc["created_at"],
        google_id=doc.get("google_id"),
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()
    if await db["users"].find_one({"email": user.email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    doc = UserInDB(
        name=user.name,
        email=user.email,
        password_hash=_hash(user.password),
        created_at=datetime.utcnow(),
    )
    result = await db["users"].insert_one(doc.model_dump())
    created = await db["users"].find_one({"_id": result.inserted_id})
    return _user_out(created)


@router.post("/login")
async def login(creds: UserLogin):
    db = get_db()
    doc = await db["users"].find_one({"email": creds.email})
    if not doc or not _verify(creds.password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": _user_out(doc)}


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    db = get_db()
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    doc = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return _user_out(doc)
