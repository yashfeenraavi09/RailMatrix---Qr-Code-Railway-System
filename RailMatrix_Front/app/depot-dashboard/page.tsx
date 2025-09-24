"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DepotDashboard } from "@/components/depot-dashboard/depot-dashboard";
import { LanguageProvider } from "@/components/language-context";

export default function DepotDashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) {
      router.push("/");
      return;
    }

    const user = JSON.parse(stored);
    const role = user.role?.toLowerCase();

    if (role !== "depot") {
      router.push("/");
      return;
    }

    setUserData(user);
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <LanguageProvider>
      <DepotDashboard
        userData={userData}
        accessToken={userData?.accessToken || ""}
        onLogout={() => {
          localStorage.removeItem("userData");
          router.push("/");
        }}
      />
    </LanguageProvider>
  );
}
