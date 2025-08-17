"use client"
import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Upload, Link } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const data = [
  {
    Id: 1,
    Name: "John Doe",
    Age: 28,
    Department: "Engineering",
    City: "San Francisco",
    Experience: 4,
    Salary: 65000,
  },
  {
    Id: 2,
    Name: "Jane Smith",
    Age: 32,
    Department: "Engineering",
    City: "New York",
    Experience: 7,
    Salary: 75000,
  },
  {
    Id: 3,
    Name: "Mike Johnson",
    Age: 29,
    Department: "Engineering",
    City: "Seattle",
    Experience: 5,
    Salary: 68000,
  },
  {
    Id: 4,
    Name: "Sarah Wilson",
    Age: 31,
    Department: "Engineering",
    City: "Boston",
    Experience: 6,
    Salary: 72000,
  },
  {
    Id: 5,
    Name: "Tom Brown",
    Age: 27,
    Department: "Engineering",
    City: "Chicago",
    Experience: 3,
    Salary: 63000,
  },
  {
    Id: 6,
    Name: "Anna Lee",
    Age: 35,
    Department: "Marketing",
    City: "New York",
    Experience: 8,
    Salary: 82000,
  },
  {
    Id: 7,
    Name: "Chris Green",
    Age: 30,
    Department: "Marketing",
    City: "Chicago",
    Experience: 5,
    Salary: 71000,
  },
  {
    Id: 8,
    Name: "Jessica Kim",
    Age: 26,
    Department: "Sales",
    City: "San Francisco",
    Experience: 2,
    Salary: 59000,
  },
  {
    Id: 9,
    Name: "Daniel Park",
    Age: 33,
    Department: "Sales",
    City: "Seattle",
    Experience: 6,
    Salary: 74000,
  },
  {
    Id: 10,
    Name: "Laura Chen",
    Age: 29,
    Department: "Sales",
    City: "Boston",
    Experience: 4,
    Salary: 68000,
  },
  {
    Id: 11,
    Name: "Olivia White",
    Age: 28,
    Department: "HR",
    City: "New York",
    Experience: 3,
    Salary: 60000,
  },
  {
    Id: 12,
    Name: "Noah Patel",
    Age: 31,
    Department: "HR",
    City: "San Francisco",
    Experience: 6,
    Salary: 70000,
  },
  {
    Id: 13,
    Name: "Liam Martin",
    Age: 34,
    Department: "Finance",
    City: "Chicago",
    Experience: 9,
    Salary: 90000,
  },
  {
    Id: 14,
    Name: "Emma Davis",
    Age: 27,
    Department: "Finance",
    City: "New York",
    Experience: 2,
    Salary: 62000,
  },
  {
    Id: 15,
    Name: "Lucas Brown",
    Age: 36,
    Department: "Engineering",
    City: "Seattle",
    Experience: 10,
    Salary: 98000,
  },
  {
    Id: 16,
    Name: "Amelia Scott",
    Age: 29,
    Department: "Marketing",
    City: "Boston",
    Experience: 4,
    Salary: 69000,
  },
  {
    Id: 17,
    Name: "Ethan Turner",
    Age: 28,
    Department: "Product",
    City: "San Francisco",
    Experience: 3,
    Salary: 65000,
  },
  {
    Id: 18,
    Name: "Ava Wilson",
    Age: 32,
    Department: "Product",
    City: "Chicago",
    Experience: 6,
    Salary: 76000,
  },
  {
    Id: 19,
    Name: "Mason Clark",
    Age: 30,
    Department: "Support",
    City: "New York",
    Experience: 5,
    Salary: 64000,
  },
  {
    Id: 20,
    Name: "Sophia Lewis",
    Age: 26,
    Department: "Support",
    City: "Boston",
    Experience: 1,
    Salary: 54000,
  },
  {
    Id: 21,
    Name: "Isabella Hall",
    Age: 31,
    Department: "Engineering",
    City: "New York",
    Experience: 7,
    Salary: 75000,
  },
  {
    Id: 22,
    Name: "James King",
    Age: 33,
    Department: "Marketing",
    City: "Seattle",
    Experience: 6,
    Salary: 73000,
  },
  {
    Id: 23,
    Name: "Benjamin Young",
    Age: 29,
    Department: "Finance",
    City: "Chicago",
    Experience: 5,
    Salary: 70000,
  },
  {
    Id: 24,
    Name: "Mia Adams",
    Age: 27,
    Department: "Sales",
    City: "San Francisco",
    Experience: 3,
    Salary: 61000,
  },
  {
    Id: 25,
    Name: "Charlotte Baker",
    Age: 34,
    Department: "HR",
    City: "Boston",
    Experience: 9,
    Salary: 88000,
  },
];

function QuickOverView() {
  const filename = "Demo Data";
  const router = useRouter();

  return (
    <div className="mx-auto w-4xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quick overview</h1>
          <p className="text-muted-foreground mt-1">Overview of {filename}</p>
        </div>
        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" asChild className="glass">
                <div>
                  <Upload className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xls,.xlsx"
                  />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Re-upload</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                asChild
                className="glass  text-white"
                onClick={() => router.push("/summary")}
              >
                <div>
                  <Link className="w-4 h-4" />
                  Summary
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Go-to Summary</p>
            </TooltipContent>
          </Tooltip>
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
                  {Object.keys(data[0]).map((key) => (
                    <TableHead key={key} className="capitalize">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex} className="font-mono text-sm">
                        <p className=" line-clamp-4 max-w-32">
                          {value?.toString() || "—"}
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={Object.keys(data[0] || {}).length}
                    align="center"
                  >
                    <div className="tracking-widest leading-tight">
                      <p>... ...</p>
                      <p>... ...</p>
                    </div>
                  </TableCell>
                </TableRow>
                {data.slice(data.length - 10).map((row: any, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value: any, cellIndex: number) => (
                      <TableCell key={cellIndex} className="font-mono text-sm">
                        <p className=" line-clamp-4 max-w-32">
                          {value?.toString() || "—"}
                        </p>
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

export default QuickOverView;
