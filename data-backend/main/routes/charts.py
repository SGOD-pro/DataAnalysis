
from fastapi import APIRouter, Depends
import pandas as pd
from main.callbacks.df_manager import get_df, set_df
from main.utils.errors import AppException
from main.sockets.events import connected_clients
from main.functions.charts import plot_chart


# router = APIRouter(prefix="/general")
router = APIRouter(prefix="/chart")


@router.get("/plot-chart")
async def generate_chart(x: str, chart_type: str, y: list[str] = []):
    df = get_df()
    if df is None:
        raise AppException("No DataFrame found")

    chart = plot_chart(df=df, x=x, y=y, chart_type=chart_type)
    return {"chart": chart}
