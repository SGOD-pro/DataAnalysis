
from fastapi import APIRouter, Depends
import pandas as pd
from main.callbacks.df_manager import get_df, set_df
from main.utils.errors import AppException
from main.sockets.events import connected_clients
from main.functions.summary import df_summary_info,columns_info,stats,unique_values


# router = APIRouter(prefix="/general")
router = APIRouter()

@router.get("/")
def root():
    return {"message": "Hello World"}

@router.get("/clients")
def list_clients():
    return {"connected_clients": len(list(connected_clients))}

@router.get("/upload")
def upload():
    df=pd.read_csv("main/data.csv")
    set_df(df)
    return {
        "data": None,
        "message": "DataFrame UPloaded",
    }



@router.get("/summary")
def summary(df: pd.DataFrame = Depends(get_df)):
    data=df_summary_info(df)
    return {
        "data": data,
        "message": "DataFrame summary",
    }

@router.get("/column-info")
def summary(df: pd.DataFrame = Depends(get_df)):
    data=columns_info(df)
    return {
        "data": data,
        "message": "Column Info",
    }
    
@router.get("/stats")
def summary(df: pd.DataFrame = Depends(get_df)):
    data=stats(df)
    return {
        "data": data,
        "message": "Descriptive Statistics",
    }

@router.get("/unique-values")
def summary(df: pd.DataFrame = Depends(get_df)):
    data=unique_values(df)
    return {
        "data": data,
        "message": "Unique Values",
    }


@router.get("/raw-data")
def get_raw_data(df: pd.DataFrame = Depends(get_df)):
    df = df.where(pd.notnull(df), None)  # replace NaN/NaT with None
    return {
        "data": df.to_dict(orient="records"),
        "message": "Summary DataFrame fetched successfully"
    }


@router.post("/update-df")
def update_df():
    df = pd.DataFrame({"name": ["Alice", "Bob"], "age": [25, 30]})
    set_df(df)
    return {"status": "updated"}



# @router.post("/appointments")
# async def create_appointment(appointment: AppointmentSchema):
#     result = await appointments_collection.insert_one(appointment.dict(by_alias=True))
#     return {"id": str(result.inserted_id)}