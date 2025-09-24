const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://rail-web-1.onrender.com"

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body instanceof FormData
        ? {} 
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.msg || data.error || `API error: ${res.status}`)
  }
  return data
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(data.msg || "Login failed")
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token)
  }
  return data
}

export async function logout() {
  const data = await apiFetch("/logout", { method: "POST" })
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
  return data
}


export async function uploadDefect(formData: FormData) {
  return apiFetch("/defect/upload", {
    method: "POST",
    body: formData,
  })
}

export async function getDefects() {
  return apiFetch("/defects")
}

export async function getDefectById(id: string) {
  return apiFetch(`/defects/${id}`)
}

export async function getStats() {
  return apiFetch("/stats")
}

export async function createQrCode(data: {
  uid?: string
  location?: string
  fitting_type?: string
  installation_date?: string
  metadata?: any
}) {
  return apiFetch("/qr/create", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Retrieve QR details
export async function retrieveQr(uid: string, hmac: string) {
  return apiFetch("/qr/retrieve", {
    method: "POST",
    body: JSON.stringify({ uid, hmac }),
  })
}
