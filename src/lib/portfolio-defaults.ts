import type { PortfolioContent } from "@/types/portfolio-content";

export const PORTFOLIO_DRAFT_STORAGE_KEY = "portfolio.content.draft.v2";

export const DEFAULT_SECTION_VISIBILITY: Required<PortfolioContent>["ui"]["sectionVisibility"] = {
  home: true,
  about: true,
  status: true,
  skills: true,
  experience: true,
  projects: true,
  contact: true,
};

export const DEFAULT_THEME_SETTINGS: Required<PortfolioContent>["ui"]["theme"] = {
  lightAccentStart: "#5d2220",
  lightAccentEnd: "#c75845",
  darkAccentStart: "#dc2626",
  darkAccentEnd: "#fb7185",
};

export const DEFAULT_INQUIRY_CHIPS = [
  "Job Opportunity",
  "Freelance Project",
  "Collaboration",
  "Feature Suggestion",
];

export const resolveSectionVisibility = (
  visibility?: Partial<PortfolioContent["ui"]["sectionVisibility"]>,
): Required<PortfolioContent>["ui"]["sectionVisibility"] => ({
  ...DEFAULT_SECTION_VISIBILITY,
  ...(visibility ?? {}),
});

export const resolveThemeSettings = (
  theme?: Partial<PortfolioContent["ui"]["theme"]>,
): Required<PortfolioContent>["ui"]["theme"] => ({
  ...DEFAULT_THEME_SETTINGS,
  ...(theme ?? {}),
});
