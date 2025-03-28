"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, Upload } from "lucide-react";
import { useEffect } from "react";
import { useResumeContext } from "@/context/resume-context";

export function ResumeUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Use the context
  const {
    selectedPosition,
    setSelectedPosition,
    languageTools,
    setLanguageTools,
    fetchRatingData, // Add this to get the function from context
  } = useResumeContext();

  useEffect(() => {
    switch (selectedPosition) {
      case "frontend":
        setLanguageTools("HTML, CSS, JavaScript, React, Angular, Vue.js");
        break;
      case "devops":
        setLanguageTools("Python, Bash, Go, Kubernetes, Git, Docker, CI/CD");
        break;
      case "product":
        setLanguageTools("Jira, Trello, Slack, Confluence, Google Analytics");
        break;
      case "data":
        setLanguageTools("Python, R, SQL, Pandas, NumPy, TensorFlow");
        break;
      case "design":
        setLanguageTools("Figma, Adobe XD, Sketch, HTML, CSS, JavaScript");
        break;
      default:
        setLanguageTools("HTML, CSS, JavaScript");
    }
  }, [selectedPosition, setLanguageTools]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();

      // Add job position and language tools to the form data
      formData.append("jobPosition", selectedPosition);
      formData.append("languageTools", languageTools);

      // Add all files to the form data
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_UPLOAD_URL as string,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // After successful upload, refresh the rating data using the context function
      await fetchRatingData();

      setUploadSuccess(true);
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload files"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Resumes</CardTitle>
          <CardDescription>
            Upload resumes for AI screening and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-position">Job Position</Label>
                // Update the Select component to use the context
                <Select
                  value={selectedPosition}
                  onValueChange={setSelectedPosition}
                >
                  <SelectTrigger id="job-position">
                    <SelectValue placeholder="Select job position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">
                      Senior Frontend Developer
                    </SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="product">Product Manager</SelectItem>
                    <SelectItem value="data">Data Scientist</SelectItem>
                    <SelectItem value="design">UX/UI Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-tools">Languages/Tools</Label>
                <Input
                  type="text"
                  placeholder="Enter Languages & Tools"
                  id="language-tools"
                  value={languageTools}
                  onChange={(e) => setLanguageTools(e.target.value)}
                />
              </div>
            </div>

            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-800"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileUp className="mb-4 h-10 w-10 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">
                Drag and drop resumes here
              </h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Supports PDF, DOCX, and TXT files up to 10MB
              </p>
              <div className="flex gap-2">
                <Input
                  id="resume-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt"
                />
                <Button asChild>
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Browse Files
                  </Label>
                </Button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <h4 className="font-medium">Selected Files ({files.length})</h4>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-900"
                    >
                      <div className="flex items-center">
                        <FileUp className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button
            disabled={files.length === 0 || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              `Upload and Process ${
                files.length > 0 ? `(${files.length})` : ""
              }`
            )}
          </Button>
        </CardFooter>

        {uploadError && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
            Files uploaded successfully!
          </div>
        )}
      </Card>
    </div>
  );
}
