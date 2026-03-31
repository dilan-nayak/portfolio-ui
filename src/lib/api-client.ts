import type { PortfolioContent } from "@/types/portfolio-content";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://localhost:8080";

export const ADMIN_AUTH_STORAGE_KEY = "portfolio.admin.auth.v2";

interface ApiSuccessResponse<T> {
  timestamp: string;
  message: string;
  data: T;
}

interface LoginResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  username: string;
}

interface PortfolioApiResponse {
  content: PortfolioContent;
  updatedAt: string;
  updatedBy: string;
}

interface AdminProfileResponse {
  username: string;
}

export interface AdminSession {
  userName: string;
  token: string;
  expiresAt: string;
}

export class ApiClientError extends Error {
  status: number;
  serviceDown: boolean;
  details?: unknown;

  constructor(message: string, status = 0, serviceDown = false, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.serviceDown = serviceDown;
    this.details = details;
  }
}

const parseJsonSafe = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const normalizeErrorMessage = (payload: unknown, fallback: string): string => {
  if (!payload || typeof payload !== "object") return fallback;
  const candidate = (payload as { message?: unknown }).message;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return fallback;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiClientError("Backend services are down", 0, true);
  }

  if (!response.ok) {
    const payload = await parseJsonSafe(response);
    const message = normalizeErrorMessage(
      payload,
      `Request failed with status ${response.status}`,
    );
    throw new ApiClientError(message, response.status, false, payload);
  }

  const json = (await response.json()) as ApiSuccessResponse<T>;
  return json.data;
}

const authHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const apiClient = {
  async login(username: string, password: string): Promise<AdminSession> {
    const data = await request<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return {
      userName: data.username,
      token: data.token,
      expiresAt: data.expiresAt,
    };
  },

  async me(token: string): Promise<AdminProfileResponse> {
    return request<AdminProfileResponse>("/api/auth/me", {
      method: "GET",
      headers: authHeaders(token),
    });
  },

  async logout(token: string): Promise<void> {
    await request<null>("/api/auth/logout", {
      method: "POST",
      headers: authHeaders(token),
    });
  },

  async getPublicPortfolio(): Promise<PortfolioContent> {
    const data = await request<PortfolioApiResponse>("/api/public/portfolio", {
      method: "GET",
    });
    return data.content;
  },

  async getAdminPortfolio(token: string): Promise<PortfolioContent> {
    const data = await request<PortfolioApiResponse>("/api/admin/portfolio", {
      method: "GET",
      headers: authHeaders(token),
    });
    return data.content;
  },

  async replacePortfolio(token: string, content: PortfolioContent): Promise<PortfolioContent> {
    const data = await request<PortfolioApiResponse>("/api/admin/portfolio", {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    });
    return data.content;
  },

  async replaceSection<TSection>(token: string, section: string, content: TSection): Promise<TSection> {
    const data = await request<{ section: string; content: TSection }>(
      `/api/admin/portfolio/sections/${section}`,
      {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ content }),
      },
    );
    return data.content;
  },

  async patchSection<TSection, TPatch>(
    token: string,
    section: string,
    patch: TPatch,
  ): Promise<TSection> {
    const data = await request<{ section: string; content: TSection }>(
      `/api/admin/portfolio/sections/${section}`,
      {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/merge-patch+json",
      },
      body: JSON.stringify(patch),
      },
    );
    return data.content;
  },
};

export const readAdminSession = (): AdminSession | null => {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed?.token || !parsed?.userName) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const storeAdminSession = (session: AdminSession) => {
  localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
};

export const isServiceDownError = (error: unknown): boolean =>
  error instanceof ApiClientError && error.serviceDown;
