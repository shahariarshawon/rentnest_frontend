import { API_BASE_URL, AUTH_TOKEN_KEY } from "./constants";
import type { ApiResponse } from "@/types/api";

export class ApiClientError extends Error {
  public status: number;
  public errorDetails?: unknown;

  constructor(message: string, status: number, errorDetails?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errorDetails = errorDetails;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  token?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = isAbsolute ? endpoint : `${base}${path}`;

  if (!params) {
    return fullUrl;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  if (!queryString) {
    return fullUrl;
  }

  return fullUrl.includes("?")
    ? `${fullUrl}&${queryString}`
    : `${fullUrl}?${queryString}`;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions & { body?: unknown } = {},
): Promise<ApiResponse<T>> {
  const { token, params, body, headers, ...rest } = options;

  const url = buildUrl(endpoint, params);

  const requestHeaders = new Headers(headers);

  // Set default JSON content type for methods with body
  if (body !== undefined && !(body instanceof FormData)) {
    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  // Authorization header
  const authToken = token ?? getStoredToken();
  if (authToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const serializedBody =
    body !== undefined
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined;

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: serializedBody,
  });

  let responseData: unknown = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorDetails: unknown = undefined;

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData
    ) {
      errorMessage = String((responseData as { message: unknown }).message);
      if ("errorDetails" in responseData) {
        errorDetails = (responseData as { errorDetails: unknown }).errorDetails;
      }
    }

    throw new ApiClientError(errorMessage, response.status, errorDetails);
  }

  return responseData as ApiResponse<T>;
}

export const apiClient = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) => request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) => request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) => request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
