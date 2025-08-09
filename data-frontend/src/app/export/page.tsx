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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  FileText,
  Share2,
  Settings,
  Database,
  BarChart3,
  FileJson,
  Image,
  Link,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ExportSectionProps {
  data: any;
  filename: string;
}

const exportFormats = [
  {
    id: "csv",
    name: "CSV",
    description: "Comma-separated values",
    icon: FileText,
    extension: ".csv",
  },
  {
    id: "excel",
    name: "Excel",
    description: "Microsoft Excel format",
    icon: Database,
    extension: ".xlsx",
  },
  {
    id: "json",
    name: "JSON",
    description: "JavaScript Object Notation",
    icon: FileJson,
    extension: ".json",
  },
  {
    id: "pdf",
    name: "PDF Report",
    description: "Formatted report document",
    icon: FileText,
    extension: ".pdf",
  },
];

const chartFormats = [
  {
    id: "png",
    name: "PNG",
    description: "Portable Network Graphics",
    icon: Image,
  },
  {
    id: "svg",
    name: "SVG",
    description: "Scalable Vector Graphics",
    icon: Image,
  },
  {
    id: "pdf",
    name: "PDF",
    description: "Portable Document Format",
    icon: FileText,
  },
];

const reportSections = [
  {
    id: "summary",
    name: "Data Summary",
    description: "Dataset overview and statistics",
  },
  {
    id: "columns",
    name: "Column Analysis",
    description: "Detailed column information",
  },
  {
    id: "charts",
    name: "Visualizations",
    description: "Generated charts and plots",
  },
  {
    id: "statistics",
    name: "Statistical Tests",
    description: "Test results and analysis",
  },
  {
    id: "filters",
    name: "Applied Filters",
    description: "Current filter configuration",
  },
];

export default function ExportSection({ data, filename }: ExportSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "summary",
    "columns",
  ]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [chartFormat, setChartFormat] = useState("png");
  const [shareableLink, setShareableLink] = useState("");

  const handleExport = (format: string) => {
    toast("Export Started", {
      description: `Exporting data as ${format.toUpperCase()} format (API integration needed)`,
    });
  };

  const handleGenerateReport = () => {
    if (selectedSections.length === 0) {
      toast("No Sections Selected", {
        description:
          "Please select at least one section to include in the report",
      });
      return;
    }

    toast("Report Generated", {
      description: `Custom report with ${selectedSections.length} sections is being prepared`,
    });
  };

  const handleGenerateShareableLink = () => {
    const mockLink = `https:/exploradata.app/shared/${Date.now()}`;
    setShareableLink(mockLink);
    navigator.clipboard.writeText(mockLink);
    toast("Shareable Link Created", {
      description: "Link has been copied to clipboard",
    });
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export & Share</h1>
          <p className="text-muted-foreground mt-1">
            Export analysis results from {filename}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Ready to Export
        </Badge>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Export Data</TabsTrigger>
          <TabsTrigger value="report">Custom Report</TabsTrigger>
          <TabsTrigger value="charts">Export Charts</TabsTrigger>
          <TabsTrigger value="share">Share Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <Card
                  key={format.id}
                  className={`data-card cursor-pointer transition-all hover:shadow-md ${
                    selectedFormat === format.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <CardHeader className="text-center pb-2">
                    <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">{format.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {format.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(format.id);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export {format.extension}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Export Options */}
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium">Data Range</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="filtered">Filtered Data Only</SelectItem>
                    <SelectItem value="sample">Sample (1000 rows)</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Columns</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Columns</SelectItem>
                    <SelectItem value="selected">Selected Columns</SelectItem>
                    <SelectItem value="numeric">Numeric Only</SelectItem>
                    <SelectItem value="categorical">
                      Categorical Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">File Name</Label>
                <Input
                  placeholder="export_filename"
                  className="mt-2"
                  defaultValue={filename?.replace(/\.[^/.]+$/, "_export")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Configuration */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Report Sections
                </CardTitle>
                <CardDescription>
                  Select sections to include in your custom report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportSections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={section.id}
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={section.id} className="font-medium">
                        {section.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-charts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                    />
                    <Label htmlFor="include-charts" className="font-medium">
                      Include Charts & Visualizations
                    </Label>
                  </div>

                  {includeCharts && (
                    <div className="mt-3 ml-6">
                      <Label className="text-sm">Chart Format</Label>
                      <Select
                        value={chartFormat}
                        onValueChange={setChartFormat}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {chartFormats.map((format) => (
                            <SelectItem key={format.id} value={format.id}>
                              {format.name} - {format.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  Your custom report will include:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSections.map((sectionId) => {
                    const section = reportSections.find(
                      (s) => s.id === sectionId
                    );
                    return (
                      <div key={sectionId} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{section?.name}</span>
                      </div>
                    );
                  })}

                  {includeCharts && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Charts ({chartFormat.toUpperCase()})
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button onClick={handleGenerateReport} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chartFormats.map((format) => {
              const Icon = format.icon;
              return (
                <Card key={format.id} className="data-card">
                  <CardHeader className="text-center">
                    <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle>{format.name}</CardTitle>
                    <CardDescription>{format.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => handleExport(`chart-${format.id}`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as {format.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Available Charts
              </CardTitle>
              <CardDescription>
                Charts from your current analysis session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Bar Chart",
                  "Line Chart",
                  "Scatter Plot",
                  "Correlation Matrix",
                ].map((chart) => (
                  <div
                    key={chart}
                    className="p-4 border rounded-lg text-center"
                  >
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">{chart}</p>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Export
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Shareable Link
                </CardTitle>
                <CardDescription>
                  Create a link to share your analysis with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGenerateShareableLink}
                  className="w-full"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Generate Shareable Link
                </Button>

                {shareableLink && (
                  <div className="p-3 bg-muted rounded-lg">
                    <Label className="text-sm font-medium">
                      Shareable URL:
                    </Label>
                    <Input
                      value={shareableLink}
                      readOnly
                      className="mt-1 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Link expires in 30 days. Recipients can view the analysis
                      but not modify it.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader>
                <CardTitle>Sharing Options</CardTitle>
                <CardDescription>Configure what others can see</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "data",
                    label: "Raw Data",
                    description: "Include the original dataset",
                  },
                  {
                    id: "summary",
                    label: "Summary Statistics",
                    description: "Show data overview",
                  },
                  {
                    id: "charts",
                    label: "Charts & Visualizations",
                    description: "Include all charts",
                  },
                  {
                    id: "filters",
                    label: "Applied Filters",
                    description: "Show current filters",
                  },
                ].map((option) => (
                  <div key={option.id} className="flex items-start space-x-3">
                    <Checkbox id={option.id} defaultChecked />
                    <div>
                      <Label htmlFor={option.id} className="font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
