from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid
import random
import string


def short_ref() -> str:
    chars = string.ascii_uppercase + string.digits
    return "ANU-" + "".join(random.choices(chars, k=6))


class OrderCreate(BaseModel):
    user_id: str
    user_email: str
    customer_name: str
    discord: str
    plan_id: str
    plan_name: str
    plan_category: Literal["vps", "minecraft"]
    billing_cycle: Literal["monthly", "quarterly", "annually"]
    price: str
    ram: str
    vcores: str
    disk: str
    utr: str
    payment_screenshot: Optional[str] = None   # URL or base64


class OrderOut(BaseModel):
    id: str
    order_ref: str
    user_id: str
    user_email: str
    customer_name: str
    discord: str
    plan_id: str
    plan_name: str
    plan_category: str
    billing_cycle: str
    price: str
    ram: str
    vcores: str
    disk: str
    status: str
    provision_status: str
    utr: str
    payment_screenshot: Optional[str] = None
    server: Optional[str] = None
    panel_url: Optional[str] = None
    server_password: Optional[str] = None
    provision_error: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True


class OrderInDB(BaseModel):
    order_ref: str = Field(default_factory=short_ref)
    user_id: str
    user_email: str
    customer_name: str
    discord: str
    plan_id: str
    plan_name: str
    plan_category: str
    billing_cycle: str
    price: str
    ram: str
    vcores: str
    disk: str
    status: Literal["pending", "paid", "rejected"] = "pending"
    provision_status: Literal["unpaid", "provisioning", "provisioned", "failed"] = "unpaid"
    utr: str
    payment_screenshot: Optional[str] = None
    server: Optional[str] = None           # Pterodactyl server ID / username
    panel_url: Optional[str] = None
    server_password: Optional[str] = None
    provision_error: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
