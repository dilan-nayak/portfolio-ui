import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput, AdminSwitch, AdminTextarea } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const StatusEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "status",
    (content) => ({
      ...content.status,
      cards: content.status.cards.map((card) => ({
        ...card,
        activeDescription: card.activeDescription ?? (card.state === "active" ? card.description ?? "" : ""),
        inactiveDescription:
          card.inactiveDescription ?? (card.state === "inactive" ? card.description ?? "" : ""),
      })),
    }),
    (content, section) => ({
      ...content,
      status: {
        ...section,
        cards: section.cards.map((card) => ({
          ...card,
          description:
            card.state === "active"
              ? card.activeDescription ?? card.description ?? ""
              : card.inactiveDescription ?? card.description ?? "",
        })),
      },
    }),
  );
  const [cardKeys, setCardKeys] = useStableListKeys(
    draft?.cards.length ?? 0,
    sessionKey,
    "status-card",
  );
  const { confirmDelete } = useAdminActionGuard();

  if (!draft) return null;

  return (
    <AdminPageShell
      title="Status Editor"
      description="Manage status cards and visibility." 
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      cards: [
                        ...prev.cards,
                        {
                          state: "active",
                          title: "New status",
                          activeDescription: "Describe active state",
                          inactiveDescription: "Describe inactive state",
                          description: "Describe active state",
                          visible: true,
                        },
                      ],
                    }
                  : prev,
              )
            }
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
          >
            Add Status Card
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={cardKeys}
          onReorder={(nextKeys) => {
            setCardKeys(nextKeys);
            setDraft((prev) =>
              prev ? { ...prev, cards: reorderByKeys(prev.cards, cardKeys, nextKeys) } : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.cards.map((card, index) => (
            <Reorder.Item
              value={cardKeys[index]}
              transition={reorderTransition}
              key={cardKeys[index] ?? `status-${index}`}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5">
              <p className="text-sm font-semibold text-zinc-100">{card.title || "Status card"}</p>
              <span className="admin-grab">
                <span aria-hidden className="text-sm leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminInput
                label="Title"
                value={card.title}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, cards: updateAt(prev.cards, index, { ...card, title: e.target.value }) }
                      : prev,
                  )
                }
              />
              <label className="block space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  State
                </span>
                <select
                  value={card.state}
                  onChange={(e) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            cards: updateAt(prev.cards, index, {
                              ...card,
                              state: e.target.value as "active" | "inactive",
                            }),
                          }
                        : prev,
                    )
                  }
                  className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-red-500/60"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="admin-divider grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminTextarea
                label="Active Description"
                rows={2}
                value={card.activeDescription ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                        ...prev,
                          cards: updateAt(prev.cards, index, { ...card, activeDescription: e.target.value }),
                        }
                      : prev,
                  )
                }
              />
              <AdminTextarea
                label="Inactive Description"
                rows={2}
                value={card.inactiveDescription ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          cards: updateAt(prev.cards, index, { ...card, inactiveDescription: e.target.value }),
                        }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider grid gap-3 px-4 py-3 sm:grid-cols-2">
              <AdminInput
                label="CTA Label"
                value={card.cta?.label ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          cards: updateAt(prev.cards, index, {
                            ...card,
                            cta: {
                              label: e.target.value,
                              href: card.cta?.href ?? "#contact",
                            },
                          }),
                        }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="CTA Href"
                value={card.cta?.href ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          cards: updateAt(prev.cards, index, {
                            ...card,
                            cta: {
                              label: card.cta?.label ?? "Contact Me",
                              href: e.target.value,
                            },
                          }),
                        }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider flex flex-wrap items-center gap-2 px-4 py-3">
              <AdminSwitch
                label={card.visible === false ? "Hidden" : "Visible"}
                checked={card.visible !== false}
                onChange={(checked) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          cards: updateAt(prev.cards, index, { ...card, visible: checked }),
                        }
                      : prev,
                  )
                }
              />

              <button
                type="button"
                onClick={() => {
                  const removedCard = card;
                  const removedKey = cardKeys[index];
                  confirmDelete({
                    title: "Delete status card?",
                    description: "This status card will be permanently removed from draft.",
                    undoLabel: "Status card deleted",
                    onConfirm: () => {
                      setCardKeys((prev) => removeAt(prev, index));
                      setDraft((prev) => (prev ? { ...prev, cards: removeAt(prev.cards, index) } : prev));
                    },
                    onUndo: () => {
                      if (!removedKey) return;
                      setCardKeys((prev) => insertAt(prev, index, removedKey));
                      setDraft((prev) =>
                        prev ? { ...prev, cards: insertAt(prev.cards, index, removedCard) } : prev,
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
      </div>
    </AdminPageShell>
  );
};

export default StatusEditorPage;
