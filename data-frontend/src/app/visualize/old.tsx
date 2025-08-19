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
  BarChart3,
  LineChart as LineChartIcon,
  Zap as ScatterIcon,
  PieChart as PieChartIcon,
  Download,
  Palette,
  Settings,
  Box,
} from "lucide-react";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { LinePlot } from "@mui/x-charts/LineChart";

import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ThemeProvider } from "@mui/material/styles";
import { Heatmap } from '@mui/x-charts-pro/Heatmap';

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const uData = [45, 32, 28, 15];
const xLabels = ["Engineering", "Marketing", "Sales", "H"];

import { toast } from "sonner";

interface VisualizationSectionProps {
  data: any;
  filename: string;
}

const chartTypes = [
  { id: "bar", name: "Bar Chart", icon: BarChart3 },
  { id: "line", name: "Line Chart", icon: LineChartIcon },
  { id: "scatter", name: "Scatter Plot", icon: ScatterIcon },
  { id: "pie", name: "Pie Chart", icon: PieChartIcon },
];

const mockColumns = [
  { name: "age", type: "numeric" },
  { name: "salary", type: "numeric" },
  { name: "department", type: "categorical" },
  { name: "city", type: "categorical" },
  { name: "experience", type: "numeric" },
];

// Mock data for different chart types

const lineData = [45000, 52000, 48000, 61000, 55000, 67000];
const lineLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const mockLineData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
];

export const scatterData = [
  {
    id: "data-0",
    x1: 329.39,
    y1: 443.28,
    y2: 153.9,
  },
  {
    id: "data-1",
    x1: 96.94,
    y1: 110.5,
    y2: 217.8,
  },
  {
    id: "data-2",
    x1: 336.35,
    y1: 175.23,
    y2: 286.32,
  },
  {
    id: "data-3",
    x1: 159.44,
    y1: 195.97,
    y2: 325.12,
  },
  {
    id: "data-4",
    x1: 188.86,
    y1: 351.77,
    y2: 144.58,
  },
  {
    id: "data-5",
    x1: 143.86,
    y1: 43.253,
    y2: 146.51,
  },
  {
    id: "data-6",
    x1: 202.02,
    y1: 376.34,
    y2: 309.69,
  },
  {
    id: "data-7",
    x1: 384.41,
    y1: 31.514,
    y2: 236.38,
  },
  {
    id: "data-8",
    x1: 256.76,
    y1: 231.31,
    y2: 440.72,
  },
  {
    id: "data-9",
    x1: 143.79,
    y1: 108.04,
    y2: 20.29,
  },
  {
    id: "data-10",
    x1: 103.48,
    y1: 321.77,
    y2: 484.17,
  },
  {
    id: "data-11",
    x1: 272.39,
    y1: 120.18,
    y2: 54.962,
  },
  {
    id: "data-12",
    x1: 23.57,
    y1: 366.2,
    y2: 418.5,
  },
  {
    id: "data-13",
    x1: 219.73,
    y1: 451.45,
    y2: 181.32,
  },
  {
    id: "data-14",
    x1: 54.99,
    y1: 294.8,
    y2: 440.9,
  },
  {
    id: "data-15",
    x1: 134.13,
    y1: 121.83,
    y2: 273.52,
  },
  {
    id: "data-16",
    x1: 12.7,
    y1: 287.7,
    y2: 346.7,
  },
  {
    id: "data-17",
    x1: 176.51,
    y1: 134.06,
    y2: 74.528,
  },
  {
    id: "data-18",
    x1: 65.05,
    y1: 104.5,
    y2: 150.9,
  },
  {
    id: "data-19",
    x1: 162.25,
    y1: 413.07,
    y2: 26.483,
  },
  {
    id: "data-20",
    x1: 68.88,
    y1: 74.68,
    y2: 333.2,
  },
  {
    id: "data-21",
    x1: 95.29,
    y1: 360.6,
    y2: 422.0,
  },
  {
    id: "data-22",
    x1: 390.62,
    y1: 330.72,
    y2: 488.06,
  },
];

