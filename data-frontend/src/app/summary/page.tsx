"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Database,
  FileText,
  Hash,
  Type,
  Calendar,
  Percent,
  Eye,
  Download,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { DataPreprocessing } from "./DataPreprocessing";

interface DataSummaryProps {
  data: any;
  filename: string;
}

const data = {
  rows: 1000,
  columns: 15,
  preview: [
    { id: 1, name: "John Doe", age: 28, city: "New York", salary: 75000 },
    {
      id: 2,
      name: "Jane Smith",
      age: 34,
      city: "San Francisco",
      salary: 95000,
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 42,
      city: "Chicago",
      salary: 68000,
    },
  ],
};
export default function DataSummary({ filename = "Demo" }: DataSummaryProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const handleExportSummary = () => {
    toast("Export Summary", {
      description:
        "Data summary will be exported as PDF (API integration needed)",
    });
  };

  const handleViewRawData = () => {
    toast('"View Raw Data"', {
      description: "Opening raw data viewer (API integration needed)",
    });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">
            Upload a file to see data summary
          </p>
        </div>
      </div>
    );
  }

  // Mock column information for demonstration
  const columnTypes = [
    { name: "id", type: "integer", nulls: 0, unique: 1000 },
    { name: "name", type: "string", nulls: 0, unique: 995 },
    { name: "age", type: "integer", nulls: 12, unique: 45 },
    { name: "city", type: "string", nulls: 5, unique: 25 },
    { name: "salary", type: "float", nulls: 8, unique: 856 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "integer":
      case "float":
        return <Hash className="w-4 h-4" />;
      case "string":
        return <Type className="w-4 h-4" />;
      case "datetime":
        return <Calendar className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "integer":
      case "float":
        return "bg-primary/10 text-primary";
      case "string":
        return "bg-secondary/10 text-secondary-foreground";
      case "datetime":
        return "bg-accent/10 text-accent-foreground";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="mx-auto w-4xl flex justify-center">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Summary</h1>
            <p className="text-muted-foreground mt-1">Overview of {filename}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportSummary}>
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewRawData}>
              <Eye className="w-4 h-4 mr-2" />
              View Raw Data
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Data Overview</TabsTrigger>
            <TabsTrigger value="preprocessing">Data Preprocessing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Dataset Overview Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="data-card">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Total Rows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {data.rows.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Data points
                  </p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="w-4 h-4 text-accent" />
                    Total Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {data.columns}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Features</p>
                </CardContent>
              </Card>

              <Card className="data-card">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4 text-secondary-foreground" />
                    Missing Values
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary-foreground">
                    2.1%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall completeness
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Column Information */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle>Column Information</CardTitle>
                <CardDescription>
                  Data types, missing values, and uniqueness for each column
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Missing Values</TableHead>
                      <TableHead>Unique Values</TableHead>
                      <TableHead>Completeness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columnTypes.map((column) => {
                      const completeness = (
                        ((data.rows - column.nulls) / data.rows) *
                        100
                      ).toFixed(1);
                      return (
                        <TableRow key={column.name}>
                          <TableCell className="font-medium">
                            {column.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getTypeColor(column.type)}
                            >
                              {getTypeIcon(column.type)}
                              <span className="ml-1 capitalize">
                                {column.type}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{column.nulls}</TableCell>
                          <TableCell>
                            {column.unique.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${completeness}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {completeness}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Data Preview */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  First few rows of your dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(data.preview[0] || {}).map((key) => (
                          <TableHead key={key} className="capitalize">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.preview.map((row: any, index: number) => (
                        <TableRow key={index}>
                          {Object.values(row).map(
                            (value: any, cellIndex: number) => (
                              <TableCell
                                key={cellIndex}
                                className="font-mono text-sm"
                              >
                                {value?.toString() || "—"}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preprocessing">
            <DataPreprocessing data={data} filename={filename} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
