"use client";

import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useFilterContext } from "@/context/FilterContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Download, Search, TableIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
const PreviewTabInner: React.FC = () => {
  const { state, clearFilters } = useFilterContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="w-5 h-5" />
          Step 4: Final Data Preview
        </CardTitle>
        <CardDescription>
          View your processed data after all filters, transformations, and
          grouping have been applied.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
            <h4 className="w-full font-medium mb-2">Applied Operations:</h4>
            {state.filters
              .filter((f) => f.applied)
              .map((filter, index) => (
                <Badge key={filter.id} variant="secondary">
                  Filter {index + 1}: {filter.column} {filter.operator}
                </Badge>
              ))}
            {state.appliedTransformations.map((transform) => (
              <Badge key={transform} variant="outline">
                {transform}
              </Badge>
            ))}
            {state.appliedGrouping && (
              <Badge variant="default">
                Grouped by: {state.selectedGrouping.join(" → ")}
              </Badge>
            )}
            {state.filters.filter((f) => f.applied).length === 0 &&
              state.appliedTransformations.length === 0 &&
              !state.appliedGrouping && (
                <span className="text-sm text-muted-foreground">
                  No operations applied yet
                </span>
              )}
          </div>

          {state.filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TableIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">No data to display</h3>
              <p className="text-sm">
                Apply some filters or transformations to see results
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Showing {state.filteredData.length} rows from{" "}
                    {state.originalRows.toLocaleString()} original
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(
                      (state.filteredData.length / state.originalRows) *
                      100
                    ).toFixed(1)}
                    % of original dataset
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Search & Filter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast("Export CSV")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Experience</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.filteredData.map((row, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>${row.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.department}</Badge>
                        </TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.experience} years</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page 1 of 1 • {state.filteredData.length} total rows
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default memo(PreviewTabInner);
