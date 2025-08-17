import React from "react";
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
import { BarChart3 } from "lucide-react";
import useDataOverviewStore from "@/store/DataOverview";

function DescriptiveStats() {
  const descriptiveStats = useDataOverviewStore(
    (state) => state.descriptiveStats
  );
  return (
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
            {Array.isArray(descriptiveStats) &&
              descriptiveStats.map((stat) => (
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
      </CardContent>
    </Card>
  );
}

export default DescriptiveStats;
