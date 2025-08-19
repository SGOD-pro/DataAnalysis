"use client";
import { useState, useCallback, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, AlertCircle, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSocketStore } from "@/store/Socket";
import ApiService from "@/lib/ApiService";
import useDataOverviewStore from "@/store/DataOverview";
import useRawDataStore from "@/store/RawData";
const apiService = new ApiService();

const validateFile = (file: File): boolean => {
  const validTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const validExtensions = [".csv", ".xls", ".xlsx"];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  return hasValidType || hasValidExtension;
};

async function uploadFile() {
  const res = await apiService.get<RawData>("/upload");
  if (res?.data) {
    useRawDataStore.getState().setData(res.data.data);
    useRawDataStore.getState().setFilename(res.data.filename);
  }
}
export default function Home() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {}, []);

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      toast("Invalid file type", {
        description: "Please upload a CSV or Excel file (.csv, .xls, .xlsx)",
      });
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast("File uploaded successfully!", {
        description: `${file.name} has been processed and is ready for analysis.`,
      });
    } catch (error) {
      toast('"Upload failed"', {
        description:
          "There was an error processing your file. Please try again.",
      });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        startTransition(() => {
          processFile(files[0]);
        });
      }
    },
    [processFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      startTransition(() => {
        processFile(files[0]);
      });
    }
  };
  useEffect(() => {
    uploadFile();
  }, []);
  return (
    <>
      <div className="space-y-6 z-10">
        <div className="flex items-center justify-center gap-2">
          <LineChart className="w-7 h-7 text-primary" />
          <h1 className="text-4xl font-bold gradient-text">Vizora</h1>
        </div>
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">
            Explore Your Data Like Never Before
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your CSV or Excel file to start interactive exploratory data
            analysis with zero coding required. Get insights, visualizations,
            and statistical tests instantly.
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Your Dataset
            </CardTitle>
            <CardDescription>
              Drag and drop your file here or click to browse. Supports CSV,
              XLS, and XLSX formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "upload-zone",
                isDragOver && "dragover",
                isPending && "pointer-events-none opacity-50"
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>

                {isPending ? (
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-lg font-medium">
                      Processing your file...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we analyze your data
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-lg font-medium mb-2">
                        Drop your file here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">or</p>
                    </div>

                    <Button size="lg" asChild>
                      <label className="cursor-pointer">
                        <Upload className="w-5 h-5 mr-2" />
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xls,.xlsx"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Requirements */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">File Requirements</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Supported formats: CSV, Excel (.xls, .xlsx)</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• First row should contain column headers</li>
                  <li>• Missing values are automatically detected</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
