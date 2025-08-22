"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Search,
  Zap,
  RefreshCw,
  Eye,
  BarChart3,
  ChevronRight,
  Save,
  Play,
  Settings,
  TableIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { filterOperators, filterTransformations } from "@/data";
import useRawDataStore from "@/store/RawData";
import useDataOverviewStore from "@/store/DataOverview";
import { generateColumnSummary } from "./generateColumnSummary";

const mockColumns = [
  { name: "age", type: "numeric", min: 22, max: 58 },
  { name: "salary", type: "numeric", min: 35000, max: 120000 },
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
  { name: "experience", type: "numeric", min: 0, max: 25 },
  { name: "name", type: "text" },
  { name: "hire_date", type: "datetime" },
  { name: "target_class", type: "categorical", values: ["A", "B", "C"] },
  { name: "feature_variance", type: "statistical" },
  { name: "feature_correlation", type: "statistical" },
];


// Mock filtered data
const mockFilteredData = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    salary: 65000,
    department: "Engineering",
    city: "San Francisco",
    experience: 4,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    salary: 75000,
    department: "Engineering",
    city: "New York",
    experience: 7,
  },
  {
    id: 3,
    name: "Mike Johnson",
    age: 29,
    salary: 68000,
    department: "Engineering",
    city: "Seattle",
    experience: 5,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    age: 31,
    salary: 72000,
    department: "Engineering",
    city: "Boston",
    experience: 6,
  },
  {
    id: 5,
    name: "Tom Brown",
    age: 27,
    salary: 63000,
    department: "Engineering",
    city: "Chicago",
    experience: 3,
  },
];

