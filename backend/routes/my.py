from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dateutil.relativedelta import relativedelta

from backend.database import get_db
from backend.auth import get_current_user

router = APIRouter(prefix="/my", tags=["my"])


# ── Renewal date helper ────────────────────────────────────────────────────────

CYCLE_DELTA = {
    "monthly":   relativedelta(months=1),
    "quarterly": relativedelta(months=3),
    "annually":  relativedelta(years=1),
}

def _renewal_date(created_at: datetime, billing_cycle: str) -> Optional[datetime]:
    delta = CYCLE_DELTA.get(billing_cycle)
    if delta is None:
        return None
    return created_at + delta


# ── Response model ─────────────────────────────────────────────────────────────

class MyOrderOut(BaseModel):
    order_ref: str
    plan_name: str
    plan_category: str
    billing_cycle: str
    price: str
    ram: str
    vcores: str
    disk: str
    status: str
    provision_status: str
    panel_url: Optional[str] = None
    server_password: Optional[str] = None
    server: Optional[str] = None
    provision_error: Optional[str] = None
    created_at: datetime
    renewal_date: Optional[datetime] = None


# ── Helper ─────────────────────────────────────────────────────────────────────

def _my_order_out(doc: dict) -> MyOrderOut:
    provisioned = doc.get("provision_status") == "provisioned"
    return MyOrderOut(
        order_ref=doc["order_ref"],
        plan_name=doc["plan_name"],
        plan_category=doc.get("plan_category", ""),
        billing_cycle=doc["billing_cycle"],
        price=doc["price"],
        ram=doc.get("ram", ""),
        vcores=doc.get("vcores", ""),
        disk=doc.get("disk", ""),
        status=doc["status"],
        provision_status=doc["provision_status"],
        panel_url=doc.get("panel_url"),
        server_password=doc.get("server_password"),
        server=doc.get("server") if provisioned else None,
        provision_error=doc.get("provision_error"),
        created_at=doc["created_at"],
        renewal_date=_renewal_date(doc["created_at"], doc["billing_cycle"]),
    )


# ── GET /api/my/orders ─────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[MyOrderOut])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Return all orders belonging to the authenticated user, newest first."""
    db = get_db()
    cursor = db["orders"].find({"user_id": current_user["id"]}).sort("created_at", -1)
    return [_my_order_out(doc) async for doc in cursor]
