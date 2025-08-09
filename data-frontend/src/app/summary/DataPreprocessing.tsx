import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface DataPreprocessingProps {
  data: any;
  filename: string;
}

const mockColumns = [
  { name: "age", type: "numeric", nulls: 12, nullPercentage: 1.2 },
  { name: "salary", type: "numeric", nulls: 8, nullPercentage: 0.8 },
  { name: "department", type: "categorical", nulls: 5, nullPercentage: 0.5 },
  { name: "city", type: "categorical", nulls: 3, nullPercentage: 0.3 },
  { name: "experience", type: "numeric", nulls: 15, nullPercentage: 1.5 },
  { name: "name", type: "text", nulls: 0, nullPercentage: 0 },
];

const fillMethods = {
  numeric: [
    { value: "mean", label: "Mean" },
    { value: "median", label: "Median" },
    { value: "mode", label: "Mode" },
    { value: "forward_fill", label: "Forward Fill" },
    { value: "backward_fill", label: "Backward Fill" },
    { value: "interpolate", label: "Interpolate" },
    { value: "custom", label: "Custom Value" },
  ],
  categorical: [
    { value: "mode", label: "Mode (Most Frequent)" },
    { value: "forward_fill", label: "Forward Fill" },
    { value: "backward_fill", label: "Backward Fill" },
    { value: "custom", label: "Custom Value" },
  ],
  text: [
    { value: "forward_fill", label: "Forward Fill" },
    { value: "backward_fill", label: "Backward Fill" },
    { value: "custom", label: "Custom Value" },
    { value: "remove", label: "Remove Rows" },
  ],
};

const outlierMethods = [
  {
    value: "iqr",
    label: "IQR Method",
    description: "Remove values beyond 1.5 * IQR",
  },
  {
    value: "zscore",
    label: "Z-Score Method",
    description: "Remove values beyond 3 standard deviations",
  },
  {
    value: "percentile",
    label: "Percentile Method",
    description: "Remove values beyond specified percentiles",
  },
  {
    value: "isolation",
    label: "Isolation Forest",
    description: "Machine learning based outlier detection",
  },
];

export function DataPreprocessing({ data, filename }: DataPreprocessingProps) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [fillMethod, setFillMethod] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [outlierMethod, setOutlierMethod] = useState("");
  const [preprocessingHistory, setPreprocessingHistory] = useState<any[]>([]);

  const handleFillNulls = () => {
    if (!selectedColumn || !fillMethod) {
      toast("Missing Parameters", {
        description: "Please select both column and fill method",
      });
      return;
    }

    const operation = {
      id: Date.now(),
      type: "fill_nulls",
      column: selectedColumn,
      method: fillMethod,
      customValue: customValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setPreprocessingHistory([...preprocessingHistory, operation]);
    toast("Null Values Filled",{
 
      description: `Applied ${fillMethod} method to ${selectedColumn} column`,
    });
  };

  const handleRemoveOutliers = () => {
    if (!selectedColumn || !outlierMethod) {
      toast("Missing Parameters",{
        description: "Please select both column and outlier detection method",
      });
      return;
    }

    const operation = {
      id: Date.now(),
      type: "remove_outliers",
      column: selectedColumn,
      method: outlierMethod,
      timestamp: new Date().toLocaleTimeString(),
    };

    setPreprocessingHistory([...preprocessingHistory, operation]);
    toast( "Outliers Removed",{
      description: `Applied ${outlierMethod} method to ${selectedColumn} column`,
    });
  };

  const handleUndoOperation = (operationId: number) => {
    setPreprocessingHistory(
      preprocessingHistory.filter((op) => op.id !== operationId)
    );
    toast("Operation Undone",{

      description: "Preprocessing step has been reverted",
    });
  };

  const handleExportPreprocessed = () => {
    toast("Export Preprocessed Data",{

      description:
        "Preprocessed dataset will be exported (API integration needed)",
    });
  };

  const selectedColumnInfo = mockColumns.find(
    (col) => col.name === selectedColumn
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Preprocessing</h1>
          <p className="text-muted-foreground mt-1">
            Clean and prepare data from {filename}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPreprocessed}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Preprocessed
          </Button>
        </div>
      </div>

      {/* Data Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Missing Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {mockColumns.reduce((sum, col) => sum + col.nulls, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total null values
            </p>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">97.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data completeness
            </p>
          </CardContent>
        </Card>

        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {preprocessingHistory.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Applied operations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="missing">Missing Values</TabsTrigger>
          <TabsTrigger value="outliers">Outliers</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="missing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Missing Values Analysis */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Values by Column
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Missing</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockColumns
                      .filter((col) => col.nulls > 0)
                      .map((col) => (
                        <TableRow key={col.name}>
                          <TableCell className="font-medium">
                            {col.name}
                          </TableCell>
                          <TableCell>{col.nulls}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                col.nullPercentage > 5
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {col.nullPercentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Fill Missing Values */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Fill Missing Values
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Column</Label>
                  <Select
                    value={selectedColumn}
                    onValueChange={setSelectedColumn}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose column" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColumns
                        .filter((col) => col.nulls > 0)
                        .map((col) => (
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
                </div>

                {selectedColumnInfo && (
                  <div>
                    <Label>Fill Method</Label>
                    <Select value={fillMethod} onValueChange={setFillMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose method" />
                      </SelectTrigger>
                      <SelectContent>
                        {fillMethods[
                          selectedColumnInfo.type as keyof typeof fillMethods
                        ]?.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {fillMethod === "custom" && (
                  <div>
                    <Label>Custom Value</Label>
                    <Input
                      placeholder="Enter custom value"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                    />
                  </div>
                )}

                <Button onClick={handleFillNulls} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Fill Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outliers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Outlier Detection */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Outlier Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Numeric Column</Label>
                  <Select
                    value={selectedColumn}
                    onValueChange={setSelectedColumn}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose column" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockColumns
                        .filter((col) => col.type === "numeric")
                        .map((col) => (
                          <SelectItem key={col.name} value={col.name}>
                            {col.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Detection Method</Label>
                  <Select
                    value={outlierMethod}
                    onValueChange={setOutlierMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose method" />
                    </SelectTrigger>
                    <SelectContent>
                      {outlierMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {method.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleRemoveOutliers} className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Remove Outliers
                </Button>
              </CardContent>
            </Card>

            {/* Outlier Summary */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Outlier Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockColumns
                    .filter((col) => col.type === "numeric")
                    .map((col) => (
                      <div
                        key={col.name}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <span className="font-medium">{col.name}</span>
                        <Badge variant="outline">
                          {Math.floor(Math.random() * 10)} outliers
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-6">
          <Card className="data-card">
            <CardHeader className="relative">
              <CardTitle>Duplicate Detection</CardTitle>
              <CardDescription>
                Identify and remove duplicate rows
              </CardDescription>
              <Button onClick={()=>{alert("Remove Duplicates")}} className="right-6 top-0 absolute bg-[var(--warning)]">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Remove Duplicates
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Duplicates Found
                </h3>
                <p className="text-muted-foreground">
                  Your dataset appears to be clean of duplicate records
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Preprocessing History
              </CardTitle>
              <CardDescription>Track of all applied operations</CardDescription>
            </CardHeader>
            <CardContent>
              {preprocessingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Operations Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Apply preprocessing operations to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {preprocessingHistory.map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {operation.type.replace("_", " ")}: {operation.column}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Method: {operation.method} • {operation.timestamp}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUndoOperation(operation.id)}
                      >
                        Undo
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
