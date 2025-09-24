"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface LanguageContextType {
  language: "en" | "hi"
  setLanguage: (lang: "en" | "hi") => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Login Page
    "login.title": "Railway QR Code System",
    "login.subtitle": "AI-powered Track Fittings Quality Control Portal",
    "login.employeeId": "Employee ID",
    "login.password": "Password",
    "login.accessLevel": "Access Level",
    "login.loginButton": "Login to Dashboard",
    "login.authenticating": "Authenticating...",
    "login.depotStaff": "Depot Staff & Procurement Teams",
    "login.seniorOfficials": "Senior Officials",

    // Dashboard Common
    "dashboard.logout": "Logout",
    "dashboard.export": "Export",
    "dashboard.generate": "Generate",
    "dashboard.update": "Update",
    "dashboard.view": "View",
    "dashboard.details": "Details",
    "dashboard.process": "Process",
    "dashboard.verify": "Verify",

    // Depot Dashboard
    "depot.title": "Depot & Procurement Dashboard",
    "depot.totalStock": "Total Stock Items",
    "depot.qrGenerated": "QR Codes Generated",
    "depot.pendingVerifications": "Pending Verifications",
    "depot.lowStockAlerts": "Low Stock Alerts",
    "depot.generateQR": "Generate QR Codes",
    "depot.dispatch": "Dispatch",
    "depot.warranty": "Warranty Claims",

    // Senior Dashboard
    "senior.title": "Senior Officials Analytics Portal",
    "senior.aiAccuracy": "AI Prediction Accuracy",
    "senior.highRisk": "High-Risk Sections",
    "senior.vendorPerformance": "Vendor Performance",
    "senior.complianceRate": "Compliance Rate",
  },
  hi: {
    // Login Page
    "login.title": "रेलवे क्यूआर कोड सिस्टम",
    "login.subtitle": "एआई-संचालित ट्रैक फिटिंग गुणवत्ता नियंत्रण पोर्टल",
    "login.employeeId": "कर्मचारी आईडी",
    "login.password": "पासवर्ड",
    "login.accessLevel": "पहुंच स्तर",
    "login.loginButton": "डैशबोर्ड में लॉगिन करें",
    "login.authenticating": "प्रमाणीकरण...",
    "login.depotStaff": "डिपो स्टाफ और खरीद टीम",
    "login.seniorOfficials": "वरिष्ठ अधिकारी",

    // Dashboard Common
    "dashboard.logout": "लॉगआउट",
    "dashboard.export": "निर्यात",
    "dashboard.generate": "उत्पन्न करें",
    "dashboard.update": "अपडेट",
    "dashboard.view": "देखें",
    "dashboard.details": "विवरण",
    "dashboard.process": "प्रक्रिया",
    "dashboard.verify": "सत्यापित करें",

    // Depot Dashboard
    "depot.title": "डिपो और खरीद डैशबोर्ड",
    "depot.totalStock": "कुल स्टॉक आइटम",
    "depot.qrGenerated": "क्यूआर कोड उत्पन्न",
    "depot.pendingVerifications": "लंबित सत्यापन",
    "depot.lowStockAlerts": "कम स्टॉक अलर्ट",
    "depot.generateQR": "क्यूआर कोड उत्पन्न करें",
    "depot.dispatch": "प्रेषण",
    "depot.warranty": "वारंटी दावे",

    // Senior Dashboard
    "senior.title": "वरिष्ठ अधिकारी विश्लेषण पोर्टल",
    "senior.aiAccuracy": "एआई भविष्यवाणी सटीकता",
    "senior.highRisk": "उच्च जोखिम वाले खंड",
    "senior.vendorPerformance": "विक्रेता प्रदर्शन",
    "senior.complianceRate": "अनुपालन दर",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
