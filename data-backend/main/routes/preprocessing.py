from fastapi import APIRouter, Depends
import pandas as pd
from main.callbacks.df_manager import get_df, set_df
from main.utils.errors import AppException
from main.sockets.events import connected_clients
from main.functions.preprocessing import fill_missing_column,find_outliers


router = APIRouter(prefix="/preprocessing")


@router.get("/fill-nulls")
def fill_nulls(column: str, method: str):
    df: pd.DataFrame = Depends(get_df)
    df[column] = fill_missing_column(col=df[column], method=method)
    set_df(df)
    return {
        "message": f"Filling nulls in column '{column}' using method '{method}'"
    }

@router.get("/detect-outliers")
def detect_outliers(column: str, method: str, **kwargs):
    df: pd.DataFrame = Depends(get_df)
    outliers = find_outliers(series=df[column], method=method, **kwargs)
    df.drop(outliers, inplace=True)
    set_df(df)
    return {
        "message": f"Removing outliers in column '{column}' using method '{method}'"
    }

@router.get("/remove-outliers")
def remove_outliers(column: str, method: str, **kwargs):
    pass


@router.get("/drop-duplicates")
def drop_duplicates(df: pd.DataFrame = Depends(get_df)):
    df.drop_duplicates(inplace=True)
    set_df(df)
    return {
        "message": f"Dropping duplicates in column '{column}'"
    }
