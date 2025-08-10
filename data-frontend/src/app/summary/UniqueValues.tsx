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
import { Database } from "lucide-react";

const data = [
  { column: "Parental_Involvement", unique_values: ["Low", "Medium", "High"] },
  { column: "Access_to_Resources", unique_values: ["High", "Medium", "Low"] },
  { column: "Extracurricular_Activities", unique_values: ["No", "Yes"] },
  { column: "Sleep_Hours", unique_values: [7, 8, 6, 10, 9, 5, 4] },
  { column: "Motivation_Level", unique_values: ["Low", "Medium", "High"] },
  { column: "Internet_Access", unique_values: ["Yes", "No"] },
  { column: "Tutoring_Sessions", unique_values: [0, 2, 1, 3, 4, 5, 6, 7, 8] },
  { column: "Family_Income", unique_values: ["Low", "Medium", "High"] },
  { column: "Teacher_Quality", unique_values: ["Medium", "High", "Low"] },
  { column: "School_Type", unique_values: ["Public", "Private"] },
  {
    column: "Peer_Influence",
    unique_values: ["Positive", "Negative", "Neutral"],
  },
  { column: "Physical_Activity", unique_values: [3, 4, 2, 1, 5, 0, 6] },
  { column: "Learning_Disabilities", unique_values: ["No", "Yes"] },
  {
    column: "Parental_Education_Level",
    unique_values: ["High School", "College", "Postgraduate"],
  },
  { column: "Distance_from_Home", unique_values: ["Near", "Moderate", "Far"] },
  { column: "Gender", unique_values: ["Male", "Female"] },
];

function UniqueValues() {
  return (
    <Card className="data-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Unique Values
        </CardTitle>
        <CardDescription>Summary of categorical values</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <TableHead key={key} className="capitalize">
                    {key}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((stat) => (
              <TableRow key={stat.column}>
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
    </Card>
  );
}

export default UniqueValues;
