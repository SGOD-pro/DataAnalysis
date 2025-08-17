from langchain.callbacks.base import AsyncCallbackHandler

class WordBufferingCallback(AsyncCallbackHandler):
    def __init__(self, sio, sid):
        self.sio = sio
        self.sid = sid

    async def on_llm_new_token(self, token: str, **kwargs):
        await self.sio.emit("server_message", token, to=self.sid)

    async def on_llm_end(self, response, **kwargs):
        await self.sio.emit("response_end", "[END]", to=self.sid)
        print("Streaming finished.")


# BUG: Add validation rules also

# def __init__(self, sio, sid, max_tokens=500):
#     self.sio = sio
#     self.sid = sid
#     self.token_count = 0
#     self.max_tokens = max_tokens

# async def on_llm_new_token(self, token: str, **kwargs):
#     self.token_count += 1
#     if self.token_count > self.max_tokens:
#         raise AppException("Token limit exceeded", status_code=400)
#     await self.sio.emit("server_message", token, to=self.sid)