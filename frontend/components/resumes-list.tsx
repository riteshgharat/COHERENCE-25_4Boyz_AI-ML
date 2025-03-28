import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useResumeContext } from "@/context/resume-context";

export function ResumesList() {
  const {
    selectedPosition,
    languageTools,
    ratingData,
    fetchRatingData,
    isLoading,
    error: contextError,
    setRatingData,
  } = useResumeContext();

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  // const [summary, setsummary] = useState<string | null>(null);

  // Delete a resume file
  const deleteResumeFile = async (filename: string) => {
    setDeleteLoading(filename);

    try {
      console.log("Deleting resume:", filename);
      // Make sure we're sending the correct filename format
      const filenameOnly = filename.split("/").pop();

      const response = await fetch("http://192.168.22.186:5000/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filenameOnly,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`Failed to delete resume: ${response.status}`);
      }

      // Force a refresh by setting ratingData to null first
      setRatingData(null);

      // Then fetch new data
      await fetchRatingData();
    } catch (err) {
      console.error("Error deleting resume:", err);
      setError(err instanceof Error ? err.message : "Failed to delete resume");
    } finally {
      setDeleteLoading(null);
    }
  };

  // const fsummary = async ()=>{
  //   try {
  //     const response = await fetch("http://192.168.22.186:5000/rate_resumes", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ job_requirement: "Java" }),
  //     });
  //     if (!response.ok) {
  //       throw new Error(Failed to fetch summary: ${response.status});
  //     }
  //     const data = await response.json();

  //     console.log(data.results[0]);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to fetch summary");
  //   }
  // }
  // Convert score to status
  const getStatusFromScore = (score: number): string => {
    if (score >= 8) return "Processed";
    if (score >= 5) return "Processing";
    if (score >= 2) return "Queued";
    return "Failed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Queued":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Get job position title based on selected position
  const getPositionTitle = (position: string): string => {
    switch (position) {
      case "frontend":
        return "Senior Frontend Developer";
      case "devops":
        return "DevOps Engineer";
      case "product":
        return "Product Manager";
      case "data":
        return "Data Scientist";
      case "design":
        return "UX/UI Designer";
      default:
        return "Senior Frontend Developer";
    }
  };

  // Format the resume data for display
  const formatResumes = () => {
    if (!ratingData || !ratingData.results) return [];

    return ratingData.results.map((result) => ({
      id: result.resume_id,
      name: result.filename, // Use filename for display
      filename: result.filename, // Use actual filename for deletion
      position: getPositionTitle(selectedPosition),
      date: new Date().toISOString().split("T")[0],
      status: getStatusFromScore(result.score),

      size: "1.2 MB",
      score: result.score.toFixed(2),
      summary: result.summary || "No summary available",
    }));
  };

  const generateHightlightedPDF = async (filename: string): Promise<void> => {
    try {
      setError(null); // Clear any previous errors

      // Use the correct URL - either from env or hardcoded as fallback
      const highlightUrl =
        process.env.NEXT_PUBLIC_BACKEND_HIGHLIGHT_URL ||
        "http://192.168.22.186:5000/highlight_resume";

      console.log("Generating highlighted PDF for:", filename);
      console.log("Using endpoint:", highlightUrl);

      // Use the actual filename from parameters and languageTools from context
      const response = await fetch(highlightUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: filename,
          job_description: ` ${languageTools}`, // Use the job description from context
        }),
        // Added to ensure proper error handling for CORS issues
        mode: "cors",
        credentials: "same-origin",
      });

      // Check for specific status codes for better error messages
      if (response.status === 404) {
        throw new Error(
          "API endpoint not found. Check if the backend service is running."
        );
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(
          `Bad request: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      } else if (!response.ok) {
        throw new Error(
          `Failed to generate PDF: ${response.status} ${response.statusText}`
        );
      }

      // Check content type to determine how to handle the response
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // If we get JSON back (possibly an error message)
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        // If it's a success message with a URL
        if (data.url) {
          window.open(data.url, "_blank");
          return;
        }
      }
      // Show success message
      console.log("Highlighted PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Show error to user with more detailed information
      setError(
        error instanceof Error
          ? `Failed to generate highlighted PDF: ${error.message}`
          : "Failed to generate highlighted PDF: Unknown error"
      );
    }
  };

  // Fetch data only once when component mounts
  useEffect(() => {
    fetchRatingData();
  }, []);

  const resumes = formatResumes();
  const displayError = error || contextError;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Resumes</CardTitle>
              <CardDescription>
                {ratingData
                  ? `Showing results for: ${ratingData.job_requirement}`
                  : "View and manage uploaded resumes"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRatingData}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh Ratings"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayError && (
              <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100">
                {displayError}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="rounded-lg border dark:border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                        <th className="px-4 py-3">Resume</th>
                        {/* <th className="px-4 py-3">Position</th> */}
                        <th className="px-4 py-3">Upload Date</th>

                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Actions</th>
                        <th className="px-4 py-3">Summary</th>
                        <th className="px-4 py-3">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {resumes.length > 0 ? (
                        resumes.map((resume) => (
                          <tr
                            key={resume.id}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                          >
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="font-medium">
                                  {resume.name}
                                </span>
                              </div>
                            </td>
                            {/* <td className="whitespace-nowrap px-4 py-3 text-sm">{resume.position}</td> */}
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              {new Date(resume.date).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                              {resume.score}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteResumeFile(resume.filename)
                                }
                                disabled={deleteLoading === resume.filename}
                              >
                                {deleteLoading === resume.filename ? (
                                  <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                )}
                              </Button>
                            </td>
                            <td
                              className="whitespace-nowrap px-4 py-3 text-sm text-blue-500 underline cursor-pointer"
                              onClick={() =>
                                setSelectedSummary(
                                  resume.summary || "No summary available"
                                )
                              }
                            >
                              {resume.summary
                                ? "View Summary"
                                : "No summary available"}
                            </td>
                            <td>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={async () => {
                                  await generateHightlightedPDF(
                                    resume.filename
                                  );
                                  const a = document.createElement("a");
                                  a.href = `${process.env.NEXT_PUBLIC_BACKEND_HUPLOAD_URL}/${resume.filename}`; // Use the correct URL for download
                                  a.target = "_blank"; // Open in a new tab
                                  a.download = `${process.env.NEXT_PUBLIC_BACKEND_HUPLOAD_URL}/${resume.filename}`;
                                  document.body.appendChild(a); // Required for Firefox
                                  a.click();
                                  // window.URL.revokeObjectURL(url);
                                  document.body.removeChild(a);
                                }}
                              >
                                <Download className="h-4 w-4 text-blue-500" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-sm text-gray-500"
                          >
                            No resume data available. Click "Refresh Ratings" to
                            load data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedSummary && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 m-0">
          <div className="max-h-[80vh] bg-white p-6 rounded-lg shadow-lg w-[100%] max-w-md relative overflow-y-scroll">
            <h2 className="text-lg font-semibold mb-2">Resume Summary</h2>
            <p className="text-sm text-gray-600">{selectedSummary}</p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedSummary(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
