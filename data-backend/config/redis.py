import redis

from utils.errors import AppException

# Create a single Redis connection


def redis_connection():
    try:
        r = redis.Redis(host="localhost", 
                        port=6379, 
                        decode_responses=True,
                        )
        
        print("✅ Connected to Redis", r.ping())
        return r
    except Exception as e:
        print("❌ Cannot connect to Redis:", e)
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=500)

