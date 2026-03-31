import React from "react";

interface SectionTitleProps {
  title: string;
  className?: string;
}

const splitTitle = (title: string) => {
  const trimmed = title.trim();
  if (!trimmed) {
    return { base: "", accent: "" };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { base: parts[0], accent: "" };
  }
  return {
    base: parts.slice(0, -1).join(" "),
    accent: parts[parts.length - 1],
  };
};

const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  const { base, accent } = splitTitle(title);

  return (
    <h2 className={`text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 ${className}`}>
      {base}
      {accent ? (
        <>
          {" "}
          <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
            {accent}
          </span>
        </>
      ) : null}
    </h2>
  );
};

export default SectionTitle;
