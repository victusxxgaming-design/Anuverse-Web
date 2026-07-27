from fastapi import APIRouter

router = APIRouter(tags=["plans"])

# ── Hardcoded VPS plan catalogue ──────────────────────────────────────────────

VPS_PLANS = [
    {
        "id": "intel_xeon",
        "name": "Intel Xeon",
        "plans": [
            {
                "id": "vps_intel_1",
                "name": "Starter",
                "ram": "2GB",
                "vcores": 2,
                "nvme": "30GB",
                "price": {"monthly": 199, "quarterly": 179, "annually": 149},
            },
            {
                "id": "vps_intel_2",
                "name": "Basic",
                "ram": "4GB",
                "vcores": 4,
                "nvme": "60GB",
                "price": {"monthly": 349, "quarterly": 319, "annually": 279},
            },
            {
                "id": "vps_intel_3",
                "name": "Standard",
                "ram": "8GB",
                "vcores": 6,
                "nvme": "120GB",
                "price": {"monthly": 649, "quarterly": 599, "annually": 529},
            },
            {
                "id": "vps_intel_4",
                "name": "Advanced",
                "ram": "16GB",
                "vcores": 8,
                "nvme": "240GB",
                "price": {"monthly": 1199, "quarterly": 1099, "annually": 969},
            },
        ],
    },
    {
        "id": "amd_epyc",
        "name": "AMD EPYC",
        "plans": [
            {
                "id": "vps_epyc_1",
                "name": "Nano",
                "ram": "2GB",
                "vcores": 2,
                "nvme": "40GB",
                "price": {"monthly": 299, "quarterly": 269, "annually": 239},
            },
            {
                "id": "vps_epyc_2",
                "name": "Micro",
                "ram": "4GB",
                "vcores": 4,
                "nvme": "80GB",
                "price": {"monthly": 549, "quarterly": 499, "annually": 439},
            },
            {
                "id": "vps_epyc_3",
                "name": "Standard",
                "ram": "8GB",
                "vcores": 6,
                "nvme": "160GB",
                "price": {"monthly": 999, "quarterly": 909, "annually": 799},
            },
            {
                "id": "vps_epyc_4",
                "name": "Pro",
                "ram": "16GB",
                "vcores": 8,
                "nvme": "320GB",
                "price": {"monthly": 1849, "quarterly": 1699, "annually": 1499},
            },
        ],
    },
    {
        "id": "amd_ryzen",
        "name": "AMD Ryzen",
        "plans": [
            {
                "id": "vps_ryzen_1",
                "name": "Starter",
                "ram": "2GB",
                "vcores": 2,
                "nvme": "40GB",
                "price": {"monthly": 249, "quarterly": 229, "annually": 199},
            },
            {
                "id": "vps_ryzen_2",
                "name": "Basic",
                "ram": "4GB",
                "vcores": 4,
                "nvme": "80GB",
                "price": {"monthly": 449, "quarterly": 409, "annually": 359},
            },
            {
                "id": "vps_ryzen_3",
                "name": "Standard",
                "ram": "8GB",
                "vcores": 6,
                "nvme": "160GB",
                "price": {"monthly": 849, "quarterly": 779, "annually": 689},
            },
            {
                "id": "vps_ryzen_4",
                "name": "Pro",
                "ram": "16GB",
                "vcores": 8,
                "nvme": "320GB",
                "price": {"monthly": 1599, "quarterly": 1469, "annually": 1299},
            },
        ],
    },
]


# ── Hardcoded Minecraft plan catalogue ───────────────────────────────────────

MINECRAFT_PLANS = [
    {
        "id": "basic",
        "name": "Basic",
        "plans": [
            {
                "id": "hamster",
                "name": "Hamster",
                "ram": "2GB",
                "vcores": 2,
                "disk": "15GB",
                "players": 10,
                "price": {"monthly": 149, "quarterly": 129, "annually": 109},
            },
            {
                "id": "rabbit",
                "name": "Rabbit",
                "ram": "4GB",
                "vcores": 3,
                "disk": "25GB",
                "players": 25,
                "price": {"monthly": 279, "quarterly": 249, "annually": 219},
            },
            {
                "id": "pup",
                "name": "Pup",
                "ram": "8GB",
                "vcores": 4,
                "disk": "40GB",
                "players": 50,
                "price": {"monthly": 519, "quarterly": 469, "annually": 419},
            },
            {
                "id": "kitten",
                "name": "Kitten",
                "ram": "16GB",
                "vcores": 6,
                "disk": "80GB",
                "players": 100,
                "price": {"monthly": 999, "quarterly": 909, "annually": 809},
            },
        ],
    },
    {
        "id": "premium",
        "name": "Premium",
        "plans": [
            {
                "id": "wolf",
                "name": "Wolf",
                "ram": "4GB",
                "vcores": 4,
                "disk": "50GB",
                "players": 40,
                "price": {"monthly": 449, "quarterly": 409, "annually": 359},
            },
            {
                "id": "panther",
                "name": "Panther",
                "ram": "8GB",
                "vcores": 6,
                "disk": "100GB",
                "players": 80,
                "price": {"monthly": 849, "quarterly": 769, "annually": 679},
            },
            {
                "id": "tiger",
                "name": "Tiger",
                "ram": "16GB",
                "vcores": 8,
                "disk": "200GB",
                "players": 150,
                "price": {"monthly": 1599, "quarterly": 1449, "annually": 1279},
            },
            {
                "id": "dragon",
                "name": "Dragon",
                "ram": "32GB",
                "vcores": 12,
                "disk": "400GB",
                "players": 300,
                "price": {"monthly": 2999, "quarterly": 2699, "annually": 2399},
            },
        ],
    },
]


# ── Plan lookup helper (used by orders route) ─────────────────────────────────

def find_plan(plan_id: str) -> dict | None:
    """Search all catalogues and return (plan_dict, category_label) or None."""
    for category in MINECRAFT_PLANS + VPS_PLANS:
        for plan in category["plans"]:
            if plan["id"] == plan_id:
                plan_category = "minecraft" if category in MINECRAFT_PLANS else "vps"
                return {**plan, "plan_category": plan_category, "category_name": category["name"]}
    return None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/plans")
async def get_minecraft_plans():
    return MINECRAFT_PLANS


@router.get("/plans/{category_id}")
async def get_minecraft_category(category_id: str):
    from fastapi import HTTPException
    category = next((c for c in MINECRAFT_PLANS if c["id"] == category_id), None)
    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{category_id}' not found")
    return category


@router.get("/vps-plans")
async def get_vps_plans():
    return VPS_PLANS


@router.get("/vps-plans/{category_id}")
async def get_vps_category(category_id: str):
    category = next((c for c in VPS_PLANS if c["id"] == category_id), None)
    if not category:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Category '{category_id}' not found")
    return category
