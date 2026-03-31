import React from "react";
import { Reorder } from "framer-motion";
import AdminPageShell from "@/admin/components/AdminPageShell";
import { AdminInput, AdminTextarea } from "@/admin/components/AdminField";
import { useAdminActionGuard } from "@/admin/context/AdminActionGuardContext";
import { useStableListKeys } from "@/admin/hooks/useStableListKeys";
import { useSectionEditor } from "@/admin/hooks/useSectionEditor";
import { insertAt, removeAt, reorderByKeys, updateAt } from "@/admin/utils/editor-utils";

const reorderTransition = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.35 };

const ExperienceEditorPage = () => {
  const { draft, setDraft, save, reset, isDirty, saveState, sessionKey } = useSectionEditor(
    "experience",
    (content) => content.experience,
    (content, section) => ({ ...content, experience: section }),
  );
  const [companyKeys, setCompanyKeys] = useStableListKeys(
    draft?.companies.length ?? 0,
    sessionKey,
    "experience-company",
  );
  const { confirmDelete } = useAdminActionGuard();
  const roleKeySeqRef = React.useRef(0);
  const makeRoleKey = React.useCallback(() => {
    roleKeySeqRef.current += 1;
    return `experience-role-${roleKeySeqRef.current}`;
  }, []);
  const [roleKeysByCompanyKey, setRoleKeysByCompanyKey] = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    if (!draft) return;
    setRoleKeysByCompanyKey((prev) => {
      const next: Record<string, string[]> = {};
      companyKeys.forEach((companyKey, companyIndex) => {
        const roleCount = draft.companies[companyIndex]?.positions.length ?? 0;
        const existing = prev[companyKey] ?? [];
        if (existing.length === roleCount) {
          next[companyKey] = existing;
        } else if (existing.length < roleCount) {
          next[companyKey] = [
            ...existing,
            ...Array.from({ length: roleCount - existing.length }, () => makeRoleKey()),
          ];
        } else {
          next[companyKey] = existing.slice(0, roleCount);
        }
      });
      return next;
    });
  }, [companyKeys, draft, makeRoleKey]);

  if (!draft) return null;
  const handleAutoResize = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <AdminPageShell
      title="Experience Editor"
      description="Manage company groups and nested role entries."
      saveState={saveState}
      isDirty={isDirty}
      onSave={save}
      onReset={reset}
      changeSessionKey={sessionKey}
    >
      <section className="admin-surface">
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminInput
            label="Section Title"
            value={draft.title}
            onChange={(e) => setDraft((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
          />
          <AdminInput
            label="Career Start Date"
            value={draft.careerStartDate}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, careerStartDate: e.target.value } : prev))
            }
          />
          <AdminInput
            label="Counter Label"
            value={draft.counterLabel}
            onChange={(e) =>
              setDraft((prev) => (prev ? { ...prev, counterLabel: e.target.value } : prev))
            }
          />
        </div>
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
                      companies: [
                        ...prev.companies,
                        {
                          companyShortName: "New Company",
                          companyFullName: "New Company Inc",
                          companyUrl: "https://",
                          totalDuration: "",
                          positions: [
                            {
                              title: "Role",
                              employmentType: "Full-time",
                              duration: "",
                              location: "",
                              descriptions: ["Achievement"],
                            },
                          ],
                        },
                      ],
                    }
                  : prev,
              )
            }
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
          >
            Add Company
          </button>
        </div>

        <Reorder.Group
          axis="y"
          values={companyKeys}
          onReorder={(nextKeys) => {
            setCompanyKeys(nextKeys);
            setDraft((prev) =>
              prev ? { ...prev, companies: reorderByKeys(prev.companies, companyKeys, nextKeys) } : prev,
            );
          }}
          className="space-y-4"
        >
          {draft.companies.map((company, companyIndex) => (
            <Reorder.Item
              value={companyKeys[companyIndex]}
              transition={reorderTransition}
              key={companyKeys[companyIndex] ?? `company-${companyIndex}`}
              className="admin-item overflow-hidden p-0"
            >
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {company.companyShortName || `Company ${companyIndex + 1}`}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {company.companyFullName}
                </p>
              </div>
              <span className="admin-grab">
                <span aria-hidden className="text-sm leading-none tracking-[-0.08em]">⋮⋮</span>
              </span>
            </div>
            <div className="grid gap-3 px-4 py-3 md:grid-cols-2">
              <AdminInput
                label="Company Short Name"
                value={company.companyShortName}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          companies: updateAt(prev.companies, companyIndex, {
                            ...company,
                            companyShortName: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Company Full Name"
                value={company.companyFullName}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          companies: updateAt(prev.companies, companyIndex, {
                            ...company,
                            companyFullName: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Company URL"
                value={company.companyUrl}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          companies: updateAt(prev.companies, companyIndex, {
                            ...company,
                            companyUrl: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
              <AdminInput
                label="Total Duration"
                value={company.totalDuration ?? ""}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          companies: updateAt(prev.companies, companyIndex, {
                            ...company,
                            totalDuration: e.target.value,
                          }),
                        }
                      : prev,
                  )
                }
              />
            </div>

            <div className="admin-divider mt-2 px-4 py-3">
              <div className="admin-surface-muted space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-200">Roles</p>
                <button
                  type="button"
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
                  onClick={() =>
                    setDraft((prev) => {
                      if (!prev) return prev;
                      const nextCompany = {
                        ...company,
                        positions: [
                          ...company.positions,
                          {
                            title: "New Role",
                            employmentType: "Full-time",
                            duration: "",
                            location: "",
                            descriptions: ["Achievement"],
                          },
                        ],
                      };
                      return { ...prev, companies: updateAt(prev.companies, companyIndex, nextCompany) };
                    })
                  }
                >
                  Add Role
                </button>
              </div>

              <Reorder.Group
                axis="y"
                values={roleKeysByCompanyKey[companyKeys[companyIndex]] ?? []}
                onReorder={(nextRoleKeys) => {
                  const companyKey = companyKeys[companyIndex];
                  const currentRoleKeys = roleKeysByCompanyKey[companyKey] ?? [];
                  setRoleKeysByCompanyKey((prev) => ({ ...prev, [companyKey]: nextRoleKeys }));
                  setDraft((prev) => {
                    if (!prev) return prev;
                    const reorderedPositions = reorderByKeys(
                      company.positions,
                      currentRoleKeys,
                      nextRoleKeys,
                    );
                    return {
                      ...prev,
                      companies: updateAt(prev.companies, companyIndex, {
                        ...company,
                        positions: reorderedPositions,
                      }),
                    };
                  });
                }}
                className="space-y-3"
              >
                {company.positions.map((position, positionIndex) => (
                  <Reorder.Item
                    value={(roleKeysByCompanyKey[companyKeys[companyIndex]] ?? [])[positionIndex]}
                    transition={reorderTransition}
                    key={
                      (roleKeysByCompanyKey[companyKeys[companyIndex]] ?? [])[positionIndex] ??
                      `role-${companyIndex}-${positionIndex}`
                    }
                    className="admin-surface-muted"
                  >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      Role {positionIndex + 1}
                    </p>
                    <span className="admin-grab">
                      <span aria-hidden className="text-xs leading-none tracking-[-0.08em]">⋮⋮</span>
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <AdminInput
                      label="Role Title"
                      value={position.title}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextPositions = updateAt(company.positions, positionIndex, {
                            ...position,
                            title: e.target.value,
                          });
                          return {
                            ...prev,
                            companies: updateAt(prev.companies, companyIndex, {
                              ...company,
                              positions: nextPositions,
                            }),
                          };
                        })
                      }
                    />
                    <AdminInput
                      label="Employment Type"
                      value={position.employmentType ?? ""}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextPositions = updateAt(company.positions, positionIndex, {
                            ...position,
                            employmentType: e.target.value,
                          });
                          return {
                            ...prev,
                            companies: updateAt(prev.companies, companyIndex, {
                              ...company,
                              positions: nextPositions,
                            }),
                          };
                        })
                      }
                    />
                    <AdminInput
                      label="Duration"
                      value={position.duration}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextPositions = updateAt(company.positions, positionIndex, {
                            ...position,
                            duration: e.target.value,
                          });
                          return {
                            ...prev,
                            companies: updateAt(prev.companies, companyIndex, {
                              ...company,
                              positions: nextPositions,
                            }),
                          };
                        })
                      }
                    />
                    <AdminInput
                      label="Location"
                      value={position.location ?? ""}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextPositions = updateAt(company.positions, positionIndex, {
                            ...position,
                            location: e.target.value,
                          });
                          return {
                            ...prev,
                            companies: updateAt(prev.companies, companyIndex, {
                              ...company,
                              positions: nextPositions,
                            }),
                          };
                        })
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <AdminTextarea
                      label="Role Highlights (Single Field)"
                      rows={6}
                      value={position.descriptions.join("\n\n")}
                      onInput={handleAutoResize}
                      onChange={(e) =>
                        setDraft((prev) => {
                          if (!prev) return prev;
                          const nextPosition = {
                            ...position,
                            descriptions: [e.target.value],
                          };
                          const nextPositions = updateAt(company.positions, positionIndex, nextPosition);
                          return {
                            ...prev,
                            companies: updateAt(prev.companies, companyIndex, {
                              ...company,
                              positions: nextPositions,
                            }),
                          };
                        })
                      }
                      className="min-h-[140px] overflow-hidden resize-none whitespace-pre-wrap"
                      hint="Use one field and write multiple lines/paragraphs. Formatting is preserved."
                    />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="admin-delete-btn rounded-md px-2 py-1 text-xs"
                      onClick={() => {
                        const companyKey = companyKeys[companyIndex];
                        const removedRole = position;
                        const removedRoleKey =
                          (roleKeysByCompanyKey[companyKey] ?? [])[positionIndex];
                        confirmDelete({
                          title: "Delete role?",
                          description: "This role will be removed from the company.",
                          undoLabel: "Role deleted",
                          onConfirm: () => {
                            setRoleKeysByCompanyKey((prev) => ({
                              ...prev,
                              [companyKey]: removeAt(prev[companyKey] ?? [], positionIndex),
                            }));
                            setDraft((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                companies: updateAt(prev.companies, companyIndex, {
                                  ...company,
                                  positions: removeAt(company.positions, positionIndex),
                                }),
                              };
                            });
                          },
                          onUndo: () => {
                            if (!removedRoleKey) return;
                            setRoleKeysByCompanyKey((prev) => ({
                              ...prev,
                              [companyKey]: insertAt(prev[companyKey] ?? [], positionIndex, removedRoleKey),
                            }));
                            setDraft((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                companies: updateAt(prev.companies, companyIndex, {
                                  ...company,
                                  positions: insertAt(company.positions, positionIndex, removedRole),
                                }),
                              };
                            });
                          },
                        });
                      }}
                    >
                      Delete Role
                    </button>
                  </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              </div>
            </div>

            <div className="admin-divider mt-1 flex gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  const removedCompany = company;
                  const removedCompanyKey = companyKeys[companyIndex];
                  const removedRoleKeys = roleKeysByCompanyKey[removedCompanyKey] ?? [];
                  confirmDelete({
                    title: "Delete company?",
                    description: "This company and all nested roles will be removed.",
                    undoLabel: "Company deleted",
                    onConfirm: () => {
                      setCompanyKeys((prev) => removeAt(prev, companyIndex));
                      setRoleKeysByCompanyKey((prev) => {
                        const next = { ...prev };
                        delete next[removedCompanyKey];
                        return next;
                      });
                      setDraft((prev) =>
                        prev ? { ...prev, companies: removeAt(prev.companies, companyIndex) } : prev,
                      );
                    },
                    onUndo: () => {
                      if (!removedCompanyKey) return;
                      setCompanyKeys((prev) => insertAt(prev, companyIndex, removedCompanyKey));
                      setRoleKeysByCompanyKey((prev) => ({
                        ...prev,
                        [removedCompanyKey]: removedRoleKeys,
                      }));
                      setDraft((prev) =>
                        prev
                          ? { ...prev, companies: insertAt(prev.companies, companyIndex, removedCompany) }
                          : prev,
                      );
                    },
                  });
                }}
                className="admin-delete-btn rounded-md px-2 py-1 text-xs"
              >
                Delete Company
              </button>
            </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>
    </AdminPageShell>
  );
};

export default ExperienceEditorPage;
