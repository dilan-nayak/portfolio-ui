import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PortfolioContent } from "@/types/portfolio-content";
import { resolvePortfolioContentAssets } from "@/assets/portfolioAssetMap";
import {
  ApiClientError,
  apiClient,
  clearAdminSession,
  isServiceDownError,
  readAdminSession,
} from "@/lib/api-client";
import {
  DEFAULT_INQUIRY_CHIPS,
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_THEME_SETTINGS,
} from "@/lib/portfolio-defaults";
import { normalizeIconValue } from "@/lib/icons";

interface PortfolioContentContextValue {
  content: PortfolioContent | null;
  loading: boolean;
  error: string | null;
  serviceDown: boolean;
  setContent: React.Dispatch<React.SetStateAction<PortfolioContent | null>>;
  saveContent: (next: PortfolioContent) => Promise<void>;
  saveSection: <K extends keyof PortfolioContent>(
    section: K,
    nextSection: PortfolioContent[K],
  ) => Promise<PortfolioContent[K]>;
  patchSection: <K extends keyof PortfolioContent>(
    section: K,
    patch: Partial<PortfolioContent[K]> | Record<string, unknown>,
  ) => Promise<PortfolioContent[K]>;
  resetDraft: () => Promise<void>;
  reloadContent: () => Promise<void>;
}

const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null);

const enrichContent = (raw: PortfolioContent): PortfolioContent => ({
  ...raw,
  hero: {
    ...raw.hero,
    socialLinks: raw.hero.socialLinks.map((link) => ({
      ...link,
      icon: normalizeIconValue(link.icon),
    })),
  },
  contact: {
    ...raw.contact,
    contactInfo: raw.contact.contactInfo.map((item) => ({
      ...item,
      icon: normalizeIconValue(item.icon),
    })),
    socialLinks: raw.contact.socialLinks.map((item) => ({
      ...item,
      icon: normalizeIconValue(item.icon),
    })),
    inquiryChips: raw.contact.inquiryChips ?? DEFAULT_INQUIRY_CHIPS,
  },
  ui: {
    sectionVisibility: {
      ...DEFAULT_SECTION_VISIBILITY,
      ...(raw.ui?.sectionVisibility ?? {}),
    },
    theme: {
      ...DEFAULT_THEME_SETTINGS,
      ...(raw.ui?.theme ?? {}),
    },
  },
});

export const PortfolioContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [baseContent, setBaseContent] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceDown, setServiceDown] = useState(false);

  const applyContent = (raw: PortfolioContent) => {
    const enriched = enrichContent(raw);
    const resolved = resolvePortfolioContentAssets(enriched);
    setBaseContent(resolved);
    setContent(resolved);
  };

  const loadFromApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    setServiceDown(false);
    try {
      const session = readAdminSession();
      let data: PortfolioContent;
      if (session?.token) {
        try {
          data = await apiClient.getAdminPortfolio(session.token);
        } catch (error) {
          if (error instanceof ApiClientError && error.status === 401) {
            clearAdminSession();
            data = await apiClient.getPublicPortfolio();
          } else {
            throw error;
          }
        }
      } else {
        data = await apiClient.getPublicPortfolio();
      }
      applyContent(data);
    } catch (err) {
      if (isServiceDownError(err)) {
        setServiceDown(true);
        setError("Oops, backend services are down.");
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFromApi();
  }, [loadFromApi]);

  const saveContent = async (next: PortfolioContent) => {
    const session = readAdminSession();
    if (!session?.token) {
      setError("Admin session expired. Please login again.");
      window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      throw new Error("Admin session expired. Please login again.");
    }

    setError(null);
    setServiceDown(false);
    try {
      const saved = await apiClient.replacePortfolio(session.token, next);
      applyContent(saved);
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 401 || err.status === 403)) {
        clearAdminSession();
        setError("Admin session expired. Please login again.");
        window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      } else if (isServiceDownError(err)) {
        setServiceDown(true);
        setError("Oops, backend services are down.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
      throw err;
    }
  };

  const saveSection = async <K extends keyof PortfolioContent>(
    section: K,
    nextSection: PortfolioContent[K],
  ): Promise<PortfolioContent[K]> => {
    const session = readAdminSession();
    if (!session?.token) {
      setError("Admin session expired. Please login again.");
      window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      throw new Error("Admin session expired. Please login again.");
    }

    setError(null);
    setServiceDown(false);
    let savedSection: PortfolioContent[K];
    try {
      savedSection = await apiClient.replaceSection<PortfolioContent[K]>(
        session.token,
        String(section),
        nextSection,
      );
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 401 || err.status === 403)) {
        clearAdminSession();
        setError("Admin session expired. Please login again.");
        window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      } else if (isServiceDownError(err)) {
        setServiceDown(true);
        setError("Oops, backend services are down.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
      throw err;
    }

    setContent((prev) => (prev ? { ...prev, [section]: savedSection } : prev));
    setBaseContent((prev) => (prev ? { ...prev, [section]: savedSection } : prev));
    return savedSection;
  };

  const patchSection = async <K extends keyof PortfolioContent>(
    section: K,
    patch: Partial<PortfolioContent[K]> | Record<string, unknown>,
  ): Promise<PortfolioContent[K]> => {
    const session = readAdminSession();
    if (!session?.token) {
      setError("Admin session expired. Please login again.");
      window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      throw new Error("Admin session expired. Please login again.");
    }

    setError(null);
    setServiceDown(false);
    let savedSection: PortfolioContent[K];
    try {
      savedSection = await apiClient.patchSection<PortfolioContent[K], typeof patch>(
        session.token,
        String(section),
        patch,
      );
    } catch (err) {
      if (err instanceof ApiClientError && (err.status === 401 || err.status === 403)) {
        clearAdminSession();
        setError("Admin session expired. Please login again.");
        window.dispatchEvent(new CustomEvent("admin-auth-expired"));
      } else if (isServiceDownError(err)) {
        setServiceDown(true);
        setError("Oops, backend services are down.");
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
      throw err;
    }

    setContent((prev) => (prev ? { ...prev, [section]: savedSection } : prev));
    setBaseContent((prev) => (prev ? { ...prev, [section]: savedSection } : prev));
    return savedSection;
  };

  const resetDraft = async () => {
    if (baseContent) {
      setContent(baseContent);
      return;
    }
    await loadFromApi();
  };

  const value = useMemo(
    () => ({
      content,
      loading,
      error,
      serviceDown,
      setContent,
      saveContent,
      saveSection,
      patchSection,
      resetDraft,
      reloadContent: loadFromApi,
    }),
    [content, loading, error, serviceDown, loadFromApi],
  );

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  );
};

export const usePortfolioContent = () => {
  const context = useContext(PortfolioContentContext);
  if (!context) {
    throw new Error("usePortfolioContent must be used within PortfolioContentProvider");
  }
  return context;
};
