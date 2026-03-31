import React from "react";
import { MotionConfig } from "framer-motion";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminNavItems, adminTitleByPath } from "@/admin/routes/admin-nav";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";
import { usePortfolioContent } from "@/admin/context/PortfolioContentContext";
import { AdminActionGuardProvider } from "@/admin/context/AdminActionGuardContext";
import { SafeFaIcon } from "@/lib/icons";
import ServiceDownState from "@/components/ServiceDownState";

const AdminLayout = () => {
  const { userName, logout } = useAdminAuth();
  const { error, serviceDown, reloadContent } = usePortfolioContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = React.useState<string | null>(null);
  const [saveErrorToast, setSaveErrorToast] = React.useState<string | null>(null);
  const [isDark, setIsDark] = React.useState(
    () => document.documentElement.classList.contains("dark"),
  );

  const pageTitle = adminTitleByPath[location.pathname] ?? "Admin";
  const isRouteActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const guardedNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetPath: string,
  ) => {
    if (!hasUnsavedChanges || location.pathname === targetPath) return;
    event.preventDefault();
    setPendingNavigationPath(targetPath);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  React.useEffect(() => {
    const handleDirtyChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isDirty?: boolean }>;
      setHasUnsavedChanges(Boolean(customEvent.detail?.isDirty));
    };
    const handleAuthExpired = () => {
      logout();
      navigate("/admin/login", { replace: true });
    };
    const handleSaveError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setSaveErrorToast(customEvent.detail?.message ?? "Save failed. Please try again.");
    };

    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("admin-dirty-change", handleDirtyChange as EventListener);
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("admin-auth-expired", handleAuthExpired as EventListener);
    window.addEventListener("admin-save-error", handleSaveError as EventListener);

    return () => {
      window.removeEventListener("admin-dirty-change", handleDirtyChange as EventListener);
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("admin-auth-expired", handleAuthExpired as EventListener);
      window.removeEventListener("admin-save-error", handleSaveError as EventListener);
    };
  }, [hasUnsavedChanges, logout, navigate]);

  React.useEffect(() => {
    if (!saveErrorToast) return;
    const timer = window.setTimeout(() => setSaveErrorToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [saveErrorToast]);

  return (
    <MotionConfig reducedMotion="never">
      <AdminActionGuardProvider>
      <div className="admin-root min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1700px]">
        <aside
          className={`hidden border-r border-zinc-200 bg-white/85 px-3 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 lg:block ${
            collapsed ? "w-[90px]" : "w-[280px]"
          }`}
        >
          <div className="mb-6 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {collapsed ? "CMS" : "Portfolio CMS"}
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? (
                <SafeFaIcon value={{ library: "fas", icon: "bars" }} className="h-4 w-4" />
              ) : (
                <SafeFaIcon value={{ library: "fas", icon: "xmark" }} className="h-4 w-4" />
              )}
            </button>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const parentActive =
                item.children?.some((child) => isRouteActive(child.to)) || isRouteActive(item.to);

              return (
                <div key={item.to} className="space-y-1">
                  <NavLink
                    to={item.to}
                    onClick={(event) => guardedNavClick(event, item.to)}
                    className={() =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        parentActive
                          ? "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md"
                          : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      }`
                    }
                  >
                    <SafeFaIcon value={item.icon} className="h-4 w-4" />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </NavLink>

                  {!collapsed && item.children?.length ? (
                    <div className="ml-8 space-y-1.5 border-l border-zinc-300 pl-3 dark:border-zinc-700">
                      {item.children.map((child) => {
                        const childActive = isRouteActive(child.to);
                        return (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={(event) => guardedNavClick(event, child.to)}
                            className={() =>
                              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                childActive
                                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200"
                                  : "text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                              }`
                            }
                          >
                            <SafeFaIcon value={child.icon} className="h-3.5 w-3.5" />
                            <span>{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 md:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Admin Panel</p>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{pageTitle}</h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-700 transition hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {isDark ? (
                    <SafeFaIcon value={{ library: "fas", icon: "sun" }} className="h-4 w-4" />
                  ) : (
                    <SafeFaIcon value={{ library: "fas", icon: "moon" }} className="h-4 w-4" />
                  )}
                </button>
                <div className="hidden rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 sm:block">
                  {userName ?? "Admin"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/admin/login", { replace: true });
                  }}
                  className="rounded-lg border border-red-500/60 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 transition-colors duration-300 md:p-6">
            {error ? (
              serviceDown ? (
                <div className="mb-4">
                  <ServiceDownState
                    title="Admin data bridge is offline"
                    subtitle="You can still browse layout, but saving/loading content is paused."
                    onRetry={() => {
                      void reloadContent();
                    }}
                    details={error}
                    fullScreen={false}
                  />
                </div>
              ) : (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {`Failed to load admin content: ${error}`}
                </div>
              )
            ) : null}
            <Outlet />
          </main>
        </div>
      </div>

      {pendingNavigationPath ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={() => setPendingNavigationPath(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <SafeFaIcon value={{ library: "fas", icon: "circle-question" }} className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Leave without saving?</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">You have unsaved changes on this page.</p>
              </div>
            </div>
            <p className="mb-6 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              If you continue, your recent edits will be lost. You can stay here and save changes first.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingNavigationPath(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextPath = pendingNavigationPath;
                  setPendingNavigationPath(null);
                  if (nextPath) navigate(nextPath);
                }}
                className="rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-rose-400"
              >
                Leave Page
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {saveErrorToast ? (
        <div className="fixed bottom-5 right-5 z-[85] max-w-sm rounded-xl border border-red-500/40 bg-zinc-900/95 px-4 py-3 text-sm text-red-200 shadow-2xl">
          <p className="font-semibold text-red-300">Save failed</p>
          <p className="mt-1 text-red-200/90">{saveErrorToast}</p>
        </div>
      ) : null}
      </div>
      </AdminActionGuardProvider>
    </MotionConfig>
  );
};

export default AdminLayout;
