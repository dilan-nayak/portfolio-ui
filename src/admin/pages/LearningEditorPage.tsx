import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const LearningEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "skills",
    (content) => ({
      title: content.skills.title,
      learningHeading: content.skills.learningHeading,
      learning: content.skills.learning,
    }),
    (content, section) => ({
      ...content,
      skills: {
        ...content.skills,
        title: section.title,
        learningHeading: section.learningHeading,
        learning: section.learning,
      },
    }),
  );
  const [courseKeys, setCourseKeys] = useStableListKeys(
    draft?.learning.length ?? 0,
    sessionKey,
    "learning-course",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  return (
    <AdminPageShell
      title="Learning / Courses Editor"
      description="Manage in-progress/completed courses and ordering."
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
          label="Learning Heading"
          value={draft.learningHeading}
          onChange={(e) =>
            setDraft((prev) => (prev ? { ...prev, learningHeading: e.target.value } : prev))
          }
        />
      </section>

      <section className="space-y-4 admin-surface">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      learning: [
                        ...prev.learning,
                        {
                          title: "New Course",
                          author: "Platform - Instructor",
                          courseLink: "https://",
                          status: "in-progress",
                          progress: 0,
                          featuredInOverview: false,
                        },
                      ],
                    }
                  : prev,
              )
            }
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
          >
            Add Course
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={courseKeys}
          onReorder={(nextKeys) => {
            setCourseKeys(nextKeys);
            setDraft((prev) =>
              prev ? { ...prev, learning: reorderByKeys(prev.learning, courseKeys, nextKeys) } : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.learning.map((course, index) => (
            <Reorder.Item
              value={courseKeys[index]}
              transition={reorderTransition}
              key={courseKeys[index] ?? `course-${index}`}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5">
              <p className="truncate text-sm font-semibold text-zinc-100">{course.title || "Course"}</p>
              <span className="admin-grab">
                <span aria-hidden className="text-sm leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminInput
                label="Title"
                value={course.title}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, learning: updateAt(prev.learning, index, { ...course, title: e.target.value }) }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Author / Platform"
                value={course.author}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, learning: updateAt(prev.learning, index, { ...course, author: e.target.value }) }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Course Link"
                value={course.courseLink}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          learning: updateAt(prev.learning, index, {
                            ...course,
                            courseLink: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />

              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-zinc-300">Status</span>
                <select
                  value={course.status}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            learning: updateAt(prev.learning, index, {
                              ...course,
                              status: e.target.value as "completed" | "in-progress",
                            }),
                          }
                        : prev,
                    )
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-3 py-2.5 text-zinc-100"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <AdminInput
                label="Progress (%)"
                type="number"
                min={0}
                max={100}
                value={String(course.progress ?? 0)}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          learning: updateAt(prev.learning, index, {
                            ...course,
                            progress: Number(e.target.value),
                          }),
                        }
                      : prev,
                  )
                }
              />

              <label className="mt-7 inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={course.featuredInOverview ?? false}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            learning: updateAt(prev.learning, index, {
                              ...course,
                              featuredInOverview: e.target.checked,
                            }),
                          }
                        : prev,
                    )
                  }
                />
                Show in overview
              </label>
            </div>

            <div className="admin-divider flex gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  const removedCourse = course;
                  const removedKey = courseKeys[index];
                  confirmDelete({
                    title: "Delete course?",
                    description: "This learning course entry will be removed.",
                    undoLabel: "Course deleted",
                    onConfirm: () => {
                      setCourseKeys((prev) => removeAt(prev, index));
                      setDraft((prev) => (prev ? { ...prev, learning: removeAt(prev.learning, index) } : prev));
                    },
                    onUndo: () => {
                      if (!removedKey) return;
                      setCourseKeys((prev) => insertAt(prev, index, removedKey));
                      setDraft((prev) =>
                        prev ? { ...prev, learning: insertAt(prev.learning, index, removedCourse) } : prev,
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

export default LearningEditorPage;
