import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";
import IconPicker from "@/admin/components/IconPicker";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const ContactEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "contact",
    (content) => content.contact,
    (content, section) => ({ ...content, contact: section }),
  );
  const [contactKeys, setContactKeys] = useStableListKeys(
    draft?.contactInfo.length ?? 0,
    sessionKey,
    "contact-info",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  return (
    <AdminPageShell
      title="Contact / Profile Editor"
      description="Edit contact methods, social links, inquiry chips, and EmailJS config."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <section className="admin-surface">
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminInput
            label="Section Heading"
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))
            }
          />
          <AdminInput
            label="Connect Heading"
            value={draft.connectHeading}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, connectHeading: e.target.value } : prev))
            }
          />
          <AdminInput
            label="Follow Heading"
            value={draft.followHeading}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, followHeading: e.target.value } : prev))
            }
          />
        </div>
      </section>

      <section className="space-y-4 admin-surface">
        <div className="flex justify-between">
          <p className="text-sm font-semibold text-zinc-200">Inquiry Chips</p>
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
            onClick={() =>
              setDraft((prev) => (prev ? { ...prev, inquiryChips: [...(prev.inquiryChips ?? []), "New Chip"] } : prev))
            }
          >
            Add Chip
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(draft.inquiryChips ?? []).map((chip, chipIndex) => (
            <div key={`${chip}-${chipIndex}`} className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200">
              <input
                value={chip}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          inquiryChips: updateAt(prev.inquiryChips ?? [], chipIndex, e.target.value),
                        }
                      : prev,
                  )
                }
                className="w-28 bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) =>
                    prev ? { ...prev, inquiryChips: removeAt(prev.inquiryChips ?? [], chipIndex) } : prev,
                  )
                }
                className="text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 admin-surface">
        <div className="flex justify-between">
          <p className="text-sm font-semibold text-zinc-200">Contact Methods</p>
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
            onClick={() =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      contactInfo: [
                        ...prev.contactInfo,
                        {
                          icon: { library: "fas", icon: "envelope" },
                          title: "New",
                          content: "",
                          href: "",
                        },
                      ],
                    }
                  : prev,
              )
            }
          >
            Add Contact Item
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={contactKeys}
          onReorder={(nextKeys) => {
            setContactKeys(nextKeys);
            setDraft((prev) =>
              prev
                ? { ...prev, contactInfo: reorderByKeys(prev.contactInfo, contactKeys, nextKeys) }
                : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.contactInfo.map((info, index) => (
            <Reorder.Item
              value={contactKeys[index]}
              transition={reorderTransition}
              key={contactKeys[index] ?? `contact-item-${index}`}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">{info.title || "Contact item"}</p>
                <p className="truncate text-xs text-zinc-500">{info.content || "No content"}</p>
              </div>
              <span className="admin-grab">
                <span aria-hidden className="text-xs leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-2 px-4 py-3 sm:grid-cols-2">
            <AdminInput
              label="Title"
              value={info.title}
              onChange={(e) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        contactInfo: updateAt(prev.contactInfo, index, { ...info, title: e.target.value }),
                      }
                    : prev,
                )
              }
            />
            <IconPicker
              value={info.icon}
              onChange={(icon) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        contactInfo: updateAt(prev.contactInfo, index, {
                          ...info,
                          icon,
                        }),
                      }
                    : prev,
                )
              }
            />
            <AdminInput
              label="Content"
              value={info.content}
              onChange={(e) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        contactInfo: updateAt(prev.contactInfo, index, { ...info, content: e.target.value }),
                      }
                    : prev,
                )
              }
            />
            <AdminInput
              label="Href"
              value={info.href}
              onChange={(e) =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        contactInfo: updateAt(prev.contactInfo, index, { ...info, href: e.target.value }),
                      }
                    : prev,
                )
              }
            />
            </div>
            <div className="flex gap-2 border-t border-zinc-800/70 px-4 py-3">
              <button
                type="button"
                className="admin-delete-btn rounded-md px-2 py-1 text-xs"
                onClick={() => {
                  const removedInfo = info;
                  const removedKey = contactKeys[index];
                  confirmDelete({
                    title: "Delete contact method?",
                    description: "This contact method will be removed.",
                    undoLabel: "Contact method deleted",
                    onConfirm: () => {
                      setContactKeys((prev) => removeAt(prev, index));
                      setDraft((prev) =>
                        prev ? { ...prev, contactInfo: removeAt(prev.contactInfo, index) } : prev,
                      );
                    },
                    onUndo: () => {
                      if (!removedKey) return;
                      setContactKeys((prev) => insertAt(prev, index, removedKey));
                      setDraft((prev) =>
                        prev
                          ? { ...prev, contactInfo: insertAt(prev.contactInfo, index, removedInfo) }
                          : prev,
                      );
                    },
                  });
                }}
              >
                Delete
              </button>
            </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>

      <section className="admin-surface">
        <h3 className="mb-3 text-sm font-semibold text-zinc-200">EmailJS Settings</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminInput
            label="Service ID"
            value={draft.form.emailJs.serviceId}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      form: {
                        ...prev.form,
                        emailJs: { ...prev.form.emailJs, serviceId: e.target.value },
                      },
                    }
                  : prev,
              )
            }
          />
          <AdminInput
            label="Template ID"
            value={draft.form.emailJs.templateId}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      form: {
                        ...prev.form,
                        emailJs: { ...prev.form.emailJs, templateId: e.target.value },
                      },
                    }
                  : prev,
              )
            }
          />
          <AdminInput
            label="Public Key"
            value={draft.form.emailJs.publicKey}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      form: {
                        ...prev.form,
                        emailJs: { ...prev.form.emailJs, publicKey: e.target.value },
                      },
                    }
                  : prev,
              )
            }
          />
        </div>
      </section>
    </AdminPageShell>
  );
};

export default ContactEditorPage;
