import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { PortfolioContent } from "@/types/portfolio-content";

interface AboutProps {
  content: PortfolioContent["about"];
}

const About = ({ content }: AboutProps) => {
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
  const visibleImages = aboutImagesRaw.slice(0, 6);
  const imageStripClassName =
    visibleImages.length <= 3
      ? "mx-auto flex flex-wrap justify-center gap-3"
      : "mx-auto flex flex-wrap justify-center gap-3 px-3 sm:px-4";

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-10 md:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-6">
              {content.title}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>
          </motion.div>

          <div className="mb-16 md:mb-28">
            <motion.div variants={itemVariants} className="max-w-4xl">
              <div className="space-y-4 theme-text-secondary text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-10 border-y border-zinc-200/70 py-8 dark:border-zinc-800/80"
          >
            <div className="pb-1">
              <div className={imageStripClassName}>
                {visibleImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className="w-full max-w-[16rem] overflow-hidden rounded-[1.05rem] border border-zinc-300/35 bg-zinc-100/80 p-1 shadow-[0_6px_18px_rgba(15,23,42,0.05)] sm:w-[14rem] dark:border-zinc-700/45 dark:bg-zinc-900/70 dark:shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
                  >
                    <div className="overflow-hidden rounded-[0.9rem]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-28 w-full object-cover sm:h-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
