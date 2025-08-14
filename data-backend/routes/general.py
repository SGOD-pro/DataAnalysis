from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Hello World"}

@router.get("/clients")
def list_clients():
    from sockets.events import connected_clients
    return {"connected_clients": len(list(connected_clients))}
