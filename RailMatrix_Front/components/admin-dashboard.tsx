"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Activity,
  AlertTriangle,
  Download,
  Eye,
  Filter,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Package,
  Scan,
  Factory,
  Zap,
  Users,
  Shield,
  Clock,
  Award,
  CheckCircle,
  UserCheck,
  Settings,
} from "lucide-react"

const overviewData = {
  totalParts: 45672,
  scansToday: 1247,
  defectsToday: 23,
  activeAlerts: 5,
}

const vendorData = [
  {
    id: 1,
    name: "Bharat Heavy Electricals Ltd (BHEL)",
    failureRate: 2.1,
    trend: -0.3,
    partsSupplied: 12450,
    lastDelivery: "2 days ago",
    location: "Bhopal, MP",
  },
  {
    id: 2,
    name: "Rail India Technical & Economic Service",
    failureRate: 3.8,
    trend: 1.2,
    partsSupplied: 8920,
    lastDelivery: "1 week ago",
    location: "New Delhi",
  },
  {
    id: 3,
    name: "Texmaco Rail & Engineering Ltd",
    failureRate: 1.4,
    trend: -0.8,
    partsSupplied: 15670,
    lastDelivery: "3 days ago",
    location: "Kolkata, WB",
  },
  {
    id: 4,
    name: "Jindal Steel & Power Ltd",
    failureRate: 4.2,
    trend: 2.1,
    partsSupplied: 6780,
    lastDelivery: "5 days ago",
    location: "Raigarh, CG",
  },
]

const qualityTrend = [
  { date: "2024-01-01", scanned: 1240, defects: 28, passRate: 97.7 },
  { date: "2024-01-02", scanned: 1180, defects: 22, passRate: 98.1 },
  { date: "2024-01-03", scanned: 1320, defects: 19, passRate: 98.6 },
  { date: "2024-01-04", scanned: 1290, defects: 31, passRate: 97.6 },
  { date: "2024-01-05", scanned: 1350, defects: 17, passRate: 98.7 },
  { date: "2024-01-06", scanned: 1280, defects: 25, passRate: 98.0 },
  { date: "2024-01-07", scanned: 1410, defects: 23, passRate: 98.4 },
]

const confusionMatrixData = [
  { predicted: "Pass", actual: "Pass", count: 8947, color: "#10b981" },
  { predicted: "Pass", actual: "Fail", count: 43, color: "#f59e0b" },
  { predicted: "Fail", actual: "Pass", count: 67, color: "#f59e0b" },
  { predicted: "Fail", actual: "Fail", count: 1254, color: "#10b981" },
]

const partTimeline = [
  {
    id: "TF-2024-001247",
    timestamp: "2024-01-07 14:30",
    event: "QR Code Scan",
    result: "Pass - Quality Grade A",
    confidence: 97.8,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png",
  },
  {
    id: "TF-2024-001247",
    timestamp: "2024-01-07 12:15",
    event: "Final Inspection",
    result: "Dimensional Check Pass",
    confidence: null,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png",
  },
  {
    id: "TF-2024-001247",
    timestamp: "2024-01-07 09:45",
    event: "Manufacturing Complete",
    result: "Track Fitting - Type A",
    confidence: null,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png",
  },
  {
    id: "TF-2024-001247",
    timestamp: "2024-01-06 16:30",
    event: "Production Started",
    result: "Material: High Carbon Steel",
    confidence: null,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png",
  },
]

