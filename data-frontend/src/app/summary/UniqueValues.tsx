import React, { memo, useCallback, useTransition } from "react";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDataOverviewStore from "@/store/DataOverview";
import useInView from "@/hooks/inview";
import ApiService from "@/lib/ApiService";
import { cn } from "@/lib/utils";
const apiService = new ApiService();

function UniqueValues() {
  const uniqueValues = useDataOverviewStore((state) => state.uniqueValues);
  const setUniqueValues = useDataOverviewStore(
    (state) => state.setUniqueValues
  );

  const [isPending, startTransition] = useTransition();

  const fetchUniqueValues = useCallback(() => {
    startTransition(() => {
      if (!uniqueValues) {
        apiService.get<UniqueValues[]>("/unique-values").then((res) => {
          if (res?.data) setUniqueValues(res.data);
        });
      }
    });
  }, [uniqueValues, setUniqueValues]);
  const ref = useInView<HTMLDivElement>(fetchUniqueValues);

  return (
    <div ref={ref}>
      <div
        className={cn(
          "h-full w-full top-0 left-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isPending ? "h-40" : "h-0"
        )}
      >
        <div className="skeleton h-full w-full" />
      </div>
      {Array.isArray(uniqueValues) ? (
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
            {uniqueValues.map((stat, i) => (
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
      ) : (
        <CardContent className="h-36">
          <p className="text-muted-foreground">No categorical variables</p>
        </CardContent>
      )}
    </div>
  );
}

export default memo(UniqueValues);
