"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Star,
  Users,
  Mail,
} from "lucide-react";
import { useResumeContext } from "../context/resume-context";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define candidate interface to fix "never" type errors
interface Candidate {
  filename: string;
  resume_id: string;
  score: number;
  summary?: string;
}

// Define score distribution interface
interface ScoreDistribution {
  high: number;
  medium: number;
  low: number;
}

export function DashboardOverview() {
  const {
    selectedPosition,
    setSelectedPosition,
    ratingData,
    fetchRatingData,
    isLoading,
  } = useResumeContext();
  const [sortedCandidates, setSortedCandidates] = useState<Candidate[]>([]);
  const [viewMode, setViewMode] = useState("summary");
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution>(
    { high: 0, medium: 0, low: 0 }
  );

  useEffect(() => {
    // Check if ratingData.results exists and is an array
    if (ratingData && ratingData.results && Array.isArray(ratingData.results)) {
      // Sort by score in descending order
      const sorted = [...ratingData.results].sort((a, b) => b.score - a.score);
      setSortedCandidates(sorted);

      // Calculate score distribution
      const high = sorted.filter((c) => c.score > 7).length;
      const medium = sorted.filter((c) => c.score > 3 && c.score <= 7).length;
      const low = sorted.filter((c) => c.score <= 3).length;
      setScoreDistribution({ high, medium, low });
    } else {
      setSortedCandidates([]);
      setScoreDistribution({ high: 0, medium: 0, low: 0 });
    }
  }, [ratingData]);

  // Calculate total resumes
  const totalResumes = ratingData?.results?.length || 0;

  // Calculate percentages for the chart
  const highPercent =
    Math.round((scoreDistribution.high / totalResumes) * 100) || 0;
  const mediumPercent =
    Math.round((scoreDistribution.medium / totalResumes) * 100) || 0;
  const lowPercent =
    Math.round((scoreDistribution.low / totalResumes) * 100) || 0;

  // Get initials from name
  const getInitials = (name: string): string => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score > 7) return "bg-green-500";
    if (score > 3) return "bg-amber-500";
    return "bg-red-500";
  };

  // Format a resume name for display
  const formatResumeName = (filename: string): string => {
    if (!filename) return "Unknown";
    return filename
      .replace(/\.pdf$|\.docx$|\.doc$|\.txt$/i, "")
      .replace(/_/g, " ")
      .replace(/-/g, " ");
  };

  // Truncate text
  const truncateText = (text: string | undefined, length = 100): string => {
    if (!text) return "No summary available";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const sendEmail = async (candidate: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_EMAIL_URL as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_receiver: "pdmamba08@gmail.com",
            subject: `Congratulations! Job Offer - Software Engineer`,
            body: `Dear ${candidate.filename.split(".")[0]},
We are delighted to offer you the position of Software Engineer at Minute Resume.\n\n Congratulations!\n
We were very impressed with your qualifications and experience, and we believe you will be a valuable asset to our team.\n\n
We will be sending you a formal offer letter along url just confirm it.
We look forward to welcoming you to Minute Resume.

${process.env.NEXT_PUBLIC_FORM_URL}?fname=${
              candidate.filename.split(".")[0]
            }&lname=${
              candidate.filename.split(".")[0]
            }&dob=12-08-2005&email=example@gmail.com&phone=1234567890&jobRole=Software+Engineer&venue=Mumbai&meetingLink=https://meet.google.com \n\n
Sincerely,
The Minute Resume, HR Team`,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      const data = await response.json();
      console.log("Email sent successfully:", data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResumes}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isLoading ? "Updating..." : "Ready for review"}
            </p>
          </CardContent>
          {isLoading && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-1">
              <Progress value={45} className="h-1" />
            </div>
          )}
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Match</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoreDistribution.high}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {highPercent}% of candidates
            </p>
          </CardContent>
          {scoreDistribution.high > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-1">
              <Progress
                value={highPercent}
                className="h-1 bg-green-100 dark:bg-green-900"
              >
                <div className="bg-green-500 h-full" />
              </Progress>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Match</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoreDistribution.medium}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mediumPercent}% of candidates
            </p>
          </CardContent>
          {scoreDistribution.medium > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-1">
              <Progress
                value={mediumPercent}
                className="h-1 bg-amber-100 dark:bg-amber-900"
              >
                <div className="bg-amber-500 h-full" />
              </Progress>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Match</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scoreDistribution.low}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lowPercent}% of candidates
            </p>
          </CardContent>
          {scoreDistribution.low > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-1">
              <Progress
                value={lowPercent}
                className="h-1 bg-red-100 dark:bg-red-900"
              >
                <div className="bg-red-500 h-full" />
              </Progress>
            </div>
          )}
        </Card>
      </div>

      {/* Charts and Candidates */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resume Analysis</CardTitle>
                <CardDescription>Candidate match distribution</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => fetchRatingData(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        <BarChart className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            {totalResumes > 0 ? (
              <div className="space-y-6">
                {/* Score distribution visual */}
                <div className="flex items-center space-x-2">
                  <div
                    className="bg-green-500 h-3 rounded-l-full"
                    style={{ width: `${Math.max(highPercent, 5)}%` }}
                  ></div>
                  <div
                    className="bg-amber-500 h-3"
                    style={{ width: `${Math.max(mediumPercent, 5)}%` }}
                  ></div>
                  <div
                    className="bg-red-500 h-3 rounded-r-full"
                    style={{ width: `${Math.max(lowPercent, 5)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {highPercent}%
                    </div>
                    <div className="text-xs text-gray-500">High Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {mediumPercent}%
                    </div>
                    <div className="text-xs text-gray-500">Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {lowPercent}%
                    </div>
                    <div className="text-xs text-gray-500">Low Match</div>
                  </div>
                </div>

                {/* Donut chart */}
                <div className="flex justify-center py-4">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalResumes}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </div>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 240 240"
                      className="h-full w-full -rotate-90"
                    >
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="20"
                      />

                      {/* High score segment */}
                      {highPercent > 0 && (
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#10b981" /* green */
                          strokeWidth="20"
                          strokeDasharray={`${highPercent * 6.28} ${
                            (100 - highPercent) * 6.28
                          }`}
                          strokeDashoffset="0"
                        />
                      )}

                      {/* Medium score segment */}
                      {mediumPercent > 0 && (
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#f59e0b" /* amber */
                          strokeWidth="20"
                          strokeDasharray={`${mediumPercent * 6.28} ${
                            (100 - mediumPercent) * 6.28
                          }`}
                          strokeDashoffset={`-${highPercent * 6.28}`}
                        />
                      )}

                      {/* Low score segment */}
                      {lowPercent > 0 && (
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#ef4444" /* red */
                          strokeWidth="20"
                          strokeDasharray={`${lowPercent * 6.28} ${
                            (100 - lowPercent) * 6.28
                          }`}
                          strokeDashoffset={`-${
                            (highPercent + mediumPercent) * 6.28
                          }`}
                        />
                      )}
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex items-center text-sm">
                    <span className="mr-2 h-3 w-3 rounded-full bg-green-500"></span>
                    <span className="flex-1">High match (score &gt; 7)</span>
                    <span className="font-medium">
                      {scoreDistribution.high}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2 h-3 w-3 rounded-full bg-amber-500"></span>
                    <span className="flex-1">Average match (score 3-7)</span>
                    <span className="font-medium">
                      {scoreDistribution.medium}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2 h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="flex-1">Low match (score &lt; 3)</span>
                    <span className="font-medium">{scoreDistribution.low}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No resume data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] mt-2">
                  Upload resumes to see analytics and candidate ratings
                </p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => setSelectedPosition("upload")}
                >
                  Go to Upload <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>
                  Highest ranked candidates across all positions
                </CardDescription>
              </div>
              {sortedCandidates.length > 0 && (
                <Tabs
                  defaultValue="summary"
                  onValueChange={setViewMode}
                  className="w-[240px]"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">
                      <Star className="mr-2 h-3.5 w-3.5" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="detailed">
                      <BookOpen className="mr-2 h-3.5 w-3.5" />
                      Detailed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedCandidates.length > 0 ? (
              <>
                {viewMode === "summary" ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {sortedCandidates.slice(0, 5).map((candidate, index) => {
                      const displayName = formatResumeName(candidate.filename);
                      const initials = getInitials(displayName);

                      return (
                        <div
                          key={index}
                          className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                        >
                          <Avatar
                            className={`h-10 w-10 ${getScoreColor(
                              candidate.score
                            )} text-white`}
                          >
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {truncateText(candidate.summary, 50)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              candidate.score > 7
                                ? "outline"
                                : candidate.score > 3
                                ? "secondary"
                                : "destructive"
                            }
                            className={`ml-auto mr-10 ${
                              candidate.score > 7
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
                                : candidate.score > 3
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                                : ""
                            }`}
                          >
                            {candidate.score.toFixed(2)}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={(e) => {
                              sendEmail(candidate);
                              const button = e.currentTarget;
                              const icon = button.querySelector(".mail-icon");
                              if (icon) {
                                icon.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                                setTimeout(() => {
                                  icon.innerHTML =
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
                                }, 2000);
                              }
                            }}
                          >
                            <span className="mail-icon">
                              <Mail className="h-4 w-4 mr-1" />
                            </span>
                            Email
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                            Resume
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                            Score
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                            Summary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCandidates
                          .slice(0, 5)
                          .map((candidate, index) => {
                            const displayName = formatResumeName(
                              candidate.filename
                            );

                            return (
                              <tr
                                key={index}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                              >
                                <td className="py-3 px-4 text-sm">
                                  <div className="flex items-center">
                                    <Avatar
                                      className={`h-8 w-8 mr-2 ${getScoreColor(
                                        candidate.score
                                      )} text-white`}
                                    >
                                      <AvatarFallback>
                                        {getInitials(displayName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{displayName}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      candidate.score > 7
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                        : candidate.score > 3
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                    }`}
                                  >
                                    {candidate.score.toFixed(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <div className="truncate max-w-[280px]">
                                    {candidate.summary ||
                                      "No summary available"}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
                <CardFooter className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing top 5 of {sortedCandidates.length} candidates
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPosition("resumes")}
                  >
                    View All <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  No candidates yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[300px] mt-2">
                  Upload resumes to see candidate rankings and summaries
                </p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => setSelectedPosition("upload")}
                >
                  Upload Resumes <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
