"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FiltersTab from "@/components/FilterTab";
import TransformationsTab from "@/components/TransformationTab";
import GroupingTab from "@/components/GroupingTab";
import PreviewTab from "@/components/FilePreview";
import { FilterProvider, useFilterSelector } from "@/context/FilterContext";
import { useSearchParams } from "next/navigation";
import useRawDataStore from "@/store/RawData";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, FilterIcon, Search, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilterSectionPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "filters";

  // Get raw data from zustand (used to seed provider initial state).
  // If your store shape differs, adjust the selector accordingly.
  const rawData = useRawDataStore((s) => s.data ?? []);
  const filename = useRawDataStore((s) => s.filename);

  return (
    // Seed provider with initial dataset and originalRows so provider starts with correct values.
    <FilterProvider initialState={{ filteredData: rawData, originalRows: rawData?.length ?? 0 }}>
      <div className="space-y-6 w-5xl m-auto">
        <HeaderInner filename={filename} />
        <ProgressSummaryInner />

        <Tabs defaultValue={tab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="filters">1. Filters</TabsTrigger>
            <TabsTrigger value="transformations">2. Transformations</TabsTrigger>
            <TabsTrigger value="grouping">3. Grouping</TabsTrigger>
            <TabsTrigger value="preview">4. Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="filters">
            <FiltersTab />
          </TabsContent>
          <TabsContent value="transformations">
            <TransformationsTab />
          </TabsContent>
          <TabsContent value="grouping">
            <GroupingTab />
          </TabsContent>
          <TabsContent value="preview">
            <PreviewTab />
          </TabsContent>
        </Tabs>
      </div>
    </FilterProvider>
  );
}

// ---------------- Header ----------------
const HeaderInner: React.FC<{ filename?: string }> = ({ filename }) => {
  const handleExport = () => {
    // export behaviour
  };

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Data Processing Workflow</h1>
        <p className="text-muted-foreground mt-1">
          Filter, transform, and analyze data from {filename ?? "your dataset"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Current View
        </Button>
      </div>
    </header>
  );
};

// ---------------- Progress Summary (optimized) ----------------
const ProgressSummaryInner: React.FC = () => {
  // Subscribe only to the slices we need (numbers, booleans, lengths).
  // These are primitive values so re-renders are minimal and only when the selected value changes.
  const originalRows = useFilterSelector((s) => s.originalRows);
  const appliedFiltersCount = useFilterSelector((s) => s.filters.filter((f) => f.applied).length);
  const filteredRows = useFilterSelector((s) => s.filteredData.length);
  const transformationsCount = useFilterSelector((s) => s.appliedTransformations.length);
  const appliedGrouping = useFilterSelector((s) => s.appliedGrouping);
  const selectedGroupingLength = useFilterSelector((s) => s.selectedGrouping.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="py-4 gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Original Rows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {originalRows.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="py-4 gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-accent" />
            Active Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {appliedFiltersCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredRows.toLocaleString()} rows remaining
          </p>
        </CardContent>
      </Card>

      <Card className="py-4 gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary-foreground" />
            Transformations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary-foreground">
            {transformationsCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Applied to data</p>
        </CardContent>
      </Card>

      <Card className="py-4 gap-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Grouping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {appliedGrouping ? selectedGroupingLength : 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {appliedGrouping ? "Active" : "None"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
