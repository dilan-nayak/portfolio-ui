import React, { createContext, useContext, useMemo, useState } from "react";
import {
  ApiClientError,
  apiClient,
  clearAdminSession,
  readAdminSession,
  storeAdminSession,
} from "@/lib/api-client";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  userName: string | null;
  token: string | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

interface StoredAuth {
  userName: string;
  token: string;
  expiresAt: string;
}

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readAdminSession());
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const verify = async () => {
      const session = readAdminSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        await apiClient.me(session.token);
        setAuth(session);
      } catch {
        clearAdminSession();
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    void verify();
  }, []);

  const login: AdminAuthContextValue["login"] = async (username, password) => {
    try {
      const session = await apiClient.login(username.trim(), password);
      storeAdminSession(session);
      setAuth(session);
      return { success: true };
    } catch (error) {
      if (error instanceof ApiClientError) {
        return { success: false, message: error.message };
      }
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    if (auth?.token) {
      void apiClient.logout(auth.token);
    }
    clearAdminSession();
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(auth?.token),
      userName: auth?.userName ?? null,
      token: auth?.token ?? null,
      loading,
      login,
      logout,
    }),
    [auth, loading],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
};
