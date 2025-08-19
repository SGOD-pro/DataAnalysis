from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage, HumanMessage, AIMessage

# Initialize memory globally (per session/user you may need a dict of memories)
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
