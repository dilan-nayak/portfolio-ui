import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { iconMap } from "@/lib/icons";
import type { IconKey, PortfolioContent } from "@/types/portfolio-content";

interface HeroProps {
  content: PortfolioContent["hero"];
}

const Hero = ({ content }: HeroProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const renderSocialIcon = (icon: IconKey) => {
    const Icon = iconMap[icon] ?? iconMap.mail;
    return <Icon className="w-6 h-6" />;
  };

  const cardTransform = useMemo(
    () => `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    [tilt],
  );

  const handleTilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const y = ((event.clientX - centerX) / rect.width) * 10;
    const x = ((centerY - event.clientY) / rect.height) * 8;
    setTilt({ x, y });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <section
      id="home"
      className="min-h-screen pt-24 md:pt-28 lg:pt-24 flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-16 left-12 h-72 w-72 rounded-full bg-[#b5453a]/22 dark:bg-red-600/15 blur-3xl" />
        <div className="absolute bottom-12 right-12 h-80 w-80 rounded-full bg-[#7a2b25]/16 dark:bg-red-900/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(181,69,58,0.22),transparent_40%),radial-gradient(circle_at_82%_76%,rgba(122,43,37,0.18),transparent_45%),radial-gradient(circle_at_62%_46%,rgba(8,145,178,0.08),transparent_44%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.15),transparent_42%),radial-gradient(circle_at_80%_75%,rgba(245,158,11,0.1),transparent_45%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 leading-[0.95]"
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
              className="mt-8 flex flex-wrap gap-4 mb-7 justify-center lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={content.secondaryButton.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl dark:from-red-600 dark:to-red-500"
              >
                <Download className="w-5 h-5" />
                {content.secondaryButton.label}
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex gap-5 justify-center lg:justify-start"
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
            className="flex justify-center lg:justify-end"
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
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                style={{
                  transform: cardTransform,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="overflow-hidden rounded-[1.8rem]">
                  <img
                    src={content.profileImage.src}
                    alt={content.profileImage.alt}
                    className="w-full aspect-[4/5] object-cover"
                    fetchPriority="high"
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
