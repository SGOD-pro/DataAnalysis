interface ColumnSummary {
  name: string;
  type: string;
  min?: number;
  max?: number;
  values?: string[];
}

export function generateColumnSummary(
  columnInfo: ColumnDetails[],
  descriptiveStats: DescriptiveStatistics[] | null,
  uniqueValues: UniqueValues[] | null
): ColumnSummary[] {
  console.log(uniqueValues);
  return columnInfo.map((col) => {
    if (col.type === "integer" || col.type === "number") {
      const stats = descriptiveStats?.find((s) => s.name === col.name);
      return {
        name: col.name,
        type: "number",
        min: stats?.min,
        max: stats?.max,
      };
    }

    if (col.type === "categorical") {
      const uniques = uniqueValues?.find((u) => u.column === col.name);
      console.log(col.name);
      console.log("uniqueValues",uniqueValues)
      return {
        name: col.name,
        type: "categorical",
        values:  uniques ? uniques.unique_values : [],
      };
    }

    if (col.type === "text") {
      return {
        name: col.name,
        type: "text",
      };
    }

    if (col.type === "datetime") {
      return {
        name: col.name,
        type: "datetime",
      };
    }

    // fallback for other statistical/unknown columns
    return {
      name: col.name,
      type: "statistical",
    };
  });
}
