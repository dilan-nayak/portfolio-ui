import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";
import { SafeFaIcon } from "@/lib/icons";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message ?? "Login failed");
      return;
    }

    const redirectTo = (location.state as { from?: string } | null)?.from;
    navigate(redirectTo?.startsWith("/admin") ? redirectTo : "/admin/dashboard", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-300 bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white">
            <SafeFaIcon value={{ library: "fas", icon: "lock" }} className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Login</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Sign in to manage portfolio content.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
