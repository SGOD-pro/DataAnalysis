import React, { memo, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wrench, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDataOverviewStore from "@/store/DataOverview";
import { fillMethods } from "@/data";
import { toast } from "sonner";
import ApiService from "@/lib/ApiService";
const apiService = new ApiService();
const FillSection = () => {
  const columnsInfo = useDataOverviewStore((state) => state.columnsInfo);
  const setColumnsInfo = useDataOverviewStore((state) => state.setColumnsInfo);

  const [fillMethod, setFillMethod] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [loading, setLoading] = useState(false);  
  const handleFillNulls = async () => {
    setLoading(true);
    if (!selectedColumn || !fillMethod) {
      toast("Missing Parameters", {
        description: "Please select both column and fill method",
      });
      return;
    }
    if (!columnsInfo) {
      toast("Missing Column info", {
        description: "Please re-upload the file",
      });
      return;
    }
    const res = await apiService.post(
      `/preprocessing/fill-nulls?column=${selectedColumn}&method=${fillMethod}`,
      // '/preprocessing/fill-nulls?method=mode&column=Distance_from_Home',
      null
    );
    setLoading(false);
    if (res.error) {  
      return;
    }
    const updatedColumnsInfo = columnsInfo.map((col) => {
      if (col.name === selectedColumn) {
        return { ...col, nulls: 0 };
      }
      return col;
    });
    setColumnsInfo(updatedColumnsInfo);
    setSelectedColumn("");
    setSelectedColumn("");
    // setPreprocessingHistory([...preprocessingHistory, operation]);
    // toast("Null Values Filled", {
    //   description: `Applied ${fillMethod} method to ${selectedColumn} column`,
    // });
  };
  const selectedColumnInfo = columnsInfo?.find(
    (col) => col.name === selectedColumn
  );

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Fill Missing Values
          </CardTitle>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"} size={"sm"}>
                <AlertTriangle className="w-4 h-4" />
                Drop
              </Button>
            </DialogTrigger>
            <DialogContent className="glass backdrop-blur">
              <DialogHeader>
                <DialogTitle className="mb-6">
                  Are you absolutely sure?
                </DialogTitle>
                <div className="grid grid-cols-3 items-center gap-y-3">
                  <Label>By row</Label>
                  <Input
                    placeholder="No of nulls present in row"
                    value={customValue}
                    type="number"
                    onChange={(e) => setCustomValue(e.target.value)}
                    max={10}
                    className="col-span-2"
                  />
                  <Label>By column</Label>
                  <Select value={fillMethod} onValueChange={setFillMethod}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Choose Column" />
                    </SelectTrigger>
                    <SelectContent>
                      {columnsInfo?.map((method, i) => (
                        <SelectItem key={i} value={method.name}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>

              <DialogFooter className="sm:justify-start">
                <Button type="button">Apply</Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardContent className="space-y-4 px-0">
          <div>
            <Label>Select Column</Label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Choose column" />
              </SelectTrigger>
              <SelectContent>
                {columnsInfo
                  ?.filter((col) => col.nulls > 0)
                  .map((col) => (
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

          {selectedColumnInfo && (
            <div>
              <Label>Fill Method</Label>
              <Select value={fillMethod} onValueChange={setFillMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose method" />
                </SelectTrigger>
                <SelectContent>
                  {fillMethods[
                    selectedColumnInfo.type as keyof typeof fillMethods
                  ]?.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {fillMethod === "custom" && (
            <div>
              <Label>Custom Value</Label>
              <Input
                placeholder="Enter custom value"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleFillNulls} className="w-full" disabled={!fillMethod||loading}>
            {loading?<Loader2 className="w-4 h-4 mr-2 animate-spin" />:<CheckCircle className="w-4 h-4 mr-2" />}
            Apply Fill Method
          </Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
function MissingValues() {
  const columnsInfo = useDataOverviewStore((state) => state.columnsInfo);
  const dataSummary = useDataOverviewStore((state) => state.dataSummary);
  const getRows = useMemo(() => {
    return dataSummary?.rows || 0;
  }, [dataSummary]);

  return (
    <>
      <Card className="data-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Missing Values by Column
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Missing</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnsInfo
                ?.filter((col) => col.nulls > 0)
                .map((col) => (
                  <TableRow key={col.name}>
                    <TableCell className="font-medium">{col.name}</TableCell>
                    <TableCell>{col.nulls}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          col.nulls / getRows > 100
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {((col.nulls / getRows) * 100).toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BUG: Drop by row: input number < no of colulmns
            Drop by column: input column name
            */}

      {/* Fill Missing Values */}
      <FillSection />
    </>
  );
}

export default memo(MissingValues);
