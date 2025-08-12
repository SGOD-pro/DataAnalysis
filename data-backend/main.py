from fastapi import FastAPI
import socketio
import uvicorn
from config import ChatOpenRouter
from langchain.schema import HumanMessage,SystemMessage
from langchain.callbacks.base import BaseCallbackHandler

from langchain.callbacks.base import AsyncCallbackHandler

class WordBufferingCallback(AsyncCallbackHandler):
    def __init__(self, sio, sid):
        self.sio = sio
        self.sid = sid

    async def on_llm_new_token(self, token: str, **kwargs):
        await self.sio.emit("server_message", token, to=self.sid)

    async def on_llm_end(self, response, **kwargs):
        print("Streaming finished.")



# Create the LLM instance
llm = ChatOpenRouter()

# Socket.IO server
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

# FastAPI app
fastapi_app = FastAPI()

@fastapi_app.get("/")
def root():
    return {"message": "Hello World"}

# # New specific endpoint
# @fastapi_app.post("/send-message/{sid}")
# async def send_message_to_client(sid: str, msg: str):
#     # Send a single prompt
#     await sio.emit("server_message", msg, to=sid)
#     return {"status": "sent", "sid": sid, "message": msg}

# # Another example endpoint
# @fastapi_app.get("/clients")
# def list_clients():
#     return {"connected_clients": list(connected_clients)}

# Track connected clients
connected_clients = set()

@sio.event
async def connect(sid, environ):
    connected_clients.add(sid)
    print(f"Client connected: {sid}")
    await sio.emit("welcome", "Welcome!", to=sid)


@sio.event
async def message(sid, data):
    print(f"Message from {sid}: {data}")

    callback = WordBufferingCallback(sio, sid)

    streaming_llm = ChatOpenRouter(
        streaming=True,
        callbacks=[callback]  # ✅ Attach here
    )

    await streaming_llm.ainvoke([
        SystemMessage(content="You are a smary chat assistant and give the accurae and sort responses."),
        HumanMessage(content=data)
    ])
    await sio.emit("response_end", "[END]", to=sid)

@sio.event
async def disconnect(sid):
    connected_clients.discard(sid)
    print(f"Client disconnected: {sid}")

# Mount Socket.IO
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
