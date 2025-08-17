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
interface DataSummary {
  rows: number;
  columns: number;
  missing_percentage: number;
}
interface ColumnDetails {
  name: string;
  type: string;
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
  name: string;
  unique: number;
}
