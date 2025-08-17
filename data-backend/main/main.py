import uvicorn
from fastapi import FastAPI
from socketio import ASGIApp
from fastapi.middleware.cors import CORSMiddleware

from .routes import general,preprocessing


from .sockets.events import sio
from .config.db_config import connect_to_mongo
from .config.redis import redis_connection
from .utils.errors import AppException, app_exception_handler
from .callbacks.df_manager import set_df
from .middleware.response import ResponseMiddleware
fastapi_app = FastAPI()

#Routeres
fastapi_app.include_router(general.router)
fastapi_app.include_router(preprocessing.router)


fastapi_app.add_exception_handler(AppException, app_exception_handler)

fastapi_app.add_middleware(ResponseMiddleware)

origins = [
    "http://localhost:3000",  # your frontend
]

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allow frontend domain
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],
)

socket_app = ASGIApp(sio, other_asgi_app=fastapi_app)

@fastapi_app.on_event("startup")
async def startup_event():
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"⚠️ Mongo not available at startup: {e}")

app = socket_app

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
