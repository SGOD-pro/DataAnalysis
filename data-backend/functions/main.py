def df_summary_info(df: pd.DataFrame) -> dict:
    total_missing = int(df.isna().sum().sum())
    total_cells = df.shape[0] * df.shape[1]
    
    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "missing_percentage": round((total_missing / total_cells) * 100, 2)*100
    }

df_summary_info(df)


def columns_info(df):
  columnTypes = []

  # Threshold for long text
  LONG_TEXT_THRESHOLD = 10 
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

columns_info(drop_data)



def stats(df):
  stats_list=[]
  for col in df.select_dtypes(include=[np.number]).columns:
    stats_list.append({
        "variable": col,
        "count": int(df[col].count()),
        "mean": float(round(df[col].mean(), 2)),
        "median": round(df[col].median(), 2),
        "std": round(df[col].std(), 2),
        "min": round(df[col].min(), 2),
        "max": round(df[col].max(), 2),
        "q1": float(round(df[col].quantile(0.25), 2)),
        "q3": float(round(df[col].quantile(0.75), 2))
    })
  return stats_list

stats(df)



def unique_values(df):
  categorical_info = []

  unique_threshold = 20  # Max unique values to still consider it categorical

  for col in df.columns:
      if df[col].dtype == 'object':
          categorical_info.append({
              "column": col,
              "unique_values": df[col].dropna().unique().tolist()
          })
      elif pd.api.types.is_integer_dtype(df[col]) and df[col].nunique() <= unique_threshold:
          categorical_info.append({
              "column": col,
              "unique_values": df[col].dropna().unique().tolist()
          })
  return categorical_info

unique_values(df)


def fill_missing_column(col: pd.Series, method: str, custom_value=None) -> pd.Series:
    """
    Fill missing values in a Pandas Series using various methods.
    
    Parameters:
    - col (pd.Series): Column to fill.
    - method (str): 'ffill', 'bfill', 'mean', 'median', 'mode', 'interpolate', 'custom'.
    - custom_value: Value to fill with when method='custom'.
    
    Returns:
    - pd.Series: Column with filled missing values.
    """
    if method == "ffill":
        return col.fillna(method="ffill")
    elif method == "bfill":
        return col.fillna(method="bfill")
    elif method == "mean":
        return col.fillna(col.mean()) if pd.api.types.is_numeric_dtype(col) else col
    elif method == "median":
        return col.fillna(col.median()) if pd.api.types.is_numeric_dtype(col) else col
    elif method == "mode":
        mode_val = col.mode()
        return col.fillna(mode_val[0]) if not mode_val.empty else col
    elif method == "interpolate":
        return col.interpolate() if pd.api.types.is_numeric_dtype(col) else col
    elif method == "custom":
        if custom_value is None:
            raise ValueError("custom_value must be provided when method='custom'")
        return col.fillna(custom_value)
    else:
        raise ValueError("Invalid method. Choose from: 'ffill', 'bfill', 'mean', 'median', 'mode', 'interpolate', 'custom'.")

fill_missing_column(df['Teacher_Quality'],"interpolate")



def find_outliers(series: pd.Series, method: str = "iqr", **kwargs) -> pd.Index:
    """
    Detect outliers in a Pandas Series using various methods.

    Parameters:
    - series (pd.Series): Numeric column to check.
    - method (str): 'iqr', 'zscore', 'percentile', 'isolation'.
    - kwargs:
        For 'zscore': threshold (default=3)
        For 'percentile': lower (default=1), upper (default=99)
        For 'isolation': contamination (default=0.05)

    Returns:
    - pd.Index: Index positions of outlier values.
    """
    if not pd.api.types.is_numeric_dtype(series):
        raise ValueError("Outlier detection works only for numeric columns.")

    method = method.lower()

    if method == "iqr":
        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        return series[(series < lower_bound) | (series > upper_bound)].index

    elif method == "zscore":
        threshold = kwargs.get("threshold", 3)
        z_scores = (series - series.mean()) / series.std()
        return series[np.abs(z_scores) > threshold].index

    elif method == "percentile":
        lower = kwargs.get("lower", 1)
        upper = kwargs.get("upper", 99)
        lower_bound = np.percentile(series, lower)
        upper_bound = np.percentile(series, upper)
        return series[(series < lower_bound) | (series > upper_bound)].index

    elif method == "isolation":
        contamination = kwargs.get("contamination", 0.05)
        iso = IsolationForest(contamination=contamination, random_state=42)
        preds = iso.fit_predict(series.values.reshape(-1, 1))
        return series[preds == -1].index

    else:
        raise ValueError("Invalid method. Choose from: 'iqr', 'zscore', 'percentile', 'isolation'.")

# Default IQR method
outlier_idx = find_outliers(df["Age"])

# Z-score method with custom threshold
outlier_idx = find_outliers(df["Age"], method="zscore", threshold=2.5)

# Percentile method
outlier_idx = find_outliers(df["Salary"], method="percentile", lower=2, upper=98)

# Isolation Forest method
outlier_idx = find_outliers(df["Income"], method="isolation", contamination=0.1)

# View outlier rows
df.loc[outlier_idx]





def correlation_matrix(df, method="pearson"):
    """
    Convert correlation matrix to triplets with column labels.

    Args:
        df (pd.DataFrame): The input DataFrame.
        method (str): Correlation method ("pearson", "spearman", "kendall").

    Returns:
        dict: { "columns": [...], "data": [[row, col, value], ...] }
    """
    if method not in ["pearson", "spearman", "kendall"]:
        raise ValueError("method must be 'pearson', 'spearman', or 'kendall'")
    
    corr_matrix = df.corr(method=method, numeric_only=True)
    columns = corr_matrix.columns.tolist()
    triplets = [
        [i, j, float(round(corr_matrix.iloc[i, j], 2))]
        for i in range(len(columns))
        for j in range(len(columns))
    ]
    
    return {
        "columns": columns,
        "data": triplets
    }

# Example usage:
# df = pd.read_csv("data.csv")
# print(top3_correlations(df, "G3", method="spearman"))


from statsmodels.tsa.stattools import adfuller, kpss
from arch.unitroot import PhillipsPerron


def stationarity_test(series: pd.Series, test_type: str = 'adf', alpha: float = 0.05):
    """
    Perform stationarity test on a time series.
    
    Parameters:
    series (pd.Series): Time series data (e.g., df['column'])
    test_type (str): 'adf', 'pp', or 'kpss'
    alpha (float): Significance level for hypothesis testing
    
    Returns:
    dict: {'test': test_type, 'result': 'Stationary'/'Non-Stationary', 'p_value': p_value}
    """
    series = series.dropna()

    if test_type.lower() == 'adf':
        _, p_value, _, _, _, _ = adfuller(series, autolag='AIC')
        conclusion = "Stationary" if p_value < alpha else "Non-Stationary"

    elif test_type.lower() == 'pp':
        result = PhillipsPerron(series)
        p_value = result.pvalue
        conclusion = "Stationary" if p_value < alpha else "Non-Stationary"

    elif test_type.lower() == 'kpss':
        _, p_value, _, _ = kpss(series, regression='c', nlags='auto')
        conclusion = "Stationary" if p_value > alpha else "Non-Stationary"

    else:
        raise ValueError("Invalid test_type. Choose from 'adf', 'pp', or 'kpss'.")

    return {"test": test_type.upper(), "result": conclusion, "p_value": p_value}

result = stationarity_test(df['Close'], 'pp')