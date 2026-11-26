import {
  FALLBACK_CATEGORIES,
  FALLBACK_ENTRIES,
  FALLBACK_SITE,
  filterFallbackEntries,
} from "./fallbackData";
import type {
  Category,
  CategoryInput,
  EntryDetail,
  EntrySummary,
  LoginResponse,
  SiteSettings,
  UpdateSiteInput,
  UploadedFile,
  UpsertEntryInput,
  UserInfo,
} from "./types";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";
const TOKEN_KEY = "hof_admin_token";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  let data: any = null;
  if (text) {
    if (!contentType.includes("application/json") && text.trimStart().startsWith("<")) {
      throw new ApiError(
        res.status || 503,
        "API server is not connected. Set VITE_API_BASE_URL to your Spring Boot API.",
      );
    }
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(res.status || 500, "Invalid response from API server.");
    }
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, data?.fieldErrors);
  }

  return data as T;
}

async function withFallback<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // When deployed on a static host (e.g. Vercel) without VITE_API_BASE_URL set,
    // /api/* returns HTML or 503; fall back to built-in sample data for public reads.
    if (!BASE_URL && (err instanceof ApiError || err instanceof TypeError)) {
      return fallback();
    }
    throw err;
  }
}

export const api = {
  // Public
  getSite: () => withFallback(() => request<SiteSettings>("/api/site"), () => FALLBACK_SITE),
  getCategories: () =>
    withFallback(() => request<Category[]>("/api/categories"), () => FALLBACK_CATEGORIES),
  getEntries: (params?: {
    category?: string;
    tag?: string;
    q?: string;
    sort?: string;
    featured?: boolean;
  }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.tag) qs.set("tag", params.tag);
    if (params?.q) qs.set("q", params.q);
    if (params?.sort) qs.set("sort", params.sort);
    if (params?.featured !== undefined) qs.set("featured", String(params.featured));
    const query = qs.toString();
    return withFallback(
      () => request<EntrySummary[]>(`/api/entries${query ? `?${query}` : ""}`),
      () => filterFallbackEntries(params),
    );
  },
  getEntryBySlug: (slug: string) =>
    withFallback(
      () => request<EntryDetail>(`/api/entries/${encodeURIComponent(slug)}`),
      () => {
        const found = FALLBACK_ENTRIES.find((e) => e.slug === slug);
        if (!found) throw new ApiError(404, "Entry not found");
        return found;
      },
    ),

  // Auth
  login: (username: string, password: string) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<UserInfo>("/api/auth/me"),

  // Admin: Entries
  createEntry: (payload: UpsertEntryInput) =>
    request<EntryDetail>("/api/entries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateEntry: (id: number, payload: UpsertEntryInput) =>
    request<EntryDetail>(`/api/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteEntry: (id: number) =>
    request<void>(`/api/entries/${id}`, {
      method: "DELETE",
    }),
  reorderEntries: (items: { id: number; rankOrder: number }[]) =>
    request<void>("/api/entries/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    }),

  // Admin: Categories
  createCategory: (payload: CategoryInput) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateCategory: (id: number, payload: CategoryInput) =>
    request<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id: number) =>
    request<void>(`/api/categories/${id}`, {
      method: "DELETE",
    }),
  reorderCategories: (items: { id: number; sortOrder: number }[]) =>
    request<Category[]>("/api/categories/reorder", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    }),

  // Admin: Site settings
  updateSite: (payload: UpdateSiteInput) =>
    request<SiteSettings>("/api/site", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  // Admin: Uploads
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<UploadedFile>("/api/uploads", {
      method: "POST",
      body: form,
    });
  },
};
