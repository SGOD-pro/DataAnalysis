"use client";

import React, { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useFilterActions, useFilterSelector } from "@/context/FilterContext";
import useDataOverviewStore from "@/store/DataOverview";
import { generateColumnSummary } from "@/app/filter/generateColumnSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

/**
 * Props: only the filter id (so component subscribes to that single filter)
 */
type Props = { filterId: string };

function useDebouncedCallback(fn: (...args: any[]) => void, delay = 200) {
  const tRef = useRef<number | null>(null);
  const cb = useCallback((...args: any[]) => {
    if (tRef.current) {
      window.clearTimeout(tRef.current);
    }
    // @ts-ignore - window.setTimeout returns number in browser
    tRef.current = window.setTimeout(() => {
      fn(...args);
      tRef.current = null;
    }, delay);
  }, [fn, delay]);

  // cleanup
  useEffect(() => {
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, []);

  return cb;
}

const FilterValueRendererInner: React.FC<Props> = ({ filterId }) => {
  // select single filter by id — this subscribes only to this filter slice
  const filter = useFilterSelector((s) => s.filters.find((f) => f.id === filterId));
  const { updateFilter } = useFilterActions();

  // metadata from data overview (memoize column summary)
  const columnsInfo = useDataOverviewStore((s) => s.columnsInfo);
  const descriptiveStats = useDataOverviewStore((s) => s.descriptiveStats);
  const uniqueValues = useDataOverviewStore((s) => s.uniqueValues);

  const mockColumns = useMemo(
    () => generateColumnSummary(columnsInfo ?? [], descriptiveStats ?? null, uniqueValues ?? null),
    [columnsInfo, descriptiveStats, uniqueValues]
  );

  // If filter no longer exists (shouldn't happen often), render null
  if (!filter) return null;

  const columnMeta = mockColumns.find((c) => c.name === filter.column);
  if (!columnMeta) return null;

  // Local state for debounced inputs (text/number/slider)
  // initialize from filter.value
  const [localValue, setLocalValue] = useState<any>(filter.value);

  // keep local in sync with remote when remote changes externally
  useEffect(() => {
    setLocalValue(filter.value);
  }, [filter.value]);

  // debounced commit to global updateFilter
  const debouncedUpdate = useDebouncedCallback((val: any) => {
    updateFilter(filter.id, "value", val);
  }, 200);

  // Generic local change handler (accepts string | string[] | number[] etc.)
  const handleLocalChange = useCallback((val: any) => {
    setLocalValue(val);
    debouncedUpdate(val);
  }, [debouncedUpdate]);

  // For discrete commits (selects, date range) we update immediately
  const handleImmediateChange = useCallback((val: any) => {
    updateFilter(filter.id, "value", val);
  }, [filter.id, updateFilter]);

  // Render by type
  switch (columnMeta.type) {
    case "number":
      if (filter.operator === "between") {
        // ensure localValue is an array of two numbers
        const currentRange =
          Array.isArray(localValue) && typeof localValue[0] === "number"
            ? localValue
            : [columnMeta.min ?? 0, columnMeta.max ?? 100];

        return (
          <div className="space-y-2">
            <Label>
              Range: {columnMeta.min} - {columnMeta.max}
            </Label>
            <Slider
              value={currentRange}
              onValueChange={(v: number[]) => handleLocalChange(v)}
              max={columnMeta.max ?? 100}
              min={columnMeta.min ?? 0}
              step={Math.max(1, ((columnMeta.max ?? 100) - (columnMeta.min ?? 0)) / 100)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Array.isArray(currentRange) ? currentRange[0] : columnMeta.min}</span>
              <span>{Array.isArray(currentRange) ? currentRange[1] : columnMeta.max}</span>
            </div>
          </div>
        );
      }

      if (filter.operator === "isin") {
        // value shown as joined string, but localValue is an array
        return (
          <Input
            placeholder="Enter values separated by commas"
            value={Array.isArray(localValue) ? localValue.join(", ") : localValue ?? ""}
            onChange={(e) =>
              // split into array and pass array to generic handler
              handleLocalChange(e.target.value.split(",").map((v: string) => v.trim()))
            }
          />
        );
      }

      return (
        <Input
          type="number"
          placeholder={`Enter value (${columnMeta.min}-${columnMeta.max})`}
          value={localValue ?? ""}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={() => {
            // ensure final commit on blur
            updateFilter(filter.id, "value", localValue);
          }}
        />
      );

    case "categorical":
      return (
        <Select
          value={filter.value as string}
          onValueChange={(value) => handleImmediateChange(value)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {columnMeta.values?.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "text":
      return (
        <Input
          placeholder="Enter text to search"
          value={localValue ?? ""}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={() => updateFilter(filter.id, "value", localValue)}
        />
      );

    case "datetime":
      if (filter.operator === "recent_years" || filter.operator === "recent_months") {
        return (
          <Input
            type="number"
            placeholder={`Enter number of ${filter.operator === "recent_years" ? "years" : "months"}`}
            value={localValue ?? ""}
            onChange={(e) => handleLocalChange(e.target.value)}
            onBlur={() => updateFilter(filter.id, "value", localValue)}
          />
        );
      }

      if (filter.operator === "date_range") {
        const current = Array.isArray(localValue) ? localValue : ["", ""];
        return (
          <div className="space-y-2">
            <Input
              type="date"
              value={current[0] ?? ""}
              onChange={(e) => {
                const next = [e.target.value, current[1]];
                setLocalValue(next);
                handleImmediateChange(next);
              }}
            />
            <Input
              type="date"
              value={current[1] ?? ""}
              onChange={(e) => {
                const next = [current[0], e.target.value];
                setLocalValue(next);
                handleImmediateChange(next);
              }}
            />
          </div>
        );
      }

      return (
        <Input
          type="number"
          placeholder="Enter year (e.g., 2023)"
          value={localValue ?? ""}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={() => updateFilter(filter.id, "value", localValue)}
        />
      );

    case "statistical":
      return (
        <Input
          type="number"
          placeholder={
            filter.operator === "variance_threshold"
              ? "Variance threshold (0-1)"
              : "Correlation threshold (0-1)"
          }
          step="0.01"
          min={0}
          max={1}
          value={localValue ?? ""}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={() => updateFilter(filter.id, "value", localValue)}
        />
      );

    case "class_balance":
      if (filter.operator === "undersample" || filter.operator === "oversample") {
        return (
          <Input
            type="number"
            placeholder="Target sample size or ratio"
            value={localValue ?? ""}
            onChange={(e) => handleLocalChange(e.target.value)}
            onBlur={() => updateFilter(filter.id, "value", localValue)}
          />
        );
      }
      return (
        <Input
          type="number"
          placeholder="Stratification ratio (0-1)"
          step="0.01"
          min={0}
          max={1}
          value={localValue ?? ""}
          onChange={(e) => handleLocalChange(e.target.value)}
          onBlur={() => updateFilter(filter.id, "value", localValue)}
        />
      );

    default:
      return null;
  }
};

export default memo(FilterValueRendererInner);
