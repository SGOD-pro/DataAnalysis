import uvicorn
from fastapi import FastAPI
from socketio import ASGIApp
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import general,preprocessing,charts


from .sockets.events import sio
from .config.db_config import connect_to_mongo
from .utils.errors import AppException, app_exception_handler
from .callbacks.df_manager import set_df
from .middleware.response import ResponseMiddleware
import os
fastapi_app = FastAPI()

# absolute path to the project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# point to static folder inside your backend
STATIC_DIR = os.path.join(BASE_DIR, "static")

# make sure the folder exists
os.makedirs(STATIC_DIR, exist_ok=True)

fastapi_app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

#Routeres
fastapi_app.include_router(general.router)
fastapi_app.include_router(preprocessing.router)
fastapi_app.include_router(charts.router)


fastapi_app.add_exception_handler(AppException, app_exception_handler)

fastapi_app.add_middleware(ResponseMiddleware)

origins = [
    "http://localhost:3000",  
]

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    
    allow_credentials=True,
    allow_methods=["*"],   
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
