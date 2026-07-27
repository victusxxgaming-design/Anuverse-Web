import os
import base64
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from typing import List, Literal, Optional
from urllib.parse import quote

from backend.database import get_db
from backend.models.order import OrderInDB, OrderOut
from backend.routes.plans import find_plan
from backend.auth import get_current_user

MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024  # 5 MB
ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}

router = APIRouter(prefix="/orders", tags=["orders"])

UPI_ID = os.getenv("UPI_ID", "veltrion@upi")   # set UPI_ID in Secrets


# ── request schema ────────────────────────────────────────────────────────────

class OrderCreateRequest(BaseModel):
    plan_id: str
    plan_category: Literal["vps", "minecraft"]
    billing_cycle: Literal["monthly", "quarterly", "annually"]
    customer_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    discord: str = Field(..., min_length=2, max_length=100)


# ── helpers ───────────────────────────────────────────────────────────────────

def _order_out(doc: dict) -> OrderOut:
    return OrderOut(
        id=str(doc["_id"]),
        order_ref=doc["order_ref"],
        user_id=doc["user_id"],
        user_email=doc["user_email"],
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
        provision_status=doc["provision_status"],
        utr=doc.get("utr", ""),
        payment_screenshot=doc.get("payment_screenshot"),
        server=doc.get("server"),
        panel_url=doc.get("panel_url"),
        server_password=doc.get("server_password"),
        provision_error=doc.get("provision_error"),
        created_at=doc["created_at"],
    )


def _build_upi_uri(amount: int, order_ref: str, plan_name: str) -> str:
    pa = quote(UPI_ID)
    pn = quote("Anuverse")
    tn = quote(f"{plan_name} Hosting")
    return f"upi://pay?pa={pa}&pn={pn}&am={amount}&tr={order_ref}&tn={tn}&cu=INR"


# ── POST /api/orders ──────────────────────────────────────────────────────────

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    body: OrderCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    # 1. Look up plan
    plan = find_plan(body.plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail=f"Plan '{body.plan_id}' not found")

    if plan["plan_category"] != body.plan_category:
        raise HTTPException(
            status_code=400,
            detail=f"Plan '{body.plan_id}' is a {plan['plan_category']} plan, not {body.plan_category}",
        )

    # 2. Calculate price
    price_map: dict = plan.get("price", {})
    amount = price_map.get(body.billing_cycle)
    if amount is None:
        raise HTTPException(
            status_code=400,
            detail=f"billing_cycle '{body.billing_cycle}' not available for this plan",
        )

    # 3. Insert order doc
    disk_field = plan.get("disk") or plan.get("nvme", "")
    doc = OrderInDB(
        user_id=current_user["id"],
        user_email=body.email,
        customer_name=body.customer_name,
        discord=body.discord,
        plan_id=body.plan_id,
        plan_name=plan["name"],
        plan_category=plan["plan_category"],
        billing_cycle=body.billing_cycle,
        price=str(amount),
        ram=plan.get("ram", ""),
        vcores=str(plan.get("vcores", "")),
        disk=disk_field,
        status="pending",
        provision_status="unpaid",
        utr="",
    )
    result = await db["orders"].insert_one(doc.model_dump())
    created = await db["orders"].find_one({"_id": result.inserted_id})

    # 4. Build UPI URI
    upi_uri = _build_upi_uri(amount, created["order_ref"], plan["name"])

    return {
        "order_ref": created["order_ref"],
        "upi_uri": upi_uri,
        "amount": amount,
        "plan_name": plan["name"],
        "plan_category": plan["plan_category"],
        "billing_cycle": body.billing_cycle,
        "order_id": str(created["_id"]),
    }


# ── POST /api/orders/{ref}/paid ───────────────────────────────────────────────

@router.post("/{ref}/paid")
async def submit_payment(
    ref: str,
    utr: str = Form(...),
    screenshot: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    # 1. Find order by ref
    order = await db["orders"].find_one({"order_ref": ref})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Verify ownership
    if order["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="This order does not belong to you")

    # 3. Guard against re-submission
    if order["status"] == "paid":
        raise HTTPException(status_code=400, detail="Order is already marked as paid")
    if order["status"] == "rejected":
        raise HTTPException(status_code=400, detail="Order has been rejected and cannot be updated")

    # 4. Validate UTR
    utr = utr.strip()
    if not utr:
        raise HTTPException(status_code=400, detail="UTR cannot be empty")

    # 5. Validate screenshot file type and size
    content_type = screenshot.content_type or ""
    if content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{content_type}'. Allowed: JPEG, PNG, WebP, GIF",
        )

    raw = await screenshot.read()
    if len(raw) > MAX_SCREENSHOT_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Screenshot exceeds 5 MB limit ({len(raw) // 1024} KB received)",
        )

    # 6. Encode as base64 data URI
    ext = content_type.split("/")[-1]
    screenshot_data = f"data:{content_type};base64,{base64.b64encode(raw).decode()}"

    # 7. Update order
    await db["orders"].update_one(
        {"order_ref": ref},
        {"$set": {"utr": utr, "payment_screenshot": screenshot_data}},
    )

    return {"success": True}


# ── GET /api/orders/user/:user_id ─────────────────────────────────────────────

@router.get("/user/{user_id}", response_model=List[OrderOut])
async def get_user_orders(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    # Users can only fetch their own orders; admins can fetch any
    if current_user["role"] != "admin" and current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    db = get_db()
    cursor = db["orders"].find({"user_id": user_id}).sort("created_at", -1)
    return [_order_out(doc) async for doc in cursor]


# ── GET /api/orders/:order_id ─────────────────────────────────────────────────

@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")
    doc = await db["orders"].find_one({"_id": ObjectId(order_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user["role"] != "admin" and current_user["id"] != doc["user_id"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return _order_out(doc)


# ── PATCH /api/orders/:order_id/status ───────────────────────────────────────

@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    provision_status: str = None,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")

    valid_status = {"pending", "paid", "rejected"}
    valid_provision = {"unpaid", "provisioning", "provisioned", "failed"}
    if status not in valid_status:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid_status}")
    if provision_status and provision_status not in valid_provision:
        raise HTTPException(status_code=400, detail=f"provision_status must be one of {valid_provision}")
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")

    update: dict = {"status": status}
    if provision_status:
        update["provision_status"] = provision_status

    db = get_db()
    result = await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Updated", "order_id": order_id, **update}


# ── PATCH /api/orders/:order_id/provision ────────────────────────────────────

@router.patch("/{order_id}/provision")
async def update_provision_details(
    order_id: str,
    server: str = None,
    panel_url: str = None,
    server_password: str = None,
    provision_error: str = None,
    provision_status: str = None,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admins only")
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order ID")

    db = get_db()
    update = {k: v for k, v in {
        "server": server, "panel_url": panel_url,
        "server_password": server_password,
        "provision_error": provision_error,
        "provision_status": provision_status,
    }.items() if v is not None}

    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db["orders"].update_one({"_id": ObjectId(order_id)}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Provision details updated", "order_id": order_id}
