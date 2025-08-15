
from fastapi import APIRouter, Depends
import pandas as pd
from callbacks.df_manager import get_df, set_df
from utils.errors import AppException


router = APIRouter()

@router.get("/")
def root():
    return {"message": "Hello World"}

@router.get("/clients")
def list_clients():
    from sockets.events import connected_clients
    return {"connected_clients": len(list(connected_clients))}



@router.get("/summary")
def summary(df: pd.DataFrame = Depends(get_df)):
    return {"rows": len(df), "columns": df.columns.tolist()}

@router.post("/update-df")
def update_df():
    df = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})
    set_df(df)
    return {"status": "updated"}



# @router.post("/appointments")
# async def create_appointment(appointment: AppointmentSchema):
#     result = await appointments_collection.insert_one(appointment.dict(by_alias=True))
#     return {"id": str(result.inserted_id)}