import React from "react";
import { searchIcons, type IconChoice } from "@/lib/icon-catalog";
import { iconLabelFromValue, normalizeIconValue, SafeFaIcon } from "@/lib/icons";
import type { IconValue } from "@/types/portfolio-content";

interface IconPickerProps {
  value?: IconValue | string | null;
  onChange: (value: IconValue) => void;
  label?: string;
}

const IconPicker = ({ value, onChange, label = "Icon" }: IconPickerProps) => {
  const instanceId = React.useId();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<IconChoice[]>(() => searchIcons("", 12));

  const normalized = React.useMemo(() => normalizeIconValue(value), [value]);
  const initialValueRef = React.useRef(normalized);
  const isChanged =
    normalized.library !== initialValueRef.current.library ||
    normalized.icon !== initialValueRef.current.icon;

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setResults(searchIcons(query, 12));
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [query]);

  React.useEffect(() => {
    const onPointerDownOutside = (event: MouseEvent) => {
      if (!open) return;
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDownOutside);
    return () => document.removeEventListener("mousedown", onPointerDownOutside);
  }, [open]);

  React.useEffect(() => {
    const onAnotherPickerOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string }>;
      if (customEvent.detail?.id !== instanceId) {
        setOpen(false);
      }
    };

    window.addEventListener("icon-picker-open", onAnotherPickerOpen as EventListener);
    return () => window.removeEventListener("icon-picker-open", onAnotherPickerOpen as EventListener);
  }, [instanceId]);

  return (
    <div ref={rootRef} className="relative">
      <p className="mb-1 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => {
            const nextOpen = !prev;
            if (nextOpen) {
              window.dispatchEvent(new CustomEvent("icon-picker-open", { detail: { id: instanceId } }));
            }
            return nextOpen;
          })
        }
        className={`flex h-12 w-full items-center justify-between rounded-xl border px-3 text-left text-zinc-900 transition hover:border-zinc-400 dark:text-zinc-100 ${
          isChanged
            ? "border-amber-500/60 bg-amber-500/10"
            : "border-zinc-300/80 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <SafeFaIcon value={normalized} className="h-4 w-4" />
          <span>{iconLabelFromValue(normalized)}</span>
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{normalized.library}:{normalized.icon}</span>
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icon by label"
            className="mb-2 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {results.length ? (
              results.map((item) => {
                const selected = item.library === normalized.library && item.icon === normalized.icon;
                return (
                  <button
                    key={`${item.library}:${item.icon}`}
                    type="button"
                    onClick={() => {
                      onChange({ library: item.library, icon: item.icon });
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition ${
                      selected
                        ? "bg-red-500/15 text-red-300"
                        : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <SafeFaIcon value={item} className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="text-xs opacity-70">{item.library}:{item.icon}</span>
                  </button>
                );
              })
            ) : (
              <p className="rounded-lg px-2 py-3 text-sm text-zinc-500 dark:text-zinc-400">No results found.</p>
            )}
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onChange(normalizeIconValue(null));
                setOpen(false);
              }}
              className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(IconPicker);
