import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ChevronRight } from "lucide-react";
import { useInView } from "react-intersection-observer";
import type { PortfolioContent } from "@/types/portfolio-content";

interface WorkExperienceProps {
  content: PortfolioContent["experience"];
}

const getExperienceText = (startDateText: string, endDate: Date) => {
  const startDate = new Date(`${startDateText}T00:00:00`);

  if (Number.isNaN(startDate.getTime()) || endDate < startDate) {
    return "0 years 0 months 0 days";
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const y = `${years} year${years === 1 ? "" : "s"}`;
  const m = `${months} month${months === 1 ? "" : "s"}`;
  const d = `${days} day${days === 1 ? "" : "s"}`;

  return `${y} ${m} ${d}`;
};

const WorkExperience = ({ content }: WorkExperienceProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [today, setToday] = useState(new Date());

  const active = content.companies[activeIndex];

  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const experienceText = useMemo(
    () => getExperienceText(content.careerStartDate, today),
    [content.careerStartDate, today]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (!content.companies.length) {
    return null;
  }

  return (
    <section
      id="experience"
      ref={ref}
      className="py-8 md:py-24 bg-transparent"
    >
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="mb-6 md:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-4xl lg:text-5xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100">
                <span className="theme-accent-text bg-gradient-to-r from-slate-700 to-cyan-600 dark:from-red-600 dark:to-red-500 bg-clip-text text-transparent">
                  {content.title}
                </span>
              </h2>

              <div className="inline-flex items-center rounded-xl px-4 py-3 theme-accent-bg bg-slate-700 text-white dark:bg-red-700 shadow-lg sm:self-auto self-start">
                <span className="font-semibold">
                  {content.counterLabel}: {experienceText}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-[240px_1px_1fr] gap-8 items-start">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {content.companies.map((company, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={company.companyFullName} className="w-full">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      className={`w-full text-left whitespace-nowrap lg:whitespace-normal px-3 py-3 rounded-xl transition-all duration-300 appearance-none border outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none ${
                        isActive
                          ? "theme-surface bg-zinc-200/85 dark:bg-zinc-900/70 border-[#8f332a]/40 dark:border-red-500/40 shadow-md"
                          : "border-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"
                      }`}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <ChevronRight
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive
                              ? "opacity-100 text-[#8f332a] dark:text-red-300"
                              : "opacity-0"
                          }`}
                        />
                        <span
                          className={`inline-block transition-all duration-300 ${
                            isActive
                              ? "translate-x-1 text-[#8f332a] dark:text-red-300"
                              : "translate-x-0 theme-text-secondary text-zinc-700 dark:text-zinc-300 hover:text-[#8f332a] dark:hover:text-red-400"
                          } text-lg font-extrabold`}
                        >
                          {company.companyShortName}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block w-px bg-gradient-to-b from-[#8f332a] via-zinc-300 to-[#c75845] dark:from-red-500 dark:via-zinc-700 dark:to-red-500 h-full" />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.companyFullName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
                className="rounded-2xl border theme-surface border-zinc-300/60 dark:border-zinc-700/70 bg-zinc-100/65 dark:bg-zinc-900/55 p-5 md:p-7 shadow-xl backdrop-blur-sm"
              >
                <div className="mb-6">
                  <a
                    href={active.companyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-2xl font-bold text-[#8f332a] dark:text-red-300 hover:text-[#702821] dark:hover:text-red-200 transition-colors"
                  >
                    {active.companyFullName}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {active.totalDuration ? (
                    <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400 mt-2">{active.totalDuration}</p>
                  ) : null}
                </div>

                <div className="space-y-8">
                  {active.positions.map((position, positionIndex) => {
                    const isLastPosition = positionIndex === active.positions.length - 1;

                    return (
                      <div
                        key={`${position.title}-${position.duration}`}
                        className={`relative pl-10 ${isLastPosition ? "pb-0" : "pb-8"}`}
                      >
                        <div className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-[#8f332a] dark:bg-red-400 ring-4 ring-[#8f332a]/15 dark:ring-red-500/15" />
                        {!isLastPosition ? (
                          <div className="absolute left-[6px] top-6 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700" />
                        ) : null}

                        <h4 className="text-2xl font-bold theme-text-primary text-zinc-900 dark:text-zinc-100">
                          {position.title}
                        </h4>
                        {position.employmentType ? (
                          <p className="theme-text-secondary text-zinc-700 dark:text-zinc-300 mt-1">{position.employmentType}</p>
                        ) : null}
                        <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400 mt-1">{position.duration}</p>
                        {position.location ? (
                          <p className="theme-text-secondary text-zinc-600 dark:text-zinc-400">{position.location}</p>
                        ) : null}

                        <div className="mt-4 hidden space-y-3 md:block">
                          {position.descriptions.map((description) => (
                            <p key={description} className="theme-text-secondary text-zinc-700 dark:text-zinc-300 leading-relaxed">
                              {description}
                            </p>
                          ))}
                        </div>

                        <details className="mt-4 rounded-xl bg-zinc-200/70 px-4 py-3 dark:bg-zinc-800/60 md:hidden">
                          <summary className="cursor-pointer text-sm font-semibold text-[#8f332a] dark:text-red-300">
                            Role highlights
                          </summary>
                          <div className="mt-3 space-y-3">
                            {position.descriptions.map((description) => (
                              <p key={`${description}-mobile`} className="theme-text-secondary text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                {description}
                              </p>
                            ))}
                          </div>
                        </details>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkExperience;
