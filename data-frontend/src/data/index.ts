
export const fillMethods = {
  number: [
    { value: "mean", label: "Mean" },
    { value: "median", label: "Median" },
    { value: "mode", label: "Mode" },
    { value: "ffill", label: "Forward Fill" },
    { value: "bfill", label: "Backward Fill" },
    { value: "interpolate", label: "Interpolate" },
    { value: "custom", label: "Custom Value" },
  ],
  categorical: [
    { value: "mode", label: "Mode (Most Frequent)" },
    { value: "ffill", label: "Forward Fill" },
    { value: "bfill", label: "Backward Fill" },
    { value: "custom", label: "Custom Value" },
  ],
  text: [
    { value: "ffill", label: "Forward Fill" },
    { value: "backward_fill", label: "Backward Fill" },
    { value: "custom", label: "Custom Value" },
    { value: "remove", label: "Remove Rows" },
  ],
};

export const outlierMethods = [
  {
    value: "iqr",
    label: "IQR Method",
    description: "Remove values beyond 1.5 * IQR",
  },
  {
    value: "zscore",
    label: "Z-Score Method",
    description: "Remove values beyond 3 standard deviations",
  },
  {
    value: "percentile",
    label: "Percentile Method",
    description: "Remove values beyond specified percentiles",
  },
  {
    value: "isolation",
    label: "Isolation Forest",
    description: "Machine learning based outlier detection",
  },
];

export const filterOperators = {
  number: [
    { value: "eq", label: "Equal to (==)" },
    { value: "neq", label: "Not equal to (!=)" },
    { value: "gt", label: "Greater than (>)" },
    { value: "gte", label: "Greater than or equal (>=)" },
    { value: "lt", label: "Less than (<)" },
    { value: "lte", label: "Less than or equal (<=)" },
    { value: "between", label: "Between (range)" },
    { value: "isin", label: "Is in values (isin)" },
  ],
  categorical: [
    { value: "in", label: "Is one of (isin)" },
    { value: "not_in", label: "Is not one of (!isin)" },
  ],
  text: [
    { value: "contains", label: "Contains pattern" },
    { value: "not_contains", label: "Does not contain" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "exact", label: "Exact match (==)" },
  ],
  datetime: [
    { value: "recent_years", label: "Recent years" },
    { value: "recent_months", label: "Recent months" },
    { value: "date_range", label: "Date range" },
    { value: "year_eq", label: "Specific year" },
  ],
  statistical: [
    { value: "variance_threshold", label: "Variance threshold" },
    { value: "correlation_threshold", label: "Correlation threshold" },
  ],
  class_balance: [
    { value: "undersample", label: "Undersampling" },
    { value: "oversample", label: "Oversampling (SMOTE)" },
    { value: "stratified", label: "Stratified filtering" },
  ],
};

export const filterTransformations = [
  {
    id: "log",
    name: "Log Transform",
    description: "Natural logarithm",
    category: "mathematical",
  },
  {
    id: "sqrt",
    name: "Square Root",
    description: "Square root transformation",
    category: "mathematical",
  },
  {
    id: "square",
    name: "Square",
    description: "Square transformation",
    category: "mathematical",
  },
  {
    id: "standardize",
    name: "Standardize",
    description: "Z-score normalization",
    category: "scaling",
  },
  {
    id: "normalize",
    name: "Normalize",
    description: "Min-max scaling",
    category: "scaling",
  },
  {
    id: "encode",
    name: "One-Hot Encode",
    description: "For categorical variables",
    category: "encoding",
  },
  {
    id: "label_encode",
    name: "Label Encoding",
    description: "Convert categories to numbers",
    category: "encoding",
  },
  {
    id: "lag",
    name: "Lag Features",
    description: "Create lagged variables",
    category: "timeseries",
  },
  {
    id: "rolling_mean",
    name: "Rolling Mean",
    description: "Moving average",
    category: "timeseries",
  },
  {
    id: "seasonal_decompose",
    name: "Seasonal Decomposition",
    description: "Extract trend and seasonality",
    category: "timeseries",
  },
  {
    id: "differencing",
    name: "Differencing",
    description: "Make series stationary",
    category: "timeseries",
  },
];

