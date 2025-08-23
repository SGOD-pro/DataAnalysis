"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap,
  Hash,
  Type,
  BarChart3,
  ChevronRight,
  Eye,
  Save,
  Trash2,
  Settings,
  X,
} from "lucide-react";
import { useFilterActions, useFilterSelector } from "@/context/FilterContext";
import { transformations as TRANSFORMS } from "@/data";

/* ----------------- Static mock columns (stable reference) ----------------- */
const mockColumns = [
  { name: "age", type: "number", min: 22, max: 58 },
  { name: "salary", type: "number", min: 35000, max: 120000 },
  {
    name: "department",
    type: "categorical",
    values: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
  },
  {
    name: "city",
    type: "categorical",
    values: ["New York", "San Francisco", "Chicago", "Boston", "Seattle"],
  },
  { name: "experience", type: "number", min: 0, max: 25 },
  { name: "name", type: "text" },
  { name: "hire_date", type: "datetime" },
  { name: "target_class", type: "categorical", values: ["A", "B", "C"] },
  { name: "feature_variance", type: "statistical" },
  { name: "feature_correlation", type: "statistical" },
] as const;

/* ----------------- Helpers ----------------- */
const normalizeType = (t: string) => (t === "numeric" ? "number" : t);

/* ----------------- Memoized subcomponents ----------------- */

/**
 * ColumnCard - memoized so only toggled column re-renders
 */
type ColumnCardProps = {
  col: (typeof mockColumns)[number];
  selected: boolean;
  onToggle: (name: string) => void;
};
const ColumnCardInner: React.FC<ColumnCardProps> = ({
  col,
  selected,
  onToggle,
}) => {
  const typeIcon =
    col.type === "number" ? (
      <Hash className="w-4 h-4" />
    ) : col.type === "categorical" ? (
      <Type className="w-4 h-4" />
    ) : col.type === "text" ? (
      <Type className="w-4 h-4" />
    ) : col.type === "datetime" ? (
      <BarChart3 className="w-4 h-4" />
    ) : (
      <Settings className="w-4 h-4" />
    );

  return (
    <Card
      className={`cursor-pointer transition-all p-3 ${
        selected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      }`}
      onClick={() => onToggle(col.name)}
    >
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {typeIcon}
            <div>
              <h6 className="font-medium text-sm">{col.name}</h6>
              <p className="text-xs text-muted-foreground capitalize">
                {col.type}
              </p>
            </div>
          </div>
          <Checkbox checked={selected} onChange={() => {}} />
        </div>
      </CardContent>
    </Card>
  );
};
const ColumnCard = React.memo(
  ColumnCardInner,
  (prev, next) =>
    prev.col === next.col &&
    prev.selected === next.selected &&
    prev.onToggle === next.onToggle
);

/**
 * TransformCard - memoized so each transform card only re-renders when props change
 */
