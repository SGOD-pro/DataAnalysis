"use client";
import React, { useState, useTransition, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Palette, Loader2 } from "lucide-react";
import ChartConfiguration, { ChartConfig } from "./ChartConfiguration";
import ApiService from "@/lib/ApiService";

const ChartDisplay = memo(
  ({
    chartData,
    isGenerating,
    chartType,
  }: {
    chartData: string | null;
    isGenerating: boolean;
    chartType: string;
  }) => {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Generating your chart...</p>
          </div>
        </div>
      );
    }

    if (!chartData) {
      return (
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
          <div className="text-center space-y-2">
            <Palette className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-lg">Ready to Create</h3>
            <p className="text-muted-foreground">
              Configure your chart settings above and click Generate
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold capitalize">
            {chartType.replace("_", " ")} Chart
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const a = document.createElement("a");
              a.href = chartData;
              a.download = "chart.png";
              a.click();
              a.remove();
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="aspect-[15/8] bg-black rounded-lg overflow-hidden">
          <img
            src={chartData}
            alt="Generated chart"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }
);

ChartDisplay.displayName = "ChartDisplay";

function VisualizePage() {
  const [chartData, setChartData] = useState<string | null>(null);
  const [currentChartType, setCurrentChartType] = useState<string>("bar");
  const [isPending, startTransition] = useTransition();

  const handleGenerateChart = useCallback((config: ChartConfig) => {
    if (!config.x) return;

    setCurrentChartType(config.chartType);
    startTransition(() => {
      const generateChart = async () => {
        try {
          const postData = {
            x: config.x,
            y: config.y,
            chart_type: config.chartType,
            hue: config.hue || null,
            style: config.style || null,
            size: config.size || null,
            kde: config.kde,
            multiple: config.multiple || null,
            cols: config.cols,
          };

          console.log("Generating chart with config:", postData);

          const apiService = new ApiService();
          const response = await apiService.post<string>(
            "http://localhost:8000/chart/plot-chart",
            postData
          );
          console.log(response.data);
          if (response.data) {
            setChartData(response.data);
          }
        } catch (error) {
          console.error("Error generating chart:", error);
          // You could add toast notification here
        }
      };

      generateChart();
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Data Visualization</h1>
          <p className="text-muted-foreground">
            Create interactive charts and plots from your data
          </p>
        </header>

        {/* Configuration */}
        <ChartConfiguration
          onGenerate={handleGenerateChart}
          isGenerating={isPending}
        />

        {/* Chart Display */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Chart Visualization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartDisplay
              chartData={chartData}
              isGenerating={isPending}
              chartType={currentChartType}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VisualizePage;
