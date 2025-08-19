

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



import pandas as pd
import numpy as np

def apply_filter(df: pd.DataFrame, column: str, operator: str, value):
    """
    Apply a filter operation to a DataFrame column based on given operator and value.
    
    Args:
        df (pd.DataFrame): Input dataframe
        column (str): Column name to apply filter on
        operator (str): Operator code (eq, gt, between, contains, etc.)
        value (Any): Value(s) needed for filtering

    Returns:
        pd.DataFrame: Filtered dataframe
    """
    if column not in df.columns:
        raise ValueError(f"Column '{column}' not found in dataframe")

    series = df[column]

    # ---- Numeric operators ----
    if operator == "eq":
        return df[series == value]
    elif operator == "neq":
        return df[series != value]
    elif operator == "gt":
        return df[series > value]
    elif operator == "gte":
        return df[series >= value]
    elif operator == "lt":
        return df[series < value]
    elif operator == "lte":
        return df[series <= value]
    elif operator == "between":
        if not isinstance(value, (list, tuple)) or len(value) != 2:
            raise ValueError("Value for 'between' must be a list/tuple of length 2")
        return df[series.between(value[0], value[1])]
    elif operator == "isin":
        return df[series.isin(value)]

    # ---- Categorical operators ----
    elif operator == "in":
        return df[series.isin(value)]
    elif operator == "not_in":
        return df[~series.isin(value)]

    # ---- Text operators ----
    elif operator == "contains":
        return df[series.astype(str).str.contains(value, na=False)]
    elif operator == "not_contains":
        return df[~series.astype(str).str.contains(value, na=False)]
    elif operator == "starts_with":
        return df[series.astype(str).str.startswith(value, na=False)]
    elif operator == "ends_with":
        return df[series.astype(str).str.endswith(value, na=False)]
    elif operator == "exact":
        return df[series.astype(str) == str(value)]

    # ---- Datetime operators ----
    elif operator in ["recent_years", "recent_months", "date_range", "year_eq"]:
        series = pd.to_datetime(series, errors="coerce")

        if operator == "recent_years":
            years = value if isinstance(value, int) else 1
            cutoff = pd.Timestamp.now() - pd.DateOffset(years=years)
            return df[series >= cutoff]

        elif operator == "recent_months":
            months = value if isinstance(value, int) else 1
            cutoff = pd.Timestamp.now() - pd.DateOffset(months=months)
            return df[series >= cutoff]

        elif operator == "date_range":
            if not isinstance(value, (list, tuple)) or len(value) != 2:
                raise ValueError("Value for 'date_range' must be a list/tuple of length 2")
            start, end = pd.to_datetime(value[0]), pd.to_datetime(value[1])
            return df[(series >= start) & (series <= end)]

        elif operator == "year_eq":
            return df[series.dt.year == int(value)]

    # ---- Statistical operators ----
    elif operator == "variance_threshold":
        if series.var() >= value:
            return df
        else:
            return df.iloc[0:0]  # empty dataframe

    elif operator == "correlation_threshold":
        # value should be (target_column, threshold)
        if not isinstance(value, (list, tuple)) or len(value) != 2:
            raise ValueError("Value for 'correlation_threshold' must be (target_col, threshold)")
        target_col, threshold = value
        if target_col not in df.columns:
            raise ValueError(f"Target column '{target_col}' not found")
        if abs(df[column].corr(df[target_col])) >= threshold:
            return df
        else:
            return df.iloc[0:0]

    # ---- Class balance operators ----
    elif operator == "undersample":
        counts = df[column].value_counts()
        min_count = counts.min()
        return df.groupby(column).apply(lambda x: x.sample(min_count, random_state=42)).reset_index(drop=True)

    elif operator == "oversample":
        counts = df[column].value_counts()
        max_count = counts.max()
        return df.groupby(column).apply(lambda x: x.sample(max_count, replace=True, random_state=42)).reset_index(drop=True)

    elif operator == "stratified":
        # just a pass-through example (depends on task)
        return df.groupby(column, group_keys=False).apply(lambda x: x.sample(frac=1.0)).reset_index(drop=True)

    else:
        raise ValueError(f"Unknown operator: {operator}")


import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.decomposition import PCA
from statsmodels.tsa.seasonal import seasonal_decompose

def apply_transformation(df: pd.DataFrame, column: str, transform_id: str, **kwargs) -> pd.DataFrame:
    """
    Apply transformation to a column in DataFrame.
    
    Args:
        df (pd.DataFrame): Input dataframe
        column (str): Column to transform
        transform_id (str): Transformation id (e.g., 'log', 'normalize')
        kwargs: Extra parameters (e.g., lag=1, window=3)

    Returns:
        pd.DataFrame: Transformed dataframe
    """
    if column not in df.columns:
        raise ValueError(f"Column '{column}' not in DataFrame")

    # Copy dataframe to avoid mutating original
    df = df.copy()

    if transform_id == "log":
        df[f"{column}_log"] = np.log(df[column].replace(0, np.nan))
    
    elif transform_id == "sqrt":
        df[f"{column}_sqrt"] = np.sqrt(df[column])
    
    elif transform_id == "square":
        df[f"{column}_square"] = np.square(df[column])
    
    elif transform_id == "standardize":
        scaler = StandardScaler()
        df[f"{column}_std"] = scaler.fit_transform(df[[column]])
    
    elif transform_id == "normalize":
        scaler = MinMaxScaler()
        df[f"{column}_norm"] = scaler.fit_transform(df[[column]])
    
    elif transform_id == "encode":
        df = pd.get_dummies(df, columns=[column], prefix=column)
    
    elif transform_id == "label_encode":
        encoder = LabelEncoder()
        df[f"{column}_label"] = encoder.fit_transform(df[column].astype(str))
    
    elif transform_id == "lag":
        lag = kwargs.get("lag", 1)
        df[f"{column}_lag{lag}"] = df[column].shift(lag)
    
    elif transform_id == "rolling_mean":
        window = kwargs.get("window", 3)
        df[f"{column}_rollmean{window}"] = df[column].rolling(window=window).mean()
    
    elif transform_id == "seasonal_decompose":
        model = kwargs.get("model", "additive")
        period = kwargs.get("period", 12)
        result = seasonal_decompose(df[column].dropna(), model=model, period=period)
        df[f"{column}_trend"] = result.trend
        df[f"{column}_seasonal"] = result.seasonal
        df[f"{column}_resid"] = result.resid
    
    elif transform_id == "differencing":
        df[f"{column}_diff"] = df[column].diff()
    
    else:
        raise ValueError(f"Unknown transformation id: {transform_id}")

    return df
