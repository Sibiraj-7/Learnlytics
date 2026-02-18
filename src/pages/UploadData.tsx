import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { useData } from "@/context/DataContext";
import { parseFile, isAcceptedFile } from "@/lib/parseUpload";

export default function UploadData() {
  const navigate = useNavigate();
  const { setUploadedData, resetToMockData, source } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ students: number; subjects: number; records: number } | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setSuccess(null);
      if (!isAcceptedFile(file)) {
        setError("Please upload a .csv, .xlsx, or .xls file.");
        return;
      }
      setLoading(true);
      try {
        const result = await parseFile(file);
        if (result.errors.length > 0 && result.students.length === 0) {
          setError(result.errors.join(" "));
          setLoading(false);
          return;
        }
        setUploadedData(result.students, result.subjects, result.markRecords);
        setSuccess({
          students: result.students.length,
          subjects: result.subjects.length,
          records: result.markRecords.length,
        });
        if (result.errors.length > 0) {
          setError(result.errors.slice(0, 3).join(" "));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to process file");
      } finally {
        setLoading(false);
      }
    },
    [setUploadedData]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const resetData = useCallback(() => {
    resetToMockData();
    setSuccess(null);
    setError(null);
  }, [resetToMockData]);

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-medium italic mb-2">Upload Data</h1>
          <p className="text-muted-foreground text-lg">
            Upload a CSV or Excel file to build the dashboard from your own student performance data.
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className={`rounded-2xl border-2 border-dashed transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border/60"
              }`}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                <div className="rounded-2xl bg-primary/10 p-5 mb-6">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-medium mb-1">Drop your file here</p>
                <p className="text-sm text-muted-foreground mb-6">
                  or click to browse — CSV, XLSX, XLS
                </p>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> CSV
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4" /> Excel
                  </span>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={onInputChange}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload file"
                />
              </CardContent>
            </Card>
          </motion.div>

          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40 p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Expected columns (any order)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Required:</strong> Student name, Roll number, Subject (code or name)</li>
              <li><strong>Marks:</strong> Internal 1, Internal 2, Assignment, Attendance (%)</li>
              <li><strong>Optional:</strong> Email, Semester, Department, Credits, Max marks</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              One row per student–subject combination. Column names are matched flexibly (e.g. &quot;Roll No&quot;, &quot;RollNo&quot;, &quot;roll_no&quot;).
            </p>
            <a
              href="/sample-data.csv"
              download="sample-data.csv"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              Download sample CSV
            </a>
          </div>

          {loading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Processing file…</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Alert className="border-success/30 bg-success/10 text-success-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Loaded {success.students} students, {success.subjects} subjects, {success.records} mark records.
                  The dashboard will now use this data.
                </AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/teacher")}
                  className="gradient-primary text-white border-0 rounded-full gap-2"
                >
                  View Teacher Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => navigate("/student")}
                  variant="outline"
                  className="rounded-full gap-2"
                >
                  View Student Dashboard
                </Button>
                <Button onClick={resetData} variant="ghost" className="rounded-full gap-2 text-muted-foreground">
                  <RotateCcw className="h-4 w-4" />
                  Reset to sample data
                </Button>
              </div>
            </motion.div>
          )}

          {source === "upload" && !success && (
            <Button onClick={resetData} variant="outline" className="rounded-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to sample data
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