export default function FilterSection() {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const filename = useRawDataStore((state) => state.filename);
  const data = useRawDataStore((state) => state.data); /// Get raw data
  const columnInfo = useDataOverviewStore((state) => state.columnsInfo); // Get column info column in interger | categorical | text
  const descriptiveStats = useDataOverviewStore(
    (state) => state.descriptiveStats
  ); // Get column info of integer value
  const uniqueValues = useDataOverviewStore((state) => state.uniqueValues); // Get ctegorical unique values

  const mockColumns = generateColumnSummary(
    columnInfo!,
    descriptiveStats,
    uniqueValues
  );

  const [appliedTransformations, setAppliedTransformations] = useState<
    string[]
  >([]);
  const [filteredData, setFilteredData] = useState(data);
  const [originalRows] = useState(1000);
  const [selectedGrouping, setSelectedGrouping] = useState<string[]>([]);
  const [groupingPreview, setGroupingPreview] = useState("");
  const [appliedGrouping, setAppliedGrouping] = useState(false);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();
  const addFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      column: "",
      operator: "",
      value: "",
      type: "numeric",
      preview: false,
      applied: false,
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const updateFilter = (id: string, field: keyof FilterRule, value: any) => {
    setFilters(
      filters.map((f) =>
        f.id === id
          ? {
              ...f,
              [field]: value,
              ...(field === "column" ? { operator: "", value: "" } : {}),
            }
          : f
      )
    );
  };

  const applyFilters = () => {
    const filteredCount = Math.floor(originalRows * 0.7);
    toast("Filters Applied", {
      description: `${filteredCount} rows remain after filtering (${filters.length} filters active)`,
    });
  };

  const clearFilters = () => {
    setFilters([]);
    setFilteredData(mockFilteredData);
    toast("Filters Cleared", {
      description: "All filters have been removed",
    });
  };

  const handleExport = () => {
    toast("Export Data", {
      description: "Current dataset view will be exported",
    });
  };

  const handlePreviewFilter = (filterId: string) => {
    setFilters(
      filters.map((f) =>
        f.id === filterId ? { ...f, preview: !f.preview } : f
      )
    );
    toast("Filter Preview", {
      description: "Filter preview updated",
    });
  };

  const handleApplyFilter = (filterId: string) => {
    setFilters(
      filters.map((f) =>
        f.id === filterId ? { ...f, applied: true, preview: false } : f
      )
    );
    toast("Filter Applied", {
      description: "Filter has been applied to dataset",
    });
  };

  const handlePreviewGrouping = () => {
    if (selectedGrouping.length === 0) {
      toast("No Columns Selected", {
        description: "Please select columns for grouping",
      });
      return;
    }
    const preview = selectedGrouping.join(" → ");
    setGroupingPreview(preview);
    toast("Grouping Preview", {
      description: `Preview: ${preview}`,
    });
  };

  const handleApplyGrouping = () => {
    if (selectedGrouping.length === 0) {
      toast("No Grouping Selected", {
        description: "Please select columns for grouping",
      });
      return;
    }

    setAppliedGrouping(true);
    toast("Grouping Applied", {
      description: `Data grouped by ${selectedGrouping.join(" → ")}`,
    });
  };

  const handleSaveGrouping = () => {
    toast("Grouping Saved", {
      description: "Grouping configuration saved successfully",
    });
  };

  const handleApplyTransformation = (transformId: string) => {
    setAppliedTransformations([...appliedTransformations, transformId]);
    toast("Transformation Applied", {
      description: `Transformation applied successfully`,
    });
  };

  const handleSaveTransformations = () => {
    toast("Transformations Saved", {
      description: "All transformations saved successfully",
    });
  };

  const handlePreviewTransformations = () => {
    toast("Transformation Preview", {
      description: "Preview of applied transformations updated",
    });
  };

  const renderFilterValue = (filter: FilterRule, index: number) => {
    const column = mockColumns.find((c) => c.name === filter.column);
    if (!column) return null;

    switch (column.type) {
      case "numeric":
        if (filter.operator === "between") {
          return (
            <div className="space-y-2">
              <Label>
                Range: {column.min} - {column.max}
              </Label>
              <Slider
                value={
                  Array.isArray(filter.value) &&
                  typeof filter.value[0] === "number"
                    ? (filter.value as number[])
                    : [column.min, column.max]
                }
                onValueChange={(value) =>
                  updateFilter(filter.id, "value", value)
                }
                max={column.max}
                min={column.min}
                step={Math.max(1, (column?.max - column?.min) / 100)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {Array.isArray(filter.value) ? filter.value[0] : column.min}
                </span>
                <span>
                  {Array.isArray(filter.value) ? filter.value[1] : column.max}
                </span>
              </div>
            </div>
          );
        }
        if (filter.operator === "isin") {
          return (
            <Input
              placeholder="Enter values separated by commas"
              value={
                Array.isArray(filter.value)
                  ? filter.value.join(", ")
                  : filter.value
              }
              onChange={(e) =>
                updateFilter(
                  filter.id,
                  "value",
                  e.target.value.split(",").map((v) => v.trim())
                )
              }
            />
          );
        }
        return (
          <Input
            type="number"
            placeholder={`Enter value (${column.min}-${column.max})`}
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
          />
        );

      case "categorical":
        return (
          <div className="space-y-2">
            <Label>Select values:</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {column.values?.map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${val}`}
                    checked={
                      Array.isArray(filter.value)
                        ? (filter.value as string[]).includes(val)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(filter.value)
                        ? (filter.value as string[])
                        : [];
                      const newValues = checked
                        ? [...currentValues, val]
                        : currentValues.filter((v) => v !== val);
                      updateFilter(filter.id, "value", newValues);
                    }}
                  />
                  <Label htmlFor={`${filter.id}-${val}`} className="text-sm">
                    {val}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <Input
            placeholder="Enter text to search"
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
          />
        );

      case "datetime":
        if (
          filter.operator === "recent_years" ||
          filter.operator === "recent_months"
        ) {
          return (
            <Input
              type="number"
              placeholder={`Enter number of ${
                filter.operator === "recent_years" ? "years" : "months"
              }`}
              value={filter.value as string}
              onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
            />
          );
        }
        if (filter.operator === "date_range") {
          return (
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="Start date"
                onChange={(e) => {
                  const currentValue = Array.isArray(filter.value)
                    ? filter.value
                    : ["", ""];
                  updateFilter(filter.id, "value", [
                    e.target.value,
                    currentValue[1],
                  ]);
                }}
              />
              <Input
                type="date"
                placeholder="End date"
                onChange={(e) => {
                  const currentValue = Array.isArray(filter.value)
                    ? filter.value
                    : ["", ""];
                  updateFilter(filter.id, "value", [
                    currentValue[0],
                    e.target.value,
                  ]);
                }}
              />
            </div>
          );
        }
        return (
          <Input
            type="number"
            placeholder="Enter year (e.g., 2023)"
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
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
            min="0"
            max="1"
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
          />
        );

      case "class_balance":
        if (
          filter.operator === "undersample" ||
          filter.operator === "oversample"
        ) {
          return (
            <Input
              type="number"
              placeholder="Target sample size or ratio"
              value={filter.value as string}
              onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
            />
          );
        }
        return (
          <Input
            type="number"
            placeholder="Stratification ratio (0-1)"
            step="0.01"
            min="0"
            max="1"
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-5xl">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Processing Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Filter, transform, and analyze data from {filename}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Current View
          </Button>
        </div>
      </header>

      {/* Progress Summary */}
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
              <Filter className="w-4 h-4 text-accent" />
              Active Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {filters.filter((f) => f.applied).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.length.toLocaleString()} rows remaining
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
              {appliedTransformations.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Applied to data
            </p>
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
              {appliedGrouping ? selectedGrouping.length : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {appliedGrouping ? "Active" : "None"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Tabs */}
      <Tabs defaultValue={tab || "filters"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            1. Filters
          </TabsTrigger>
          <TabsTrigger
            value="transformations"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            2. Transformations
          </TabsTrigger>
          <TabsTrigger value="grouping" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            3. Grouping
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <TableIcon className="w-4 h-4" />
            4. Preview
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Filters */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Step 1: Filter Your Data
              </CardTitle>
              <CardDescription>
                Narrow down your dataset by applying filters. Each filter can
                use different criteria based on column type.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Button onClick={addFilter}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Filter Rule
                </Button>
                {filters.length > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>

              {filters.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No filters added yet</h3>
                  <p className="text-sm">
                    Start by adding a filter rule to narrow down your data
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filters.map((filter, index) => (
                    <Card
                      key={filter.id}
                      className={`border-2 py-0 ${
                        filter.applied
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : filter.preview
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-border"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-1  pt-2">
                            <Badge
                              variant="outline"
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                            >
                              {index + 1}
                            </Badge>
                          </div>

                          <div className="col-span-3">
                            <Label className="text-sm font-medium">
                              Column
                            </Label>
                            <Select
                              value={filter.column}
                              onValueChange={(value) => {
                                const column = mockColumns.find(
                                  (c) => c.name === value
                                );
                                updateFilter(filter.id, "column", value);
                                updateFilter(
                                  filter.id,
                                  "type",
                                  column?.type || "numeric"
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select column" />
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

                          <div className="col-span-3">
                            <Label className="text-sm font-medium">
                              Filter Type
                            </Label>
                            <Select
                              value={filter.operator}
                              onValueChange={(value) =>
                                updateFilter(filter.id, "operator", value)
                              }
                              disabled={!filter.column}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
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

                          <div className="col-span-4">
                            <Label className="text-sm font-medium">Value</Label>
                            {filter.column && filter.operator ? (
                              renderFilterValue(filter, index)
                            ) : (
                              <div className="h-10 flex items-center text-muted-foreground text-sm bg-muted rounded-md px-3">
                                Select column and operator first
                              </div>
                            )}
                          </div>

                          <div className="col-span-1 flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreviewFilter(filter.id)}
                              disabled={
                                !filter.column ||
                                !filter.operator ||
                                !filter.value
                              }
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApplyFilter(filter.id)}
                              disabled={
                                !filter.column ||
                                !filter.operator ||
                                !filter.value
                              }
                              title="Apply"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFilter(filter.id)}
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {filter.preview && (
                          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              📊 Preview: This filter would return approximately
                              150 rows from 1,000 total
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {filters.filter((f) => f.applied).length} of{" "}
                      {filters.length} filters applied
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={applyFilters}>
                        Apply All Filters
                      </Button>
                      <Button
                        onClick={() =>
                          router.push("/filter?tab=transformations")
                        }
                      >
                        Next: Transformations
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Transformations */}
        <TabsContent value="transformations" className="space-y-4">
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
                {/* Mathematical & Scaling */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Mathematical & Scaling Transformations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterTransformations
                      .filter(
                        (t) =>
                          t.category === "mathematical" ||
                          t.category === "scaling"
                      )
                      .map((transform) => (
                        <Card
                          key={transform.id}
                          className={cn(
                            "py-0",
                            appliedTransformations.includes(transform.id)
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : ""
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {transform.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {transform.description}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant={
                                  appliedTransformations.includes(transform.id)
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  handleApplyTransformation(transform.id)
                                }
                                disabled={appliedTransformations.includes(
                                  transform.id
                                )}
                              >
                                {appliedTransformations.includes(transform.id)
                                  ? "Applied"
                                  : "Apply"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Encoding */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Encoding Transformations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterTransformations
                      .filter((t) => t.category === "encoding")
                      .map((transform) => (
                        <Card
                          key={transform.id}
                          className={cn(
                            "py-0",
                            appliedTransformations.includes(transform.id)
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : ""
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {transform.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {transform.description}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant={
                                  appliedTransformations.includes(transform.id)
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  handleApplyTransformation(transform.id)
                                }
                                disabled={appliedTransformations.includes(
                                  transform.id
                                )}
                              >
                                {appliedTransformations.includes(transform.id)
                                  ? "Applied"
                                  : "Apply"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Time Series */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Time Series Transformations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterTransformations
                      .filter((t) => t.category === "timeseries")
                      .map((transform) => (
                        <Card
                          key={transform.id}
                          className={cn(
                            "py-0",
                            appliedTransformations.includes(transform.id)
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : ""
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">
                                  {transform.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  {transform.description}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant={
                                  appliedTransformations.includes(transform.id)
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  handleApplyTransformation(transform.id)
                                }
                                disabled={appliedTransformations.includes(
                                  transform.id
                                )}
                              >
                                {appliedTransformations.includes(transform.id)
                                  ? "Applied"
                                  : "Apply"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {appliedTransformations.length > 0 && (
                  <div className="flex justify-between items-center pt-6 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePreviewTransformations}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSaveTransformations}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Transformations
                      </Button>
                    </div>
                    <Button onClick={() => router.push("/filter?tab=grouping")}>
                      Next: Grouping
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Grouping */}
        <TabsContent value="grouping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Step 3: Group Your Data
              </CardTitle>
              <CardDescription>
                Group data by multiple columns to create aggregate views for
                analysis and visualization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Select Grouping Columns</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose one or more columns to group by. Order matters - drag
                  to reorder priority.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockColumns
                    .filter((col) => col.type !== "statistical")
                    .map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`group-${col.name}`}
                          checked={selectedGrouping.includes(col.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGrouping([
                                ...selectedGrouping,
                                col.name,
                              ]);
                            } else {
                              setSelectedGrouping(
                                selectedGrouping.filter((g) => g !== col.name)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`group-${col.name}`}
                          className="text-sm cursor-pointer"
                        >
                          {col.name}
                          <span className="text-muted-foreground ml-1">
                            ({col.type})
                          </span>
                        </Label>
                      </div>
                    ))}
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
                          <Badge variant="secondary">{col}</Badge>
                          {index < selectedGrouping.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Data will be grouped hierarchically in this order,
                      allowing for drill-down analysis.
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
                      <Button variant="outline" onClick={handlePreviewGrouping}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Grouping
                      </Button>
                      <Button onClick={handleApplyGrouping}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Apply Grouping
                      </Button>
                    </>
                  )}
                  {appliedGrouping && (
                    <Button variant="outline" onClick={handleSaveGrouping}>
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
        </TabsContent>

        {/* Step 4: Preview */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="w-5 h-5" />
                Step 4: Final Data Preview
              </CardTitle>
              <CardDescription>
                View your processed data after all filters, transformations, and
                grouping have been applied.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Applied Operations Summary */}
                <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                  <h4 className="w-full font-medium mb-2">
                    Applied Operations:
                  </h4>
                  {filters
                    .filter((f) => f.applied)
                    .map((filter, index) => (
                      <Badge key={filter.id} variant="secondary">
                        Filter {index + 1}: {filter.column} {filter.operator}
                      </Badge>
                    ))}
                  {appliedTransformations.map((transform) => (
                    <Badge key={transform} variant="outline">
                      {
                        filterTransformations.find((t) => t.id === transform)
                          ?.name
                      }
                    </Badge>
                  ))}
                  {appliedGrouping && (
                    <Badge variant="default">
                      Grouped by: {selectedGrouping.join(" → ")}
                    </Badge>
                  )}
                  {filters.filter((f) => f.applied).length === 0 &&
                    appliedTransformations.length === 0 &&
                    !appliedGrouping && (
                      <span className="text-sm text-muted-foreground">
                        No operations applied yet
                      </span>
                    )}
                </div>

                {/* Data Table */}
                {filteredData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <TableIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No data to display</h3>
                    <p className="text-sm">
                      Apply some filters or transformations to see results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Showing {filteredData.length} rows from{" "}
                          {originalRows.toLocaleString()} original
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((filteredData.length / originalRows) * 100).toFixed(
                            1
                          )}
                          % of original dataset
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Search className="w-4 h-4 mr-2" />
                          Search & Filter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleExport}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Experience</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((row, index) => (
                            <TableRow
                              key={row.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {row.name}
                              </TableCell>
                              <TableCell>{row.age}</TableCell>
                              <TableCell>
                                ${row.salary.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {row.department}
                                </Badge>
                              </TableCell>
                              <TableCell>{row.city}</TableCell>
                              <TableCell>{row.experience} years</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination would go here */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Page 1 of 1 • {filteredData.length} total rows
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
