import pandas as pd
import numpy as np

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
