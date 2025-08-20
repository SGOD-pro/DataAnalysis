
from fastapi import APIRouter, Depends
import pandas as pd
from main.callbacks.df_manager import get_df, set_df
from main.utils.errors import AppException
from main.sockets.events import connected_clients
from main.functions.charts import plot_chart
from pydantic import BaseModel, Field
from typing import Optional, List


class ChartRequest(BaseModel):                # expects tabular data (e.g., DataFrame-like JSON)
    chart_type: str                                # type of chart, e.g. "line", "bar", etc.
    x: Optional[str] = None                   # x-axis column
    y: Optional[List[str]] = None             # list of y-axis columns
    hue: Optional[str] = None                 # categorical column for color separation
    style: Optional[str] = None               # column for style mapping (e.g., markers/lines)
    size: Optional[str] = None                # column for point sizes
    kde: Optional[bool] = False               # whether to show KDE (for distributions)
    multiple: Optional[str] = None            # "layer", "stack", "dodge", etc. (for histplot)
    cols: Optional[int] = None                # number of columns (for facet grids)


# data, chart, x=None, y=None, hue=None, style=None, size=None, kde=False, multiple=None, cols=None
# router = APIRouter(prefix="/general")
router = APIRouter(prefix="/chart")


@router.post("/plot-chart")
async def generate_chart(req: ChartRequest):
    print(req.dict())
    df = get_df()
    if df is None:
        raise AppException("No DataFrame found")

    chart = plot_chart(
        data=df,
        chart=req.chart_type,
        x=req.x,
        y=req.y,
        hue=req.hue,
        style=req.style,
        size=req.size,
        kde=req.kde,
        multiple=req.multiple,
        cols=req.cols,
    )

    return {"data": chart}
    # return {"data": "chart"}

