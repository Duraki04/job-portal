const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:5116").replace(/\/$/, "");

async function parseError(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();

      if (data?.errors && typeof data.errors === "object") {
        const lines = Object.entries(data.errors)
          .flatMap(([field, msgs]) =>
            (Array.isArray(msgs) ? msgs : [msgs]).map((m) => `${field}: ${m}`)
          );
        return lines.join("\n") || data.title || data.detail || `HTTP ${res.status}`;
      }

      return (
        data?.message ||
        data?.title ||
        data?.detail ||
        (typeof data === "string" ? data : JSON.stringify(data))
      );
    }

    const text = await res.text();
    return text || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "omit",
  });

  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}
