"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Download,
  Shield,
  Eye,
  Brain,
  Target,
  Award,
  LogOut,
  FileText,
  Loader2,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useLanguage } from "@/components/language-context"


interface SeniorOfficialsDashboardProps {
  userData: any
  onLogout: () => void
}

const predictiveAlerts = [
  { section: "Delhi-Ghaziabad", risk: "High", prediction: "7% failure expected in next 30 days", confidence: 94 },
  { section: "Mumbai-Pune", risk: "Medium", prediction: "3% failure expected in next 45 days", confidence: 87 },
  { section: "Chennai-Bangalore", risk: "Low", prediction: "1% failure expected in next 60 days", confidence: 92 },
]

const vendorBenchmark = [
  { vendor: "Jindal Steel", reliability: 98.2, onTime: 95, quality: 97.8, cost: 85 },
  { vendor: "SAIL", reliability: 96.8, onTime: 92, quality: 96.2, cost: 88 },
  { vendor: "Tata Steel", reliability: 97.5, onTime: 94, quality: 97.1, cost: 82 },
  { vendor: "JSW Steel", reliability: 95.9, onTime: 89, quality: 95.5, cost: 90 },
]

const complianceData = [
  { category: "RDSO Standards", compliance: 98.5, total: 1250, passed: 1231 },
  { category: "ISO Certification", compliance: 97.2, total: 890, passed: 865 },
  { category: "Safety Protocols", compliance: 99.1, total: 2100, passed: 2081 },
  { category: "Quality Assurance", compliance: 96.8, total: 1560, passed: 1510 },
]

