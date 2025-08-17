import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "lucide-react";
import useDataOverviewStore from "@/store/DataOverview";
import useInView from "@/hooks/inview";

function UniqueValues() {
  const uniqueValues = useDataOverviewStore((state) => state.uniqueValues);

  const [ref, isInView]=useInView<HTMLDivElement>({ once:true,threshold:1 })
  console.log("inview", isInView)
  useEffect(() => {
    if (!isInView) {
     console.log("not inview")
    }
  }, [ref]);
  return (
    <Card className="data-card" ref={ref}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Unique Values
        </CardTitle>
        <CardDescription>Summary of categorical values</CardDescription>
      </CardHeader>
      {Array.isArray(uniqueValues) ? (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {uniqueValues[0] &&
                  Object.keys(uniqueValues[0]).map((key) => (
                    <TableHead key={key} className="capitalize">
                      {key}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueValues.map((stat,i) => (
                <TableRow key={i}>
                  {Object.values(stat).map((value) => (
                    <TableCell key={value} className="capitalize">
                      {Array.isArray(value) && typeof value[0] === "string"
                        ? value.join(", ")
                        : value ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent className="h-36">
          <p className="text-muted-foreground">No categorical variables</p>
        </CardContent>
      )}
    </Card>
  );
}

export default UniqueValues;
