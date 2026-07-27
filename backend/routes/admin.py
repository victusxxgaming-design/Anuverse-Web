from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from backend.database import get_db
from backend.auth import require_admin
from backend.pterodactyl import provision_server, ProvisionError

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Response model ─────────────────────────────────────────────────────────────

class AdminOrderOut(BaseModel):
    id: str
    order_ref: str

    # Joined from users collection (authoritative account data)
    user_id: str
    user_name: Optional[str] = None     # account name at time of request
    user_email: Optional[str] = None    # account email at time of request

    # Order-level contact fields (captured at order creation)
    customer_name: str
    discord: str

    # Plan / billing
    plan_id: str
    plan_name: str
    plan_category: str
    billing_cycle: str
    price: str
    ram: str
    vcores: str
    disk: str

    # Payment
    status: str
    utr: str
    payment_screenshot: Optional[str] = None

    # Provision
    provision_status: str
    server: Optional[str] = None
    panel_url: Optional[str] = None
    server_password: Optional[str] = None
    provision_error: Optional[str] = None

    created_at: datetime

    class Config:
        populate_by_name = True


# ── Helper ─────────────────────────────────────────────────────────────────────

def _admin_order_out(doc: dict, user_map: dict) -> AdminOrderOut:
    user = user_map.get(doc["user_id"], {})
    return AdminOrderOut(
        id=str(doc["_id"]),
        order_ref=doc["order_ref"],
        user_id=doc["user_id"],
        user_name=user.get("name"),
        user_email=user.get("email"),
        customer_name=doc["customer_name"],
        discord=doc["discord"],
        plan_id=doc["plan_id"],
        plan_name=doc["plan_name"],
        plan_category=doc["plan_category"],
        billing_cycle=doc["billing_cycle"],
        price=doc["price"],
        ram=doc["ram"],
        vcores=doc["vcores"],
        disk=doc["disk"],
        status=doc["status"],
        utr=doc.get("utr", ""),
        payment_screenshot=doc.get("payment_screenshot"),
        provision_status=doc["provision_status"],
        server=doc.get("server"),
        panel_url=doc.get("panel_url"),
        server_password=doc.get("server_password"),
        provision_error=doc.get("provision_error"),
        created_at=doc["created_at"],
    )


# ── GET /api/admin/all-orders ──────────────────────────────────────────────────

@router.get("/all-orders", response_model=List[AdminOrderOut])
async def get_all_orders(current_user: dict = Depends(require_admin)):
    """
    Admin-only. Return every order sorted newest first, with user
    name/email joined from the users collection.
    """
    db = get_db()

    # 1. Fetch all orders sorted by created_at descending
    orders = await db["orders"].find().sort("created_at", -1).to_list(length=None)

    if not orders:
        return []

    # 2. Collect unique user IDs and batch-fetch from users collection
    user_ids = list({doc["user_id"] for doc in orders})
    object_ids = [ObjectId(uid) for uid in user_ids if ObjectId.is_valid(uid)]

    users_cursor = db["users"].find(
        {"_id": {"$in": object_ids}},
        {"name": 1, "email": 1},          # project only what we need
    )
    user_map: dict = {}
    async for u in users_cursor:
        user_map[str(u["_id"])] = {"name": u.get("name"), "email": u.get("email")}

    # 3. Merge and return
    return [_admin_order_out(doc, user_map) for doc in orders]


# ── POST /api/admin/orders/{ref}/mark-paid ─────────────────────────────────────

@router.post("/orders/{ref}/mark-paid", response_model=AdminOrderOut)
async def mark_order_paid(ref: str, current_user: dict = Depends(require_admin)):
    """
    Admin-only. Mark an order as paid and set provision_status to provisioning.
    Pterodactyl provisioning is wired in during Phase 9.
    """
    db = get_db()

    # 1. Find order
    order = await db["orders"].find_one({"order_ref": ref})
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{ref}' not found")

    # 2. Guard: already provisioned
    if order["provision_status"] == "provisioned":
        raise HTTPException(status_code=400, detail="Order is already provisioned")

    # 3. Mark paid + provisioning
    await db["orders"].update_one(
        {"order_ref": ref},
        {"$set": {"status": "paid", "provision_status": "provisioning"}},
    )
    order["status"] = "paid"
    order["provision_status"] = "provisioning"

    # 4. Pterodactyl provisioning (retry-once on timeout — see Phase 9.4)
    try:
        result = await provision_server(order)

        # 4a. Success — persist server details
        await db["orders"].update_one(
            {"order_ref": ref},
            {"$set": {
                "provision_status": "provisioned",
                "panel_url": result.panel_url,
                "server": result.server,
                "server_password": result.server_password,
                "provision_error": None,
            }},
        )

    except ProvisionError as exc:
        # 4b. Failure — persist raw error so admin can see it and retry manually
        await db["orders"].update_one(
            {"order_ref": ref},
            {"$set": {
                "provision_status": "failed",
                "provision_error": str(exc),
            }},
        )
        raise HTTPException(
            status_code=502,
            detail=f"Pterodactyl provisioning failed: {exc}",
        )

    # 5. Return final state with user join
    updated = await db["orders"].find_one({"order_ref": ref})

    user_doc = None
    if ObjectId.is_valid(updated["user_id"]):
        user_doc = await db["users"].find_one(
            {"_id": ObjectId(updated["user_id"])},
            {"name": 1, "email": 1},
        )
    user_map = {updated["user_id"]: user_doc} if user_doc else {}

    return _admin_order_out(updated, user_map)


# ── POST /api/admin/orders/{ref}/reject ───────────────────────────────────────

@router.post("/orders/{ref}/reject")
async def reject_order(ref: str, current_user: dict = Depends(require_admin)):
    """Admin-only. Reject an order that has not yet been provisioned."""
    db = get_db()

    order = await db["orders"].find_one({"order_ref": ref})
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{ref}' not found")

    if order["provision_status"] == "provisioned":
        raise HTTPException(status_code=400, detail="Cannot reject an already provisioned order")

    await db["orders"].update_one(
        {"order_ref": ref},
        {"$set": {"status": "rejected"}},
    )

    return {"success": True}
