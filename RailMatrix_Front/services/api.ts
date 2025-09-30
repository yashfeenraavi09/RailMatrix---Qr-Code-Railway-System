

const API_BASE ="https://railmatrixx.onrender.com/api" 


export async function login(employeeId: string, password: string, role: string) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee_id: employeeId, password, role }),
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(data.message || "Login failed");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
  }

  return data;
}
