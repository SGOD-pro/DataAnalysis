import socketio
from langchain.schema import HumanMessage, SystemMessage
from callbacks.word_buffer import WordBufferingCallback
from config.llm_config import ChatOpenRouter
from config.settings import SYSTEM_PROMPT
connected_clients = set()
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
@sio.event
async def connect(sid, environ):
    connected_clients.add(sid)
    print(f"Client connected: {sid}")
    await sio.emit("welcome", "Welcome!", to=sid)

@sio.event
async def message(sid, data):
    print(f"Message from {sid}: {data}")

    callback = WordBufferingCallback(sio, sid)
    streaming_llm = ChatOpenRouter(callbacks=[callback],streaming=True)

    await streaming_llm.ainvoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=data)
    ])



@sio.event
async def disconnect(sid):
    connected_clients.discard(sid)
    print(f"Client disconnected: {sid}")
