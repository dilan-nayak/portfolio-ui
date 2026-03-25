import React from "react";
import { motion } from "framer-motion";
import type { PortfolioContent } from "@/types/portfolio-content";

interface StatusProps {
  content: PortfolioContent["status"];
}

const Status = ({ content }: StatusProps) => {
  return (
    <section id="status" className="py-8 md:py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mb-6 md:mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100">
            Current{" "}
            <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
              Status
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 max-w-5xl">
          {content.cards.map((card, index) => {
            const isAvailable = card.state === "active";

            return (
              <motion.div
                key={`${card.title}-${index}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`relative rounded-xl border p-4 shadow-md backdrop-blur ${
                  isAvailable
                    ? "border-emerald-300/80 dark:border-emerald-600/60 bg-gradient-to-br from-emerald-50 to-green-100/70 dark:from-emerald-950/45 dark:to-zinc-900"
                    : "border-red-300/80 dark:border-red-700/60 bg-gradient-to-br from-red-50 to-rose-100/70 dark:from-red-950/40 dark:to-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isAvailable ? "bg-emerald-500" : "bg-red-500"
                    } animate-pulse`}
                  />
                  <h3
                    className={`text-base md:text-lg font-semibold ${
                      isAvailable
                        ? "text-emerald-900 dark:text-emerald-200"
                        : "text-red-900 dark:text-red-200"
                    }`}
                  >
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {card.description}
                </p>
                {isAvailable ? (
                  <a
                    href="#contact"
                    className="inline-flex mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Contact Me
                  </a>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Status;
