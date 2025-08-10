import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const data = {
  rows: 1000,
  columns: 15,
  preview: [
    { id: 1, name: "John Doe", age: 28, city: "New York", salary: 75000 },
    {
      id: 2,
      name: "Jane Smith",
      age: 34,
      city: "San Francisco",
      salary: 95000,
    },
    {
      id: 3,
      name: "Bob Johnson",
      age: 42,
      city: "Chicago",
      salary: 68000,
    },
  ],
};
function RawData() {
  const filename = "Demo Data";
  return (
    <div className="mx-auto w-4xl">
      <header className="mb-6">
        <div>
          <h1 className="text-3xl font-bold">View Raw Data</h1>
          <p className="text-muted-foreground mt-1">Overview of {filename}</p>
        </div>
      </header>
      <Card className="data-card">
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>First few rows of your dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(data.preview[0] || {}).map((key) => (
                    <TableHead key={key} className="capitalize">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.preview.map((row: any, index: number) => (
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RawData;
