"""
Vercel serverless entry point.
Wraps the FastAPI ASGI app with Mangum so Vercel's Python runtime can invoke it.
All /api/* requests are forwarded here by vercel.json.
"""
from mangum import Mangum
from backend.main import app  # noqa: F401  (imported for side-effects: routes registered)

handler = Mangum(app, lifespan="off")
