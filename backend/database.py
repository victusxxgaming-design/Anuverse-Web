import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "anuverse")

# Single client reused across warm-start invocations in serverless.
# Created lazily on first get_db() call — no lifespan event needed.
_client: AsyncIOMotorClient = None


def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    return _client[DB_NAME]
