"use client";

import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { filterTransformations } from "@/data";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChevronRight, Eye, Save, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useFilterActions, useFilterSelector } from "@/context/FilterContext";
import { ComboboxDemo } from "./ComboBox";

const TransformationsTabInner: React.FC = () => {
  const router = useRouter();

  // subscribe only to the applied transformations slice
  const appliedTransformations = useFilterSelector(
    (s) => s.appliedTransformations
  );

  // stable actions (won't cause re-renders due to identity changes)
  const { addTransformation, saveTransformations, previewTransformations } =
    useFilterActions();
  const selecetedValues = (values: string[] | null) => {
    console.log(values);
  };
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Step 2: Transform Your Data
          </div>
          <div className="">
            <ComboboxDemo selectedValues={selecetedValues} />{" "}
            {/*  //NOTE: This component return the selected columns where the transformation will be applied} */}
          </div>
        </CardTitle>
        <CardDescription>
          Apply mathematical, statistical, and encoding transformations to
          create new features or modify existing ones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {["mathematical", "scaling", "encoding", "timeseries"].map(
            (category) => (
              <div key={category}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  {category[0].toUpperCase() + category.slice(1)}{" "}
                  Transformations
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterTransformations
                    .filter((t) => t.category === category)
                    .map((transform) => {
                      const isApplied = appliedTransformations.includes(
                        transform.id
                      );
                      return (
                        <div
                          key={transform.id}
                          className={cn(
                            "py-0",
                            isApplied
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : ""
                          )}
                        >
                          <Card>
                            <CardContent className="">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium">
                                    {transform.name}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {transform.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant={isApplied ? "default" : "outline"}
                                  onClick={() =>
                                    addTransformation(transform.id)
                                  }
                                  disabled={isApplied}
                                >
                                  {isApplied ? "Applied" : "Apply"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          )}

          {appliedTransformations.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => previewTransformations()}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
                <Button variant="outline" onClick={() => saveTransformations()}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Transformations
                </Button>
              </div>
              <Button onClick={() => router.push("/filter?tab=grouping")}>
                Next: Grouping
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(TransformationsTabInner);
