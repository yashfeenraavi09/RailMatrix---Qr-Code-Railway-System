"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, Zap, Shield, Eye, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "./language-context"
import { login } from "@/services/api"
import { useRouter } from "next/navigation"

interface LoginPageProps {
  onLogin: (role: string, userData: any) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState({
    employeeId: "",
    password: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  const roleOptions = [
    { value: "Depot staff", label: "Depot Staff" },
    { value: "Senior officials", label: "Senior Officials" },
  ]

  const handleLogin = async () => {
    if (credentials.employeeId && credentials.password && credentials.role) {
      setIsLoading(true)
      setError("")

      try {
        const data = await login(credentials.employeeId, credentials.password, credentials.role)

        onLogin(credentials.role, data)

        if (data.redirect_url) {
          router.push(data.redirect_url)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t("login.title")}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="ml-4"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
          </div>
          <p className="text-muted-foreground">{t("login.subtitle")}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Secure Access
            </Badge>
            <Badge variant="secondary">
              <Eye className="h-3 w-3 mr-1" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>

        <div className="flex justify-center">
          {/* Login Form */}
          <Card className="shadow-lg w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Login
              </CardTitle>
              <CardDescription>Enter your railway credentials to access the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="e.g., depot001"
                  value={credentials.employeeId}
                  onChange={(e) => setCredentials({ ...credentials, employeeId: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="role">{t("login.accessLevel")}</Label>
                <Select
                  value={credentials.role}
                  onValueChange={(value) => setCredentials({ ...credentials, role: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={!credentials.employeeId || !credentials.password || !credentials.role || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("login.authenticating")}
                  </>
                ) : (
                  t("login.loginButton")
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
