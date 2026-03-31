import React from "react";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminSwitch } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import {
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_THEME_SETTINGS,
} from "@/lib/portfolio-defaults";

type AccentTheme = {
  lightAccentStart: string;
  lightAccentEnd: string;
  darkAccentStart: string;
  darkAccentEnd: string;
};

type ThemePreset = {
  id: string;
  name: string;
  colors: AccentTheme;
};

const THEME_PRESETS_STORAGE_KEY = "portfolio.theme.presets.v1";

const colorFields: Array<{
  key: keyof AccentTheme;
  label: string;
}> = [
  { key: "lightAccentStart", label: "Light Start" },
  { key: "lightAccentEnd", label: "Light End" },
  { key: "darkAccentStart", label: "Dark Start" },
  { key: "darkAccentEnd", label: "Dark End" },
];

const isHexColor = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value);

const normalizeHex = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#([0-9a-fA-F]{3})$/.test(prefixed)) {
    const raw = prefixed.slice(1);
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toLowerCase();
  }
  return prefixed.toLowerCase();
};

const readThemePresets = (): ThemePreset[] => {
  try {
    const raw = localStorage.getItem(THEME_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ThemePreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveThemePresets = (presets: ThemePreset[]) => {
  localStorage.setItem(THEME_PRESETS_STORAGE_KEY, JSON.stringify(presets));
};

const ThemeColorControl = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) => {
  const [draftHex, setDraftHex] = React.useState(value);

  React.useEffect(() => {
    setDraftHex(value);
  }, [value]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3 transition hover:border-zinc-700">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-zinc-400">{label}</p>
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300">
          {value.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label className="group relative inline-flex h-10 w-10 cursor-pointer overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
          />
          <span
            className="h-full w-full"
            style={{
              backgroundColor: value,
            }}
          />
        </label>
        <input
          type="text"
          value={draftHex}
          onChange={(e) => setDraftHex(e.target.value)}
          onBlur={() => {
            const normalized = normalizeHex(draftHex);
            if (isHexColor(normalized)) {
              onChange(normalized);
              setDraftHex(normalized);
            } else {
              setDraftHex(value);
            }
          }}
          className="h-10 flex-1 rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500"
          placeholder="#dc2626"
        />
      </div>
    </div>
  );
};

const SettingsEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "ui",
    (content) => content.ui ?? { sectionVisibility: DEFAULT_SECTION_VISIBILITY, theme: DEFAULT_THEME_SETTINGS },
    (content, section) => ({ ...content, ui: section }),
  );

  const [themePresets, setThemePresets] = React.useState<ThemePreset[]>([]);
  const [lastSavedTheme, setLastSavedTheme] = React.useState<AccentTheme | null>(null);
  const { confirmDelete } = useAdminActionGuard();

  React.useEffect(() => {
    setThemePresets(readThemePresets());
  }, []);

  React.useEffect(() => {
    if (!draft || lastSavedTheme) return;
    setLastSavedTheme({ ...draft.theme });
  }, [draft, lastSavedTheme]);

  React.useEffect(() => {
    if (!draft) return;
    if (saveState === "saved") {
      setLastSavedTheme({ ...draft.theme });
    }
  }, [saveState, draft]);

  if (!draft) return null;

  const updateTheme = (key: keyof AccentTheme, value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            theme: {
              ...prev.theme,
              [key]: value,
            },
          }
        : prev,
    );
  };

  const saveCurrentPreset = () => {
    const presetName = `Preset ${themePresets.length + 1}`;
    const nextPreset: ThemePreset = {
      id: String(Date.now()),
      name: presetName,
      colors: { ...draft.theme },
    };
    const next = [nextPreset, ...themePresets].slice(0, 12);
    setThemePresets(next);
    saveThemePresets(next);
  };

  const applyPreset = (preset: ThemePreset) => {
    setDraft((prev) => (prev ? { ...prev, theme: { ...preset.colors } } : prev));
  };

  const deletePreset = (presetId: string) => {
    const next = themePresets.filter((preset) => preset.id !== presetId);
    setThemePresets(next);
    saveThemePresets(next);
  };

  const restorePreset = (preset: ThemePreset) => {
    setThemePresets((prev) => {
      const next = [preset, ...prev.filter((item) => item.id !== preset.id)].slice(0, 12);
      saveThemePresets(next);
      return next;
    });
  };

  const restoreLastSavedTheme = () => {
    if (!lastSavedTheme) return;
    setDraft((prev) => (prev ? { ...prev, theme: { ...lastSavedTheme } } : prev));
  };

  return (
    <AdminPageShell
      title="Settings"
      description="Control section visibility and brand accent colors for light/dark themes."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <section className="admin-surface">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">Section Visibility</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(draft.sectionVisibility).map(([key, visible]) => (
            <AdminSwitch
              key={key}
              label={key}
              checked={visible}
              onChange={(checked) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        sectionVisibility: {
                          ...prev.sectionVisibility,
                          [key]: checked,
                        },
                      }
                    : prev,
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="admin-surface">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">Theme Accent Colors</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={restoreLastSavedTheme}
              className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-500"
            >
              Restore Last Saved
            </button>
            <button
              type="button"
              onClick={saveCurrentPreset}
              className="rounded-lg border border-red-500/60 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
            >
              Save Preset
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(290px,0.9fr)]">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {colorFields.map((field) => (
                <ThemeColorControl
                  key={field.key}
                  label={field.label}
                  value={draft.theme[field.key]}
                  onChange={(next) => updateTheme(field.key, next)}
                />
              ))}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-zinc-400">Saved Presets</p>
              {themePresets.length === 0 ? (
                <p className="text-sm text-zinc-500">No presets yet. Save your current 4-color combination.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {themePresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-2.5 transition hover:border-zinc-700"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-medium text-zinc-200">{preset.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete({
                              title: "Delete preset?",
                              description: "This saved color preset will be removed.",
                              undoLabel: "Preset deleted",
                              onConfirm: () => deletePreset(preset.id),
                              onUndo: () => restorePreset(preset),
                            })
                          }
                          className="admin-delete-btn rounded-md px-1.5 py-0.5 text-[10px] transition"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="block w-full rounded-lg border border-zinc-700 p-1 transition hover:border-zinc-500"
                      >
                        <div className="grid grid-cols-4 gap-1">
                          <span className="h-6 rounded-sm" style={{ backgroundColor: preset.colors.lightAccentStart }} />
                          <span className="h-6 rounded-sm" style={{ backgroundColor: preset.colors.lightAccentEnd }} />
                          <span className="h-6 rounded-sm" style={{ backgroundColor: preset.colors.darkAccentStart }} />
                          <span className="h-6 rounded-sm" style={{ backgroundColor: preset.colors.darkAccentEnd }} />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/45 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-zinc-400">Live Accent Preview</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-300/70 bg-[#f2ede6] p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-700">Light Theme</p>
                <div
                  className="h-10 rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, ${draft.theme.lightAccentStart}, ${draft.theme.lightAccentEnd})`,
                  }}
                />
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-white"
                    style={{
                      background: `linear-gradient(90deg, ${draft.theme.lightAccentStart}, ${draft.theme.lightAccentEnd})`,
                    }}
                  >
                    Accent
                  </span>
                  <span className="text-xs text-zinc-600">Preview chip</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">Dark Theme</p>
                <div
                  className="h-10 rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, ${draft.theme.darkAccentStart}, ${draft.theme.darkAccentEnd})`,
                  }}
                />
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-white"
                    style={{
                      background: `linear-gradient(90deg, ${draft.theme.darkAccentStart}, ${draft.theme.darkAccentEnd})`,
                    }}
                  >
                    Accent
                  </span>
                  <span className="text-xs text-zinc-500">Preview chip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminPageShell>
  );
};

export default SettingsEditorPage;
