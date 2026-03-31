import React from "react";
import type { SaveState } from "@/admin/hooks/useSectionEditor";
import { SafeFaIcon } from "@/lib/icons";

interface AdminPageShellProps {
  title: string;
  description: string;
  saveState: SaveState;
  isDirty: boolean;
  changeSessionKey?: number;
  onSave: () => void;
  onReset: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const stateStyles: Record<SaveState, string> = {
  saved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  saving: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  unsaved: "bg-red-500/15 text-red-300 border-red-500/30",
};

const stateLabel: Record<SaveState, string> = {
  saved: "Saved",
  saving: "Saving",
  unsaved: "Unsaved",
};

const AdminPageShell = ({
  title,
  description,
  saveState,
  isDirty,
  changeSessionKey = 0,
  onSave,
  onReset,
  children,
  actions,
}: AdminPageShellProps) => {
  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("admin-dirty-change", { detail: { isDirty } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("admin-dirty-change", { detail: { isDirty: false } }),
      );
    };
  }, [isDirty]);

  return (
    <div className="space-y-7 rounded-2xl transition-colors duration-300">
      <div className="rounded-2xl border border-zinc-300 bg-white p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/45">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[1.65rem] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <span
              className={`inline-flex min-w-[96px] items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide ${stateStyles[saveState]}`}
            >
              {saveState === "saving" ? (
                <SafeFaIcon value={{ library: "fas", icon: "gear" }} className="h-3.5 w-3.5 animate-spin" />
              ) : null}
              {stateLabel[saveState]}
            </span>
            <button
              type="button"
              onClick={onReset}
              disabled={!isDirty || saveState === "saving"}
              className="rounded-xl border border-zinc-700/90 bg-zinc-900/60 px-3.5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!isDirty || saveState === "saving"}
              className="rounded-xl border border-red-500/60 bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div key={changeSessionKey} className="space-y-5">
        {children}
      </div>
    </div>
  );
};

export default AdminPageShell;
