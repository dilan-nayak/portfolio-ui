import React from "react";
import { motion } from "framer-motion";
import { SafeFaIcon } from "@/lib/icons";

interface ServiceDownStateProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  details?: string | null;
  fullScreen?: boolean;
}

const ServiceDownState = ({
  title = "Our backend took a quick chai break",
  subtitle = "We are trying to reconnect. Give us a few seconds and try again.",
  onRetry,
  details,
  fullScreen = true,
}: ServiceDownStateProps) => {
  return (
    <div
      className={`relative overflow-hidden px-6 ${
        fullScreen ? "min-h-screen" : "min-h-[320px]"
      } flex items-center justify-center bg-zinc-100 dark:bg-zinc-950`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-red-500/10 blur-3xl dark:bg-red-500/20" />
        <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-2xl rounded-3xl border border-zinc-200/80 bg-white/90 p-8 text-center shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 sm:p-10"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          <SafeFaIcon value={{ library: "fas", icon: "gear" }} className="h-7 w-7 animate-spin [animation-duration:3s]" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
          {subtitle}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-700 dark:bg-zinc-800/70">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Reconnecting
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-rose-400"
          >
            <SafeFaIcon value={{ library: "fas", icon: "arrow-up-right-from-square" }} className="h-3.5 w-3.5 rotate-90" />
            Try Again
          </button>
        </div>

        {details ? (
          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">
            Debug info: {details}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
};

export default ServiceDownState;
