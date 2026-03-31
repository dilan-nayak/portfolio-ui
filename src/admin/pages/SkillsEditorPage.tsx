import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const CompactField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <label className="block space-y-1">
    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{label}</span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/60"
    />
  </label>
);

const SkillsEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "skills",
    (content) => ({
      title: content.skills.title,
      stackHeading: content.skills.stackHeading,
      technologies: content.skills.technologies,
    }),
    (content, section) => ({
      ...content,
      skills: {
        ...content.skills,
        title: section.title,
        stackHeading: section.stackHeading,
        technologies: section.technologies,
      },
    }),
  );
  const [categoryKeys, setCategoryKeys] = useStableListKeys(
    draft?.technologies.length ?? 0,
    sessionKey,
    "skill-category",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  return (
    <AdminPageShell
      title="Technology Stack Editor"
      description="Manage technology categories and chip tags."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <section className="admin-surface">
        <AdminInput
          label="Section Heading (Shared)"
          value={draft.title}
          onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))
          }
        />
        <p className="mt-1 text-xs text-zinc-500">
          This heading is shared across both Technology Stack and Learning pages.
        </p>
      </section>

      <section className="admin-surface">
        <AdminInput
          label="Technology Stack Heading"
          value={draft.stackHeading}
          onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, stackHeading: e.target.value } : prev))
          }
        />
      </section>

      <section className="space-y-4 admin-surface">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
            onClick={() =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      technologies: [
                        ...prev.technologies,
                        { category: "New Category", techs: ["Skill"], color: "from-red-500 to-rose-400" },
                      ],
                    }
                  : prev,
              )
            }
          >
            Add Category
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={categoryKeys}
          onReorder={(nextKeys) => {
            setCategoryKeys(nextKeys);
            setDraft((prev) =>
              prev
                ? {
                    ...prev,
                    technologies: reorderByKeys(prev.technologies, categoryKeys, nextKeys),
                  }
                : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.technologies.map((category, index) => (
            <Reorder.Item
              value={categoryKeys[index]}
              transition={reorderTransition}
              key={categoryKeys[index] ?? `category-${index}`}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-3 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Category {index + 1}
              </span>
              <span className="admin-grab">
                <span aria-hidden className="text-xs leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-2 px-3 py-3 sm:grid-cols-2">
              <CompactField
                label="Category"
                value={category.category}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          technologies: updateAt(prev.technologies, index, {
                            ...category,
                            category: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
              <CompactField
                label="Color Token"
                value={category.color}
                placeholder="from-red-700 to-rose-500"
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          technologies: updateAt(prev.technologies, index, {
                            ...category,
                            color: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider px-3 py-3">
              <p className="mb-2 text-sm font-medium text-zinc-300">Skills</p>
              <div className="flex flex-wrap gap-2">
                {category.techs.map((tech, skillIndex) => (
                  <div key={`${tech}-${skillIndex}`} className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
                    <input
                      value={tech}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextTechs = updateAt(category.techs, skillIndex, e.target.value);
                          return {
                            ...prev,
                            technologies: updateAt(prev.technologies, index, { ...category, techs: nextTechs }),
                          };
                        })
                      }
                      className="w-24 bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextTechs = removeAt(category.techs, skillIndex);
                          return {
                            ...prev,
                            technologies: updateAt(prev.technologies, index, { ...category, techs: nextTechs }),
                          };
                        })
                      }
                      className="text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        technologies: updateAt(prev.technologies, index, {
                          ...category,
                          techs: [...category.techs, "New Skill"],
                        }),
                      };
                    })
                  }
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                >
                  + Skill
                </button>
              </div>
            </div>

            <div className="admin-divider flex gap-2 px-3 py-2.5">
              <button
                type="button"
                onClick={() => {
                  const removedCategory = category;
                  const removedKey = categoryKeys[index];
                  confirmDelete({
                    title: "Delete category?",
                    description: "This skills category and all tags inside it will be removed.",
                    undoLabel: "Category deleted",
                    onConfirm: () => {
                      setCategoryKeys((prev) => removeAt(prev, index));
                      setDraft((prev) =>
                        prev ? { ...prev, technologies: removeAt(prev.technologies, index) } : prev,
                      );
                    },
                    onUndo: () => {
                      if (!removedKey) return;
                      setCategoryKeys((prev) => insertAt(prev, index, removedKey));
                      setDraft((prev) =>
                        prev
                          ? { ...prev, technologies: insertAt(prev.technologies, index, removedCategory) }
                          : prev,
                      );
                    },
                  });
                }}
                className="admin-delete-btn rounded-md px-2 py-1 text-xs"
              >
                Delete
              </button>
            </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>
    </AdminPageShell>
  );
};

export default SkillsEditorPage;
