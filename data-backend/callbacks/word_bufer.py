from langchain.callbacks.base import AsyncCallbackHandler

class WordBufferingCallback(AsyncCallbackHandler):
    def __init__(self, sio, sid):
        self.sio = sio
        self.sid = sid

    async def on_llm_new_token(self, token: str, **kwargs):
        await self.sio.emit("server_message", token, to=self.sid)

    async def on_llm_end(self, response, **kwargs):
        print("Streaming finished.")
        await self.sio.emit("response_end", "[END]", to=self.sid)