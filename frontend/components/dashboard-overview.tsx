"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, FileText, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResumeContext } from "../context/resume-context"
import { useState, useEffect } from "react"

export function DashboardOverview() {
   const { selectedPosition, setSelectedPosition, ratingData } = useResumeContext();
   const [sortedCandidates, setSortedCandidates] = useState([]);

   useEffect(() => {
     // Check if ratingData.results exists and is an array
     if (ratingData && ratingData.results && Array.isArray(ratingData.results)) {
       // Sort by score in descending order
       const sorted = [...ratingData.results].sort((a, b) => b.score - a.score);
       setSortedCandidates(sorted);
     } else {
       setSortedCandidates([]);
     }
   }, [ratingData]);

   // Calculate total resumes
   const totalResumes = ratingData?.results?.length || 0;

   return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 justify-center">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Resume Analysis</CardTitle>
            <CardDescription>Distribution of processed resumes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <div className="flex h-full items-center justify-center">
                <div className="relative h-40 w-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold">{totalResumes}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Resumes</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
                    <circle cx="120" cy="120" r="100" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                    <circle
                      cx="120"
                      cy="120"
                      r="100"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray="628.3"
                      strokeDashoffset="0"
                    />
                    {totalResumes > 0 && (
                      <>
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray="314.2"
                          strokeDashoffset="-628.3"
                        />
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray="209.4"
                          strokeDashoffset="-942.5"
                        />
                        <circle
                          cx="120"
                          cy="120"
                          r="100"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray="104.7"
                          strokeDashoffset="-1151.9"
                        />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Top Candidates</CardTitle>
            <CardDescription>Highest ranked candidates across all positions</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedCandidates.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Resume</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCandidates.slice(0, 5).map((candidate, index) => {
                    // Extract candidate name from filename
                    const filename = candidate.filename || '';
                    const displayName = filename
                      .replace(/\.pdf$|\.docx$|\.doc$|\.txt$/i, '')
                      .replace(/_/g, ' ')
                      .replace(/-/g, ' ');
                      
                    return (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                        <td className="px-4 py-2">
                          {displayName || candidate.resume_id || `Candidate ${index + 1}`}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            candidate.score > 7 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            candidate.score > 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {candidate.score.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-2 truncate max-w-[200px]">
                          {candidate.summary || 'No summary available'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No candidate data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
   );
}