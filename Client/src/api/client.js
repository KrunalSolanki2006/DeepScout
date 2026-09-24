/**
 * DeepScout API Client
 * Centralized fetch wrapper with credentials (httpOnly cookies), JSON parsing, and unified error handling.
 */

const API_BASE = ""; // Relative path allows Vite proxy in development and same-domain in production

export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // essential for httpOnly cookie transport
    ...options,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => "");
      data = { text };
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data?.error === "object" ? data?.error?.message : data?.error) ||
        data?.message ||
        `Request failed with status ${response.status}`;
      throw new ApiError(String(errorMessage), response.status, data?.details || data?.error);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network / offline failure
    throw new ApiError(
      "Unable to connect to DeepScout service. Please check your network connection.",
      0,
      error.message
    );
  }
}
