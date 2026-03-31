import React from "react";
import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { fileToDataUrl, insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";
import IconPicker from "@/admin/components/IconPicker";
import { SafeFaIcon } from "@/lib/icons";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const HeroEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "hero",
    (content) => content.hero,
    (content, section) => ({ ...content, hero: section }),
  );
  const [socialKeys, setSocialKeys] = useStableListKeys(
    draft?.socialLinks.length ?? 0,
    sessionKey,
    "hero-social",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  const onUploadImage = async (file: File | null) => {
    if (!file) return;
    const src = await fileToDataUrl(file);
    setDraft((prev) => (prev ? { ...prev, profileImage: { ...prev.profileImage, src } } : prev));
  };

  const onUploadResume = async (file: File | null) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setDraft((prev) =>
      prev ? { ...prev, secondaryButton: { ...prev.secondaryButton, url } } : prev,
    );
  };

  return (
    <AdminPageShell
      title="Home / Hero Editor"
      description="Edit identity, resume, social links, and profile image."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.9fr)]">
        <section className="space-y-6">
          <div className="admin-surface">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Identity</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="First Name"
                value={draft.firstName}
                placeholder="Dilan"
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, firstName: e.target.value } : prev))}
              />
              <AdminInput
                label="Last Name"
                value={draft.lastName}
                placeholder="Nayak"
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, lastName: e.target.value } : prev))}
              />
              <AdminInput
                label="Download CV Label"
                value={draft.secondaryButton.label}
                placeholder="Download CV"
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, secondaryButton: { ...prev.secondaryButton, label: e.target.value } } : prev,
                  )
                }
              />
              <AdminInput
                label="Download CV URL"
                value={draft.secondaryButton.url}
                placeholder="/resume/dilan-nayak-cv.pdf"
                onChange={(e) =>
                  setDraft((prev) =>
                    prev ? { ...prev, secondaryButton: { ...prev.secondaryButton, url: e.target.value } } : prev,
                  )
                }
              />
            </div>
          </div>

          <div className="admin-surface">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Assets</p>
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-3">
                <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/80">
                  <img
                    src={draft.profileImage.src}
                    alt={draft.profileImage.alt}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 opacity-90 transition group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-medium text-zinc-100 backdrop-blur">
                      <SafeFaIcon value={{ library: "fas", icon: "upload" }} className="h-3.5 w-3.5" />
                      Change Image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void onUploadImage(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="space-y-4">
                <AdminInput
                  label="Image Alt"
                  value={draft.profileImage.alt}
                  placeholder="Portrait image"
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev ? { ...prev, profileImage: { ...prev.profileImage, alt: e.target.value } } : prev,
                    )
                  }
                />
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Resume Upload
                  </p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500">
                    <SafeFaIcon value={{ library: "fas", icon: "upload" }} className="h-4 w-4 text-red-400" />
                    Upload Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => void onUploadResume(e.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-2 break-all text-xs text-zinc-500">
                    Current source: {draft.secondaryButton.url || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-surface">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Social Links</p>
              <button
                type="button"
                onClick={() => {
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          socialLinks: [
                            ...prev.socialLinks,
                            { icon: { library: "fab", icon: "github" }, label: "New Link", href: "https://" },
                          ],
                        }
                      : prev,
                  )
                }}
                className="rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-medium text-zinc-200 transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800"
              >
                Add Link
              </button>
            </div>
            <Reorder.Group
              axis="y"
              values={socialKeys}
              onReorder={(nextKeys) => {
                setSocialKeys(nextKeys);
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        socialLinks: reorderByKeys(prev.socialLinks, socialKeys, nextKeys),
                      }
                    : prev,
                );
              }}
              className="space-y-3"
            >
              {draft.socialLinks.map((link, index) => {
                return (
                  <Reorder.Item
                    value={socialKeys[index]}
                    transition={reorderTransition}
                    key={socialKeys[index] ?? `social-fallback-${index}`}
                    className="admin-item overflow-hidden p-0 transition-colors duration-200 hover:border-zinc-700"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/70 px-3 py-2.5">
                      <div className="inline-flex min-w-0 items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100">
                          <SafeFaIcon value={link.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-100">{link.label || "Untitled"}</p>
                          <p className="truncate text-xs text-zinc-500">
                            {typeof link.icon === "string"
                              ? link.icon
                              : `${link.icon.library}:${link.icon.icon}`}
                          </p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <span className="rounded-full border border-zinc-700/80 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          #{index + 1}
                        </span>
                        <span className="admin-grab">
                          <span aria-hidden className="text-sm leading-none tracking-[-0.08em]">⋮⋮</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2.5 px-3 py-3 lg:grid-cols-[minmax(0,180px)_minmax(0,240px)_minmax(0,1fr)]">
                      <AdminInput
                        label="Name"
                        value={link.label}
                        placeholder="GitHub"
                        onChange={(e) =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  socialLinks: updateAt(prev.socialLinks, index, {
                                    ...link,
                                    label: e.target.value,
                                  }),
                                }
                              : prev,
                          )
                        }
                      />
                      <IconPicker
                        value={link.icon}
                        onChange={(icon) =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  socialLinks: updateAt(prev.socialLinks, index, {
                                    ...link,
                                    icon,
                                  }),
                                }
                              : prev,
                          )
                        }
                      />
                      <AdminInput
                        label="URL"
                        value={link.href}
                        placeholder="https://..."
                        onChange={(e) =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  socialLinks: updateAt(prev.socialLinks, index, {
                                    ...link,
                                    href: e.target.value,
                                  }),
                                }
                              : prev,
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-800/70 px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          const removedLink = link;
                          const removedKey = socialKeys[index];
                          confirmDelete({
                            title: "Delete social link?",
                            description: "This social link will be removed from hero.",
                            undoLabel: "Social link deleted",
                            onConfirm: () => {
                              setSocialKeys((prev) => removeAt(prev, index));
                              setDraft((prev) =>
                                prev ? { ...prev, socialLinks: removeAt(prev.socialLinks, index) } : prev,
                              );
                            },
                            onUndo: () => {
                              if (!removedKey) return;
                              setSocialKeys((prev) => insertAt(prev, index, removedKey));
                              setDraft((prev) =>
                                prev
                                  ? { ...prev, socialLinks: insertAt(prev.socialLinks, index, removedLink) }
                                  : prev,
                              );
                            },
                          });
                        }}
                        className="admin-delete-btn inline-flex items-center gap-1 px-2.5 py-1.5 text-xs transition"
                      >
                        <SafeFaIcon value={{ library: "fas", icon: "trash" }} className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
        </section>

        <aside className="xl:sticky xl:top-[96px]">
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 to-zinc-950/85 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Live Preview</p>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                Synced
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="mx-auto max-w-[230px] overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/70 p-1.5">
                <img
                  src={draft.profileImage.src}
                  alt={draft.profileImage.alt}
                  className="h-[280px] w-full rounded-xl object-cover"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-[2rem] font-semibold leading-none tracking-tight text-zinc-100">
                  {draft.firstName} <span className="text-red-400">{draft.lastName}</span>
                </p>
                <div className="mt-3 inline-flex items-center rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-200">
                  {draft.secondaryButton.label || "Download CV"}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {draft.socialLinks.map((link, idx) => {
                  return (
                    <div
                      key={`${link.href}-${link.label}-preview-${idx}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-2.5 py-2 text-xs text-zinc-200"
                    >
                      <SafeFaIcon value={link.icon} className="h-3.5 w-3.5 text-red-400" />
                      <span className="truncate">{link.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AdminPageShell>
  );
};

export default HeroEditorPage;
