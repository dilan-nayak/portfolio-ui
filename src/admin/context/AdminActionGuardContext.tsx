import React from "react";
import { SafeFaIcon } from "@/lib/icons";

type DeleteRequest = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onUndo?: () => void;
  undoLabel?: string;
};

type UndoNotice = {
  label: string;
  onUndo: () => void;
};

type AdminActionGuardContextValue = {
  confirmDelete: (request: DeleteRequest) => void;
};

const AdminActionGuardContext = React.createContext<AdminActionGuardContextValue | null>(null);

const DEFAULT_DELETE_TITLE = "Delete item?";
const DEFAULT_DELETE_DESCRIPTION =
  "This action removes the item from the editor. You can restore it immediately using undo.";
const DEFAULT_CONFIRM_LABEL = "Delete";
const DEFAULT_UNDO_LABEL = "Item deleted";
const UNDO_TIMEOUT_MS = 10000;

export const AdminActionGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const [pendingDelete, setPendingDelete] = React.useState<DeleteRequest | null>(null);
  const [undoNotice, setUndoNotice] = React.useState<UndoNotice | null>(null);
  const undoTimeoutRef = React.useRef<number | null>(null);

  const clearUndoTimer = React.useCallback(() => {
    if (undoTimeoutRef.current !== null) {
      window.clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
  }, []);

  const confirmDelete = React.useCallback((request: DeleteRequest) => {
    setPendingDelete(request);
  }, []);

  const openUndoNotice = React.useCallback(
    (label: string, onUndo: () => void) => {
      clearUndoTimer();
      setUndoNotice({ label, onUndo });
      undoTimeoutRef.current = window.setTimeout(() => {
        setUndoNotice(null);
        undoTimeoutRef.current = null;
      }, UNDO_TIMEOUT_MS);
    },
    [clearUndoTimer],
  );

  React.useEffect(() => {
    return () => {
      clearUndoTimer();
    };
  }, [clearUndoTimer]);

  return (
    <AdminActionGuardContext.Provider value={{ confirmDelete }}>
      {children}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete dialog"
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300">
                <SafeFaIcon value={{ library: "fas", icon: "trash" }} className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {pendingDelete.title ?? DEFAULT_DELETE_TITLE}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {pendingDelete.description ?? DEFAULT_DELETE_DESCRIPTION}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const current = pendingDelete;
                  setPendingDelete(null);
                  current.onConfirm();
                  if (current.onUndo) {
                    openUndoNotice(current.undoLabel ?? DEFAULT_UNDO_LABEL, current.onUndo);
                  }
                }}
                className="rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-rose-400"
              >
                {pendingDelete.confirmLabel ?? DEFAULT_CONFIRM_LABEL}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {undoNotice ? (
        <div className="fixed bottom-6 right-6 z-[94] w-[340px] max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-300 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{undoNotice.label}</p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                You can restore it for a few seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearUndoTimer();
                setUndoNotice(null);
              }}
              className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <SafeFaIcon value={{ library: "fas", icon: "xmark" }} className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                undoNotice.onUndo();
                clearUndoTimer();
                setUndoNotice(null);
              }}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Undo Restore
            </button>
          </div>
        </div>
      ) : null}
    </AdminActionGuardContext.Provider>
  );
};

export const useAdminActionGuard = () => {
  const context = React.useContext(AdminActionGuardContext);
  if (!context) {
    throw new Error("useAdminActionGuard must be used inside AdminActionGuardProvider");
  }
  return context;
};
