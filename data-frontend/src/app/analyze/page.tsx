"use client";
import React, { useState } from "react";

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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  TrendingUp,
  Target,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import DEscriptiveStsts from "@/app/summary/DescriptiveStats";
import { correlationColor } from "@/lib/correlationColor";
import { useSearchParams } from "next/navigation";
import { ComboboxDemo } from "@/components/ComboBox";

interface AnalysisSectionProps {
  data: any;
  filename: string;
}

const testTypes = [
  {
    id: "normality",
    name: "Normality Tests",
    description: "Shapiro-Wilk, Anderson-Darling",
  },
  {
    id: "correlation",
    name: "Correlation Analysis",
    description: "Pearson, Spearman, Kendall",
  },
  { id: "ttest", name: "T-Tests", description: "One-sample, Two-sample" },
  { id: "anova", name: "ANOVA", description: "One-way, Two-way" },
  { id: "chisquare", name: "Chi-square", description: "Independence test" },
];
const stationaryTestTypes = [
  {
    id: "kpss",
    name: "KPSS Test",
    description: "Kwiatkowski-Phillips-Schmidt-Shin",
  },
  {
    id: "adf",
    name: "ADF Test",
    description: "Augmented Dickey-Fuller",
  },
  { id: "pp", name: "PP", description: "Phillips-Perron" },
];

const mockColumns = [
  { name: "age", type: "numeric" },
  { name: "salary", type: "numeric" },
  { name: "department", type: "categorical" },
  { name: "city", type: "categorical" },
  { name: "experience", type: "numeric" },
];

// Mock test results
const mockTestResults = {
  normality: {
    testName: "Shapiro-Wilk Test",
    variable: "salary",
    statistic: 0.987,
    pValue: 0.043,
    alpha: 0.05,
    conclusion: "reject",
    interpretation: "The data does not follow a normal distribution (p < 0.05)",
  },
  correlation: {
    testName: "Pearson Correlation",
    variables: ["age", "salary"],
    coefficient: 0.742,
    pValue: 0.001,
    significance: "strong positive",
    interpretation:
      "Strong positive correlation between age and salary (r = 0.742, p < 0.001)",
  },
  ttest: {
    testName: "Independent T-Test",
    groups: ["Engineering", "Marketing"],
    statistic: 2.847,
    pValue: 0.012,
    meanDiff: 8500,
    conclusion: "reject",
    interpretation:
      "Significant difference in salary between groups (t = 2.847, p = 0.012)",
  },
};
const corr_data = {
  columns: [
    "Hours_Studied",
    "Attendance",
    "Sleep_Hours",
    "Previous_Scores",
    "Tutoring_Sessions",
    "Physical_Activity",
    "Exam_Score",
  ],

  data: [
    [0, 0, 1.0],
    [0, 1, -0.01],
    [0, 2, 0.01],
    [0, 3, 0.02],
    [0, 4, -0.01],
    [0, 5, 0.0],
    [0, 6, 0.45],
    [1, 0, -0.01],
    [1, 1, 1.0],
    [1, 2, -0.02],
    [1, 3, -0.02],
    [1, 4, 0.01],
    [1, 5, -0.02],
    [1, 6, 0.58],
    [2, 0, 0.01],
    [2, 1, -0.02],
    [2, 2, 1.0],
    [2, 3, -0.02],
    [2, 4, -0.01],
    [2, 5, -0.0],
    [2, 6, -0.02],
    [3, 0, 0.02],
    [3, 1, -0.02],
    [3, 2, -0.02],
    [3, 3, 1.0],
    [3, 4, -0.01],
    [3, 5, -0.01],
    [3, 6, 0.18],
    [4, 0, -0.01],
    [4, 1, 0.01],
    [4, 2, -0.01],
    [4, 3, -0.01],
    [4, 4, 1.0],
    [4, 5, 0.02],
    [4, 6, 0.16],
    [5, 0, 0.0],
    [5, 1, -0.02],
    [5, 2, -0.0],
    [5, 3, -0.01],
    [5, 4, 0.02],
    [5, 5, 1.0],
    [5, 6, 0.03],
    [6, 0, 0.45],
    [6, 1, 0.58],
    [6, 2, -0.02],
    [6, 3, 0.18],
    [6, 4, 0.16],
    [6, 5, 0.03],
    [6, 6, 1.0],
  ],
};

