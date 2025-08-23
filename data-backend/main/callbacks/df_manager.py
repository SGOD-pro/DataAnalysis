import pickle
import redis
import pandas as pd
from main.redis_utils.pubsub import notify_update, r
from main.utils.errors import AppException

# local in-memory cache (per worker)
_cache = {}

def get_df(key: str = "main_df"):
    try:
        if key in _cache:
            return _cache[key]
        pickled_df = r.get(key)
        if pickled_df is None:
            return None
        df = pickle.loads(pickled_df)
        _cache[key] = df
        return df
    except redis.exceptions.ConnectionError as e:
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        raise AppException("Failed to get DataFrame", extra=str(e), status_code=500)

def set_df(df: pd.DataFrame, key: str = "main_df", channel: str = "df_update"):

    try:
        _cache[key] = df
        r.set(key, pickle.dumps(df))
        notify_update(channel)

    except redis.exceptions.ConnectionError as e:
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        raise AppException("Failed to set DataFrame", extra=str(e), status_code=500)

def refresh_df(key: str = "main_df"):
    """Force reload from Redis (for Pub/Sub events)"""
    try:
        pickled_df = r.get(key)
        if pickled_df:
            _cache[key] = pickle.loads(pickled_df)
    except redis.exceptions.ConnectionError as e:
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=503)
    except Exception as e:
        raise AppException("Failed to refresh DataFrame", extra=str(e), status_code=500)
