import React from "react";
import AdminPageShell from "@/admin/components/AdminPageShell";
import {
  ANALYTICS_UPDATED_EVENT,
  getAnalyticsSummary,
} from "@/lib/portfolio-analytics";

type MetricBlockProps = {
  label: string;
  value: string | number;
};

const MetricBlock = ({ label, value }: MetricBlockProps) => (
  <div className="admin-item rounded-xl p-4">
    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
  </div>
);

const TopList = ({
  title,
  values,
}: {
  title: string;
  values: Record<string, number>;
}) => {
  const rows = Object.entries(values).sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <div className="admin-surface rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">No data yet</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map(([name, count]) => (
            <li key={name} className="flex items-center justify-between text-sm">
              <span className="truncate text-zinc-700 dark:text-zinc-200">{name}</span>
              <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                {count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AnalyticsPage = () => {
  const [, setRefreshToken] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => setRefreshToken((v) => v + 1);
    window.addEventListener(ANALYTICS_UPDATED_EVENT, refresh as EventListener);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(ANALYTICS_UPDATED_EVENT, refresh as EventListener);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Recompute when refresh token changes; no memoization needed here.
  const summary = getAnalyticsSummary();

  return (
    <AdminPageShell
      title="Analytics"
      description="Lightweight portfolio analytics (client-side for now)."
      saveState="saved"
      isDirty={false}
      onSave={() => {}}
      onReset={() => {}}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricBlock label="Total Visits" value={summary.totalVisits} />
        <MetricBlock label="Visits Today" value={summary.visitsToday} />
        <MetricBlock label="Avg Time Spent" value={`${summary.timeSpentAvgSeconds}s`} />
        <MetricBlock label="Tracked Events" value={summary.totalEvents} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TopList title="Visits Per Day" values={summary.visitsPerDay} />
        <TopList title="Visits Per Hour" values={summary.visitsPerHour} />
        <TopList title="Traffic Sources" values={summary.trafficSource} />
        <TopList title="Browser Type" values={summary.browserType} />
        <TopList title="Operating System" values={summary.osType} />
        <TopList title="Device Type" values={summary.deviceType} />
      </section>

      <section className="admin-surface rounded-xl p-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Interactions</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <MetricBlock label="Button Clicks" value={summary.clickCounts.button} />
          <MetricBlock label="Link Clicks" value={summary.clickCounts.link} />
          <MetricBlock label="Download Clicks" value={summary.clickCounts.download} />
        </div>
      </section>
    </AdminPageShell>
  );
};

export default AnalyticsPage;
