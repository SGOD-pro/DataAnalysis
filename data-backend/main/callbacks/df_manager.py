import pickle
import redis
import pandas as pd
from main.redis_utlis.pubsub import notify_update,r

from main.utils.errors import AppException
from main.config.redis import redis_connection

_df_cache = None  # per-worker cache


def get_df():
    try:
        pickled_df = r.get("main_df")
        if pickled_df is None:
            return None
        df = pickle.loads(pickled_df)
        return df
    except redis.exceptions.ConnectionError as e:
        print("Redis connection failed:", e)
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        print("❌ Cannot get DataFrame from Redis:", e)
        raise AppException(
            "Failed to get DataFrame from Redis",
            extra=str(e),
            status_code=500
        )


def set_df(df: pd.DataFrame):
    try:
        global _df_cache
        _df_cache = df
        r.set("main_df", pickle.dumps(df))
        notify_update()
    except redis.exceptions.ConnectionError as e:
        print("Redis connection failed:", e)
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        print(e)
        raise AppException("Failed to set DataFrame", extra=str(e), status_code=500)


def refresh_df():
    """Force reload from Redis (for Pub/Sub events)"""
    try:
        global _df_cache
        pickled_df = r.get("main_df")
        if pickled_df:
            _df_cache = pickle.loads(pickled_df)
    except redis.exceptions.ConnectionError as e:
        print("Redis connection failed:", e)
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        print(e)
        raise AppException("Failed to set DataFrame", extra=str(e), status_code=500)
