"use client";
import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  LineChartIcon,
  Palette,
  PieChartIcon,
  ScatterChartIcon,
  Settings,
  AreaChart,
  CircleDot,
  Box,
  Radar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const uData = [45, 32, 28, 15];
const xLabels = ["Engineering", "Marketing", "Sales", "H"];
import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ThemeProvider } from "@mui/material/styles";
import useDataOverviewStore from "@/store/DataOverview";
import { Badge } from "@/components/ui/badge";
import useRawDataStore from "@/store/RawData";
import { ComboboxDemo } from "@/components/ComboBox";
import Image from "next/image";
import ApiService from "@/lib/ApiService";

const lineData = [45000, 52000, 48000, 61000, 55000, 67000];
const lineLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

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

const chartTypes = [
  { id: "bar", name: "Bar Chart", icon: BarChart3 },
  { id: "line", name: "Line Chart", icon: LineChartIcon },
  { id: "scatter", name: "Scatter Plot", icon: ScatterChartIcon },
  { id: "pie", name: "Pie Chart", icon: PieChartIcon },
];

const charts = [
  { value: "bar", label: "Bar Chart", Icon: BarChart3 },
  //{ value: "stacked_bar", label: "Stacked Bar Chart", Icon: LayoutGrid },
  { value: "line", label: "Line Chart", Icon: LineChartIcon },
  { value: "area", label: "Area Chart", Icon: AreaChart },
  { value: "scatter", label: "Scatter Plot", Icon: ScatterChartIcon },
  { value: "histogram", label: "Histogram", Icon: Box },
  { value: "boxplot", label: "Box Plot", Icon: Box },
  { value: "violin", label: "Violin Plot", Icon: CircleDot },
  { value: "pie", label: "Pie Chart", Icon: PieChartIcon },
  //{ value: "donut", label: "Donut Chart", Icon: CircleDot },
  { value: "radar", label: "Radar Chart", Icon: Radar },
];

const renderChart = ({ selectedChart }: { selectedChart: string }) => {
  const data = useRawDataStore((state) => state.data);
  switch (selectedChart) {
    case "bar":
      return (
        <BarChart
          sx={{ height: "100%", width: "100%" }}
          // dataset={data}
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
const Header = ({
  func,
}: {
  func: (xColumn: string, chartType: string, yColumn?: string[] | null) => void;
}) => {
  const [selectedChart, setSelectedChart] = useState("bar");
  const [currentGalleryChart, setCurrentGalleryChart] = useState<string | null>(
    null
  );
  const columns = useDataOverviewStore((state) => state.columnsInfo);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState<string[] | null>([]);
  const id = useId();

  return (
    <Card className="">
      <CardContent className="grid grid-cols-4 gap-4">
        <Select onValueChange={(value) => setXColumn(value)} value={xColumn}>
          <SelectTrigger className="">
            <SelectValue placeholder="X Variables" />
          </SelectTrigger>
          <SelectContent>
            {columns?.map((column) => (
              <SelectItem key={column.name} value={column.name}>
                <div className="flex items-center gap-3">
                  <span>{column.name}</span>
                  <Badge className="block" variant={"secondary"}>
                    {column.type}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ComboboxDemo selectedValues={(value) => setYColumn(value)} />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Chart
            </Button>
          </PopoverTrigger>
          <PopoverContent className="glass backdrop-blur-2xl">
            <RadioGroup
              className="grid-cols-3 transparent"
              value={selectedChart}
              onValueChange={setSelectedChart}
            >
              {charts.map((item) => (
                <div
                  key={`${id}-${item.value}`}
                  className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-3 shadow-xs outline-none"
                >
                  <div className="flex justify-between gap-2 ">
                    <RadioGroupItem
                      id={`${id}-${item.value}`}
                      value={item.value}
                      className="order-1 after:absolute after:inset-0"
                    />
                    <item.Icon
                      className="opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                  <Label htmlFor={`${id}-${item.value}`} className="text-xs">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="sm"
          onClick={() => func(xColumn, selectedChart, yColumn)}
        >
          Apply
        </Button>
      </CardContent>
    </Card>
  );
};
function VisualizePage() {
  // const [showChart, setShowChart] = useState<{
  //   xVar: number;
  //   yVar?: number;
  //   chart: string;
  // }>();
  // const data = useRawDataStore((state) => state.data); //The entire dataset
  const [chart, setChart] = useState<string | null>("bar");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState("");
  async function showChart(xVar: string, chartType: string, yVar?: string[] | null) {
    setChart(chartType);
    startTransition(() => {});
    const res=await new ApiService().get('http://localhost:8000/chart/plot-chart?x=Exam_Score&chart_type=scatter')
    console.log(res.data)
    setData(res?.data.chart)
  }
  return (
    <div className="w-full h-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Visualization</h1>
          <p className="text-muted-foreground mt-1">
            Interactive charts and plots for
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Chart
          </Button>
          {/* //TODO: add a save chat option to save the chart to the database */}
        </div>
      </header>
      <section className="h-full flex gap-4 flex-col">
        <Header func={showChart} />
        <div className="grow">
          <Card className="data-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {chartTypes.find((c) => c.id === chart)?.name || "Chart"}
              </CardTitle>
              <CardDescription>
                Interactive visualization of your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
              width={1200}
              height={600}
                className="w-full h-full object-contain rounded-2xl"
                alt="chart"
                src={data}
                // src={
                //   `data:image/png;base64,{{${data}}}`
                // }
              />
            </CardContent>
            {/* <CardContent className="h-[80%]">
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {chart ? (
                  // <div className="h-full">
                  //   <div className="mb-4 p-2 bg-muted rounded-lg">
                  //     <p className="text-sm font-medium">
                  //       Gallery Chart: {chart}
                  //     </p>
                  //     <Button
                  //       variant="outline"
                  //       size="sm"
                  //       onClick={() => setChart(null)}
                  //       className="mt-2"
                  //     >
                  //       Back to Configuration
                  //     </Button>
                  //   </div>
                  <>{renderChart({ selectedChart: chart })}</>
                ) : (
                  // </div>
                  <div className="">Set the configurations</div>
                )}
              </ThemeProvider>
            </CardContent> */}
          </Card>
        </div>
      </section>
    </div>
  );
}

export default VisualizePage;
