import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import WorkExperience from "@/components/WorkExperience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Status from "@/components/Status";
import Footer from "@/components/Footer";
import TubesCursor from "@/components/TubesCursor";
import ServiceDownState from "@/components/ServiceDownState";
import { usePortfolioContent } from "@/admin/context/PortfolioContentContext";
import { resolveSectionVisibility, resolveThemeSettings } from "@/lib/portfolio-defaults";
import {
  trackAnalyticsEvent,
  trackVisitOncePerSession,
} from "@/lib/portfolio-analytics";

const PublicPortfolioPage = () => {
  const { content, loading, error, serviceDown, reloadContent } = usePortfolioContent();

  useEffect(() => {
    trackVisitOncePerSession();
    trackAnalyticsEvent("page_view");

    const startedAt = Date.now();

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!clickable) return;

      const label =
        clickable.textContent?.trim() ||
        clickable.getAttribute("aria-label") ||
        "Unknown";

      if (clickable.tagName.toLowerCase() === "a") {
        const href = (clickable as HTMLAnchorElement).href || "";
        if (href.includes("/resume") || href.toLowerCase().includes(".pdf")) {
          trackAnalyticsEvent("download_click", { label, href });
          return;
        }
        trackAnalyticsEvent("link_click", { label, href });
        return;
      }

      trackAnalyticsEvent("button_click", { label });
    };

    const onBeforeUnload = () => {
      const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      trackAnalyticsEvent("time_spent", { seconds });
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      onBeforeUnload();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  if (error) {
    if (serviceDown) {
      return (
        <ServiceDownState
          onRetry={() => {
            void reloadContent();
          }}
          details={error}
          fullScreen
        />
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Could not load portfolio content</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{error}</p>
          <button
            type="button"
            onClick={() => {
              void reloadContent();
            }}
            className="mt-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  const visibility = resolveSectionVisibility(content.ui?.sectionVisibility);
  const theme = resolveThemeSettings(content.ui?.theme);

  const navVisibilityByHref: Record<string, boolean> = {
    "#home": visibility.home,
    "#about": visibility.about,
    "#status": visibility.status,
    "#skills": visibility.skills,
    "#experience": visibility.experience,
    "#projects": visibility.projects,
    "#contact": visibility.contact,
  };

  const headerContent = {
    ...content.header,
    navItems: content.header.navItems.filter((item) => navVisibilityByHref[item.href] !== false),
  };

  return (
    <div
      className="min-h-screen theme-page bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
      style={{
        ["--accent-light-start" as string]: theme.lightAccentStart,
        ["--accent-light-end" as string]: theme.lightAccentEnd,
        ["--accent-dark-start" as string]: theme.darkAccentStart,
        ["--accent-dark-end" as string]: theme.darkAccentEnd,
      }}
    >
      <TubesCursor />
      <Header content={headerContent} />

      <main className="overflow-hidden">
        {visibility.home ? <Hero content={content.hero} /> : null}

        <div className="relative section-dots-fixed">
          <div className="relative z-10">
            {visibility.about ? <About content={content.about} /> : null}
            {visibility.status ? <Status content={content.status} /> : null}
            {visibility.skills ? <Skills content={content.skills} /> : null}
            {visibility.experience ? <WorkExperience content={content.experience} /> : null}
            {visibility.projects ? <Projects content={content.projects} /> : null}
            {visibility.contact ? <Contact content={content.contact} /> : null}
          </div>
        </div>
      </main>

      <Footer hero={content.hero} />
    </div>
  );
};

export default PublicPortfolioPage;
