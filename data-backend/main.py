import uvicorn
from fastapi import FastAPI
from socketio import ASGIApp
from sockets.events import sio
from routes import general
from config.db_config import connect_to_mongo
from config.redis import redis_connection
from utils.errors import AppException, app_exception_handler

fastapi_app = FastAPI()
fastapi_app.include_router(general.router)
fastapi_app.add_exception_handler(AppException, app_exception_handler)

socket_app = ASGIApp(sio, other_asgi_app=fastapi_app)

@fastapi_app.on_event("startup")
async def startup_event():
    try:
        redis_connection()
    except Exception as e:  # Catch everything
        print(f"⚠️ Redis not available at startup: {e}")

    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"⚠️ Mongo not available at startup: {e}")

app = socket_app  # Final app object for uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
