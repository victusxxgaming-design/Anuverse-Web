from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.auth import router as auth_router
from backend.routes.users import router as users_router
from backend.routes.orders import router as orders_router
from backend.routes.plans import router as plans_router
from backend.routes.my import router as my_router
from backend.routes.admin import router as admin_router

app = FastAPI(
    title="Anuverse API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(plans_router, prefix="/api")
app.include_router(my_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "anuverse-api"}
