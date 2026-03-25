import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import WorkExperience from "./components/WorkExperience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Status from "./components/Status";
import Footer from "./components/Footer";
import TubesCursor from "./components/TubesCursor";
import type { PortfolioContent } from "./types/portfolio-content";
import { resolvePortfolioContentAssets } from "./assets/portfolioAssetMap";

import "./App.css";

function App() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/portfolio-content.json");

        if (!response.ok) {
          throw new Error(`Failed to load content JSON: ${response.status}`);
        }

        const data = (await response.json()) as PortfolioContent;
        setContent(resolvePortfolioContentAssets(data));
      } catch (error) {
        setContentError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    loadContent();
  }, []);

  if (contentError) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-page bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 px-6">
        <p className="text-center">Could not load portfolio content: {contentError}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-page bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-page bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <TubesCursor />
      <Header content={content.header} />

      <main className="overflow-hidden">
        <Hero content={content.hero} />

        <div className="relative section-dots-fixed">
          <div className="relative z-10">
            <About content={content.about} />
            <Status content={content.status} />
            <Skills content={content.skills} />
            <WorkExperience content={content.experience} />
            <Projects content={content.projects} />
            <Contact content={content.contact} />
          </div>
        </div>
      </main>

      <Footer hero={content.hero} />
    </div>
  );
}

export default App;
