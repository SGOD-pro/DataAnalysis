import pickle
import redis
import pandas as pd
from redis_utlis.pubsub import notify_update

from utils.errors import AppException
from config.redis import redis_connection

_df_cache = None  # per-worker cache


def get_df():
    global _df_cache
    r= redis_connection()
    if _df_cache is None:
        pickled_df = r.get("main_df")
        if pickled_df:
            _df_cache = pickle.loads(pickled_df)
        else:
            raise AppException("No DataFrame found", status_code=404)
    return _df_cache


def set_df(df: pd.DataFrame):
    r= redis_connection()
    global _df_cache
    _df_cache = df
    r.set("main_df", pickle.dumps(df))
    notify_update()


def refresh_df():
    """Force reload from Redis (for Pub/Sub events)"""
    r= redis_connection()
    global _df_cache
    pickled_df = r.get("main_df")
    if pickled_df:
        _df_cache = pickle.loads(pickled_df)
