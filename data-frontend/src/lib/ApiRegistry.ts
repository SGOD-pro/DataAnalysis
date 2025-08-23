// apiRegistry.ts
import useDataOverviewStore from "@/store/DataOverview";

export const apiRegistry = {
  summary: {
    url: "/summary",
    selector: () => useDataOverviewStore((s) => s.dataSummary),
    setter: () => useDataOverviewStore((s) => s.setDataSummary),
  },
  columns: {
    url: "/column-info",
    selector: () => useDataOverviewStore((s) => s.columnsInfo),
    setter: () => useDataOverviewStore((s) => s.setColumnsInfo),
  },
  stats: {
    url: "/stats",
    selector: () => useDataOverviewStore((s) => s.descriptiveStats),
    setter: () => useDataOverviewStore((s) => s.setDescriptiveStats),
  },
  uniqueValues: {
    url: "/stats",
    selector: () => useDataOverviewStore((s) => s.uniqueValues),
    setter: () => useDataOverviewStore((s) => s.setUniqueValues),
  },

};
