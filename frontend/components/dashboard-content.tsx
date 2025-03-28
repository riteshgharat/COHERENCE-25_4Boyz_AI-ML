"use client";

import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardOverview } from "@/components/dashboard-overview";
import { ResumeUpload } from "@/components/resume-upload";
import { ApplicationList } from "@/components/application-list";

import { AnalyticsPanel } from "@/components/analytics-panel";
import { ResumesList } from "@/components/resumes-list";

interface DashboardContentProps {
  activeTab: string;
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const { toggle } = useSidebar();

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <ResumeUpload />;
      case "dashboard":
        return <DashboardOverview />;
      case "resumes":
        return <ResumesList />;
      case "analytics":
        return <AnalyticsPanel />;
      case "applicants":
        return <ApplicationList />;
      default:
        return <ResumeUpload />;
    }
  };

  return (
    <main className="flex-1">
      <div className="flex h-14 items-center border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
      </div>
      <div className="container mx-auto p-4 lg:p-6">{renderContent()}</div>
    </main>
  );
}
import { useEffect } from "react";
