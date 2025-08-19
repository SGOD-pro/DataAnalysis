from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Any, Dict

import json
from pydantic import BaseModel
from typing import Optional, Any

class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None

class ResponseMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            if request.url.path.startswith("/static"):
                return await call_next(request)
            if isinstance(response, JSONResponse):
                return response  

            # Read raw body
            body = b"".join([chunk async for chunk in response.body_iterator])
            try:
                payload = json.loads(body.decode()) if body else None
            except Exception:
                payload = body.decode() if body else None

            # --- Handle custom message convention ---
            message = "OK"
            data = payload

            # If payload is dict with 'data' and 'message', extract them
            if isinstance(payload, dict):
                if "data" in payload:
                    data = payload["data"]
                if "message" in payload:
                    message = payload["message"]

            return JSONResponse(
                content=APIResponse(success=True, data=data, message=message).dict(),
                status_code=response.status_code,
            )

        except Exception as e:
            return JSONResponse(
                content=APIResponse(success=False, data=None, message=str(e)).dict(),
                status_code=500,
            )
