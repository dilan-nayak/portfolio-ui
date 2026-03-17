import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LayoutGrid } from "lucide-react";
import type { PortfolioContent } from "@/types/portfolio-content";

interface SkillsProps {
  content: PortfolioContent["skills"];
}

const Skills = ({ content }: SkillsProps) => {
  const [activeLearningTab, setActiveLearningTab] = React.useState<
    "overview" | "in-progress" | "completed"
  >("overview");
  const [expandedLearningTabs, setExpandedLearningTabs] = React.useState<{
    "in-progress": boolean;
    completed: boolean;
  }>({
    "in-progress": false,
    completed: false,
  });
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  const normalizeStatus = (status: string) =>
    status.trim().toLowerCase().replace(/\s+/g, "-");
  const isCompleted = (status: string) => normalizeStatus(status) === "completed";
  const isInProgress = (status: string) =>
    normalizeStatus(status) === "in-progress";

  const overviewCourses = (
    content.learning.filter((course) => course.featuredInOverview) || []
  ).slice(0, 4);
  const overviewFallbackCourses = content.learning.slice(0, 4);
  const visibleOverviewCoursesRaw =
    overviewCourses.length > 0 ? overviewCourses : overviewFallbackCourses;
  const visibleOverviewCourses = [...visibleOverviewCoursesRaw].sort((a, b) => {
    const aWeight = isInProgress(a.status) ? 0 : 1;
    const bWeight = isInProgress(b.status) ? 0 : 1;
    return aWeight - bWeight;
  });

  const filteredLearningCourses = content.learning.filter((course) =>
    activeLearningTab === "in-progress"
      ? isInProgress(course.status)
      : isCompleted(course.status),
  );

  const inProgressCount = content.learning.filter((course) =>
    isInProgress(course.status),
  ).length;
  const completedCount = content.learning.filter((course) =>
    isCompleted(course.status),
  ).length;
  const isExpandedTab =
    activeLearningTab === "overview"
      ? false
      : expandedLearningTabs[activeLearningTab];
  const displayedCourses =
    activeLearningTab === "overview"
      ? visibleOverviewCourses
      : isExpandedTab
        ? filteredLearningCourses
        : filteredLearningCourses.slice(0, 4);
  const showMoreButton =
    activeLearningTab !== "overview" &&
    filteredLearningCourses.length > 4 &&
    !isExpandedTab;
  const shouldScrollLearning =
    activeLearningTab !== "overview" &&
    isExpandedTab &&
    filteredLearningCourses.length > 4;
  const leftColumnTechnologies = content.technologies.filter(
    (_, index) => index % 2 === 0,
  );
  const rightColumnTechnologies = content.technologies.filter(
    (_, index) => index % 2 === 1,
  );

  return (
    <section
      id="skills"
      ref={ref}
      className="py-16 md:py-24 bg-transparent"
    >
      <div className="container mx-auto px-8">
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

          <div className="mb-14 flex flex-col gap-8 items-stretch lg:mb-20 lg:flex-row">
            <motion.div variants={itemVariants} className="flex-1 w-full">
              <h3 className="text-2xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-8 text-left">
                {content.stackHeading}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start">
                <div className="space-y-14">
                  {leftColumnTechnologies.map((category) => (
                    <motion.div
                      key={category.category}
                      whileHover={{ x: 2 }}
                      className="transition-all duration-300"
                    >
                      <div className="inline-flex items-center gap-3 mb-3">
                        <span className="h-4 w-1.5 rounded-full bg-[#9f3a30] dark:bg-red-500" />
                        <h4 className="text-2xl font-bold text-[#9f3a30] dark:text-red-400 tracking-tight">
                          {category.category}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-3 pl-5">
                        {category.techs.map((tech) => (
                          <motion.span
                            key={`${category.category}-${tech}`}
                            whileHover={{ scale: 1.04 }}
                            className="px-3 py-1 rounded-lg text-sm font-medium theme-surface-soft bg-zinc-100 dark:bg-zinc-800 theme-text-secondary text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-14">
                  {rightColumnTechnologies.map((category) => (
                    <motion.div
                      key={category.category}
                      whileHover={{ x: 2 }}
                      className="transition-all duration-300"
                    >
                      <div className="inline-flex items-center gap-3 mb-3">
                        <span className="h-4 w-1.5 rounded-full bg-[#9f3a30] dark:bg-red-500" />
                        <h4 className="text-2xl font-bold text-[#9f3a30] dark:text-red-400 tracking-tight">
                          {category.category}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-3 pl-5">
                        {category.techs.map((tech) => (
                          <motion.span
                            key={`${category.category}-${tech}`}
                            whileHover={{ scale: 1.04 }}
                            className="px-3 py-1 rounded-lg text-sm font-medium theme-surface-soft bg-zinc-100 dark:bg-zinc-800 theme-text-secondary text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="hidden lg:flex self-stretch mx-8">
              <div className="w-px bg-gradient-to-b from-[#8f332a] via-zinc-700 to-[#c75845] dark:from-red-700 dark:to-amber-400 opacity-100 h-full" />
            </div>

            <motion.div variants={itemVariants} className="relative mt-12 w-full border-t border-zinc-200/70 pt-12 dark:border-zinc-800/80 lg:mt-0 lg:border-t-0 lg:pt-0 flex-1">
              <h3 className="text-2xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100 mb-8 text-left">
                {content.learningHeading}
              </h3>

              <div className="mb-4 inline-flex rounded-xl theme-surface bg-zinc-200 dark:bg-zinc-800 p-1">
                <button
                  type="button"
                  onClick={() => setActiveLearningTab("overview")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    activeLearningTab === "overview"
                      ? "theme-surface-soft bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow"
                      : "theme-text-secondary text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                  aria-label="Featured learning courses"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLearningTab("in-progress")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    activeLearningTab === "in-progress"
                      ? "theme-surface-soft bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow"
                      : "theme-text-secondary text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>In Progress</span>
                    <span className="text-xs opacity-80">{inProgressCount}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLearningTab("completed")}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    activeLearningTab === "completed"
                      ? "theme-surface-soft bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow"
                      : "theme-text-secondary text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>Completed</span>
                    <span className="text-xs opacity-80">{completedCount}</span>
                  </span>
                </button>
              </div>

              <div
                className={`${
                  shouldScrollLearning ? "max-h-[560px] overflow-y-auto pr-1" : "overflow-visible"
                }`}
              >
                <div className="grid md:grid-cols-1 gap-3">
                  {displayedCourses.map((course, index) => (
                    <motion.div
                      key={`${course.title}-${course.author}-${index}`}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 theme-surface bg-zinc-200 dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-sm font-bold leading-snug theme-text-primary text-zinc-900 dark:text-zinc-100">
                          {course.title}
                        </h4>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isCompleted(course.status)
                              ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : "bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                          }`}
                        >
                          {isCompleted(course.status) ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <p className="text-xs theme-text-secondary text-zinc-700 dark:text-zinc-300 mb-1">
                        by {course.author}
                      </p>
                      <div className="mt-2">
                        <a
                          href={course.courseLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold theme-surface-soft text-[#8f332a] hover:bg-[#e8d7c7] dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-800/60 transition-colors"
                        >
                          Open Link
                        </a>
                      </div>
                      {isInProgress(course.status) && (
                        <div className="mt-2">
                          <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-700">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-[#8f332a] to-[#c75845] dark:from-red-600 dark:to-red-400"
                              style={{ width: `${course.progress ?? 0}%` }}
                            />
                          </div>
                          <p className="text-[11px] font-medium theme-text-secondary text-zinc-700 dark:text-zinc-300 mt-1">
                            {course.progress ?? 0}% complete
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {displayedCourses.length === 0 && (
                  <p className="text-sm theme-text-secondary text-zinc-600 dark:text-zinc-400">
                    {activeLearningTab === "in-progress"
                        ? "No in-progress courses yet."
                        : "No completed courses yet."}
                  </p>
                )}
                {showMoreButton ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLearningTabs((prev) => ({
                          ...prev,
                          [activeLearningTab]: true,
                        }))
                      }
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold theme-surface bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      More
                    </button>
                  </div>
                ) : null}
                {activeLearningTab !== "overview" &&
                isExpandedTab &&
                filteredLearningCourses.length > 4 ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLearningTabs((prev) => ({
                          ...prev,
                          [activeLearningTab]: false,
                        }))
                      }
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold theme-surface bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      Show Less
                    </button>
                  </div>
                ) : null}
                {activeLearningTab === "overview" ? (
                  <p className="mt-4 text-sm theme-text-secondary text-zinc-600 dark:text-zinc-400">
                    Please check the In Progress and Completed tabs to view all courses.
                  </p>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