const failureTrend = [
  { month: "Jan", failures: 12, predicted: 15, actual: 12 },
  { month: "Feb", failures: 8, predicted: 10, actual: 8 },
  { month: "Mar", failures: 15, predicted: 18, actual: 15 },
  { month: "Apr", failures: 6, predicted: 8, actual: 6 },
  { month: "May", failures: 11, predicted: 12, actual: 11 },
  { month: "Jun", failures: 9, predicted: 11, actual: 9 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"]

export function SeniorOfficialsDashboard({ userData, onLogout }: SeniorOfficialsDashboardProps) {
  const { t } = useLanguage()
  const [selectedTab, setSelectedTab] = useState("analytics")
  const [isExportingReport, setIsExportingReport] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null)

  const handleExportReport = async () => {
    setIsExportingReport(true)
    try {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: "executive-summary",
          userId: userData.employeeId,
          dateRange: "last-30-days",
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`Report exported successfully: ${data.filename}`)
      } else {
        alert("Failed to export report")
      }
    } catch (error) {
      alert("Network error occurred")
    } finally {
      setIsExportingReport(false)
    }
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(reportType)
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          userId: userData.employeeId,
          parameters: {
            dateRange: reportType.includes("audit") ? "last-12-months" : "last-6-months",
            includeCharts: true,
            format: "pdf",
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`${reportType} report generated successfully: ${data.reportId}`)
      } else {
        alert("Failed to generate report")
      }
    } catch (error) {
      alert("Network error occurred")
    } finally {
      setIsGeneratingReport(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("senior.title")}</h1>
              <p className="text-sm text-muted-foreground">Welcome, {userData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{userData.employeeId}</Badge>
            <Button variant="outline" size="sm" onClick={handleExportReport} disabled={isExportingReport}>
              {isExportingReport ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {t("dashboard.export")} Report
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("senior.aiAccuracy")}</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">Failure prediction model</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("senior.highRisk")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("senior.vendorPerformance")}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.1%</div>
              <p className="text-xs text-muted-foreground">Average reliability score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("senior.complianceRate")}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.1%</div>
              <p className="text-xs text-muted-foreground">RDSO & safety standards</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Benchmarking</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Monitor</TabsTrigger>
            <TabsTrigger value="audit">Audit Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Predictive Failure Alerts</CardTitle>
                  <CardDescription>AI-driven risk assessment for track sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictiveAlerts.map((alert, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{alert.section}</h4>
                          <Badge
                            variant={
                              alert.risk === "High" ? "destructive" : alert.risk === "Medium" ? "default" : "secondary"
                            }
                          >
                            {alert.risk} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.prediction}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={alert.confidence} className="flex-1 h-2" />
                          <span className="text-xs font-medium">{alert.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failure Prediction vs Actual</CardTitle>
                  <CardDescription>Model accuracy over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={failureTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance Benchmarking</CardTitle>
                <CardDescription>Comprehensive vendor evaluation across key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {vendorBenchmark.map((vendor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{vendor.vendor}</h4>
                        <Badge variant="outline">
                          Overall:{" "}
                          {((vendor.reliability + vendor.onTime + vendor.quality + vendor.cost) / 4).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Reliability</p>
                          <Progress value={vendor.reliability} className="h-2 mb-1" />
                          <p className="text-xs font-medium">{vendor.reliability}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">On-Time Delivery</p>
                          <Progress value={vendor.onTime} className="h-2 mb-1" />
                          <p className="text-xs font-medium">{vendor.onTime}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                          <Progress value={vendor.quality} className="h-2 mb-1" />
                          <p className="text-xs font-medium">{vendor.quality}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cost Efficiency</p>
                          <Progress value={vendor.cost} className="h-2 mb-1" />
                          <p className="text-xs font-medium">{vendor.cost}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Monitoring</CardTitle>
                  <CardDescription>Standards adherence across all categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceData.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.category}</h4>
                          <Badge variant={item.compliance > 97 ? "default" : "secondary"}>{item.compliance}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>Passed: {item.passed}</span>
                          <span>Total: {item.total}</span>
                        </div>
                        <Progress value={item.compliance} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Distribution</CardTitle>
                  <CardDescription>Visual breakdown of compliance categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={complianceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, compliance }) => `${category}: ${compliance}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="compliance"
                      >
                        {complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit-Ready Reports</CardTitle>
                <CardDescription>Comprehensive reports for safety and compliance audits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    className="h-24 flex-col"
                    onClick={() => handleGenerateReport("safety-audit")}
                    disabled={isGeneratingReport === "safety-audit"}
                  >
                    {isGeneratingReport === "safety-audit" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <FileText className="h-6 w-6 mb-2" />
                    )}
                    <span>Safety Audit Report</span>
                    <span className="text-xs opacity-70">Last 12 months</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col bg-transparent"
                    onClick={() => handleGenerateReport("compliance-summary")}
                    disabled={isGeneratingReport === "compliance-summary"}
                  >
                    {isGeneratingReport === "compliance-summary" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <Shield className="h-6 w-6 mb-2" />
                    )}
                    <span>Compliance Summary</span>
                    <span className="text-xs opacity-70">RDSO Standards</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col bg-transparent"
                    onClick={() => handleGenerateReport("performance-trends")}
                    disabled={isGeneratingReport === "performance-trends"}
                  >
                    {isGeneratingReport === "performance-trends" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <TrendingUp className="h-6 w-6 mb-2" />
                    )}
                    <span>Performance Trends</span>
                    <span className="text-xs opacity-70">Vendor Analysis</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col bg-transparent"
                    onClick={() => handleGenerateReport("incident-reports")}
                    disabled={isGeneratingReport === "incident-reports"}
                  >
                    {isGeneratingReport === "incident-reports" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 mb-2" />
                    )}
                    <span>Incident Reports</span>
                    <span className="text-xs opacity-70">Failure Analysis</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col bg-transparent"
                    onClick={() => handleGenerateReport("quality-metrics")}
                    disabled={isGeneratingReport === "quality-metrics"}
                  >
                    {isGeneratingReport === "quality-metrics" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <Award className="h-6 w-6 mb-2" />
                    )}
                    <span>Quality Metrics</span>
                    <span className="text-xs opacity-70">Certification Status</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col bg-transparent"
                    onClick={() => handleGenerateReport("inspection-logs")}
                    disabled={isGeneratingReport === "inspection-logs"}
                  >
                    {isGeneratingReport === "inspection-logs" ? (
                      <Loader2 className="h-6 w-6 mb-2 animate-spin" />
                    ) : (
                      <Eye className="h-6 w-6 mb-2" />
                    )}
                    <span>Inspection Logs</span>
                    <span className="text-xs opacity-70">QR Trace History</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
