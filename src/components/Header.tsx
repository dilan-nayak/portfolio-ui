import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeFaIcon } from "@/lib/icons";
import type { PortfolioContent } from "@/types/portfolio-content";

interface HeaderProps {
  content: PortfolioContent["header"];
}

const Header = ({ content }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [catImageErrored, setCatImageErrored] = useState(false);
  const [activeSection, setActiveSection] = useState(
    content.navItems[0]?.href ?? "#home",
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const sectionElements = content.navItems
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));

    if (!sectionElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible?.target) {
          return;
        }

        const matchingItem = content.navItems.find(
          (item) => document.querySelector(item.href) === visible.target,
        );

        if (matchingItem) {
          setActiveSection(matchingItem.href);
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [content.navItems]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(href);
    }
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleAdminToggle = () => {
    setIsAdminOpen((prev) => !prev);
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(false);
    setIsMenuOpen(false);
    window.open("/admin", "_blank", "noopener,noreferrer");
  };

  const adminConfig = content.adminToggle;
  const catImageSrc = isAdminOpen
    ? adminConfig?.openImage
    : adminConfig?.closeImage;
  const showCatImage = Boolean(catImageSrc) && !catImageErrored;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "theme-surface bg-zinc-200/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="relative flex items-center gap-3">
            <div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAdminToggle}
                className="h-12 w-12 rounded-xl theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 shadow-lg flex items-center justify-center overflow-hidden"
                aria-label="Toggle admin panel"
              >
                {showCatImage ? (
                  <img
                    src={catImageSrc}
                    alt={isAdminOpen ? "Cat open hand" : "Cat closed hand"}
                    className="h-full w-full object-cover"
                    onError={() => setCatImageErrored(true)}
                  />
                ) : (
                  <SafeFaIcon value={{ library: "fas", icon: "code" }} className="w-6 h-6 text-white" />
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {isAdminOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -8, width: 0 }}
                  className="overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleOpenAdmin}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl theme-surface-soft bg-zinc-200/90 dark:bg-zinc-900/85 border border-zinc-300 dark:border-zinc-700 hover:border-[#9f3a30]/70 dark:hover:border-red-500/70 transition-colors"
                  >
                    <span className="text-sm font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {adminConfig?.label ?? "Admin"}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="hidden md:flex items-center gap-2">
            {content.navItems.map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.href)}
                className={`relative px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  activeSection === item.href
                    ? "theme-text-primary text-zinc-900 dark:text-zinc-100"
                    : "theme-text-secondary text-zinc-700 dark:text-zinc-200 hover:text-[#8f332a] dark:hover:text-red-400"
                }`}
              >
                {item.label}
                {activeSection === item.href ? (
                  <motion.span
                    layoutId="active-nav-indicator"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500"
                  />
                ) : null}
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-surface bg-zinc-200/90 dark:bg-zinc-900/80 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              {isDarkMode ? (
                <SafeFaIcon value={{ library: "fas", icon: "sun" }} className="w-5 h-5 text-yellow-500" />
              ) : (
                <SafeFaIcon value={{ library: "fas", icon: "moon" }} className="w-5 h-5 text-zinc-700" />
              )}
            </motion.button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-surface bg-zinc-200/90 dark:bg-zinc-900/80"
            >
              {isDarkMode ? (
                <SafeFaIcon value={{ library: "fas", icon: "sun" }} className="w-5 h-5 text-yellow-500" />
              ) : (
                <SafeFaIcon value={{ library: "fas", icon: "moon" }} className="w-5 h-5 text-zinc-700" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg theme-surface bg-zinc-200/90 dark:bg-zinc-900/80"
            >
              {isMenuOpen ? (
                <SafeFaIcon value={{ library: "fas", icon: "xmark" }} className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
              ) : (
                <SafeFaIcon value={{ library: "fas", icon: "bars" }} className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
              )}
            </motion.button>
          </div>
        </div>

      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm px-4 py-6 flex items-start justify-center"
          >
            <motion.div
              initial={{ y: -12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border theme-surface border-zinc-300 dark:border-zinc-700 bg-zinc-100/95 dark:bg-zinc-900/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-300 dark:border-zinc-700">
                <span className="text-sm font-semibold theme-text-secondary text-zinc-700 dark:text-zinc-200">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg theme-surface-soft bg-zinc-200 dark:bg-zinc-800"
                  aria-label="Close menu"
                >
                  <SafeFaIcon value={{ library: "fas", icon: "xmark" }} className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
                </button>
              </div>

              <div className="px-3 py-3">
                {content.navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-center py-3 rounded-xl theme-text-secondary text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-[#8f332a] dark:hover:text-red-400 transition-colors duration-200 font-semibold"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
