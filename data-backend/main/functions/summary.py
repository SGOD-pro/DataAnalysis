import pandas as pd
import numpy as np

def df_summary_info(df: pd.DataFrame) -> dict:
    total_missing = int(df.isna().sum().sum())
    total_cells = df.shape[0] * df.shape[1]
    
    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "missing_percentage": round((total_missing / total_cells) * 100, 2)*100
    }


def columns_info(df:pd.DataFrame)->dict:
  columnTypes = []

  # Threshold for long text
  LONG_TEXT_THRESHOLD = 15 
  for col in df.columns:
      dtype = df[col].dtype
      col_type = None

      if np.issubdtype(dtype, np.number):
          col_type = "number"
      elif df[col].dtype == object:
          # Check if it's long text
          max_len = df[col].dropna().astype(str).map(len).max() if not df[col].dropna().empty else 0
          if max_len > LONG_TEXT_THRESHOLD:
              col_type = "string"
          else:
              col_type = "categorical"
      else:
          col_type = str(dtype)  # fallback

      columnTypes.append({
          "name": col,
          "type": col_type,
          "nulls": int(df[col].isna().sum()),
          "unique": int(df[col].nunique())
      })
  return columnTypes



def stats(df:pd.DataFrame)->dict:
    stats_list=[]
    print(df.head())
    for col in df.select_dtypes(include=[np.number]).columns:
        stats_list.append({
            "name": col,
            "count": int(df[col].count()),
            "mean": float(round(df[col].mean(), 2)),
            "median": float(round(df[col].median(), 2)),
            "std": float(round(df[col].std(), 2)),
            "min": float(round(df[col].min(), 2)),
            "max": float(round(df[col].max(), 2)),
            "q1": float(round(df[col].quantile(0.25), 2)),
            "q3": float(round(df[col].quantile(0.75), 2)),
        })
    print(stats_list)
    return {"data":stats_list}


def unique_values(df: pd.DataFrame) -> list[dict]:
    categorical_info = []
    unique_threshold = 20
    
    for col in df.columns:
        if df[col].dtype == 'object':
            values = df[col].dropna().unique().tolist()
            categorical_info.append({
                "column": col,
                "unique_values": [str(v) for v in values]  # ✅ all string
            })
        elif pd.api.types.is_integer_dtype(df[col]) and df[col].nunique() <= unique_threshold:
            values = df[col].dropna().unique().tolist()
            categorical_info.append({
                "column": col,
                "unique_values": [str(v) for v in values]  # ✅ force string
            })
        elif pd.api.types.is_bool_dtype(df[col]):
            values = df[col].dropna().unique().tolist()
            categorical_info.append({
                "column": col,
                "unique_values": [str(v) for v in values]  # ✅ force string
            })
    
    return categorical_info