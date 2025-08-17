from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from main.middleware.response import APIResponse


# Custom exception
class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400, extra: str = None):
        self.message = message
        self.status_code = status_code
        self.extra = extra
        super().__init__(message)


# Handle custom exception
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIResponse(
            success=False,
            data=None,
            message=exc.message
        ).dict()
    )
