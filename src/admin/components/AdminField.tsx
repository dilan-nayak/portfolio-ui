import React from "react";

interface CommonProps {
  label: string;
  hint?: string;
}

export const AdminInput = ({
  label,
  hint,
  ...props
}: CommonProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const initialValueRef = React.useRef(props.value);
  const isChanged = React.useMemo(
    () => JSON.stringify(props.value ?? "") !== JSON.stringify(initialValueRef.current ?? ""),
    [props.value],
  );

  return (
    <label
      className={`group block space-y-1.5 rounded-md px-1 py-1 transition-colors duration-200 ${
        isChanged ? "bg-amber-500/5" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 transition-colors duration-200 group-focus-within:text-zinc-800 dark:text-zinc-400 dark:group-focus-within:text-zinc-200">
        {label}
      </span>
      <div
        className={`border-b transition-colors duration-200 ${
          isChanged
            ? "border-amber-500/70"
            : "border-zinc-700/90 hover:border-zinc-500/80 group-focus-within:border-red-500/70"
        }`}
      >
        <input
          {...props}
          className={`w-full bg-transparent px-0 py-2 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${isChanged ? "dark:text-amber-50" : ""} ${props.className ?? ""}`}
        />
      </div>
      {hint ? <span className="text-xs text-zinc-600 dark:text-zinc-500">{hint}</span> : null}
    </label>
  );
};

export const AdminTextarea = ({
  label,
  hint,
  ...props
}: CommonProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const initialValueRef = React.useRef(props.value);
  const isChanged = React.useMemo(
    () => JSON.stringify(props.value ?? "") !== JSON.stringify(initialValueRef.current ?? ""),
    [props.value],
  );

  const autoResize = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  React.useLayoutEffect(() => {
    autoResize();
  }, [autoResize, props.value]);

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    autoResize();
    props.onInput?.(event);
  };

  return (
    <label
      className={`group block space-y-1.5 rounded-md px-1 py-1 transition-colors duration-200 ${
        isChanged ? "bg-amber-500/5" : ""
      }`}
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 transition-colors duration-200 group-focus-within:text-zinc-800 dark:text-zinc-400 dark:group-focus-within:text-zinc-200">
        {label}
      </span>
      <div
        className={`border-b transition-colors duration-200 ${
          isChanged
            ? "border-amber-500/70"
            : "border-zinc-700/90 hover:border-zinc-500/80 group-focus-within:border-red-500/70"
        }`}
      >
        <textarea
          {...props}
          ref={textareaRef}
          onInput={handleInput}
          className={`w-full bg-transparent px-0 py-2 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-500 resize-none overflow-hidden dark:text-zinc-100 dark:placeholder:text-zinc-500 ${isChanged ? "dark:text-amber-50" : ""} ${props.className ?? ""}`}
        />
      </div>
      {hint ? <span className="text-xs text-zinc-600 dark:text-zinc-500">{hint}</span> : null}
    </label>
  );
};

export const AdminSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
    >
      <span
        className={`h-4 w-8 rounded-full transition ${checked ? "bg-emerald-500" : "bg-zinc-600"}`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </span>
      {label}
    </button>
  );
};
