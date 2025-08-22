import socketio
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from main.utils.errors import AppException

from main.callbacks.word_buffer import WordBufferingCallback
from main.config.llm_config import ChatOpenRouter
from main.config.settings import SYSTEM_PROMPT

connected_clients = set()
sio = socketio.AsyncServer(async_mode="asgi",cors_allowed_origins="http://localhost:3000" )


@sio.event
async def connect(sid, environ):
    connected_clients.add(sid)
    print(f"Client connected: {sid}")
    await sio.emit("welcome", "Welcome!", to=sid)

memory = ConversationBufferMemory(return_messages=True)

@sio.event
async def message(sid, data: str):
    print(f"Message from {sid}: {data}")

    callback = WordBufferingCallback(sio, sid)
    streaming_llm = ChatOpenRouter(callbacks=[callback], streaming=True)

    try:
        # Load history from memory
        history = memory.load_memory_variables({})["history"]

        # Construct full message chain
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + history + [
            HumanMessage(content=data)
        ]

        # Stream response
        response = await streaming_llm.ainvoke(messages)

        # Save this turn into memory
        memory.save_context(
            {"input": data},
            {"output": response.content}
        )

    except AppException as ae:
        await sio.emit("error", {
            "success": False,
            "error": ae.message,
            "details": ae.extra
        }, to=sid)
    except Exception as e:
        await sio.emit("error", {
            "success": False,
            "error": "Internal Server Error"
        }, to=sid)
        print(f"[ERROR] LLM streaming failed: {e}")



@sio.event
async def disconnect(sid):
    connected_clients.discard(sid)
    print(f"Client disconnected: {sid}")
