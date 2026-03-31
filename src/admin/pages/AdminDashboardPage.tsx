import { Link } from "react-router-dom";
import { adminNavItems } from "@/admin/routes/admin-nav";
import { usePortfolioContent } from "@/admin/context/PortfolioContentContext";
import { SafeFaIcon } from "@/lib/icons";

const AdminDashboardPage = () => {
  const { content, resetDraft } = usePortfolioContent();

  if (!content) {
    return <p className="text-zinc-400">Loading dashboard...</p>;
  }

  const cards = [
    { label: "Technologies", value: content.skills.technologies.length },
    { label: "Courses", value: content.skills.learning.length },
    { label: "Companies", value: content.experience.companies.length },
    { label: "Projects", value: content.projects.cards.length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
        <h2 className="text-xl font-semibold text-zinc-100">Welcome to your portfolio CMS</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Manage each section from dedicated editors. Changes are saved locally for now and structured for easy backend API integration later.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetDraft}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 hover:border-red-500/60 hover:text-white"
          >
            Reset Local Draft to JSON
          </button>
          <Link
            to="/"
            className="rounded-lg border border-red-500/50 bg-gradient-to-r from-red-600 to-rose-500 px-3 py-2 text-sm font-semibold text-white"
          >
            Open Public Preview
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-100">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400">Section Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminNavItems
            .filter((item) => item.to !== "/admin/dashboard")
            .map((item) => {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group admin-item transition hover:border-red-500/50"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 group-hover:border-red-500/60 group-hover:text-red-300">
                    <SafeFaIcon value={item.icon} className="h-4 w-4" />
                  </div>
                  <h4 className="font-medium text-zinc-100">{item.label}</h4>
                  <p className="mt-1 text-xs text-zinc-500">Open editor</p>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
