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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Target,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

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

const descriptiveStats = [
  {
    variable: "age",
    count: 1000,
    mean: 32.5,
    median: 31.0,
    std: 8.2,
    min: 22,
    max: 58,
    q1: 27,
    q3: 38,
  },
  {
    variable: "salary",
    count: 992,
    mean: 65750,
    median: 62000,
    std: 18200,
    min: 35000,
    max: 120000,
    q1: 52000,
    q3: 78000,
  },
  {
    variable: "experience",
    count: 995,
    mean: 6.8,
    median: 5.5,
    std: 4.1,
    min: 0,
    max: 25,
    q1: 3,
    q3: 9,
  },
];

export default function AnalysisSection({
  data,
  filename,
}: AnalysisSectionProps) {
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [groupVariable, setGroupVariable] = useState("");
  const [testResults, setTestResults] = useState<any>(null);

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
    <div className="space-y-6">
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

      <Tabs defaultValue="descriptive" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="descriptive">Descriptive Statistics</TabsTrigger>
          <TabsTrigger value="tests">Hypothesis Testing</TabsTrigger>
          <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="descriptive" className="space-y-6">
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Descriptive Statistics
              </CardTitle>
              <CardDescription>
                Summary statistics for numerical variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Mean</TableHead>
                    <TableHead>Median</TableHead>
                    <TableHead>Std Dev</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Q1</TableHead>
                    <TableHead>Q3</TableHead>
                    <TableHead>Max</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {descriptiveStats.map((stat) => (
                    <TableRow key={stat.variable}>
                      <TableCell className="font-medium">
                        {stat.variable}
                      </TableCell>
                      <TableCell>{stat.count.toLocaleString()}</TableCell>
                      <TableCell>{stat.mean.toLocaleString()}</TableCell>
                      <TableCell>{stat.median.toLocaleString()}</TableCell>
                      <TableCell>{stat.std.toLocaleString()}</TableCell>
                      <TableCell>{stat.min.toLocaleString()}</TableCell>
                      <TableCell>{stat.q1.toLocaleString()}</TableCell>
                      <TableCell>{stat.q3.toLocaleString()}</TableCell>
                      <TableCell>{stat.max.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-1">
              <Card className="data-card">
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
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pearson">Pearson</SelectItem>
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

                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium">Variable</div>
                  <div className="font-medium">age</div>
                  <div className="font-medium">salary</div>
                  <div className="font-medium">experience</div>

                  <div className="font-medium">age</div>
                  <div className="bg-primary/20 p-2 rounded text-center">
                    1.00
                  </div>
                  <div className="bg-primary/10 p-2 rounded text-center">
                    0.74
                  </div>
                  <div className="bg-primary/15 p-2 rounded text-center">
                    0.82
                  </div>

                  <div className="font-medium">salary</div>
                  <div className="bg-primary/10 p-2 rounded text-center">
                    0.74
                  </div>
                  <div className="bg-primary/20 p-2 rounded text-center">
                    1.00
                  </div>
                  <div className="bg-primary/12 p-2 rounded text-center">
                    0.68
                  </div>

                  <div className="font-medium">experience</div>
                  <div className="bg-primary/15 p-2 rounded text-center">
                    0.82
                  </div>
                  <div className="bg-primary/12 p-2 rounded text-center">
                    0.68
                  </div>
                  <div className="bg-primary/20 p-2 rounded text-center">
                    1.00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
