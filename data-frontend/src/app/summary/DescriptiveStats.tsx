import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useSWRZustand";


function DescriptiveStats() {
  const { data, error, isLoading } = useApi("stats");

  // const ref = useInViewOnce<HTMLDivElement>();
  if (error) {
    return (
      <div className="h-full w-full grid place-items-center">
        <div className="text-muted-foreground h-full grid place-items-center">
          Error fetching descriptive stats.
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "h-full w-full top-0 left-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isLoading ? "h-40" : "h-0"
        )}
      ></div>
      <div>
        {data ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variable</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Mean</TableHead>
                <TableHead>Median</TableHead>
                <TableHead>Std Dev</TableHead>
                <TableHead>Min</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q3</TableHead>
                <TableHead>Max</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) &&
                data.map((stat) => (
                  <TableRow key={stat.name}>
                    <TableCell className="font-medium">{stat.name}</TableCell>
                    <TableCell>{stat.count.toLocaleString()}</TableCell>
                    <TableCell>{stat.mean.toLocaleString()}</TableCell>
                    <TableCell>{stat.median.toLocaleString()}</TableCell>
                    <TableCell>{stat.std.toLocaleString()}</TableCell>
                    <TableCell>{stat.min.toLocaleString()}</TableCell>
                    <TableCell>{stat.q1.toLocaleString()}</TableCell>
                    <TableCell>{stat.q3.toLocaleString()}</TableCell>
                    <TableCell>{stat.max.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-36 sm:h-44 md:h-52 flex items-center justify-center">
            No Data
          </div>
        )}
      </div>
    </>
  );
}

export default memo(DescriptiveStats);
