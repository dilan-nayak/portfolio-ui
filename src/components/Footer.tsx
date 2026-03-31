import React from "react";
import { motion } from "framer-motion";
import type { PortfolioContent } from "@/types/portfolio-content";
import { SafeFaIcon } from "@/lib/icons";

interface FooterProps {
  hero: PortfolioContent["hero"];
}

const Footer = ({ hero }: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t theme-surface border-zinc-300 dark:border-zinc-800 bg-zinc-200/55 dark:bg-zinc-950/80 backdrop-blur">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-lg font-semibold theme-text-primary text-zinc-900 dark:text-zinc-100">
              {hero.firstName} {hero.lastName}
            </p>
            <p className="text-sm theme-text-secondary text-zinc-600 dark:text-zinc-400">
              © {currentYear} All rights reserved.
            </p>
          </div>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold theme-text-primary text-zinc-800 dark:text-zinc-100">
              Built with lots of ❤️ and ☕.
            </p>
            <p className="mt-1 text-sm theme-text-secondary text-zinc-600 dark:text-zinc-300">
              If you find any issue on this page, or have a better idea to
              improve it, please{" "}
              <button
                type="button"
                onClick={() => scrollToSection("#contact")}
                className="font-semibold text-[#8f332a] dark:text-red-400 hover:underline"
              >
                contact me
              </button>{" "}
              and reach out.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border theme-surface-soft border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 theme-text-primary text-zinc-800 dark:text-zinc-100"
              aria-label="Back to top"
            >
              <SafeFaIcon value={{ library: "fas", icon: "arrow-up" }} className="w-4 h-4" />
              Top
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
