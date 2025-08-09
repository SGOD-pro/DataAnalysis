"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface FilterSectionProps {
  data: any;
  filename: string;
}

interface FilterRule {
  id: string;
  column: string;
  operator: string;
  value: string | number | string[] | number[];
  type: "numeric" | "categorical" | "text";
}

const mockColumns = [
  { name: "age", type: "numeric", min: 22, max: 58 },
  { name: "salary", type: "numeric", min: 35000, max: 120000 },
  { name: "department", type: "categorical", values: ["Engineering", "Marketing", "Sales", "HR", "Finance"] },
  { name: "city", type: "categorical", values: ["New York", "San Francisco", "Chicago", "Boston", "Seattle"] },
  { name: "experience", type: "numeric", min: 0, max: 25 },
  { name: "name", type: "text" }
];

const operators = {
  numeric: [
    { value: "eq", label: "Equal to" },
    { value: "neq", label: "Not equal to" },
    { value: "gt", label: "Greater than" },
    { value: "gte", label: "Greater than or equal" },
    { value: "lt", label: "Less than" },
    { value: "lte", label: "Less than or equal" },
    { value: "between", label: "Between" }
  ],
  categorical: [
    { value: "in", label: "Is one of" },
    { value: "not_in", label: "Is not one of" }
  ],
  text: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "exact", label: "Exact match" }
  ]
};

const transformations = [
  { id: "log", name: "Log Transform", description: "Natural logarithm" },
  { id: "sqrt", name: "Square Root", description: "Square root transformation" },
  { id: "square", name: "Square", description: "Square transformation" },
  { id: "standardize", name: "Standardize", description: "Z-score normalization" },
  { id: "normalize", name: "Normalize", description: "Min-max scaling" },
  { id: "encode", name: "One-Hot Encode", description: "For categorical variables" }
];

const groupingOptions = [
  { id: "department", name: "Group by Department", description: "Group data by department" },
  { id: "city", name: "Group by City", description: "Group data by city" },
  { id: "age_range", name: "Group by Age Range", description: "Group by age ranges" },
  { id: "salary_range", name: "Group by Salary Range", description: "Group by salary ranges" }
];

// Mock filtered data
const mockFilteredData = [
  { id: 1, name: "John Doe", age: 28, salary: 65000, department: "Engineering", city: "San Francisco", experience: 4 },
  { id: 2, name: "Jane Smith", age: 32, salary: 75000, department: "Engineering", city: "New York", experience: 7 },
  { id: 3, name: "Mike Johnson", age: 29, salary: 68000, department: "Engineering", city: "Seattle", experience: 5 },
  { id: 4, name: "Sarah Wilson", age: 31, salary: 72000, department: "Engineering", city: "Boston", experience: 6 },
  { id: 5, name: "Tom Brown", age: 27, salary: 63000, department: "Engineering", city: "Chicago", experience: 3 },
];

