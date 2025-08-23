from main.utils.errors import AppException
import threading
import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=False)


def listen_for_updates(callback):
    """Listen for DF updates and run callback when received."""
    try:
        pubsub = r.pubsub()
        pubsub.subscribe("df_update")
        for message in pubsub.listen():
            if message["type"] == "message":
                callback()
    except Exception as e:
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=500)


def start_listener(callback):
    """Start the Pub/Sub listener in a background thread."""
    t = threading.Thread(target=listen_for_updates, args=(callback,), daemon=True)
    t.start()


def notify_update(channel: str = "df_update"):
    """Notify all workers that DF has been updated."""
    try:
        r.publish("df_update", "refresh")
    except Exception as e:
        raise AppException("Failed to connect to Redis", extra=str(e), status_code=500)