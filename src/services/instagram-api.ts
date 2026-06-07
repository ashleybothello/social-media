import { getAuthToken } from "@/store/auth-store";

const API_BASE = "http://localhost:8000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "API request failed");
  }
  return res.json();
}

export const instagramApi = {
  getConnectUrl: () => fetchWithAuth("/instagram/connect"),
  handleCallback: (code: string) => fetchWithAuth(`/instagram/callback?code=${encodeURIComponent(code)}`, { method: "POST" }),
  selectAccount: (instagram_id: string) => fetchWithAuth("/instagram/select-account", { method: "POST", body: JSON.stringify({ instagram_id }) }),
  sync: () => fetchWithAuth("/instagram/sync", { method: "POST" }),
  getProfile: () => fetchWithAuth("/instagram/profile"),
  
  getDashboardStats: () => fetchWithAuth("/analytics/dashboard"),
  
  getRecommendations: () => fetchWithAuth("/recommendations/"),
  generateRecommendations: () => fetchWithAuth("/recommendations/generate", { method: "POST" }),
  
  getCompetitors: () => fetchWithAuth("/competitors/list"),
  addCompetitor: (username: string) => fetchWithAuth("/competitors/add", { method: "POST", body: JSON.stringify({ username }) }),
  compareCompetitor: (username: string) => fetchWithAuth(`/competitors/compare/${username}`),
};
