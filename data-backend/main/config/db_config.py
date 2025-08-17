from pymongo import AsyncMongoClient
import os
from main.utils.errors import AppException, app_exception_handler

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "mydb")

client = None
database = None
appointments_collection = None
therapists_collection = None

async def connect_to_mongo():
    global client, database, appointments_collection, therapists_collection
    try:
        client = AsyncMongoClient(MONGO_URI)
        database = client[MONGO_DB_NAME]

        # If you want a time-series collection:
        try:
            appointments_collection=await database.create_collection(
                "appointments",
                timeseries={"timeField": "timestamp"}
            )
        except Exception as e:
            if "already exists" not in str(e):
                raise e

        appointments_collection = database["appointments"]
        therapists_collection = database["therapists"]

        print("✅ Connected to MongoDB")
    except Exception as e:
        print("❌ MongoDB connection failed:")
        raise AppException("Failed to connect to MongoDB", extra=str(e), status_code=500)

