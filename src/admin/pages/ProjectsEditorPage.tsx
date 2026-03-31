import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput, AdminTextarea } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { fileToDataUrl, insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const ProjectsEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "projects",
    (content) => content.projects,
    (content, section) => ({ ...content, projects: section }),
  );
  const [projectKeys, setProjectKeys] = useStableListKeys(
    draft?.cards.length ?? 0,
    sessionKey,
    "project-card",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  const uploadProjectImage = async (index: number, file: File | null) => {
    if (!file) return;
    const src = await fileToDataUrl(file);
    setDraft((prev) => {
      if (!prev) return prev;
      const project = prev.cards[index];
      return {
        ...prev,
        cards: updateAt(prev.cards, index, { ...project, image: src }),
      };
    });
  };

  return (
    <AdminPageShell
      title="Projects Editor"
      description="Manage project cards, tags, links, featured state, and ordering."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <section className="admin-surface">
        <AdminInput
          label="Section Heading"
          value={draft.title}
          onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))
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
                      cards: [
                        ...prev.cards,
                        {
                          id: Date.now(),
                          title: "New Project",
                          category: "Backend",
                          description: "Project description",
                          image: "",
                          technologies: ["React"],
                          liveUrl: "https://",
                          githubUrl: "https://",
                          featured: false,
                        },
                      ],
                    }
                  : prev,
              )
            }
          >
            Add Project
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={projectKeys}
          onReorder={(nextKeys) => {
            setProjectKeys(nextKeys);
            setDraft((prev) =>
              prev ? { ...prev, cards: reorderByKeys(prev.cards, projectKeys, nextKeys) } : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.cards.map((project, index) => (
            <Reorder.Item
              value={projectKeys[index]}
              transition={reorderTransition}
              key={projectKeys[index] ?? String(project.id)}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">{project.title || "Project"}</p>
                <p className="truncate text-xs text-zinc-500">{project.category}</p>
              </div>
              <span className="admin-grab">
                <span aria-hidden className="text-sm leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminInput
                label="Title"
                value={project.title}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, cards: updateAt(prev.cards, index, { ...project, title: e.target.value }) } : prev,
                  )
                }
              />
              <AdminInput
                label="Category"
                value={project.category}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, cards: updateAt(prev.cards, index, { ...project, category: e.target.value }) }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider px-4 py-3">
              <AdminTextarea
                label="Description"
                rows={3}
                value={project.description}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          cards: updateAt(prev.cards, index, { ...project, description: e.target.value }),
                        }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminInput
                label="GitHub URL"
                value={project.githubUrl}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, cards: updateAt(prev.cards, index, { ...project, githubUrl: e.target.value }) }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Readme / Live URL"
                value={project.liveUrl}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, cards: updateAt(prev.cards, index, { ...project, liveUrl: e.target.value }) }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider px-4 py-3">
              <p className="mb-2 text-sm font-medium text-zinc-200">Project Image</p>
              {project.image ? (
                <img src={project.image} alt={project.title} className="mb-2 h-32 w-48 rounded-lg object-cover" />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void uploadProjectImage(index, e.target.files?.[0] ?? null)}
                className="text-xs text-zinc-300"
              />
              <AdminInput
                label="Image URL"
                value={project.image}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, cards: updateAt(prev.cards, index, { ...project, image: e.target.value }) } : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider px-4 py-3">
              <p className="mb-2 text-sm font-medium text-zinc-200">Tech Tags</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <div key={`${tech}-${techIndex}`} className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
                    <input
                      value={tech}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextTech = updateAt(project.technologies, techIndex, e.target.value);
                          return {
                            ...prev,
                            cards: updateAt(prev.cards, index, { ...project, technologies: nextTech }),
                          };
                        })
                      }
                      className="w-20 bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            cards: updateAt(prev.cards, index, {
                              ...project,
                              technologies: removeAt(project.technologies, techIndex),
                            }),
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
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        cards: updateAt(prev.cards, index, {
                          ...project,
                          technologies: [...project.technologies, "New Tech"],
                        }),
                      };
                    })
                  }
                >
                  + Tag
                </button>
              </div>
            </div>

            <label className="admin-divider inline-flex items-center gap-2 px-4 py-3 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={Boolean((project as { featured?: boolean }).featured)}
                onChange={(e) =>
                  setDraft((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      cards: updateAt(prev.cards, index, {
                        ...project,
                        featured: e.target.checked,
                      }),
                    };
                  })
                }
              />
              Featured project
            </label>

            <div className="admin-divider flex gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  const removedProject = project;
                  const removedKey = projectKeys[index];
                  confirmDelete({
                    title: "Delete project?",
                    description: "This project card will be removed from your portfolio list.",
                    undoLabel: "Project deleted",
                    onConfirm: () => {
                      setProjectKeys((prev) => removeAt(prev, index));
                      setDraft((prev) => (prev ? { ...prev, cards: removeAt(prev.cards, index) } : prev));
                    },
                    onUndo: () => {
                      if (!removedKey) return;
                      setProjectKeys((prev) => insertAt(prev, index, removedKey));
                      setDraft((prev) =>
                        prev ? { ...prev, cards: insertAt(prev.cards, index, removedProject) } : prev,
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

export default ProjectsEditorPage;
