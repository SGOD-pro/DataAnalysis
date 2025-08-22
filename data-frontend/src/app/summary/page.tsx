"use client";

import { useEffect, memo } from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
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

import { fetcher } from "@/lib/FetcherFunc";
import { cn } from "@/lib/utils";
import useDataOverviewStore from "@/store/DataOverview";
import DataPreprocessing from "./DataPreprocessing";
import DEscriptiveStsts from "@/app/summary/DescriptiveStats";
import UniqueValues from "./UniqueValues";

// ----------------------------
// Helpers
// ----------------------------
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

// ----------------------------
// Memoized subcomponents
// ----------------------------
const OverviewCards = memo(
  ({ summary, loading }: { summary?: DataSummary; loading: boolean }) => (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="data-card py-4 gap-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Total Rows
          </CardTitle>
        </CardHeader>
        <CardContent className="h-16 overflow-hidden">
          <div
            className={cn(
              "skeleton transition-all duration-300 ease-in-out",
              loading ? "h-full" : "h-0"
            )}
          />
          <div className="text-2xl font-bold text-primary">
            {summary?.rows?.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Data points</p>
        </CardContent>
      </Card>

      <Card className="data-card py-4 gap-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="w-4 h-4 text-accent" />
            Total Columns
          </CardTitle>
        </CardHeader>
        <CardContent className="h-16 overflow-hidden">
          <div
            className={cn(
              "skeleton skeleton transition-all duration-300 ease-in-out",
              loading ? "h-full" : "h-0"
            )}
          />
          <div className="text-2xl font-bold text-accent">
            {summary?.columns}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Features</p>
        </CardContent>
      </Card>

      <Card className="data-card py-4 gap-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Percent className="w-4 h-4 text-secondary-foreground" />
            Missing Values
          </CardTitle>
        </CardHeader>
        <CardContent className="h-16 overflow-hidden">
          <div
            className={cn(
              "skeleton skeleton transition-all duration-300 ease-in-out",
              loading ? "h-full" : "h-0"
            )}
          />
          <div className="text-2xl font-bold text-secondary-foreground">
            {summary?.missing_percentage}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Overall completeness
          </p>
        </CardContent>
      </Card>
    </div>
  )
);

const ColumnsTable = memo(
  ({
    columns,
    rows,
    loading,
  }: {
    columns?: ColumnDetails[];
    rows?: number;
    loading: boolean;
  }) => (
    <Card className="data-card">
      <CardHeader>
        <CardTitle>Column Information</CardTitle>
        <CardDescription>
          Data types, missing values, and uniqueness for each column
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          loading ? "h-46" : "h-fit"
        )}
      >
        <div
          className={cn(
            "skeleton transition-all duration-300 ease-in-out",
            loading ? "h-full" : "h-0"
          )}
        />
        {Array.isArray(columns) && columns.length > 0 ? (
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
              {columns.map((col) => {
                const completeness = (
                  (((rows || 0) - col.nulls) / (rows || 1)) *
                  100
                ).toFixed(1);
                return (
                  <TableRow key={col.name}>
                    <TableCell className="font-medium">{col.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getTypeColor(col.type)}
                      >
                        {getTypeIcon(col.type)}
                        <span className="ml-1 capitalize">{col.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{col.nulls}</TableCell>
                    <TableCell>{col.unique.toLocaleString()}</TableCell>
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
        ) : (
          !loading && (
            <div className="h-full flex items-center justify-center">
              No Data
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
);

// ----------------------------
// Main Component
// ----------------------------
export default function DataSummary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  const summaryData = useDataOverviewStore((s) => s.dataSummary);
  const setDataSummary = useDataOverviewStore((s) => s.setDataSummary);

  const {
    data: summaryResponse,
    error: summaryError,
    isLoading: loadingSummary,
  } = useSWR<ApiServicesResponse<DataSummary>>(
    summaryData ? null : "/summary", // 🚫 skip if already in store
    fetcher<ApiServicesResponse<DataSummary>>,
    {
      fallbackData: summaryData
        ? ({ data: summaryData } as ApiServicesResponse<DataSummary>)
        : undefined,
    }
  );

  // Same for columns
  const columnsInfoData = useDataOverviewStore((s) => s.columnsInfo);
  const setColumnsInfo = useDataOverviewStore((s) => s.setColumnsInfo);

  const {
    data: columnsResponse,
    error: columnsError,
    isLoading: loadingColumns,
  } = useSWR<ApiServicesResponse<ColumnDetails[]>>(
    columnsInfoData ? null : "/column-info",
    fetcher<ApiServicesResponse<ColumnDetails[]>>,
    {
      fallbackData: columnsInfoData
        ? ({ data: columnsInfoData } as ApiServicesResponse<ColumnDetails[]>)
        : undefined,
    }
  );
  useEffect(() => {
    if (columnsResponse?.data && !columnsInfoData) {
      setColumnsInfo(columnsResponse.data);
    }
    if (summaryResponse?.data && !summaryData) {
      setDataSummary(summaryResponse.data);
    }
  }, [columnsResponse, summaryResponse]);

  if (summaryError || columnsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Database className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-4xl flex justify-center pb-10">
      <div className="space-y-6 w-full">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Summary</h1>
            <p className="text-muted-foreground mt-1">Overview of</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast("Export Summary")}
            >
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

        {/* Tabs */}
        <Tabs className="w-full" defaultValue={tab ?? "overview"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Data Overview</TabsTrigger>
            <TabsTrigger value="preprocessing">Data Preprocessing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewCards summary={summaryData!} loading={loadingSummary} />

            <ColumnsTable
              columns={columnsInfoData!}
              rows={summaryData?.rows}
              loading={loadingColumns}
            />

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
