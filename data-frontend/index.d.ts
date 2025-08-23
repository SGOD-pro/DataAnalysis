interface ChatMessages {
  id: string;
  user?: boolean;
  content: string;
}

interface ApiServicesResponse<T> {
  success: boolean;
  data?: T; // Optional, as it might be undefined in case of an error
  error?: Error | null; // Optional, with a null fallback
  message?: string;
}

interface RawData {
  filename: string;
  data: any[];
}

interface DataSummary {
  rows: number;
  columns: number;
  missing_percentage: number;
}
interface ColumnDetails {
  name: string;
  type: 'number'|"text"|"categorical"|"datetime";
  nulls: number;
  unique: number;
}
interface DescriptiveStatistics {
  name: string;
  count: number;
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
}

interface UniqueValues {
  column: string;
  unique_values: string[] ;
}

interface History {
  id: string;
  section: string;
  operation: string;
  column: string;
}

interface FilterRule {
  id: string;
  column: string;
  operator: string;
  value: string | number | string[] | number[];
  type:
    | "numeric"
    | "categorical"
    | "text"
    | "datetime"
    | "statistical"
    | "class_balance";
  preview?: boolean;
  applied?: boolean;
}


type ApiTypes = {
  summary: DataSummary;
  columns: ColumnDetails[];
  stats: DescriptiveStatistics[];
  uniqueValues: UniqueValues[];
};