from fastapi import APIRouter, Depends
import pandas as pd
from main.callbacks.df_manager import get_df, set_df
from main.utils.errors import AppException
from main.sockets.events import connected_clients
from main.functions.charts import plot_chart
from pydantic import BaseModel, Field
from typing import Optional, List

router = APIRouter(prefix="/filters")

# filter_df = get_df("main_filter")
# set_df(filter_df, key="main_filter", channel="filter_update")