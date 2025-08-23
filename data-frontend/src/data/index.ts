
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

export const transformations = [
  {
    id: "log",
    name: "Log Transform",
    description: "Natural logarithm",
    category: "mathematical",
    allowedTypes: ["numeric"],
  },
  {
    id: "sqrt",
    name: "Square Root",
    description: "Square root transformation",
    category: "mathematical",
    allowedTypes: ["numeric"],
  },
  {
    id: "square",
    name: "Square",
    description: "Square transformation",
    category: "mathematical",
    allowedTypes: ["numeric"],
  },
  {
    id: "standardize",
    name: "Standardize",
    description: "Z-score normalization",
    category: "scaling",
    allowedTypes: ["numeric"],
  },
  {
    id: "normalize",
    name: "Normalize",
    description: "Min-max scaling",
    category: "scaling",
    allowedTypes: ["numeric"],
  },
  {
    id: "encode",
    name: "One-Hot Encode",
    description: "For categorical variables",
    category: "encoding",
    allowedTypes: ["categorical"],
  },
  {
    id: "label_encode",
    name: "Label Encoding",
    description: "Convert categories to numbers",
    category: "encoding",
    allowedTypes: ["categorical"],
  },
  {
    id: "extract_numbers",
    name: "Extract Numbers",
    description: "Extract numeric values from text (e.g., '1000km' → 1000)",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "create_boolean",
    name: "Create Boolean Column",
    description: "Create true/false column based on text patterns",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "remove_strings",
    name: "Remove Strings",
    description: "Remove specific text patterns from column",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "text_length",
    name: "Text Length",
    description: "Calculate character count of text",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "text_upper",
    name: "Uppercase",
    description: "Convert text to uppercase",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "text_lower",
    name: "Lowercase",
    description: "Convert text to lowercase",
    category: "text_processing",
    allowedTypes: ["text"],
  },
  {
    id: "lag",
    name: "Lag Features",
    description: "Create lagged variables",
    category: "timeseries",
    allowedTypes: ["datetime", "numeric"],
  },
  {
    id: "rolling_mean",
    name: "Rolling Mean",
    description: "Moving average",
    category: "timeseries",
    allowedTypes: ["datetime", "numeric"],
  },
  {
    id: "seasonal_decompose",
    name: "Seasonal Decomposition",
    description: "Extract trend and seasonality",
    category: "timeseries",
    allowedTypes: ["datetime"],
  },
  {
    id: "differencing",
    name: "Differencing",
    description: "Make series stationary",
    category: "timeseries",
    allowedTypes: ["datetime", "numeric"],
  },
  {
    id: "date_extract_year",
    name: "Extract Year",
    description: "Extract year from date",
    category: "timeseries",
    allowedTypes: ["datetime"],
  },
  {
    id: "date_extract_month",
    name: "Extract Month",
    description: "Extract month from date",
    category: "timeseries",
    allowedTypes: ["datetime"],
  },
  {
    id: "date_extract_day",
    name: "Extract Day",
    description: "Extract day from date",
    category: "timeseries",
    allowedTypes: ["datetime"],
  },
];

