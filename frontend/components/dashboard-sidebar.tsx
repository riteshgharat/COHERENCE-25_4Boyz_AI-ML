"use client"

import { useSidebar } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Home, Menu, Settings, Upload, Users, UserCheck } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const { isOpen, toggle } = useSidebar()

  const menuItems = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "resumes", label: "Resumes", icon: FileText },
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "applicants", label: "Applicants Status", icon: UserCheck }, // Added new menu item
    // { id: "candidates", label: "Candidates", icon: Users },
    // { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black/50 lg:hidden ${isOpen ? "block" : "hidden"}`} onClick={toggle} />
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
          <h1 className="text-lg font-semibold">ResumeAI Screener</h1>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeTab === item.id ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="ml-3">
              <p className="text-sm font-medium">HR Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">hr@company.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

