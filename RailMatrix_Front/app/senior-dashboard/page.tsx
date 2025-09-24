"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SeniorOfficialsDashboard } from "@/components/senior-dashboard/senior-officials-dashboard"
import { LanguageProvider } from "@/components/language-context"

export default function SeniorDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("userData")
    if (!stored) {
      router.push("/") 
      return
    }

    const user = JSON.parse(stored)
    const role = user.role?.toLowerCase()

    if (role !== "senior") {
      router.push("/") 
      return
    }

    setUserData(user)
  }, [])

  if (!userData) return <div>Loading...</div>

  return (
    <LanguageProvider>
      <SeniorOfficialsDashboard
        userData={userData}
        onLogout={() => {
          localStorage.removeItem("userData")
          router.push("/")
        }}
      />
    </LanguageProvider>
  )
}
