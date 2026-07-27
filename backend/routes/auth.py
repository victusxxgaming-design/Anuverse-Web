import os
import secrets
import urllib.parse
import bcrypt as _bcrypt
from fastapi import APIRouter, HTTPException, Response, Request, status, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
import httpx

from backend.database import get_db
from backend.auth import create_access_token, get_current_user, COOKIE_NAME

SECURE_COOKIE = os.getenv("ENVIRONMENT", "development") == "production"

from backend.models.user import UserInDB, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()


def _verify_password(password: str, hashed: str) -> bool:
    try:
        return _bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False

COOKIE_MAX_AGE = 7 * 24 * 60 * 60  # 7 days

# ── OAuth config ──────────────────────────────────────────────────────────────

GOOGLE_CLIENT_ID     = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

DISCORD_CLIENT_ID     = os.getenv("DISCORD_CLIENT_ID", "")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET", "")

def _app_base_url(request: Request) -> str:
    """Return the public-facing base URL (scheme://host) for building redirect URIs."""
    # Replit exposes the dev domain in this env var
    dev_domain = os.getenv("REPLIT_DEV_DOMAIN", "")
    if dev_domain:
        return f"https://{dev_domain}"
    # Fallback: honour X-Forwarded headers from any reverse proxy
    proto = request.headers.get("x-forwarded-proto", "http")
    host  = request.headers.get("x-forwarded-host", request.headers.get("host", "localhost:5000"))
    return f"{proto}://{host}"


# ── request schemas ───────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


# ── helpers ───────────────────────────────────────────────────────────────────

def _user_out(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "email": doc["email"],
        "role": doc.get("role", "user"),
        "created_at": doc["created_at"].isoformat(),
    }


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=SECURE_COOKIE,
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
        path="/",
    )


async def _find_or_create_oauth_user(
    db,
    *,
    provider_key: str,   # "google_id" or "discord_id"
    provider_id: str,
    email: str,
    name: str,
) -> dict:
    """Find existing user by provider ID or email, or create a new one."""
    # 1. Try matching provider ID
    doc = await db["users"].find_one({provider_key: provider_id})

    # 2. Fall back to email match
    if not doc:
        doc = await db["users"].find_one({"email": email})

    if doc:
        # Backfill provider ID if missing
        if not doc.get(provider_key):
            await db["users"].update_one(
                {"_id": doc["_id"]},
                {"$set": {provider_key: provider_id}},
            )
            doc[provider_key] = provider_id
        return doc

    # 3. Create new user
    new_user = UserInDB(
        name=name,
        email=email,
        password_hash="",          # OAuth users have no password
        role="user",
        created_at=datetime.utcnow(),
        **{provider_key: provider_id},
    )
    result = await db["users"].insert_one(new_user.model_dump())
    return await db["users"].find_one({"_id": result.inserted_id})


# ── POST /api/auth/register ───────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, response: Response):
    db = get_db()
    if await db["users"].find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    doc = UserInDB(
        name=body.name,
        email=body.email,
        password_hash=_hash_password(body.password),
        role="user",
        created_at=datetime.utcnow(),
    )
    result = await db["users"].insert_one(doc.model_dump())
    created = await db["users"].find_one({"_id": result.inserted_id})

    token = create_access_token(
        user_id=str(created["_id"]),
        email=created["email"],
        role=created["role"],
    )
    _set_auth_cookie(response, token)
    return {"user": _user_out(created)}


# ── POST /api/auth/login ──────────────────────────────────────────────────────

@router.post("/login")
async def login(body: LoginRequest, response: Response):
    db = get_db()
    doc = await db["users"].find_one({"email": body.email})
    if not doc or not doc.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not _verify_password(body.password, doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        user_id=str(doc["_id"]),
        email=doc["email"],
        role=doc["role"],
    )
    _set_auth_cookie(response, token)
    return {"user": _user_out(doc)}


# ── GOOGLE OAUTH ──────────────────────────────────────────────────────────────

@router.get("/google")
async def google_login(request: Request):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Google OAuth not configured")

    state = secrets.token_urlsafe(32)
    redirect_uri = f"{_app_base_url(request)}/api/auth/google/callback"

    params = urllib.parse.urlencode({
        "client_id":     GOOGLE_CLIENT_ID,
        "redirect_uri":  redirect_uri,
        "response_type": "code",
        "scope":         "openid email profile",
        "state":         state,
        "access_type":   "online",
    })
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{params}"

    response = RedirectResponse(url=url)
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=SECURE_COOKIE,
        samesite="lax",
        max_age=600,   # 10 minutes
        path="/",
    )
    return response


