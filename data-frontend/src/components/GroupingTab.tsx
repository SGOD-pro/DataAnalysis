"use client";

import React, { memo, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BarChart3, ChevronRight, Eye, RefreshCw, Save } from "lucide-react";
import { Button } from "./ui/button";
import useDataOverviewStore from "@/store/DataOverview";
import { generateColumnSummary } from "@/app/filter/generateColumnSummary";
import { useFilterSelector, useFilterActions } from "@/context/FilterContext";

const GroupingTabInner: React.FC = () => {
  // Select only the slices we need (minimal subscriptions)
  const selectedGrouping = useFilterSelector((s) => s.selectedGrouping);
  const appliedGrouping = useFilterSelector((s) => s.appliedGrouping);

  // Actions (stable)
  const { setGrouping, previewGrouping, applyGrouping, saveGrouping } =
    useFilterActions();

  const router = useRouter();

  // DataOverview selectors and memoized column summary
  const columnInfo = useDataOverviewStore((s) => s.columnsInfo);
  const descriptiveStats = useDataOverviewStore((s) => s.descriptiveStats);
  const uniqueValues = useDataOverviewStore((s) => s.uniqueValues);

  const mockColumns = useMemo(
    () =>
      generateColumnSummary(
        columnInfo ?? [],
        descriptiveStats ?? null,
        uniqueValues ?? null
      ),
    [columnInfo, descriptiveStats, uniqueValues]
  );

  // toggle handler factory (memoized)
  const handleToggleColumn = useCallback(
    (colName: string, checked: boolean) => {
      const newGrouping = checked
        ? [...selectedGrouping, colName]
        : selectedGrouping.filter((g) => g !== colName);
      setGrouping(newGrouping);
    },
    [selectedGrouping, setGrouping]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Step 3: Group Your Data
        </CardTitle>
        <CardDescription>
          Group data by multiple columns to create aggregate views for analysis
          and visualization.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-4">Select Grouping Columns</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Choose one or more columns to group by. Order matters - drag to
            reorder priority.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mockColumns
              .filter((col) => col.type !== "statistical")
              .map((col) => {
                const isChecked = selectedGrouping.includes(col.name);
                return (
                  <div key={col.name} className="flex items-center space-x-2">
                    <input
                      id={`group-${col.name}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleToggleColumn(col.name, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`group-${col.name}`}
                      className="text-sm cursor-pointer"
                    >
                      {col.name}
                      <span className="text-muted-foreground ml-1">
                        ({col.type})
                      </span>
                    </label>
                  </div>
                );
              })}
          </div>
        </div>

        {selectedGrouping.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Grouping Preview</h4>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Grouping hierarchy:</span>
                {selectedGrouping.map((col, index) => (
                  <span key={col} className="flex items-center gap-1">
                    <span className="badge">{col}</span>
                    {index < selectedGrouping.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Data will be grouped hierarchically in this order, allowing for
                drill-down analysis.
              </p>
            </div>
          </div>
        )}

        {appliedGrouping && (
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Grouping Applied: {selectedGrouping.join(" → ")}
              </span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Ready for analysis and visualization
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            {selectedGrouping.length > 0 && (
              <>
                <Button variant="outline" onClick={() => previewGrouping()}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Grouping
                </Button>

                <Button onClick={() => applyGrouping()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Apply Grouping
                </Button>
              </>
            )}

            {appliedGrouping && (
              <Button variant="outline" onClick={() => saveGrouping()}>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
            )}
          </div>

          <Button onClick={() => router.push("/filter?tab=preview")}>
            Next: Preview Results
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(GroupingTabInner);