export default function AnalysisSection({
  data,
  filename,
}: AnalysisSectionProps) {
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [groupVariable, setGroupVariable] = useState("");
  const [testResults, setTestResults] = useState<any>(null);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const handleRunTest = () => {
    if (!selectedTest || !selectedVariable) {
      toast("Missing Parameters", {
        description: "Please select both test type and variable(s)",
      });
      return;
    }

    // Simulate test execution
    setTestResults(
      mockTestResults[selectedTest as keyof typeof mockTestResults]
    );
    toast("Test Complete", {
      description: `${selectedTest} test has been executed successfully`,
    });
  };

  const handleExportResults = () => {
    toast("Export Results", {
      description: "Analysis results will be exported (API integration needed)",
    });
  };

  const getSignificanceIcon = (pValue: number, alpha: number = 0.05) => {
    if (pValue < alpha) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Test Results: {testResults.testName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Test Statistic
              </div>
              <div className="text-lg font-bold">
                {testResults.statistic?.toFixed(3)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">P-Value</div>
              <div className="text-lg font-bold flex items-center justify-center gap-2">
                {testResults.pValue?.toFixed(3)}
                {testResults.pValue && getSignificanceIcon(testResults.pValue)}
              </div>
            </div>
            {testResults.coefficient && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Correlation</div>
                <div className="text-lg font-bold">
                  {testResults.coefficient.toFixed(3)}
                </div>
              </div>
            )}
            {testResults.meanDiff && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Mean Difference
                </div>
                <div className="text-lg font-bold">
                  {testResults.meanDiff.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Interpretation</span>
            </div>
            <p className="text-sm">{testResults.interpretation}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Statistical Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Advanced statistical tests for {filename}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportResults}>
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      //NOTE: Merge Stationarity and Hypothesis Testing at once and add a togle switch  ither user can do Hypothesis test or Stationarity

      <Tabs defaultValue={tab || "stationarity"} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stationarity">Stationarity Test</TabsTrigger>
          <TabsTrigger value="tests">Hypothesis Testing</TabsTrigger>
          <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="stationarity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-1 h-full">
              <Card className="data-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ComboboxDemo />
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Test Type
                    </label>
                    <Select
                      value={selectedTest}
                      onValueChange={setSelectedTest}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test" />
                      </SelectTrigger>
                      <SelectContent>
                        {stationaryTestTypes.map((test) => (
                          <SelectItem key={test.id} value={test.id}>
                            <div>
                              <div className="font-medium">{test.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {test.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleRunTest}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Test Results */}
            <div className="lg:col-span-2 h-full">
              {testResults ? (
                renderTestResults()
              ) : (
                <Card className="data-card">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Test Results
                      </h3>
                      <p className="text-muted-foreground">
                        Configure and run a statistical test to see results
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-1">
              <Card className="data-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Test Type
                    </label>
                    <Select
                      value={selectedTest}
                      onValueChange={setSelectedTest}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test" />
                      </SelectTrigger>
                      <SelectContent>
                        {testTypes.map((test) => (
                          <SelectItem key={test.id} value={test.id}>
                            <div>
                              <div className="font-medium">{test.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {test.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {selectedTest === "chisquare"
                        ? "Variables (multiple)"
                        : "Variable"}
                    </label>
                    {selectedTest === "chisquare" ? (
                      <div className="space-y-2">
                        {mockColumns
                          .filter((col) => col.type === "categorical")
                          .map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={col.name}
                                className="rounded"
                                onChange={(e) => {
                                  const current = Array.isArray(
                                    selectedVariable
                                  )
                                    ? selectedVariable.split(",")
                                    : [];
                                  const newVars = e.target.checked
                                    ? [...current, col.name]
                                    : current.filter((v) => v !== col.name);
                                  setSelectedVariable(newVars.join(","));
                                }}
                              />
                              <label htmlFor={col.name} className="text-sm">
                                {col.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <Select
                        value={selectedVariable}
                        onValueChange={setSelectedVariable}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select variable" />
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
                    )}
                  </div>

                  {(selectedTest === "ttest" || selectedTest === "anova") && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Group Variable
                      </label>
                      <Select
                        value={groupVariable}
                        onValueChange={setGroupVariable}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grouping variable" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockColumns
                            .filter((col) => col.type === "categorical")
                            .map((col) => (
                              <SelectItem key={col.name} value={col.name}>
                                {col.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleRunTest}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Test Results */}
            <div className="lg:col-span-2">
              {testResults ? (
                renderTestResults()
              ) : (
                <Card className="data-card">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Test Results
                      </h3>
                      <p className="text-muted-foreground">
                        Configure and run a statistical test to see results
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Correlation Matrix
              </CardTitle>
              <CardDescription>
                Correlation coefficients between numerical variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select defaultValue="pearson" defaultOpen>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pearson">
                        Pearson <Badge className="text-xs">default</Badge>
                      </SelectItem>
                      <SelectItem value="spearman">Spearman</SelectItem>
                      <SelectItem value="kendall">Kendall</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      toast("Correlation Matrix Generated", {
                        description:
                          "Correlation matrix has been calculated successfully",
                      });
                    }}
                  >
                    Generate Correlation Matrix
                  </Button>
                </div>

                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${
                      corr_data.columns.length + 1
                    }, minmax(0, 1fr))`,
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {/* First row: header */}
                  <div className="font-medium">Variable</div>
                  {corr_data.columns.map((col, idx) => (
                    <div key={idx} className="font-medium cursor-default">
                      <p className=" line-clamp-1" title={col}>
                        {" "}
                        {col}
                      </p>
                    </div>
                  ))}

                  {/* Data rows */}
                  {corr_data.columns.map((rowName, rowIdx) => (
                    <React.Fragment key={rowIdx}>
                      {/* Row label */}
                      <div className="font-medium">{rowName}</div>

                      {corr_data.columns.map((_, colIdx) => {
                        const valueObj = corr_data.data.find(
                          ([r, c]) => r === rowIdx && c === colIdx
                        );
                        const value = valueObj ? valueObj[2] : 0;

                        return (
                          <div
                            key={colIdx}
                            className="p-2 rounded text-center relative group cursor-pointer"
                            style={{
                              backgroundColor: correlationColor(value),
                            }}
                          >
                            <p className=" mix-blend-difference">
                              {value.toFixed(2)}
                            </p>
                            <div className="absolute -bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded hidden group-hover:block transition-opacity whitespace-nowrap z-10">
                              {corr_data.columns[rowIdx]} ,{" "}
                              {corr_data.columns[colIdx]}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
