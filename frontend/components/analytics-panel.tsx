import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AnalyticsPanel() {

  fetch('http://192.168.22.186:5000/extract_tech') // Replace with your API endpoint
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {

    console.log(data); // Handle the data
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="bias">Bias Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8s</div>
                <p className="text-xs text-muted-foreground">Average per resume</p>
                <div className="mt-4 h-[80px]">
                  <div className="flex h-full items-end gap-1">
                    {[40, 30, 45, 50, 60, 35, 45].map((value, i) => (
                      <div key={i} className="bg-primary/90 w-full rounded-sm" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Screening Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">Based on hiring outcomes</p>
                <div className="mt-4 h-[80px]">
                  <div className="flex h-full items-end gap-1">
                    {[85, 90, 88, 92, 95, 94, 96].map((value, i) => (
                      <div key={i} className="bg-green-500 w-full rounded-sm" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bias Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Potential biases detected</p>
                <div className="mt-4 h-[80px]">
                  <div className="flex h-full items-end gap-1">
                    {[20, 15, 10, 18, 5, 8, 12].map((value, i) => (
                      <div key={i} className="bg-amber-500 w-full rounded-sm" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shortlist Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.4%</div>
                <p className="text-xs text-muted-foreground">Of total resumes</p>
                <div className="mt-4 h-[80px]">
                  <div className="flex h-full items-end gap-1">
                    {[15, 18, 22, 19, 16, 20, 18].map((value, i) => (
                      <div key={i} className="bg-blue-500 w-full rounded-sm" style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Screening Efficiency</CardTitle>
                <CardDescription>Time saved compared to manual screening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="flex h-full flex-col justify-center">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Manual Screening</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">~120 hours</div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2.5 rounded-full bg-gray-500" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">AI Screening</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">~8 hours</div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2.5 rounded-full bg-primary" style={{ width: "6.7%" }}></div>
                        </div>
                      </div>
                      <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="font-medium text-green-800 dark:text-green-300">93.3% Time Saved</div>
                        <div className="text-sm text-green-700 dark:text-green-400">
                          Approximately 118 hours saved in the screening process
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Candidate Sources</CardTitle>
                {/* <CardDescription>Distribution of resume sources</CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <div className="flex h-full items-center justify-center">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-bold">1,248</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Total Resumes</div>
                        </div>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="20"
                          strokeDasharray="188.5"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray="94.2"
                          strokeDashoffset="-188.5"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray="62.8"
                          strokeDashoffset="-282.7"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray="31.4"
                          strokeDashoffset="-345.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                      <div className="text-sm">LinkedIn (45%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="text-sm">Company Website (25%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                      <div className="text-sm">Job Boards (15%)</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="text-sm">Referrals (15%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position Analytics</CardTitle>
              <CardDescription>Performance metrics by job position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Position analytics content would go here */}
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Position-specific analytics would be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Analytics</CardTitle>
              <CardDescription>Candidate quality and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Candidate analytics content would go here */}
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Candidate-specific analytics would be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bias Analysis</CardTitle>
              <CardDescription>Bias detection and mitigation metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Bias analysis content would go here */}
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Bias analysis metrics would be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

