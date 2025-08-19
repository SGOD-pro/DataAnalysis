import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

import useRawDataStore from "@/store/RawData";
import useDataOverviewStore from "@/store/DataOverview";
import MissingValues from "./MissingValues";
import Outliers from "./Outliers";
import ApiService from "@/lib/ApiService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHistoryStore } from "@/store/History";
const apiService = new ApiService();
type MissingStatsProps = {
  variant: "total" | "percentage";
};
type PreprocessingOperation = {
  id: number;
  type: string;
  column: string;
  method: string;
  timestamp: string;
};

type OperationsProps = {
  variant: "count" | "list";
};
const MissingStats = memo(({ variant }: MissingStatsProps) => {
  const columnsInfo = useDataOverviewStore((state) => state.columnsInfo);
  const dataSummary = useDataOverviewStore((state) => state.dataSummary);

  const { totalMissingValues, missingValuePercentage } = useMemo(() => {
    const totalMissingValues =
      columnsInfo?.reduce((sum, col) => sum + col.nulls, 0) || 0;

    const rows = dataSummary?.rows || 0;
    const missingValuePercentage =
      rows > 0 ? ((1 - totalMissingValues / rows) * 100).toFixed(2) : "0.00";

    return { totalMissingValues, missingValuePercentage };
  }, [columnsInfo, dataSummary]);
  // console.log(missingValuePercentage);
  if (variant === "total") {
    return (
      <div className="text-2xl font-bold text-amber-500">
        {totalMissingValues}
      </div>
    );
  }

  return (
    <div className="text-2xl font-bold text-green-500">
      {missingValuePercentage}%
    </div>
  );
});

const Operations = memo(({ variant }: OperationsProps) => {
  const history = useHistoryStore((state) => state.history);

  // const handleUndoOperation = useCallback(
  //   (operationId: number) => {
  //     setPreprocessingHistory((prev) =>
  //       prev.filter((op) => op.id !== operationId)
  //     );
  //     toast("Operation Undone", {
  //       description: "Preprocessing step has been reverted",
  //     });
  //   },
  //   [setPreprocessingHistory]
  // );

  if (variant === "count") {
    return (
      <div className="text-2xl font-bold text-blue-500">{history.length}</div>
    );
  }

  return history.length === 0 ? (
    <div className="text-center py-8">
      <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Operations Yet</h3>
      <p className="text-muted-foreground">
        Apply preprocessing operations to see them here
      </p>
    </div>
  ) : (
    <div className="space-y-3">
      {history.map((operation) => (
        <div
          key={operation.id}
          className="flex items-center justify-between p-3 border rounded"
        >
          <div>
            <div className="font-medium capitalize">
              {operation.operation}: {operation.column}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Undo")}
          >
            Undo
          </Button>
        </div>
      ))}
    </div>
  );
});

const Duplicates = () => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    startTransition(async () => {
      const res = await apiService.get<any[]>("/preprocessing/duplicates");
      if (res.data) {
        setData(res.data);
      }
    });
  }, []);
  if (data.length == 0)
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Duplicates Found</h3>
        <p className="text-muted-foreground">
          Your dataset appears to be clean of duplicate records
        </p>
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.keys(data[0] || {}).map((key) => (
            <TableHead key={key} className="capitalize">
              {key}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: any, index: number) => (
          <TableRow key={index}>
            {Object.values(row).map((value: any, cellIndex: number) => (
              <TableCell key={cellIndex} className="font-mono text-sm">
                {value?.toString() || "—"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
function DataPreprocessing() {
  const filename = useRawDataStore((state) => state.filename);

  const handleExportPreprocessed = () => {
    toast("Export Preprocessed Data", {
      description:
        "Preprocessed dataset will be exported (API integration needed)",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mt-1">
            Clean and prepare data from {filename}
          </p>
        </div>
      </div>
      {/* Data Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="data-card py-4 gap-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Missing Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MissingStats variant="total" />
            <p className="text-xs text-muted-foreground mt-1">
              Total null values
            </p>
          </CardContent>
        </Card>
        <Card className="data-card py-4 gap-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MissingStats variant="percentage" />
            <p className="text-xs text-muted-foreground mt-1">
              Data completeness
            </p>
          </CardContent>
        </Card>

        <Card className="data-card py-4 gap-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Operations variant="count" />
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
            <MissingValues />
          </div>
        </TabsContent>

        <TabsContent value="outliers" className="space-y-6">
          <Outliers />
        </TabsContent>

        {/* /NOTE: Duplicates Filtering
                  Remove exact duplicates
                  df.drop_duplicates()
                  Subset duplicates
                  df.drop_duplicates(subset=["col1", "col2"]) */}

        <TabsContent value="duplicates" className="space-y-6">
          <Card className="data-card">
            <CardHeader className="relative">
              <CardTitle>Duplicate Detection</CardTitle>
              <CardDescription>
                Identify and remove duplicate rows
              </CardDescription>
              <Button
                onClick={() => {
                  alert("Remove Duplicates");
                }}
                className="right-6 top-0 absolute bg-[var(--warning)]"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Remove Duplicates
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Duplicates />
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
              <Operations variant="list" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="float-end">
        <Button size="sm" onClick={handleExportPreprocessed}>
          <Download className="w-4 h-4 mr-2" />
          Export Preprocessed
        </Button>
      </div>
    </div>
  );
}
export default DataPreprocessing;
