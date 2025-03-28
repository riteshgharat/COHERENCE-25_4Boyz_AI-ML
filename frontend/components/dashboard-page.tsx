"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/sidebar-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard-content"

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardContent activeTab={activeTab} />
      </div>
    </SidebarProvider>
  )
}

