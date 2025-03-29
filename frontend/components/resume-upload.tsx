"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Upload } from "lucide-react";
import { useResumeContext } from "@/context/resume-context";
import { keywords } from "../llm/gemini.js";

export function ResumeUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const { fetchRatingData, saveJobDescription } = useResumeContext();

  // Load job description from localStorage on component mount
  useEffect(() => {
    const savedJobDescription = localStorage.getItem('jobDescription');
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
    }
  }, []);

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
      // Extract keywords from job description
      const extractedKeywords = await keywords(jobDescription); // Call LLM
      console.log("Extracted Keywords:", extractedKeywords);
  
      // Convert array to comma-separated string
      const formattedDescription = extractedKeywords.join(" , "); 
      
      // Save the formatted description to localStorage and context
      saveJobDescription(formattedDescription);
  
      console.log("Formatted Job Description:", formattedDescription);

      const formData = new FormData();
      formData.append("job_requirement", formattedDescription);
  
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
            {/* Job Description Input */}
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Enter job description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
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
          <Button variant="outline" onClick={() => {
            setFiles([]);
            setUploadError("");
            setUploadSuccess(false);
          }}>
            Cancel
          </Button>
          <Button
            disabled={files.length === 0 || isUploading || !jobDescription.trim()}
            onClick={handleUpload}
          >
            {isUploading ? "Uploading..." : `Upload and Process (${files.length})`}
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