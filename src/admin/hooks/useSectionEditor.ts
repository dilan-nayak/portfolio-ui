import React from "react";
import { usePortfolioContent } from "@/admin/context/PortfolioContentContext";
import { buildMergePatch } from "@/admin/utils/json-merge-patch";
import type { PortfolioContent } from "@/types/portfolio-content";

export type SaveState = "saved" | "saving" | "unsaved";

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const isEqual = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

export const useSectionEditor = <T,>(
  sectionKey: keyof PortfolioContent,
  select: (content: PortfolioContent) => T,
  patch: (content: PortfolioContent, section: T) => PortfolioContent,
) => {
  const { content, saveSection, patchSection } = usePortfolioContent();
  const [draft, setDraft] = React.useState<T | null>(null);
  const [baseline, setBaseline] = React.useState<T | null>(null);
  const [saveState, setSaveState] = React.useState<SaveState>("saved");
  const [sessionKey, setSessionKey] = React.useState(0);
  const selectRef = React.useRef(select);
  const patchRef = React.useRef(patch);

  selectRef.current = select;
  patchRef.current = patch;

  React.useEffect(() => {
    if (!content) return;
    const initial = deepClone(selectRef.current(content));
    setDraft(initial);
    setBaseline(deepClone(initial));
    setSaveState("saved");
    setSessionKey((prev) => prev + 1);
  }, [content]);

  const isDirty = React.useMemo(() => {
    if (!baseline || !draft) return false;
    return !isEqual(draft, baseline);
  }, [baseline, draft]);

  React.useEffect(() => {
    if (isDirty) {
      setSaveState((current) => (current === "saving" ? current : "unsaved"));
    } else {
      setSaveState((current) => (current === "saving" ? current : "saved"));
    }
  }, [isDirty]);

  const save = async () => {
    if (!content || !baseline || !draft || !isDirty) return;
    setSaveState("saving");
    try {
      const nextContent = patchRef.current(content, draft);
      const nextSection = nextContent[sectionKey];
      const currentSection = baseline;
      const mergePatch = buildMergePatch(currentSection, nextSection);

      if (mergePatch === undefined) {
        setSaveState("saved");
        return;
      }

      let persistedSection: T;
      if (
        typeof mergePatch === "object" &&
        mergePatch !== null &&
        !Array.isArray(mergePatch)
      ) {
        persistedSection = (await patchSection(
          sectionKey,
          mergePatch as Record<string, unknown>,
        )) as T;
      } else {
        persistedSection = (await saveSection(sectionKey, nextSection)) as T;
      }
      setDraft(deepClone(persistedSection));
      setBaseline(deepClone(persistedSection));
      setSessionKey((prev) => prev + 1);
      setSaveState("saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed. Check backend/API error and try again.";
      window.dispatchEvent(
        new CustomEvent("admin-save-error", {
          detail: { message },
        }),
      );
      setSaveState("unsaved");
    }
  };

  const reset = () => {
    if (!baseline) return;
    setDraft(deepClone(baseline));
    setSaveState("saved");
    setSessionKey((prev) => prev + 1);
  };

  return {
    content,
    draft,
    setDraft,
    save,
    reset,
    isDirty,
    saveState,
    sessionKey,
  };
};