const railwayRoleData = [
  {
    role: "P-Way Engineer",
    description: "Track design, laying, and maintenance",
    permissions: ["QR Verification", "Inspection History", "Performance Tracking"],
    count: 45,
    zones: ["Northern", "Western", "Eastern", "Southern"],
  },
  {
    role: "PWI/JE-P.Way/SSE-P.Way",
    description: "Frontline track fitting supervisors",
    permissions: ["QR Scanning", "Failure Monitoring", "Warranty Verification"],
    count: 78,
    zones: ["All Zones"],
  },
  {
    role: "Chief Track Engineer (CTE)",
    description: "Senior track maintenance oversight",
    permissions: ["AI Reports", "Procurement QC", "Vendor Analysis"],
    count: 12,
    zones: ["Zonal Level"],
  },
  {
    role: "Railway Stores (Controller/Depot)",
    description: "Material custody and inventory",
    permissions: ["UDM Integration", "Lot Tracking", "Issue Management"],
    count: 34,
    zones: ["Depot Level"],
  },
  {
    role: "RDSO Officials",
    description: "Vendor certification and standards",
    permissions: ["Analytics Review", "Vendor Approval", "Long-term Reliability"],
    count: 8,
    zones: ["National"],
  },
  {
    role: "TMO Teams",
    description: "Track machine operations",
    permissions: ["Machine QR Scanning", "Renewal Tracking"],
    count: 23,
    zones: ["Mechanized Sections"],
  },
  {
    role: "Procurement Officials (IREPS)",
    description: "Vendor and lot verification",
    permissions: ["IREPS Integration", "Batch Verification", "Supply Acceptance"],
    count: 19,
    zones: ["Procurement Centers"],
  },
  {
    role: "QA Inspectors",
    description: "Manufacturing and supply inspection",
    permissions: ["Inspection Logging", "Warranty Compliance", "Traceability"],
    count: 56,
    zones: ["Manufacturing & Field"],
  },
]

const workerData = [
  {
    id: "EMP001",
    name: "Rajesh Kumar",
    role: "P-Way Engineer",
    zone: "Northern Railway - Delhi Division",
    lastLogin: "2024-01-07 14:30",
    scansToday: 127,
    accuracy: 98.5,
    status: "Active",
    certifications: ["Track Engineering", "Railway Safety", "QR Systems"],
    employeeCode: "NR/DE/PWE/001",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    role: "PWI (JE-P.Way)",
    zone: "Western Railway - Mumbai Division",
    lastLogin: "2024-01-07 13:45",
    scansToday: 89,
    accuracy: 99.2,
    status: "Active",
    certifications: ["Track Inspection", "QR Technology", "Safety Protocols"],
    employeeCode: "WR/MB/PWI/002",
  },
  {
    id: "EMP003",
    name: "Amit Singh",
    role: "Chief Track Engineer (CTE)",
    zone: "Eastern Railway - Zonal Office",
    lastLogin: "2024-01-07 12:15",
    scansToday: 156,
    accuracy: 97.8,
    status: "Break",
    certifications: ["Track Management", "AI Analytics", "Procurement QC"],
    employeeCode: "ER/ZO/CTE/003",
  },
  {
    id: "EMP004",
    name: "Sunita Patel",
    role: "Railway Stores Controller",
    zone: "Southern Railway - Chennai Depot",
    lastLogin: "2024-01-07 11:30",
    scansToday: 98,
    accuracy: 98.9,
    status: "Active",
    certifications: ["UDM Systems", "Inventory Management", "Material Tracking"],
    employeeCode: "SR/CH/RSC/004",
  },
  {
    id: "EMP005",
    name: "Dr. Vikram Mehta",
    role: "RDSO Official",
    zone: "RDSO Lucknow",
    lastLogin: "2024-01-07 10:15",
    scansToday: 45,
    accuracy: 99.5,
    status: "Active",
    certifications: ["Standards & Certification", "Vendor Evaluation", "Research & Development"],
    employeeCode: "RDSO/LKO/RO/005",
  },
  {
    id: "EMP006",
    name: "Manoj Gupta",
    role: "TMO Supervisor",
    zone: "Central Railway - Track Machine Org",
    lastLogin: "2024-01-07 09:30",
    scansToday: 134,
    accuracy: 98.1,
    status: "Active",
    certifications: ["Machine Operations", "Track Renewal", "QR Integration"],
    employeeCode: "CR/TMO/SUP/006",
  },
]

