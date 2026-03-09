import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { PortfolioContent } from "@/types/portfolio-content";

interface AboutProps {
  content: PortfolioContent["about"];
}

const About = ({ content }: AboutProps) => {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const aboutImagesRaw =
    content.images && content.images.length > 0
      ? content.images
      : content.image
        ? [content.image]
        : [];
  const aboutImages =
    aboutImagesRaw.length > 0
      ? aboutImagesRaw
      : [{ src: "/images/hero-workspace.JPG", alt: "Workspace" }];
  const activeImage = aboutImages[activeImageIndex] ?? aboutImages[0];

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 min-h-screen bg-transparent"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-6">
              {content.title}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="space-y-4 theme-text-secondary text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#a33a2f]/20 via-transparent to-[#2f343c]/20 dark:from-cyan-500/20 dark:to-red-500/20 blur-2xl" />
                <div className="relative rounded-3xl border theme-surface border-zinc-300/70 dark:border-zinc-700/70 bg-zinc-100/80 dark:bg-zinc-900/70 p-3 shadow-2xl backdrop-blur">
                  <motion.div
                    key={`${activeImage.src}-${activeImageIndex}`}
                    initial={{ opacity: 0.35, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      className="h-[360px] w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
                  </motion.div>

                  <div className="mt-3 max-h-44 overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 gap-2">
                      {aboutImages.map((image, index) => {
                        const isActive = index === activeImageIndex;
                        return (
                          <button
                            key={`${image.src}-${index}`}
                            type="button"
                            onMouseEnter={() => setActiveImageIndex(index)}
                            onFocus={() => setActiveImageIndex(index)}
                            onClick={() => setActiveImageIndex(index)}
                            className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                              isActive
                                ? "border-[#9f3a30] dark:border-red-500 ring-2 ring-[#b14a3d]/40 dark:ring-red-500/40"
                                : "border-zinc-300 dark:border-zinc-700 hover:border-[#9f3a30]/70 dark:hover:border-red-500/70"
                            }`}
                            aria-label={`Show image ${index + 1}`}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="h-20 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
