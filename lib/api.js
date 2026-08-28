const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://optik-kayumanis-backend.vercel.app/api";

async function request(path, { method = "GET", body, token, cache, next } = {}) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  if (cache) {
    options.cache = cache;
  } else if (next) {
    options.next = next;
  } else if (method === "GET" && !token) {
    options.next = { revalidate: 30 }; // Cache public GET data for 30s for superfast rendering
  } else {
    options.cache = "no-store";
  }

  const res = await fetch(`${API_URL}${path}`, options);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Terjadi kesalahan, silakan coba lagi.");
  }
  return data;
}

export const api = {
  get: (path, token, options = {}) => request(path, { token, ...options }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  put: (path, body, token) => request(path, { method: "PUT", body, token }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  del: (path, token) => request(path, { method: "DELETE", token }),
  // For file uploads: pass a FormData instance. Do NOT set Content-Type —
  // the browser sets the correct multipart boundary automatically.
  upload: async (path, formData, token) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Gagal mengunggah file.");
    }
    return data;
  },
};

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}
