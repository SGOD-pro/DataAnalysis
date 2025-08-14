import uvicorn
from fastapi import FastAPI
from socketio import ASGIApp
from sockets.events import sio
from routes import general

# FastAPI app
fastapi_app = FastAPI()
fastapi_app.include_router(general.router)

# Include routers
# app.include_router(general.router)
# app.include_router(db_routes.router)
# app.include_router(redis_routes.router)

# Mount Socket.IO with FastAPI
app = ASGIApp(sio, other_asgi_app=fastapi_app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