@router.get("/google/callback")
async def google_callback(request: Request, code: str = "", state: str = "", error: str = ""):
    base = _app_base_url(request)

    if error or not code:
        return RedirectResponse(url=f"{base}/auth?error=google_denied")

    # Verify state
    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        return RedirectResponse(url=f"{base}/auth?error=invalid_state")

    redirect_uri = f"{base}/api/auth/google/callback"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Exchange code for tokens
            token_resp = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code":          code,
                    "client_id":     GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri":  redirect_uri,
                    "grant_type":    "authorization_code",
                },
            )
            if not token_resp.is_success:
                return RedirectResponse(url=f"{base}/auth?error=google_token_failed")

            access_token = token_resp.json().get("access_token")

            # Fetch user profile
            profile_resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if not profile_resp.is_success:
                return RedirectResponse(url=f"{base}/auth?error=google_profile_failed")

            profile = profile_resp.json()
    except httpx.RequestError:
        return RedirectResponse(url=f"{base}/auth?error=google_unreachable")

    google_id = profile.get("sub")
    email     = profile.get("email")
    name      = profile.get("name") or (email.split("@")[0] if email else "User")

    if not email or not google_id:
        return RedirectResponse(url=f"{base}/auth?error=google_no_email")

    db = get_db()
    doc = await _find_or_create_oauth_user(
        db, provider_key="google_id", provider_id=google_id, email=email, name=name
    )

    token = create_access_token(
        user_id=str(doc["_id"]),
        email=doc["email"],
        role=doc["role"],
    )

    response = RedirectResponse(url=f"{base}/login-success")
    _set_auth_cookie(response, token)
    response.delete_cookie("oauth_state", path="/")
    return response


# ── DISCORD OAUTH ─────────────────────────────────────────────────────────────

@router.get("/discord")
async def discord_login(request: Request):
    if not DISCORD_CLIENT_ID:
        raise HTTPException(status_code=503, detail="Discord OAuth not configured")

    state = secrets.token_urlsafe(32)
    redirect_uri = f"{_app_base_url(request)}/api/auth/discord/callback"

    params = urllib.parse.urlencode({
        "client_id":     DISCORD_CLIENT_ID,
        "redirect_uri":  redirect_uri,
        "response_type": "code",
        "scope":         "identify email",
        "state":         state,
    })
    url = f"https://discord.com/oauth2/authorize?{params}"

    response = RedirectResponse(url=url)
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=SECURE_COOKIE,
        samesite="lax",
        max_age=600,
        path="/",
    )
    return response


@router.get("/discord/callback")
async def discord_callback(request: Request, code: str = "", state: str = "", error: str = ""):
    base = _app_base_url(request)

    if error or not code:
        return RedirectResponse(url=f"{base}/auth?error=discord_denied")

    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        return RedirectResponse(url=f"{base}/auth?error=invalid_state")

    redirect_uri = f"{base}/api/auth/discord/callback"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Exchange code for tokens
            token_resp = await client.post(
                "https://discord.com/api/oauth2/token",
                data={
                    "code":          code,
                    "client_id":     DISCORD_CLIENT_ID,
                    "client_secret": DISCORD_CLIENT_SECRET,
                    "redirect_uri":  redirect_uri,
                    "grant_type":    "authorization_code",
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if not token_resp.is_success:
                return RedirectResponse(url=f"{base}/auth?error=discord_token_failed")

            access_token = token_resp.json().get("access_token")

            # Fetch user profile
            profile_resp = await client.get(
                "https://discord.com/api/users/@me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if not profile_resp.is_success:
                return RedirectResponse(url=f"{base}/auth?error=discord_profile_failed")

            profile = profile_resp.json()
    except httpx.RequestError:
        return RedirectResponse(url=f"{base}/auth?error=discord_unreachable")

    discord_id = profile.get("id")
    email      = profile.get("email")
    username   = profile.get("global_name") or profile.get("username") or "Discord User"

    if not discord_id:
        return RedirectResponse(url=f"{base}/auth?error=discord_no_id")

    # Discord may not return email if user hasn't verified — use a fallback
    if not email:
        email = f"discord_{discord_id}@discord.local"

    db = get_db()
    doc = await _find_or_create_oauth_user(
        db, provider_key="discord_id", provider_id=discord_id, email=email, name=username
    )

    token = create_access_token(
        user_id=str(doc["_id"]),
        email=doc["email"],
        role=doc["role"],
    )

    response = RedirectResponse(url=f"{base}/login-success")
    _set_auth_cookie(response, token)
    response.delete_cookie("oauth_state", path="/")
    return response


# ── GET /api/auth/me ──────────────────────────────────────────────────────────

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    from bson import ObjectId
    doc = await db["users"].find_one({"_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": _user_out(doc)}


# ── POST /api/auth/logout ─────────────────────────────────────────────────────

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, httponly=True, secure=SECURE_COOKIE, samesite="lax", path="/")
    return {"success": True}