type TransformCardProps = {
  transform: (typeof TRANSFORMS)[number];
  isAppliedToAnySelected: boolean;
  onApply: (transformId: string) => void;
  disabled: boolean;
};
const TransformCardInner: React.FC<TransformCardProps> = ({
  transform,
  isAppliedToAnySelected,
  onApply,
  disabled,
}) => {
  return (
    <Card
      className={
        isAppliedToAnySelected
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : ""
      }
    >
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h5 className="font-medium">{transform.name}</h5>
            <p className="text-sm text-muted-foreground">
              {transform.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {transform.allowedTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            variant={isAppliedToAnySelected ? "default" : "outline"}
            onClick={() => onApply(transform.id)}
            disabled={disabled}
          >
            {isAppliedToAnySelected ? "Applied" : "Apply"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
const TransformCard = React.memo(
  TransformCardInner,
  (p, n) =>
    p.transform === n.transform &&
    p.isAppliedToAnySelected === n.isAppliedToAnySelected &&
    p.onApply === n.onApply &&
    p.disabled === n.disabled
);

/**
 * AppliedEntry - shows applied transforms for a column
 */
type AppliedEntryProps = {
  entry: { column: string; transformations: string[] };
  onRemove: (column: string, transformId: string) => void;
  transformsLookup: Record<string, { id: string; name: string }>;
};
const AppliedEntryInner: React.FC<AppliedEntryProps> = ({
  entry,
  onRemove,
  transformsLookup,
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-medium">{entry.column}</span>
            {entry.transformations.map((tr) => (
              <Badge key={tr} variant="outline" className="text-xs flex p-1 px-1.5">
                {transformsLookup[tr]?.name ?? tr}
                <button onClick={() => onRemove(entry.column, tr)} className="cursor-pointer hover:text-red-500">

                <X className="w-4 h-4 ml-1" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const AppliedEntry = React.memo(
  AppliedEntryInner,
  (p, n) =>
    p.entry.column === n.entry.column &&
    p.entry.transformations.length === n.entry.transformations.length &&
    p.onRemove === n.onRemove &&
    p.transformsLookup === n.transformsLookup
);

/* ----------------- Main component ----------------- */

type TransformationsTabProps = {
  onNextTab: () => void;
};

export default function TransformationsTab({
  onNextTab,
}: TransformationsTabProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // subscribe to the minimal slice
  const appliedTransformationsContext = useFilterSelector(
    (s) => s.appliedTransformations
  );

  // stable actions
  const {
    addTransformation,
    setTransformations,
    previewTransformations,
    saveTransformations,
  } = useFilterActions();

  // transforms lookup (stable)
  const transformsLookup = useMemo(() => {
    const out: Record<string, { id: string; name: string }> = {};
    for (const t of TRANSFORMS) out[t.id] = { id: t.id, name: t.name };
    return out;
  }, []);

  // Build a Map<column, Set<transformId>> for O(1) membership checks — memoized and stable until appliedTransformationsContext changes
  const appliedMap = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const entry of appliedTransformationsContext) {
      m.set(entry.column, new Set(entry.transformations));
    }
    return m;
  }, [appliedTransformationsContext]);

  // toggle column selection (stable)
  const toggleColumn = useCallback((name: string) => {
    setSelectedColumns((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }, []);

  // check transform applied (reads appliedMap, stable unless appliedTransformationsContext changes)
  const isAppliedToColumn = useCallback(
    (column: string, transformId: string) => {
      const s = appliedMap.get(column);
      return Boolean(s && s.has(transformId));
    },
    [appliedMap]
  );

  // apply transform to selected columns (stable)
  const applyTransform = useCallback(
    (transformId: string) => {
      if (selectedColumns.length === 0) return;
      const transform = TRANSFORMS.find((t) => t.id === transformId);
      if (!transform) return;

      // validate selected columns are compatible
      const invalid = selectedColumns.filter((colName) => {
        const col = mockColumns.find((c) => c.name === colName);
        if (!col) return true;
        const allowedNormalized = transform.allowedTypes.map(normalizeType);
        return !allowedNormalized.includes(col.type);
      });
      if (invalid.length > 0) {
        // keep UI toast in the component level (you already had that)
        return;
      }

      // call addTransformation for each selected column (action is stable)
      selectedColumns.forEach((colName) => {
        if (!isAppliedToColumn(colName, transformId))
          addTransformation(colName, transformId);
      });
    },
    [selectedColumns, addTransformation, isAppliedToColumn]
  );

  // remove a single transform from a column — rebuild next array and setTransformations
  const removeTransform = useCallback(
    (column: string, transformId: string) => {
      const next = appliedTransformationsContext
        .map((entry) =>
          entry.column === column
            ? {
                column: entry.column,
                transformations: entry.transformations.filter(
                  (t) => t !== transformId
                ),
              }
            : entry
        )
        .filter((entry) => entry.transformations.length > 0);
      setTransformations(next);
    },
    [appliedTransformationsContext, setTransformations]
  );

  // group transforms by category (stable)
  const transformsByCategory = useMemo(() => {
    const map = new Map<string, typeof TRANSFORMS>();
    for (const t of TRANSFORMS) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return map;
  }, []);

  // compute compatible selected per category once per render
  const compatibleSelectedByCategory = useMemo(() => {
    const result = new Map<string, string[]>();
    const cats = Array.from(transformsByCategory.keys());
    for (const category of cats) {
      const selected = selectedColumns.filter((colName) => {
        const col = mockColumns.find((c) => c.name === colName);
        if (!col) return false;
        return TRANSFORMS.some(
          (t) =>
            t.category === category &&
            t.allowedTypes.map(normalizeType).includes(col.type)
        );
      });
      result.set(category, selected);
    }
    return result;
  }, [selectedColumns, transformsByCategory]);

  /* render */
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Step 2: Transform Your Data
        </CardTitle>
        <CardDescription>
          Apply mathematical, statistical, and encoding transformations to
          create new features or modify existing ones.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Column selection */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Step 1: Select Columns for Transformation
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which columns you want to transform. Only compatible
              transformations will be shown.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockColumns.map((col) => (
                <ColumnCard
                  key={col.name}
                  col={col}
                  selected={selectedColumns.includes(col.name)}
                  onToggle={toggleColumn}
                />
              ))}
            </div>

            {selectedColumns.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Selected columns ({selectedColumns.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedColumns.map((colName) => {
                    const col = mockColumns.find((c) => c.name === colName);
                    return (
                      <Badge
                        key={colName}
                        variant="secondary"
                        className="text-xs"
                      >
                        {colName} ({col?.type})
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Transformation categories — render only when compatible selected exist */}
          {[
            "mathematical",
            "scaling",
            "encoding",
            "text_processing",
            "timeseries",
          ].map((category) => {
            const compatible = compatibleSelectedByCategory.get(category) ?? [];
            if (compatible.length === 0) return null;

            const title =
              category === "mathematical"
                ? "Mathematical Transformations"
                : category === "scaling"
                ? "Scaling Transformations"
                : category === "encoding"
                ? "Encoding Transformations"
                : category === "text_processing"
                ? "Text Processing Transformations"
                : "Time Series Transformations";

            const icon =
              category === "timeseries" ? (
                <BarChart3 className="w-4 h-4" />
              ) : category === "encoding" ? (
                <Type className="w-4 h-4" />
              ) : (
                <Hash className="w-4 h-4" />
              );
            const badge =
              category === "mathematical" || category === "scaling"
                ? "Numeric Columns Only"
                : category === "encoding"
                ? "Categorical Columns Only"
                : category === "text_processing"
                ? "Text Columns Only"
                : "DateTime/Numeric Columns";

            const transforms = transformsByCategory.get(category) ?? [];

            return (
              <div key={category}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  {icon}
                  {title}
                  <Badge variant="secondary" className="text-xs ml-2">
                    {badge}
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Available for selected columns: {compatible.join(", ")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transforms.map((transform) => {
                    const isAppliedToAnySelected = selectedColumns.some((c) =>
                      isAppliedToColumn(c, transform.id)
                    );
                    return (
                      <TransformCard
                        key={transform.id}
                        transform={transform}
                        isAppliedToAnySelected={isAppliedToAnySelected}
                        onApply={applyTransform}
                        disabled={selectedColumns.length === 0}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Applied summary (from context) */}
          {appliedTransformationsContext.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-4">
                Applied Transformations (
                {appliedTransformationsContext.reduce(
                  (acc, e) => acc + e.transformations.length,
                  0
                )}
                )
              </h4>
              <div className="space-y-2">
                {appliedTransformationsContext.map((entry) => (
                  <AppliedEntry
                    key={entry.column}
                    entry={entry}
                    onRemove={removeTransform}
                    transformsLookup={transformsLookup}
                  />
                ))}
              </div>
            </div>
          )}

          {(appliedTransformationsContext.length > 0 ||
            selectedColumns.length > 0) && (
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => previewTransformations()}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
                <Button variant="outline" onClick={() => saveTransformations()}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Transformations
                </Button>
              </div>
              <Button onClick={onNextTab}>
                Next: Grouping
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
