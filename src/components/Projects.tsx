import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Play, Filter } from "lucide-react";
import type { PortfolioContent } from "@/types/portfolio-content";

interface ProjectsProps {
  content: PortfolioContent["projects"];
}

const Projects = ({ content }: ProjectsProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeFilter, setActiveFilter] = useState(content.filters[0] ?? "All");

  const filteredProjects =
    activeFilter === "All"
      ? content.cards
      : content.cards.filter((project) => project.category === activeFilter);

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
      className="py-24 min-h-screen bg-transparent"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-left mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-6">
              {content.title}{" "}
              <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                {content.titleHighlight}
              </span>
            </h2>
          </motion.div>

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

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative theme-surface bg-zinc-200 dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 theme-surface bg-zinc-200/90 dark:bg-zinc-900/90 rounded-full theme-text-primary text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200"
                        aria-label="View Live Project"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 theme-surface bg-zinc-200/90 dark:bg-zinc-900/90 rounded-full theme-text-primary text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200"
                        aria-label="View GitHub Repository"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-[#8f332a]/15 dark:bg-red-900/30 text-[#8f332a] dark:text-red-400 text-sm font-medium rounded-full">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-[#8f332a] dark:group-hover:text-red-300 transition-colors duration-200">
                      {project.title}
                    </h3>

                    <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
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

                    <div className="flex gap-3">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 theme-accent-bg bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                      >
                        <Play className="w-4 h-4" />
                        {content.cta.liveDemo}
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 theme-surface border-zinc-300 dark:border-zinc-700 theme-text-secondary text-zinc-700 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-all duration-200"
                      >
                        <Github className="w-4 h-4" />
                        {content.cta.code}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
