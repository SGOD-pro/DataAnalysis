import React from 'react'
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
import {

  BarChart3,

} from "lucide-react";

const descriptiveStats = [{'variable': 'Hours_Studied',
  'count': 6607,
  'mean': 19.98,
  'median': 20.0,
  'std': 5.99,
  'min': 1,
  'max': 44,
  'q1': 16.0,
  'q3': 24.0},
 {'variable': 'Attendance',
  'count': 6607,
  'mean': 79.98,
  'median': 80.0,
  'std': 11.55,
  'min': 60,
  'max': 100,
  'q1': 70.0,
  'q3': 90.0},
 {'variable': 'Sleep_Hours',
  'count': 6607,
  'mean': 7.03,
  'median': 7.0,
  'std': 1.47,
  'min': 4,
  'max': 10,
  'q1': 6.0,
  'q3': 8.0},
 {'variable': 'Previous_Scores',
  'count': 6607,
  'mean': 75.07,
  'median': 75.0,
  'std': 14.4,
  'min': 50,
  'max': 100,
  'q1': 63.0,
  'q3': 88.0},
 {'variable': 'Tutoring_Sessions',
  'count': 6607,
  'mean': 1.49,
  'median': 1.0,
  'std': 1.23,
  'min': 0,
  'max': 8,
  'q1': 1.0,
  'q3': 2.0},
 {'variable': 'Physical_Activity',
  'count': 6607,
  'mean': 2.97,
  'median': 3.0,
  'std': 1.03,
  'min': 0,
  'max': 6,
  'q1': 2.0,
  'q3': 4.0},
 {'variable': 'Exam_Score',
  'count': 6607,
  'mean': 67.24,
  'median': 67.0,
  'std': 3.89,
  'min': 55,
  'max': 101,
  'q1': 65.0,
  'q3': 69.0}];

function DescriptiveStats() {
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
                  {descriptiveStats.map((stat) => (
                    <TableRow key={stat.variable}>
                      <TableCell className="font-medium">
                        {stat.variable}
                      </TableCell>
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
  )
}

export default DescriptiveStats
