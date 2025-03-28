import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Filter, Search, SlidersHorizontal } from "lucide-react"

export function ResumesList() {
  const resumes = [
    {
      id: "RES-001",
      name: "Alex Johnson Resume.pdf",
      position: "Senior Frontend Developer",
      date: "2023-05-15",
      status: "Processed",
      size: "1.2 MB",
    },
    {
      id: "RES-002",
      name: "Sarah Williams CV.docx",
      position: "DevOps Engineer",
      date: "2023-05-14",
      status: "Processed",
      size: "890 KB",
    },
    {
      id: "RES-003",
      name: "Michael Chen Resume.pdf",
      position: "Product Manager",
      date: "2023-05-14",
      status: "Processed",
      size: "1.5 MB",
    },
    {
      id: "RES-004",
      name: "Emily Rodriguez CV.pdf",
      position: "Data Scientist",
      date: "2023-05-13",
      status: "Processed",
      size: "2.1 MB",
    },
    {
      id: "RES-005",
      name: "David Kim Resume.docx",
      position: "UX/UI Designer",
      date: "2023-05-13",
      status: "Processing",
      size: "1.8 MB",
    },
    {
      id: "RES-006",
      name: "Lisa Patel CV.pdf",
      position: "Senior Frontend Developer",
      date: "2023-05-12",
      status: "Processing",
      size: "950 KB",
    },
    {
      id: "RES-007",
      name: "James Wilson Resume.pdf",
      position: "DevOps Engineer",
      date: "2023-05-12",
      status: "Processing",
      size: "1.1 MB",
    },
    {
      id: "RES-008",
      name: "Robert Hernandez CV.docx",
      position: "Product Manager",
      date: "2023-05-11",
      status: "Failed",
      size: "1.3 MB",
    },
    {
      id: "RES-009",
      name: "Jennifer Taylor Resume.pdf",
      position: "Data Scientist",
      date: "2023-05-11",
      status: "Queued",
      size: "1.7 MB",
    },
    {
      id: "RES-010",
      name: "Thomas Brown CV.pdf",
      position: "UX/UI Designer",
      date: "2023-05-10",
      status: "Queued",
      size: "2.3 MB",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Queued":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Resumes</CardTitle>
              <CardDescription>View and manage uploaded resumes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input type="search" placeholder="Search resumes..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="devops">DevOps Engineer</SelectItem>
                  <SelectItem value="product">Product Manager</SelectItem>
                  <SelectItem value="data">Data Scientist</SelectItem>
                  <SelectItem value="design">UX/UI Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processed">Processed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="queued">Queued</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="rounded-lg border dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                          <th className="px-4 py-3">Resume</th>
                          <th className="px-4 py-3">Position</th>
                          <th className="px-4 py-3">Upload Date</th>
                          <th className="px-4 py-3">Size</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-800">
                        {resumes.map((resume) => (
                          <tr
                            key={resume.id}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                          >
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-gray-400" />
                                <span className="font-medium">{resume.name}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">{resume.position}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              {new Date(resume.date).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">{resume.size}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                  resume.status,
                                )}`}
                              >
                                {resume.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-sm">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              {/* Similar TabsContent for other tabs */}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

