"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "@/components/login-page"
import { LanguageProvider } from "@/components/language-context"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("userData")
    if (stored) {
      const user = JSON.parse(stored)
      const role = user.role?.toLowerCase()
      if (role === "depot") router.push("/depot-dashboard")
      if (role === "senior") router.push("/senior-dashboard")
    }
  }, [])

  const handleLogin = (role: string, userData: any) => {
    // Normalize role
    const normalizedRole = role.toLowerCase().includes("depot") ? "depot" : "senior"

    // Save user to localStorage
    localStorage.setItem("userData", JSON.stringify({ role: normalizedRole, ...userData }))

    // Redirect to correct dashboard
    if (normalizedRole === "depot") router.push("/depot-dashboard")
    if (normalizedRole === "senior") router.push("/senior-dashboard")
  }

  return (
    <LanguageProvider>
      <LoginPage onLogin={handleLogin} />
    </LanguageProvider>
  )
}
