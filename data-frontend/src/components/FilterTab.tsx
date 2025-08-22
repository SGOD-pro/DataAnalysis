"use client";

import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useFilterActions, useFilterSelector } from "@/context/FilterContext";
import FilterCard from "./FilterCard";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronRight, FilterIcon, Plus, RotateCcw } from "lucide-react";

const FiltersTabInner: React.FC<{ tab?: string }> = () => {
  // Actions (stable)
  const { addFilter, clearFilters, applyFilters } = useFilterActions();

  // Subscribe only to the slice we need
  const filters = useFilterSelector((s) => s.filters);

  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5" />
          Step 1: Filter Your Data
        </CardTitle>
        <CardDescription>
          Narrow down your dataset by applying filters. Each filter can use
          different criteria based on column type.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Button onClick={() => addFilter()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Filter Rule
          </Button>

          {filters.length > 0 && (
            <Button variant="outline" onClick={() => clearFilters()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {filters.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FilterIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">No filters added yet</h3>
            <p className="text-sm">
              Start by adding a filter rule to narrow down your data
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filters.map((filter, index) => (
              <FilterCard key={filter.id} filter={filter} index={index} />
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filters.filter((f) => f.applied).length} of {filters.length}{" "}
                filters applied
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => applyFilters()}>
                  Apply All Filters
                </Button>
                <Button onClick={() => router.push("/filter?tab=transformations")}>
                  Next: Transformations
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FiltersTab = memo(FiltersTabInner);
export default FiltersTab;
