import React from "react";
import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput, AdminTextarea } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { fileToDataUrl, insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const AboutEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "about",
    (content) => content.about,
    (content, section) => ({ ...content, about: section }),
  );
  const [imageKeys, setImageKeys] = useStableListKeys(
    draft?.images?.length ?? 0,
    sessionKey,
    "about-image",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;
  const paragraphText = draft.paragraphs.join("\n\n");
  const handleAutoResize = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const uploadImage = async (index: number, file: File | null) => {
    if (!file) return;
    const src = await fileToDataUrl(file);
    setDraft((prev) => {
      if (!prev) return prev;
      const images = prev.images ? [...prev.images] : [];
      images[index] = { ...(images[index] ?? { alt: "About image" }), src };
      return { ...prev, images };
    });
  };

  return (
    <AdminPageShell
      title="About Editor"
      description="Manage heading, paragraph blocks, and about image strip."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4 admin-surface">
          <AdminInput
            label="Section Heading"
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))
            }
          />

          <AdminTextarea
            label="About Content (Single Paragraph Field)"
            rows={8}
            value={paragraphText}
            onInput={handleAutoResize}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, paragraphs: [e.target.value] } : prev))
            }
            className="min-h-[180px] overflow-hidden resize-none whitespace-pre-wrap"
            hint="You can write multiple lines/paragraphs here. Line breaks are preserved exactly."
          />
        </section>

        <section className="space-y-3 admin-surface">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-200">About Images</p>
            <button
              type="button"
              className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
              onClick={() =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        images: [...(prev.images ?? []), { src: "", alt: "New image" }],
                      }
                    : prev,
                )
              }
            >
              Add Image
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={imageKeys}
            onReorder={(nextKeys) => {
              setImageKeys(nextKeys);
              setDraft((prev) =>
                prev
                  ? { ...prev, images: reorderByKeys(prev.images ?? [], imageKeys, nextKeys) }
                  : prev,
              );
            }}
            className="space-y-3"
          >
            {(draft.images ?? []).map((image, index) => (
            <Reorder.Item
              value={imageKeys[index]}
              transition={reorderTransition}
              key={imageKeys[index] ?? `image-${index}`}
                className="admin-item overflow-hidden p-0"
              >
              <div className="flex items-center justify-between border-b border-zinc-800/70 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  Image {index + 1}
                </p>
                <span className="admin-grab">
                  <span aria-hidden className="text-xs leading-none tracking-[-0.08em]">⋮⋮</span>
                </span>
              </div>
              <div className="grid gap-3 px-3 py-3 sm:grid-cols-[100px_1fr]">
                <img
                  src={image.src || "https://placehold.co/200x120/111/777?text=Image"}
                  alt={image.alt}
                  className="h-24 w-full rounded-lg object-cover"
                />
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void uploadImage(index, e.target.files?.[0] ?? null)}
                    className="text-xs text-zinc-300"
                  />
                  <AdminInput
                    label="Image URL"
                    value={image.src}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              images: updateAt(prev.images ?? [], index, { ...image, src: e.target.value }),
                            }
                          : prev,
                      )
                    }
                  />
                  <AdminInput
                    label="Alt Text"
                    value={image.alt}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              images: updateAt(prev.images ?? [], index, { ...image, alt: e.target.value }),
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2 border-t border-zinc-800/70 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const removedImage = image;
                    const removedKey = imageKeys[index];
                    confirmDelete({
                      title: "Delete about image?",
                      description: "This image will be removed from the about section.",
                      undoLabel: "About image deleted",
                      onConfirm: () => {
                        setImageKeys((prev) => removeAt(prev, index));
                        setDraft((prev) =>
                          prev ? { ...prev, images: removeAt(prev.images ?? [], index) } : prev,
                        );
                      },
                      onUndo: () => {
                        if (!removedKey) return;
                        setImageKeys((prev) => insertAt(prev, index, removedKey));
                        setDraft((prev) =>
                          prev
                            ? { ...prev, images: insertAt(prev.images ?? [], index, removedImage) }
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
      </div>
    </AdminPageShell>
  );
};

export default AboutEditorPage;
