import React, {
  memo,
  Suspense,
  useState,
  useTransition,
  cache,
  use,
  useEffect,
} from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { outlierMethods } from "@/data";
import useDataOverviewStore from "@/store/DataOverview";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ApiService from "@/lib/ApiService";

const apiService = new ApiService();

// Cached fetch function to prevent unnecessary re-fetches
const cachedDetectOutliers = cache(async (column: string, method: string) => {
  const res = await apiService.get<unknown[]>(
    `/preprocessing/detect-outliers?column=${encodeURIComponent(
      column
    )}&method=${encodeURIComponent(method)}`
  );
  return res;
});

// Sync component using `use` for suspenseful data loading
function ShowOutliers({ column, method }: { column: string; method: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  async function fetch() {
    console.log("fetching");
    setIsLoading(true);
    setError(false);
    const res = await cachedDetectOutliers(column, method);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    if (res.error||!res.data) {
      setError(true);
      return;
    }
    setData(res.data)
  }
  useEffect(() => {
    if (!column) return;
    fetch();
  }, [column, method]);

  if (error) {
    return (
      <div className="text-muted-foreground h-full grid place-items-center">Error fetching outliers.</div>
    );
  }
  if (isLoading) {
    return <div className="skeleton h-full w-full" />;
  }
  if (data.length === 0) {
    return <div className="text-muted-foreground">No outliers detected.</div>;
  }
  return (
    <div className="">{data.sort((a, b) => a - b).join(", ")}</div>
  )
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
}

function Outliers() {
  const columnsInfo = useDataOverviewStore((state) => state.columnsInfo);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [outlierMethod, setOutlierMethod] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleRemoveOutliers = () => {
    if (!selectedColumn || !outlierMethod) {
      toast("Missing Parameters", {
        description: "Please select both column and outlier detection method",
      });
      return;
    }

    startTransition(async () => {
      try {
        // Assuming a POST endpoint for removal; adjust based on your API
        const res = await apiService.post(
          "/preprocessing/remove-outliers?column=" +
            selectedColumn +
            "&method=" +
            outlierMethod
        );

        if (res.error) {
          throw new Error(res.error.message || "Failed to remove outliers");
        }

        toast("Outliers Removed", {
          description: `Applied ${outlierMethod} method to ${selectedColumn} column`,
        });

        // Optionally update store if needed (e.g., refresh columnsInfo)
        // useDataOverviewStore.getState().refreshData(); // If such a method exists
      } catch (error) {
        toast("Error Removing Outliers", {
          description: "Failed to remove outliers",
        });
      }
    });
  };

  return (
    <div className="">
      {/* Outlier Detection */}
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Outlier Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 items-end gap-3">
          <div>
            <Label>Select Numeric Column</Label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Choose column" />
              </SelectTrigger>
              <SelectContent>
                {columnsInfo
                  ?.filter((col) => col.type === "number")
                  .map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Detection Method</Label>
            <Select value={outlierMethod} onValueChange={setOutlierMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Choose method" />
              </SelectTrigger>
              <SelectContent>
                {outlierMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRemoveOutliers}
            disabled={isPending || !selectedColumn || !outlierMethod}
            className="w-full"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {isPending ? "Removing..." : "Remove Outliers"}
          </Button>
        </CardContent>
      </Card>

      {/* Outliers */}
      <Card className="data-card mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Outliers
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-44 h-44">
          {selectedColumn && outlierMethod ? (
            <ShowOutliers column={selectedColumn} method={outlierMethod} />
          ) : (
            <div className="text-muted-foreground">
              Select column & method first
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(Outliers);
