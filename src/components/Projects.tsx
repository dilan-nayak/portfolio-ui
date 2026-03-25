import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github } from "lucide-react";
import type { PortfolioContent } from "@/types/portfolio-content";

interface ProjectsProps {
  content: PortfolioContent["projects"];
}

const Projects = ({ content }: ProjectsProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Filter state is intentionally disabled for now.
  // const [activeFilter, setActiveFilter] = useState(content.filters[0] ?? "All");

  // Popup state is intentionally disabled for now.
  // const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const visibleProjects = content.cards;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="py-8 md:py-24 bg-transparent"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-6 md:mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-6">
              {content.title}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>
          </motion.div>

          {/* Filter controls are intentionally disabled for now.
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {content.filters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 text-white shadow-lg"
                    : "theme-surface bg-zinc-200/90 dark:bg-zinc-900/80 theme-text-secondary text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {filter}
              </motion.button>
            ))}
          </motion.div>
          */}

          <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {visibleProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-300/70 theme-surface bg-zinc-200 shadow-lg transition-all duration-200 hover:border-[#8f332a]/55 hover:shadow-[0_0_0_1px_rgba(143,51,42,0.18),0_0_22px_rgba(143,51,42,0.12)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-red-400/55 dark:hover:shadow-[0_0_0_1px_rgba(248,113,113,0.2),0_0_24px_rgba(239,68,68,0.14)] mx-auto"
                >
                  <div className="relative hidden overflow-hidden md:block">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-56 w-full object-cover"
                    />
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#8f332a]/15 dark:bg-red-900/30 text-[#8f332a] dark:text-red-400 text-sm font-medium rounded-full">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold theme-text-primary text-zinc-900 md:text-xl dark:text-zinc-100">
                      {project.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm theme-text-secondary text-zinc-600 dark:text-zinc-400 md:text-base">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 theme-surface-soft bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex">
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-zinc-300 px-4 py-2 theme-surface theme-text-secondary text-zinc-700 transition-colors duration-200 hover:border-[#8f332a]/65 hover:bg-[#8f332a]/12 hover:text-[#8f332a] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-red-400/60 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                      >
                        <Github className="w-4 h-4" />
                        {content.cta.code}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>

          {/* Project popup is intentionally disabled for now.
          <AnimatePresence>
            {selectedProject ? (
              <motion.div>
                ...
              </motion.div>
            ) : null}
          </AnimatePresence>
          */}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
