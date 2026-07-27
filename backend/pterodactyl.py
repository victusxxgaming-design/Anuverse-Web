"""
Pterodactyl provisioning integration.

Environment variables required:
  PTERODACTYL_URL      — base URL of the panel, e.g. https://panel.example.com
  PTERODACTYL_API_KEY  — Application API key (Admin → API Credentials)
"""

import os
import re
import secrets
import string
from dataclasses import dataclass

import httpx


# ── Config ─────────────────────────────────────────────────────────────────────

def _panel_url() -> str:
    url = os.getenv("PTERODACTYL_URL", "").rstrip("/")
    if not url:
        raise ProvisionError("PTERODACTYL_URL environment variable is not set")
    return url

def _api_key() -> str:
    key = os.getenv("PTERODACTYL_API_KEY", "")
    if not key:
        raise ProvisionError("PTERODACTYL_API_KEY environment variable is not set")
    return key

def _headers() -> dict:
    return {
        "Authorization": f"Bearer {_api_key()}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }


# ── Result / Error types ───────────────────────────────────────────────────────

@dataclass
class ProvisionResult:
    panel_url: str        # Direct URL to this server on the panel
    server: str           # Pterodactyl server identifier (short UUID)
    server_password: str  # Panel login password (set/reset during provisioning)


class ProvisionError(Exception):
    """Raised when Pterodactyl provisioning fails for any reason."""

class ProvisionTimeoutError(ProvisionError):
    """Raised specifically when a Pterodactyl API call times out."""


# ── 9.2 Egg / Nest / Node mapping ─────────────────────────────────────────────

# Hardcoded per-category config.
# Update nest_id, egg_id, node_id to match your panel's setup.
# docker_image and startup must match the egg's defaults exactly.
_EGG_MAP: dict[str, dict] = {
    "vps": {
        "nest_id": 1,
        "egg_id": 3,
        "node_id": 1,
        "docker_image": "ghcr.io/pterodactyl/yolks:debian",
        "startup": "/bin/bash {{STARTUP_CMD}}",
    },
    "minecraft": {
        "nest_id": 2,
        "egg_id": 5,
        "node_id": 1,
        "docker_image": "ghcr.io/pterodactyl/yolks:java_17",
        "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    },
}


def get_egg_config(plan_category: str) -> dict:
    """
    Return the full egg/node config dict for a given plan_category.

    Raises:
        ProvisionError: if the category is not in the map.
    """
    key = plan_category.lower().strip()
    config = _EGG_MAP.get(key)
    if config is None:
        supported = ", ".join(f'"{k}"' for k in _EGG_MAP)
        raise ProvisionError(
            f"No egg mapping for plan_category '{plan_category}'. "
            f"Supported: {supported}"
        )
    return config


# ── Helpers ────────────────────────────────────────────────────────────────────

def _random_password(length: int = 16) -> str:
    """Cryptographically random alphanumeric password."""
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def _make_username(email: str) -> str:
    """Derive a Pterodactyl-safe username (a-z 0-9 _ - .) from an email."""
    local = email.split("@")[0].lower()
    username = re.sub(r"[^a-z0-9_\-.]", "_", local)[:32]
    return username or "user"


def _split_name(full_name: str) -> tuple[str, str]:
    """Split a full name into (first, last). Last defaults to '-'."""
    parts = full_name.strip().split(None, 1)
    first = parts[0] if parts else "User"
    last = parts[1] if len(parts) > 1 else "-"
    return first, last


def _parse_mb(value: str) -> int:
    """
    Parse a human-readable storage/RAM string into megabytes.

    Examples:
      "2GB"   → 2048
      "512MB" → 512
      "1024"  → 1024   (bare number treated as MB)
      "2.5GB" → 2560
    """
    value = value.strip().upper()
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*(GB|MB|G|M)?", value)
    if not match:
        raise ProvisionError(f"Cannot parse resource value '{value}' into MB")
    amount = float(match.group(1))
    unit = match.group(2) or "MB"
    if unit in ("GB", "G"):
        return int(amount * 1024)
    return int(amount)


# ── 9.1 Find or create a Pterodactyl user ─────────────────────────────────────

async def find_or_create_ptero_user(
    email: str, full_name: str
) -> tuple[int, str]:
    """
    Return (ptero_user_id, panel_password) for *email*.

    - Existing user → reset their password so we always know it.
    - New user      → create with a generated password.

    Raises:
        ProvisionTimeoutError: on HTTP timeout.
        ProvisionError: on any other API error.
    """
    panel = _panel_url()
    headers = _headers()
    first_name, last_name = _split_name(full_name)
    password = _random_password()

    async with httpx.AsyncClient(timeout=15) as client:

        # Step 1: search for existing user
        try:
            resp = await client.get(
                f"{panel}/api/application/users",
                headers=headers,
                params={"filter[email]": email},
            )
        except httpx.TimeoutException as exc:
            raise ProvisionTimeoutError(
                f"Timed out searching for Pterodactyl user: {exc}"
            ) from exc
        except httpx.RequestError as exc:
            raise ProvisionError(
                f"Network error reaching Pterodactyl: {exc}"
            ) from exc

        if resp.status_code != 200:
            raise ProvisionError(
                f"Pterodactyl user search failed: "
                f"HTTP {resp.status_code} — {resp.text[:200]}"
            )

        users = resp.json().get("data", [])

        if users:
            ptero_id: int = users[0]["attributes"]["id"]

            # Reset password so the caller always receives a known credential
            try:
                patch = await client.patch(
                    f"{panel}/api/application/users/{ptero_id}",
                    headers=headers,
                    json={
                        "email": email,
                        "username": users[0]["attributes"]["username"],
                        "first_name": users[0]["attributes"]["first_name"],
                        "last_name": users[0]["attributes"]["last_name"],
                        "password": password,
                    },
                )
            except httpx.TimeoutException as exc:
                raise ProvisionTimeoutError(
                    f"Timed out resetting panel password: {exc}"
                ) from exc
            except httpx.RequestError as exc:
                raise ProvisionError(
                    f"Network error resetting panel password: {exc}"
                ) from exc

            if patch.status_code not in (200, 201):
                raise ProvisionError(
                    f"Pterodactyl password reset failed: "
                    f"HTTP {patch.status_code} — {patch.text[:200]}"
                )

            return ptero_id, password

        # Step 2: create new user
        username = _make_username(email)
        try:
            resp = await client.post(
                f"{panel}/api/application/users",
                headers=headers,
                json={
                    "email": email,
                    "username": username,
                    "first_name": first_name,
                    "last_name": last_name,
                    "password": password,
                },
            )
        except httpx.TimeoutException as exc:
            raise ProvisionTimeoutError(
                f"Timed out creating Pterodactyl user: {exc}"
            ) from exc
        except httpx.RequestError as exc:
            raise ProvisionError(
                f"Network error reaching Pterodactyl: {exc}"
            ) from exc

        if resp.status_code not in (200, 201):
            raise ProvisionError(
                f"Pterodactyl user creation failed: "
                f"HTTP {resp.status_code} — {resp.text[:200]}"
            )

        ptero_id = resp.json()["attributes"]["id"]
        return ptero_id, password


# ── 9.3 Get a free allocation ──────────────────────────────────────────────────

async def _get_free_allocation(
    client: httpx.AsyncClient, panel: str, headers: dict, node_id: int
) -> int:
    """
    Find and return the ID of the first unassigned allocation on *node_id*.

    Raises:
        ProvisionTimeoutError: on HTTP timeout.
        ProvisionError: if no free allocation is found or the API call fails.
    """
    page = 1
    while True:
        try:
            resp = await client.get(
                f"{panel}/api/application/nodes/{node_id}/allocations",
                headers=headers,
                params={"page": page},
            )
        except httpx.TimeoutException as exc:
            raise ProvisionTimeoutError(
                f"Timed out fetching allocations: {exc}"
            ) from exc
        except httpx.RequestError as exc:
            raise ProvisionError(
                f"Network error fetching allocations: {exc}"
            ) from exc

        if resp.status_code != 200:
            raise ProvisionError(
                f"Pterodactyl allocation fetch failed: "
                f"HTTP {resp.status_code} — {resp.text[:200]}"
            )

        body = resp.json()
        for alloc in body.get("data", []):
            if not alloc["attributes"]["assigned"]:
                return alloc["attributes"]["id"]

        # Follow pagination
        meta = body.get("meta", {}).get("pagination", {})
        if page >= meta.get("total_pages", 1):
            break
        page += 1

    raise ProvisionError(
        f"No free allocations available on node {node_id}. "
        "Add more allocations in the Pterodactyl panel."
    )


# ── 9.3 Create server ─────────────────────────────────────────────────────────

async def create_ptero_server(
    ptero_user_id: int,
    order: dict,
    egg_cfg: dict,
) -> str:
    """
    Create a server on Pterodactyl and return its identifier (short UUID).

    Raises:
        ProvisionTimeoutError: on HTTP timeout.
        ProvisionError: on API error or parse failure.
    """
    panel = _panel_url()
    headers = _headers()

    ram_mb = _parse_mb(order["ram"])
    disk_mb = _parse_mb(order["disk"])
    cpu = int(float(order["vcores"])) * 100   # vcores → CPU % (1 vcore = 100 %)

    server_name = f"{order['order_ref']}-{order['plan_name']}"

    async with httpx.AsyncClient(timeout=30) as client:

        allocation_id = await _get_free_allocation(
            client, panel, headers, egg_cfg["node_id"]
        )

        payload = {
            "name": server_name,
            "user": ptero_user_id,
            "egg": egg_cfg["egg_id"],
            "docker_image": egg_cfg["docker_image"],
            "startup": egg_cfg["startup"],
            "limits": {
                "memory": ram_mb,
                "cpu": cpu,
                "disk": disk_mb,
                "swap": 0,
                "io": 500,
            },
            "feature_limits": {
                "databases": 1,
                "backups": 1,
                "allocations": 1,
            },
            "allocation": {
                "default": allocation_id,
            },
        }

        try:
            resp = await client.post(
                f"{panel}/api/application/servers",
                headers=headers,
                json=payload,
            )
        except httpx.TimeoutException as exc:
            raise ProvisionTimeoutError(
                f"Timed out creating server: {exc}"
            ) from exc
        except httpx.RequestError as exc:
            raise ProvisionError(
                f"Network error creating server: {exc}"
            ) from exc

        if resp.status_code not in (200, 201):
            raise ProvisionError(
                f"Pterodactyl server creation failed: "
                f"HTTP {resp.status_code} — {resp.text[:300]}"
            )

        identifier: str = resp.json()["attributes"]["identifier"]
        return identifier


# ── 9.4 Retry wrapper ─────────────────────────────────────────────────────────

async def _provision_once(order: dict) -> ProvisionResult:
    """Run the full provisioning flow exactly once (no retry)."""
    ptero_user_id, panel_password = await find_or_create_ptero_user(
        email=order["user_email"],
        full_name=order["customer_name"],
    )
    egg_cfg = get_egg_config(order["plan_category"])
    identifier = await create_ptero_server(ptero_user_id, order, egg_cfg)

    panel = _panel_url()
    return ProvisionResult(
        panel_url=f"{panel}/server/{identifier}",
        server=identifier,
        server_password=panel_password,
    )


# ── Entry-point ────────────────────────────────────────────────────────────────

async def provision_server(order: dict) -> ProvisionResult:
    """
    Full provisioning flow with one automatic retry on timeout.

    Attempts:
      1st try  — run provisioning normally.
      2nd try  — only if a ProvisionTimeoutError was raised; retry once.
      Any other ProvisionError is re-raised immediately without retry.

    Raises:
        ProvisionError: if provisioning fails on both attempts, or fails
                        with a non-timeout error on the first attempt.
    """
    try:
        return await _provision_once(order)
    except ProvisionTimeoutError as exc:
        # One automatic retry on timeout
        try:
            return await _provision_once(order)
        except ProvisionError as retry_exc:
            raise ProvisionError(
                f"Provisioning failed after retry. "
                f"Original timeout: {exc}. "
                f"Retry error: {retry_exc}"
            ) from retry_exc
