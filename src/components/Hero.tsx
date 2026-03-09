import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Download, Twitter, MessageCircle } from "lucide-react";
import type { IconKey, PortfolioContent } from "@/types/portfolio-content";

interface HeroProps {
  content: PortfolioContent["hero"];
}

const iconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  phone: Mail,
  mapPin: Mail,
  twitter: Twitter,
  messageCircle: MessageCircle,
};

const Hero = ({ content }: HeroProps) => {
  const renderSocialIcon = (icon: IconKey) => {
    const Icon = iconMap[icon] ?? Mail;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-24 md:pt-28 lg:pt-24 flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-16 left-12 h-72 w-72 rounded-full bg-[#a33a2f]/10 dark:bg-red-600/15 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-80 w-80 rounded-full bg-[#2f343c]/15 dark:bg-red-900/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(8,145,178,0.12),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(220,38,38,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.15),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(245,158,11,0.1),transparent_45%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-5 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-4 text-5xl lg:text-7xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 leading-[0.95]"
            >
              {content.firstName}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.lastName}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex mb-8 mt-8 justify-center lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.secondaryButton.url}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border-2 theme-accent-border border-cyan-700 dark:border-red-600 text-cyan-700 dark:text-red-400 font-semibold rounded-xl hover:bg-[#8f332a] dark:hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {content.secondaryButton.label}
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              {content.socialLinks.map(({ icon, href, label }) => {
                return (
                  <motion.a
                    key={label}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 theme-surface bg-zinc-200 dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 theme-text-secondary text-zinc-700 dark:text-zinc-200 hover:text-[#8f332a] dark:hover:text-red-400"
                    aria-label={label}
                  >
                    {renderSocialIcon(icon)}
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-3 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -inset-6 rounded-[2.4rem] border border-cyan-500/20 dark:border-red-500/30"
              />

              <div className="absolute -inset-8 rounded-[2.8rem] bg-gradient-to-br from-[#a33a2f]/25 via-transparent to-[#2f343c]/25 dark:from-cyan-500/25 dark:to-red-500/25 blur-2xl" />

              <motion.div
                className="relative rounded-[2.2rem] border theme-surface border-zinc-300/70 dark:border-zinc-700/70 bg-zinc-100/75 dark:bg-zinc-900/65 p-3 shadow-2xl backdrop-blur"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="overflow-hidden rounded-[1.8rem]">
                  <img
                    src={content.profileImage.src}
                    alt={content.profileImage.alt}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>

                <div className="pointer-events-none absolute inset-x-5 bottom-5 h-20 rounded-2xl bg-gradient-to-t from-black/35 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
