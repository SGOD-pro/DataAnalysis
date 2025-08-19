"use client";
import { useEffect, useState, useTransition } from "react";
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
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import DataPreprocessing from "./DataPreprocessing";
import DEscriptiveStsts from "@/app/summary/DescriptiveStats";
import { useRouter, useSearchParams } from "next/navigation";
import UniqueValues from "./UniqueValues";
import useDataOverviewStore from "@/store/DataOverview";
import ApiService from "@/lib/ApiService";
import { cn } from "@/lib/utils";
const apiService = new ApiService();

export default function DataSummary() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();

  const handleExportSummary = () => {
    toast("Export Summary", {
      description:
        "Data summary will be exported as PDF (API integration needed)",
    });
  };

  // if (!data) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
  //         <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
  //         <p className="text-muted-foreground">
  //           Upload a file to see data summary
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // Mock column information for demonstration

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "number":
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
      case "number":
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
  const dataSummary = useDataOverviewStore((state) => state.dataSummary);
  const setDataSummary = useDataOverviewStore((state) => state.setDataSummary);

  const columnsInfo = useDataOverviewStore((state) => state.columnsInfo);
  const setColumnsInfo = useDataOverviewStore((state) => state.setColumnsInfo);

  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!dataSummary || !columnsInfo) {
      startTransition(() => {
        const fetchData = async () => {
          try {
            setLoading(true);

            if (!dataSummary) {
              const summaryRes = await apiService.get<DataSummary>("/summary");
              if (summaryRes?.data) setDataSummary(summaryRes.data);
            }

            if (!columnsInfo) {
              const columnsRes = await apiService.get<ColumnDetails[]>(
                "/column-info"
              );
              if (columnsRes?.data) setColumnsInfo(columnsRes.data);
            }
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      });
    }
  }, [dataSummary, columnsInfo]);
  return (
    <div className="mx-auto w-4xl flex justify-center pb-10">
      <div className="space-y-6 w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Summary</h1>
            <p className="text-muted-foreground mt-1">Overview of </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportSummary}>
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/raw-data")}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Raw Data
            </Button>
          </div>
        </header>

        <Tabs className="w-full" defaultValue={tab ?? "overview"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Data Overview</TabsTrigger>
            <TabsTrigger value="preprocessing">Data Preprocessing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Dataset Overview Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="data-card py-4 gap-0">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Total Rows
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative overflow-hidden h-16">
                  <div
                    className={cn(
                      "h-full w-full top-0 left-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      isPending && loading ? "h-full" : "h-0"
                    )}
                  >
                    <div className="skeleton h-full w-full" />
                  </div>

                  <>
                    <div className="text-2xl font-bold text-primary">
                      {dataSummary?.rows.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Data points
                    </p>
                  </>
                </CardContent>
              </Card>

              <Card className="data-card py-4 gap-0">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="w-4 h-4 text-accent" />
                    Total Columns
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative overflow-hidden h-16">
                  <div
                    className={cn(
                      "h-full w-full top-0 left-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      isPending && loading ? "h-full" : "h-0"
                    )}
                  >
                    <div className="skeleton h-full w-full" />
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    {dataSummary?.columns}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Features</p>
                </CardContent>
              </Card>

              <Card className="data-card py-4 gap-0">
                <CardHeader className="">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4 text-secondary-foreground" />
                    Missing Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative overflow-hidden h-16">
                  <div
                    className={cn(
                      "h-full w-full top-0 left-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      isPending && loading ? "h-full" : "h-0"
                    )}
                  >
                    <div className="skeleton h-full w-full" />
                  </div>
                  <div className="text-2xl font-bold text-secondary-foreground">
                    {dataSummary?.missing_percentage}%
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
              {columnsInfo ? (
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
                      {Array.isArray(columnsInfo) &&
                        columnsInfo.map((column) => {
                          const completeness = (
                            ((dataSummary?.rows || 0 - column.nulls) /
                              (dataSummary?.rows || 1)) *
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
              ) : (
                <div className="h-36 sm:h-44 md:h-52 flex items-center justify-center">
                  No Data
                </div>
              )}
            </Card>
            {/* DEecriptiveStats Information */}
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
                <DEscriptiveStsts />
              </CardContent>
            </Card>
            {/* Unique Values */}
            <Card className="data-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Unique Values
                </CardTitle>
                <CardDescription>Summary of categorical values</CardDescription>
              </CardHeader>
              <CardContent>
                <UniqueValues />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preprocessing">
            <DataPreprocessing />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