export function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV/UDM
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-sidebar min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={selectedTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("overview")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === "vendors" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("vendors")}
            >
              <Factory className="h-4 w-4 mr-2" />
              Vendor List
            </Button>
            <Button
              variant={selectedTab === "parts" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("parts")}
            >
              <Package className="h-4 w-4 mr-2" />
              Part Details
            </Button>
            <Button
              variant={selectedTab === "alerts" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("alerts")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button
              variant={selectedTab === "workers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("workers")}
            >
              <Users className="h-4 w-4 mr-2" />
              Worker Management
            </Button>
            <Button
              variant={selectedTab === "ml" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedTab("ml")}
            >
              <Eye className="h-4 w-4 mr-2" />
              ML Console
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Quality Control Dashboard</h2>
                <p className="text-muted-foreground">
                  Real-time insights into track fittings production and quality metrics
                </p>
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    System Excellence & USPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">99.1%</div>
                      <p className="text-sm text-muted-foreground">AI Accuracy Rate</p>
                      <p className="text-xs text-blue-600">Industry Leading</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">0.3s</div>
                      <p className="text-sm text-muted-foreground">Scan Processing</p>
                      <p className="text-xs text-green-600">Real-time Analysis</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <p className="text-sm text-muted-foreground">Monitoring</p>
                      <p className="text-xs text-purple-600">Continuous Operation</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">ISO</div>
                      <p className="text-sm text-muted-foreground">Certified Process</p>
                      <p className="text-xs text-orange-600">International Standard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.totalParts.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Manufactured to date</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
                    <Scan className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.scansToday}</div>
                    <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Defects Today</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.defectsToday}</div>
                    <p className="text-xs text-muted-foreground">1.8% defect rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overviewData.activeAlerts}</div>
                    <p className="text-xs text-muted-foreground">Requires attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quality Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Control Trends (Last 7 Days)</CardTitle>
                  <CardDescription>Daily scan volume and pass rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={qualityTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="scanned" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="defects" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Problem Types Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle>Problem Types Heatmap</CardTitle>
                  <CardDescription>Distribution of defect categories across vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="p-3 bg-green-100 text-green-800 rounded text-center font-medium">
                      Dimensional
                      <br />
                      <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-800 rounded text-center font-medium">
                      Surface
                      <br />
                      <span className="text-lg font-bold">8</span>
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-800 rounded text-center font-medium">
                      Material
                      <br />
                      <span className="text-lg font-bold">15</span>
                    </div>
                    <div className="p-3 bg-red-100 text-red-800 rounded text-center font-medium">
                      QR Code
                      <br />
                      <span className="text-lg font-bold">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "vendors" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Vendor Performance</h2>
                <p className="text-muted-foreground">Failure rates and quality trends by supplier</p>
              </div>

              <div className="grid gap-4">
                {vendorData.map((vendor) => (
                  <Card key={vendor.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <Badge
                          variant={
                            vendor.failureRate < 2 ? "default" : vendor.failureRate < 4 ? "secondary" : "destructive"
                          }
                        >
                          {vendor.failureRate}% Failure Rate
                        </Badge>
                      </div>
                      <CardDescription>
                        {vendor.location} • Last delivery: {vendor.lastDelivery}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Parts Supplied</p>
                          <p className="text-2xl font-bold">{vendor.partsSupplied.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quality Score</p>
                          <p className="text-2xl font-bold">{(100 - vendor.failureRate).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">30-Day Trend</p>
                          <div className="flex items-center gap-1">
                            {vendor.trend < 0 ? (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            )}
                            <span className={vendor.trend < 0 ? "text-green-500" : "text-red-500"}>
                              {Math.abs(vendor.trend)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={100 - vendor.failureRate} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "parts" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Part Details</h2>
                <p className="text-muted-foreground">Manufacturing timeline and inspection history</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Part ID: TF-2024-001247 - Track Fitting Type A</CardTitle>
                  <CardDescription>Manufacturing and quality control timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partTimeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt="Part scan"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{event.event}</h4>
                            <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{event.result}</p>
                          {event.confidence && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs">Confidence:</span>
                                <Progress value={event.confidence} className="h-1 w-20" />
                                <span className="text-xs">{event.confidence}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "alerts" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Active Alerts</h2>
                <p className="text-muted-foreground">Quality control warnings and system notifications</p>
              </div>

              <div className="space-y-4">
                <Card className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <CardTitle className="text-lg">High Failure Rate Detected</CardTitle>
                    </div>
                    <CardDescription>Jindal Steel & Power Ltd - Lot JSP-2024-003</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Lot JSP-2024-003 has 7% failure rate in last 1000 scans — FLAGGED for immediate review
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Investigate</Button>
                      <Button size="sm" variant="outline">
                        Mark Reviewed
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-lg">QR Code Quality Degradation</CardTitle>
                    </div>
                    <CardDescription>BHEL Manufacturing Unit - Laser Marking System</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      QR code readability dropped 15% in the last 24 hours. Laser calibration may be required.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Schedule Maintenance</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <CardTitle className="text-lg">Material Specification Variance</CardTitle>
                    </div>
                    <CardDescription>Rail India Technical - Batch RIT-2024-012</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Carbon content variance detected in batch RIT-2024-012. Quality assurance review required.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Quality Review</Button>
                      <Button size="sm" variant="outline">
                        Contact Vendor
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-lg">System Maintenance</CardTitle>
                    </div>
                    <CardDescription>Scheduled maintenance window</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Scheduled laser system maintenance on Jan 10, 2024 from 2:00 AM - 4:00 AM IST
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        Acknowledge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === "workers" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Railway Personnel Management</h2>
                <p className="text-muted-foreground">
                  Employee credentials, role-based access, and performance tracking across railway zones
                </p>
              </div>

              {/* Railway Role Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Railway Roles & Responsibilities</CardTitle>
                  <CardDescription>Personnel distribution across different railway functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {railwayRoleData.map((roleInfo, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{roleInfo.role}</h4>
                          <Badge variant="secondary">{roleInfo.count}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{roleInfo.description}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium">Key Permissions:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {roleInfo.permissions.slice(0, 2).map((perm, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {roleInfo.permissions.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{roleInfo.permissions.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium">Coverage:</p>
                            <p className="text-xs text-muted-foreground">{roleInfo.zones.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Worker Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">275</div>
                    <p className="text-xs text-muted-foreground">Across all railway zones</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">198</div>
                    <p className="text-xs text-muted-foreground">Currently logged in</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.7%</div>
                    <p className="text-xs text-muted-foreground">Quality performance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">Active certificates</p>
                  </CardContent>
                </Card>
              </div>

              {/* Railway-Specific Management Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Railway Personnel Management</CardTitle>
                  <CardDescription>Manage credentials, access, and certifications for railway staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Add Railway Personnel
                    </Button>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Zone-wise Access Control
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      IREPS Integration
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      UDM Export
                    </Button>
                    <Button variant="outline">
                      <Award className="h-4 w-4 mr-2" />
                      Railway Certification Tracker
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Safety Audit Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Worker List with Railway Details */}
              <div className="space-y-4">
                {workerData.map((worker) => (
                  <Card key={worker.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {worker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{worker.name}</CardTitle>
                            <CardDescription>
                              {worker.role} • {worker.zone}
                            </CardDescription>
                            <p className="text-xs text-muted-foreground mt-1">Employee Code: {worker.employeeCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={worker.status === "Active" ? "default" : "secondary"}>{worker.status}</Badge>
                          <Badge variant="outline">{worker.accuracy}% Accuracy</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Login</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {worker.lastLogin}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">QR Scans Today</p>
                          <p className="font-medium">{worker.scansToday}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Performance</p>
                          <Progress value={worker.accuracy} className="h-2 mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Railway Certifications</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {worker.certifications.map((cert, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Reset Credentials
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Activity Log
                        </Button>
                        <Button size="sm" variant="outline">
                          <Award className="h-3 w-3 mr-1" />
                          Railway Certs
                        </Button>
                        <Button size="sm" variant="outline">
                          <Filter className="h-3 w-3 mr-1" />
                          Zone Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Railway-Specific Access Control Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Railway Access Control Matrix</CardTitle>
                  <CardDescription>Role-based permissions for railway QR code marking system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Railway Role</th>
                          <th className="text-center p-2">QR Scanning</th>
                          <th className="text-center p-2">Quality Review</th>
                          <th className="text-center p-2">Vendor Data</th>
                          <th className="text-center p-2">UDM/IREPS</th>
                          <th className="text-center p-2">ML Console</th>
                          <th className="text-center p-2">Admin Panel</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">P-Way Engineer</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">PWI/JE-P.Way</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Chief Track Engineer</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Railway Stores</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">RDSO Officials</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">TMO Teams</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">QA Inspectors</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">✅</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">👁️</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-muted-foreground mt-2">✅ Full Access • 👁️ View Only • ❌ No Access</p>
                  </div>
                </CardContent>
              </Card>

              {/* Zone-wise Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Zone-wise Personnel Distribution</CardTitle>
                  <CardDescription>Railway personnel across different zones and divisions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold">Northern Railway</h4>
                      <p className="text-2xl font-bold text-blue-600">67</p>
                      <p className="text-xs text-muted-foreground">Personnel</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold">Western Railway</h4>
                      <p className="text-2xl font-bold text-green-600">54</p>
                      <p className="text-xs text-muted-foreground">Personnel</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold">Eastern Railway</h4>
                      <p className="text-2xl font-bold text-purple-600">71</p>
                      <p className="text-xs text-muted-foreground">Personnel</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold">Southern Railway</h4>
                      <p className="text-2xl font-bold text-orange-600">83</p>
                      <p className="text-xs text-muted-foreground">Personnel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "ml" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">ML Console</h2>
                <p className="text-muted-foreground">Quality control model performance and training controls</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Confusion Matrix */}
                <Card>
                  <CardHeader>
                    <CardTitle>Confusion Matrix</CardTitle>
                    <CardDescription>Quality classification accuracy breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-4 bg-green-100 rounded text-green-800 font-semibold">
                        8947
                        <br />
                        <span className="text-xs">Pass → Pass</span>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded text-yellow-800 font-semibold">
                        43
                        <br />
                        <span className="text-xs">Pass → Fail</span>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded text-yellow-800 font-semibold">
                        67
                        <br />
                        <span className="text-xs">Fail → Pass</span>
                      </div>
                      <div className="p-4 bg-green-100 rounded text-green-800 font-semibold">
                        1254
                        <br />
                        <span className="text-xs">Fail → Fail</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">Overall Accuracy: 98.9%</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Classifications</CardTitle>
                    <CardDescription>Recent quality assessments with confidence scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 border rounded">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png"
                          alt="Track fitting sample"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pass - Grade A Quality</p>
                          <Progress value={97.8} className="h-1 mt-1" />
                        </div>
                        <span className="text-xs text-muted-foreground">97.8%</span>
                      </div>

                      <div className="flex items-center gap-3 p-2 border rounded">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png"
                          alt="Track fitting sample"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Fail - Dimensional Issue</p>
                          <Progress value={94.2} className="h-1 mt-1" />
                        </div>
                        <span className="text-xs text-muted-foreground">94.2%</span>
                      </div>

                      <div className="flex items-center gap-3 p-2 border rounded">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lpWckObhlwg8CLN84Q4TMW9R8EUNwV.png"
                          alt="Track fitting sample"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pass - QR Code Clear</p>
                          <Progress value={99.1} className="h-1 mt-1" />
                        </div>
                        <span className="text-xs text-muted-foreground">99.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Model Management</CardTitle>
                  <CardDescription>Training controls and model deployment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retrain Model
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Model
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Training Logs
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Data Validation
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      API Call Logs
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Model Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Model Version:</span>
                        <span className="ml-2">v3.2.1</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Trained:</span>
                        <span className="ml-2">Jan 5, 2024</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Training Samples:</span>
                        <span className="ml-2">127,431 images</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Validation Accuracy:</span>
                        <span className="ml-2">98.9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