// Mock box plot data (simulating quartiles)
const mockBoxPlotData = [
  {
    name: "Engineering",
    min: 35000,
    q1: 45000,
    median: 55000,
    q3: 65000,
    max: 75000,
    outliers: [32000, 78000],
  },
  {
    name: "Marketing",
    min: 32000,
    q1: 40000,
    median: 48000,
    q3: 58000,
    max: 68000,
    outliers: [29000, 72000],
  },
  {
    name: "Sales",
    min: 30000,
    q1: 38000,
    median: 45000,
    q3: 55000,
    max: 65000,
    outliers: [28000, 70000],
  },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

export default function VisualizationSection({
  data,
  filename,
}: VisualizationSectionProps) {
  const [selectedChart, setSelectedChart] = useState("bar");
  const [xVariable, setXVariable] = useState("");
  const [yVariable, setYVariable] = useState("");
  const [currentGalleryChart, setCurrentGalleryChart] = useState<string | null>(
    null
  );

  const handleExportChart = () => {
    toast("Chart Export", {
      description: "Chart will be exported as PNG/SVG (API integration needed)",
    });
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <BarChart
            sx={{ height: "100%", width: "100%" }}
            series={[{ data: uData, label: "uv", id: "uvId" }]}
            xAxis={[{ data: xLabels }]}
            yAxis={[{ width: 50 }]}
          />
        );
      case "line":
        return (
          <LineChart
            sx={{ height: "100%", width: "100%" }}
            series={[{ data: lineData, label: "pv" }]}
            xAxis={[{ scaleType: "point", data: lineLabels }]}
            yAxis={[{ width: 50 }]}
            margin={50}
          />
        );
      case "scatter":
        return (
          <ScatterChart
            sx={{ height: "100%", width: "100%" }}
            series={[
              {
                label: "Series A",
                data: scatterData.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
              },
              {
                label: "Series B",
                data: scatterData.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
              },
            ]}
          />
        );
      case "pie":
        return (
          <PieChart
            sx={{ height: "100%", width: "100%" }}
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}

          />
        );
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl transition-all">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Visualization</h1>
          <p className="text-muted-foreground mt-1">
            Interactive charts and plots for {filename}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportChart}>
            <Download className="w-4 h-4 mr-2" />
            Export Chart
          </Button>

          //TODO: add a save chat option to save the chart to the database
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        {/* Chart Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card className=" data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Chart Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chart Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Chart Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((chart) => {
                    const Icon = chart.icon;
                    return (
                      <Button
                        key={chart.id}
                        variant={
                          selectedChart === chart.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedChart(chart.id)}
                        className="flex flex-col gap-1 h-auto py-3"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{chart.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Variable Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  X Variable
                </label>
                <Select value={xVariable} onValueChange={setXVariable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X variable" />
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Y Variable
                </label>
                <Select value={yVariable} onValueChange={setYVariable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y variable" />
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
              </div>

              <Button className="w-full" disabled={!xVariable}>
                Generate Chart
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chart Display */}
        <div className="lg:col-span-3">
          <Card className="data-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {chartTypes.find((c) => c.id === selectedChart)?.name ||
                  "Chart"}
              </CardTitle>
              <CardDescription>
                Interactive visualization of your data
              </CardDescription>
            </CardHeader>

            <CardContent className="h-[80%]">
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {currentGalleryChart ? (
                  <div>
                    <div className="mb-4 p-2 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        Gallery Chart: {currentGalleryChart}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentGalleryChart(null)}
                        className="mt-2"
                      >
                        Back to Configuration
                      </Button>
                    </div>
                    {renderChart()}
                  </div>
                ) : (
                  renderChart()
                )}
              </ThemeProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart Gallery */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle>Chart Gallery</CardTitle>
          <CardDescription>
            Quick access to different visualization types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="relationship">Relationship</TabsTrigger>
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            <TabsContent value="distribution" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore data distributions with histograms, box plots, and
                density plots
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Histogram", "Box Plot", "Violin Plot", "Density Plot"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => {
                        if (type === "Box Plot") {
                          setSelectedChart("boxplot");
                          setCurrentGalleryChart(type);
                        } else if (type === "Histogram") {
                          setSelectedChart("bar");
                          setCurrentGalleryChart(type);
                        } else {
                          setSelectedChart("line");
                          setCurrentGalleryChart(type);
                        }
                        toast("Chart Generated", {
                          description: `${type} displayed successfully`,
                        });
                      }}
                    >
                      {type === "Box Plot" ? (
                        <Box className="w-6 h-6" />
                      ) : (
                        <BarChart3 className="w-6 h-6" />
                      )}
                      <span className="text-xs">{type}</span>
                    </Button>
                  )
                )}
              </div>
            </TabsContent>
            <TabsContent value="relationship" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Analyze relationships between variables with scatter plots and
                correlation matrices
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Scatter Plot",
                  "Correlation Matrix",
                  "Pair Plot",
                  "Heat Map",
                ].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      if (type === "Scatter Plot") {
                        setSelectedChart("scatter");
                        setCurrentGalleryChart(type);
                      } else if (type === "Correlation Matrix") {
                        setSelectedChart("line");
                        setCurrentGalleryChart(type);
                      } else {
                        setSelectedChart("bar");
                        setCurrentGalleryChart(type);
                      }
                      toast("Chart Generated", {
                        description: `${type} displayed successfully`,
                      });
                    }}
                  >
                    <ScatterIcon className="w-6 h-6" />
                    <span className="text-xs">{type}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="composition" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Show composition and parts of a whole with pie charts and
                stacked plots
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Pie Chart", "Donut Chart", "Stacked Bar", "Tree Map"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => {
                        if (type === "Pie Chart") {
                          setSelectedChart("pie");
                          setCurrentGalleryChart(type);
                        } else if (type === "Stacked Bar") {
                          setSelectedChart("bar");
                          setCurrentGalleryChart(type);
                        } else {
                          setSelectedChart("pie");
                          setCurrentGalleryChart(type);
                        }
                        toast("Chart Generated", {
                          description: `${type} displayed successfully`,
                        });
                      }}
                    >
                      <PieChartIcon className="w-6 h-6" />
                      <span className="text-xs">{type}</span>
                    </Button>
                  )
                )}
              </div>
            </TabsContent>
            <TabsContent value="comparison" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compare values across categories with bar charts and line plots
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Bar Chart", "Line Chart", "Area Chart", "Radar Chart"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => {
                        if (type === "Bar Chart") {
                          setSelectedChart("bar");
                          setCurrentGalleryChart(type);
                        } else if (type === "Line Chart") {
                          setSelectedChart("line");
                          setCurrentGalleryChart(type);
                        } else {
                          setSelectedChart("line");
                          setCurrentGalleryChart(type);
                        }
                        toast("Chart Generated", {
                          description: `${type} displayed successfully`,
                        });
                      }}
                    >
                      <LineChartIcon className="w-6 h-6" />
                      <span className="text-xs">{type}</span>
                    </Button>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
