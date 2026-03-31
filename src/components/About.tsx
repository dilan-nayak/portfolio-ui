import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { PortfolioContent } from "@/types/portfolio-content";
import SectionTitle from "@/components/SectionTitle";

interface AboutProps {
  content: PortfolioContent["about"];
}

const About = ({ content }: AboutProps) => {
  const mobileImageStripRef = React.useRef<HTMLDivElement | null>(null);
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
  const mobileLoopImages =
    visibleImages.length > 1 ? [...visibleImages, ...visibleImages] : visibleImages;
  const aboutText = content.paragraphs.join("\n\n");

  React.useEffect(() => {
    const strip = mobileImageStripRef.current;
    if (!strip || visibleImages.length <= 1) {
      return;
    }

    let frameId = 0;
    let lastTime = 0;
    const speedPxPerSecond = 16;

    const step = (timestamp: number) => {
      if (lastTime === 0) {
        lastTime = timestamp;
      }
      const deltaSeconds = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      const halfWidth = strip.scrollWidth / 2;
      if (halfWidth > 0) {
        strip.scrollLeft += speedPxPerSecond * deltaSeconds;
        if (strip.scrollLeft >= halfWidth) {
          strip.scrollLeft -= halfWidth;
        }
      }

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [visibleImages.length]);

  return (
    <section id="about" ref={ref} className="py-8 md:py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-6 md:mb-16">
            <SectionTitle title={content.title} className="mb-6" />
          </motion.div>

          <div className="mb-8 md:mb-28">
            <motion.div variants={itemVariants} className="max-w-4xl">
              <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {aboutText}
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-6 md:mt-10 border-y border-zinc-200/70 py-6 md:py-8 dark:border-zinc-800/80"
          >
            <div className="pb-1">
              <div
                ref={mobileImageStripRef}
                className="about-image-strip md:hidden overflow-x-auto overflow-y-hidden"
              >
                <div className="flex w-max gap-3 px-1">
                  {mobileLoopImages.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      className="w-[15rem] shrink-0 overflow-hidden rounded-[1.05rem] border border-zinc-300/35 bg-zinc-100/80 p-1 shadow-[0_6px_18px_rgba(15,23,42,0.05)] dark:border-zinc-700/45 dark:bg-zinc-900/70 dark:shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
                    >
                      <div className="overflow-hidden rounded-[0.9rem]">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-28 w-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto hidden flex-wrap justify-center gap-3 px-3 sm:px-4 md:flex">
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
