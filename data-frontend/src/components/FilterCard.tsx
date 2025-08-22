"use client";

import React, { memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Play, Eye } from "lucide-react";
import { useFilterActions, FilterRule } from "@/context/FilterContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateColumnSummary } from "@/app/filter/generateColumnSummary";
import useDataOverviewStore from "@/store/DataOverview";
import { filterOperators } from "@/data"; // remains the same
import FilterValueRenderer from "./FilterValueRenderer"; // uses updateFilter internally (keeps existing behavior)

type Props = {
  filter: FilterRule;
  index: number;
};

const FilterCardInner: React.FC<Props> = ({ filter, index }) => {
  // Use stable actions (won't cause re-renders when action identity is stable)
  const { updateFilter, togglePreview, applyFilterSingle, removeFilter } =
    useFilterActions();

  // Subscribe to metadata from your DataOverview store (only re-compute when they change)
  const columnsInfo = useDataOverviewStore((s) => s.columnsInfo);
  const descriptiveStats = useDataOverviewStore((s) => s.descriptiveStats);
  const uniqueValues = useDataOverviewStore((s) => s.uniqueValues);

  // Memoize generated column summary
  const mockColumns = useMemo(
    () =>
      generateColumnSummary(
        columnsInfo ?? [],
        descriptiveStats ?? null,
        uniqueValues ?? null
      ),
    [columnsInfo, descriptiveStats, uniqueValues]
  );

  // Handlers (simple wrappers to satisfy onClick types)
  const handleRemove = () => removeFilter(filter.id);
  const handlePreview = () => togglePreview(filter.id);
  const handleApply = () => applyFilterSingle(filter.id);

  return (
    <Card
      key={filter.id}
      className={`border-2 py-2 ${
        filter.applied
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : filter.preview
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-border"
      }`}
    >
      <CardContent className="p-2">
        <div className="flex gap-2 items-center">
          {/* Index */}
          <div className="col-span-1 flex justify-center">
            <Badge
              variant="outline"
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            >
              {index + 1}
            </Badge>
          </div>

          {/* Column */}
          <div className="col-span-4 grow">
            <Select
              value={filter.column}
              onValueChange={(value) => {
                const column = mockColumns.find((c) => c.name === value);
                updateFilter(filter.id, "column", value);
                updateFilter(filter.id, "type", column?.type || "numeric");
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {mockColumns.map((col) => (
                  <SelectItem key={col.name} value={col.name}>
                    {col.name} ({col.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operator */}
          <div className="col-span-4 grow">
            <Select
              value={filter.operator}
              onValueChange={(value) =>
                updateFilter(filter.id, "operator", value)
              }
              disabled={!filter.column}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {filter.column &&
                  filterOperators[
                    filter.type as keyof typeof filterOperators
                  ]?.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value */}
          {/* Value */}
          <div className="col-span-4 grow">
            {filter.column && filter.operator ? (
              <FilterValueRenderer filterId={filter.id} />
            ) : (
              <div className="h-10 flex items-center text-muted-foreground text-sm bg-muted rounded-md px-3">
                Value
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="col-span-2 flex gap-2 justify-end">
            <Button
              size="icon"
              variant={"secondary"}
              onClick={handlePreview}
              disabled={!filter.column || !filter.operator || !filter.value}
              title="Preview"
              className="h-8 w-8"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="default"
              onClick={handleApply}
              disabled={!filter.column || !filter.operator || !filter.value}
              title="Apply"
              className="h-8 w-8"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={"destructive"}
              onClick={handleRemove}
              title="Remove"
              className="h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Dialog open={filter.preview} onOpenChange={handlePreview}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                Display the table here
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const FilterCard = memo(FilterCardInner);
export default FilterCard;
