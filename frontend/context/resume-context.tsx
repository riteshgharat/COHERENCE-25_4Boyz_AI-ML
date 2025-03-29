"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ResumeRating {
  preview?: string;
  resume_id: string;
  filename: string;
  score: number;
  summary?: string;
}

interface RatingResponse {
  job_requirement: string;
  results: ResumeRating[];
}

type ResumeContextType = {
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
  languageTools: string;
  setLanguageTools: (tools: string) => void;
  ratingData: RatingResponse | null;
  setRatingData: (data: RatingResponse | null) => void;
  fetchRatingData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  saveJobDescription: (description: string) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Default job description if none is in localStorage
const DEFAULT_JOB_DESCRIPTION = "Python, Internship";

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [selectedPosition, setSelectedPosition] = useState("frontend");
  const [languageTools, setLanguageTools] = useState(DEFAULT_JOB_DESCRIPTION);
  const [ratingData, setRatingData] = useState<RatingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved job description from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {  // Check if we're in the browser
      const savedJobDescription = localStorage.getItem('jobDescription');
      if (savedJobDescription) {
        setLanguageTools(savedJobDescription);
      }
    }
  }, []);

  // Function to save job description to localStorage
  const saveJobDescription = (description: string) => {
    setLanguageTools(description);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jobDescription', description);
    }
  };

  const fetchRatingData = async (forceRefresh = false) => {
    // If we already have data and not forcing refresh, don't fetch again
    if (ratingData && ratingData.job_requirement === languageTools && !forceRefresh) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://192.168.22.186:5000/rate_resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_requirement: languageTools
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ratings: ${response.status}`);
      }

      const data = await response.json();
      console.log("Rating results:", data);
      setRatingData(data);
    } catch (err) {
      console.error("Error fetching resume ratings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        selectedPosition,
        setSelectedPosition,
        languageTools,
        setLanguageTools,
        ratingData,
        setRatingData,
        fetchRatingData,
        isLoading,
        error,
        saveJobDescription
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }
  return context;
}