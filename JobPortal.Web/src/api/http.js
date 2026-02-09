import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://jobportal-api-2026-d9ezffcfh8dhdnfw.westeurope-01.azurewebsites.net"
)
  .trim()
  .replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) return Promise.reject(new Error("Server not reachable"));

    const { data, status } = error.response;

    if (data?.errors && typeof data.errors === "object") {
      const lines = Object.entries(data.errors).flatMap(([field, msgs]) =>
        (Array.isArray(msgs) ? msgs : [msgs]).map((m) => `${field}: ${m}`)
      );
      return Promise.reject(new Error(lines.join("\n")));
    }

    return Promise.reject(
      new Error(data?.message || data?.title || data?.detail || `HTTP ${status}`)
    );
  }
);

// ✅ helper që ti po e përdor kudo:
export async function apiFetch(url, { method = "GET", body, auth = false } = {}) {
  const res = await api.request({
    url,
    method,
    data: body,
    // auth flag e le “opsional”, interceptor e vendos tokenin automatikisht nëse ekziston
  });
  return res.data;
}