export default function FilterSection({ data, filename }: FilterSectionProps) {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [selectedTransformations, setSelectedTransformations] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState(mockFilteredData);
  const [originalRows] = useState(1000);
  const [selectedGrouping, setSelectedGrouping] = useState("");


  const addFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      column: "",
      operator: "",
      value: "",
      type: "numeric"
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, field: keyof FilterRule, value: any) => {
    setFilters(filters.map(f => 
      f.id === id 
        ? { ...f, [field]: value, ...(field === 'column' ? { operator: '', value: '' } : {}) }
        : f
    ));
  };

  const applyFilters = () => {
    // Simulate filter application
    const filteredCount = Math.floor(originalRows * 0.7); // 70% of original data
    toast("Filters Applied",{
       
      description: `${filteredCount} rows remain after filtering (${filters.length} filters active)`,
    });
  };

  const clearFilters = () => {
    setFilters([]);
    setFilteredData(mockFilteredData);
    toast("Filters Cleared",{
       
      description: "All filters have been removed",
    });
  };

  const handleExport = () => {
    toast( "Export Filtered Data",{
      
      description: "Filtered dataset will be exported (API integration needed)",
    });
  };

  const handleApplyGrouping = () => {
    if (!selectedGrouping) {
      toast("No Grouping Selected",{
         
        description: "Please select a grouping option",

      });
      return;
    }

    toast("Grouping Applied",{
       
      description: `Data grouped by ${selectedGrouping}`,
    });
  };

  const renderFilterValue = (filter: FilterRule, index: number) => {
    const column = mockColumns.find(c => c.name === filter.column);
    if (!column) return null;

    switch (column.type) {
      case "numeric":
        if (filter.operator === "between") {
          return (
            <div className="space-y-2">
              <Label>Range: {column.min} - {column.max}</Label>
              <Slider
                value={Array.isArray(filter.value) && typeof filter.value[0] === 'number' ? filter.value as number[] : [column.min, column.max]}
                onValueChange={(value) => updateFilter(filter.id, 'value', value)}
                max={column.max}
                min={column.min}
                step={Math.max(1, (column.max - column.min) / 100)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Array.isArray(filter.value) ? filter.value[0] : column.min}</span>
                <span>{Array.isArray(filter.value) ? filter.value[1] : column.max}</span>
              </div>
            </div>
          );
        }
        return (
          <Input
            type="number"
            placeholder={`Enter value (${column.min}-${column.max})`}
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
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
                    checked={Array.isArray(filter.value) ? (filter.value as string[]).includes(val) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(filter.value) ? filter.value as string[] : [];
                      const newValues = checked
                        ? [...currentValues, val]
                        : currentValues.filter(v => v !== val);
                      updateFilter(filter.id, 'value', newValues);
                    }}
                  />
                  <Label htmlFor={`${filter.id}-${val}`} className="text-sm">{val}</Label>
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
            onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Filtering & Transformation</h1>
          <p className="text-muted-foreground mt-1">Filter and transform data from {filename}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Filtered Data
          </Button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Original Rows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{originalRows.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              Filtered Rows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{filteredData.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((filteredData.length / originalRows) * 100).toFixed(1)}% remaining
            </p>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary-foreground" />
              Active Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{filters.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Rules
              </CardTitle>
              <CardDescription>
                Add and configure filter conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filters.map((filter, index) => (
                <div key={filter.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Filter {index + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Select
                    value={filter.column}
                    onValueChange={(value) => {
                      const column = mockColumns.find(c => c.name === value);
                      updateFilter(filter.id, 'column', value);
                      updateFilter(filter.id, 'type', column?.type || 'numeric');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColumns.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          <div className="flex items-center gap-2">
                            {col.name}
                            <Badge variant="secondary" className="text-xs">
                              {col.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {filter.column && (
                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(filter.id, 'operator', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators[filter.type]?.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filter.operator && renderFilterValue(filter, index)}
                </div>
              ))}

              <div className="flex gap-2">
                <Button onClick={addFilter} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Filter
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={applyFilters} className="w-full" disabled={filters.length === 0}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Data Transformations */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Transformations
              </CardTitle>
              <CardDescription>
                Apply mathematical transformations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {transformations.map((transform) => (
                <div key={transform.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{transform.name}</div>
                      <div className="text-xs text-muted-foreground">{transform.description}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast("Transformation Applied",{
                           
                          description: `${transform.name} applied successfully`,
                        });
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Grouping Options */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Data Grouping
              </CardTitle>
              <CardDescription>
                Group data for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Grouping Options</label>
                <Select value={selectedGrouping} onValueChange={setSelectedGrouping}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupingOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleApplyGrouping} className="w-full">
                Apply Grouping
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filtered Data Preview */}
        <div className="lg:col-span-2">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Filtered Data Preview
              </CardTitle>
              <CardDescription>
                Preview of filtered dataset ({filteredData.length} rows)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(filteredData[0] || {}).map((key) => (
                        <TableHead key={key} className="capitalize">{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex} className="font-mono text-sm">
                            {value?.toString() || "—"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredData.length > 10 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing 10 of {filteredData.length} filtered rows
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Load More Rows
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}