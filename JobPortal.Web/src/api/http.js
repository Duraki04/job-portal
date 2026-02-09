import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  "https://jobportal-api-2026-d9ezffcfh8dhdnfw.westeurope-01.azurewebsites.net"
)
  .trim()
  .replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiFetch(url, options = {}) {
  const { method = "GET", body, ...rest } = options;

  const response = await api.request({
    url,
    method,
    data: body,
    ...rest,
  });

  return response.data;
}
