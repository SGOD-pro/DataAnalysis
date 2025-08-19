import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type DataOverviewState = {
  dataSummary: DataSummary | null;
  columnsInfo: ColumnDetails[] | null;
  descriptiveStats: DescriptiveStatistics[] | null;
  uniqueValues: UniqueValues[] | null;

  setDataSummary: (dataSummary: DataSummary | null) => void;
  setColumnsInfo: (columnsInfo: ColumnDetails[]) => void;
  setDescriptiveStats: (descriptiveStats: DescriptiveStatistics[]) => void;
  setUniqueValues: (uniqueValues: UniqueValues[]) => void;

  
};

export const useDataOverviewStore = create<DataOverviewState>()(
  immer((set) => ({
    dataSummary: null,

    columnsInfo: null,
    descriptiveStats: null,
    uniqueValues: null,
    
    setDataSummary: (dataSummary: DataSummary | null) =>
      set((state) => ({ ...state, dataSummary })),
    setColumnsInfo: (columnsInfo: ColumnDetails[]) =>
      set((state) => ({ ...state, columnsInfo })),
    setDescriptiveStats: (descriptiveStats: DescriptiveStatistics[]) =>
      set((state) => ({ ...state, descriptiveStats })),
    setUniqueValues: (uniqueValues: UniqueValues[]) =>
      set((state) => ({ ...state, uniqueValues })),
  }))
);
export default useDataOverviewStore;
