"use client";

import { useState, useEffect } from "react";
import { getAllApplicants } from "@/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, MapPin, User, Briefcase, Clock } from "lucide-react";

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  governmentId: string;
  jobRole: string;
  interviewMode: string;
  venue: string;
  timestamp: Date;
}

export function ApplicationList() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const data = await getAllApplicants();
        setApplicants(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load applicants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInterviewBadgeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'online':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'offline':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                View and manage job applications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-100">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="rounded-lg border dark:border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                        <th className="px-4 py-3">Applicant</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Job Role</th>
                        <th className="px-4 py-3">Interview</th>
                        <th className="px-4 py-3">Applied On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {applicants.length > 0 ? (
                        applicants.map((applicant) => (
                          <tr key={applicant.id} className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900">
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{applicant.firstName} {applicant.lastName}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <User className="h-3 w-3" /> ID: {applicant.governmentId}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> DOB: {applicant.dateOfBirth}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <div className="flex flex-col">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" /> {applicant.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" /> {applicant.phoneNumber}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <div className="flex items-center">
                                <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                                <span>{applicant.jobRole}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <div className="flex flex-col gap-1">
                                <Badge className={getInterviewBadgeColor(applicant.interviewMode)}>
                                  {applicant.interviewMode.toUpperCase()}
                                </Badge>
                                {applicant.venue && (
                                  <span className="text-xs flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-gray-400" /> {applicant.venue}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                <span>{formatDate(applicant.timestamp)}</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                            No applications available. Check back later.
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
    </div>
  );
}