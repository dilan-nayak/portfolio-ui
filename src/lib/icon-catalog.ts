import type { IconPrefix } from "@fortawesome/fontawesome-svg-core";

export type IconLibrary = Extract<IconPrefix, "fab" | "fas">;
export type IconName =
  | "github"
  | "linkedin-in"
  | "x-twitter"
  | "envelope"
  | "phone"
  | "globe"
  | "location-dot"
  | "comment"
  | "download"
  | "bars"
  | "xmark"
  | "sun"
  | "moon"
  | "code"
  | "arrow-up"
  | "arrow-down"
  | "pen"
  | "trash"
  | "upload"
  | "circle-question"
  | "right-from-bracket"
  | "table-columns"
  | "house"
  | "user"
  | "signal"
  | "star"
  | "graduation-cap"
  | "briefcase"
  | "folder"
  | "address-card"
  | "gear"
  | "chevron-right"
  | "arrow-up-right-from-square"
  | "lock";

export interface IconChoice {
  library: IconLibrary;
  icon: IconName;
  label: string;
}

export const ICONS: IconChoice[] = [
  { library: "fab", icon: "github", label: "GitHub" },
  { library: "fab", icon: "linkedin-in", label: "LinkedIn" },
  { library: "fab", icon: "x-twitter", label: "X (Twitter)" },
  { library: "fas", icon: "envelope", label: "Email" },
  { library: "fas", icon: "phone", label: "Phone" },
  { library: "fas", icon: "globe", label: "Website" },
  { library: "fas", icon: "location-dot", label: "Location" },
  { library: "fas", icon: "comment", label: "Message" },
  { library: "fas", icon: "download", label: "Download" },
  { library: "fas", icon: "bars", label: "Menu" },
  { library: "fas", icon: "xmark", label: "Close" },
  { library: "fas", icon: "sun", label: "Sun" },
  { library: "fas", icon: "moon", label: "Moon" },
  { library: "fas", icon: "code", label: "Code" },
  { library: "fas", icon: "arrow-up", label: "Arrow Up" },
  { library: "fas", icon: "arrow-down", label: "Arrow Down" },
  { library: "fas", icon: "pen", label: "Edit" },
  { library: "fas", icon: "trash", label: "Delete" },
  { library: "fas", icon: "upload", label: "Upload" },
  { library: "fas", icon: "circle-question", label: "Unknown" },
  { library: "fas", icon: "right-from-bracket", label: "Logout" },
  { library: "fas", icon: "table-columns", label: "Dashboard" },
  { library: "fas", icon: "house", label: "Home" },
  { library: "fas", icon: "user", label: "User" },
  { library: "fas", icon: "signal", label: "Status" },
  { library: "fas", icon: "star", label: "Skills" },
  { library: "fas", icon: "graduation-cap", label: "Learning" },
  { library: "fas", icon: "briefcase", label: "Experience" },
  { library: "fas", icon: "folder", label: "Projects" },
  { library: "fas", icon: "address-card", label: "Contact" },
  { library: "fas", icon: "gear", label: "Settings" },
  { library: "fas", icon: "chevron-right", label: "Chevron Right" },
  { library: "fas", icon: "arrow-up-right-from-square", label: "External Link" },
  { library: "fas", icon: "lock", label: "Lock" },
];

export const FALLBACK_ICON: IconChoice = {
  library: "fas",
  icon: "circle-question",
  label: "Unknown",
};

export const LEGACY_ICON_MAP: Record<string, Pick<IconChoice, "library" | "icon">> = {
  github: { library: "fab", icon: "github" },
  linkedin: { library: "fab", icon: "linkedin-in" },
  linkedinin: { library: "fab", icon: "linkedin-in" },
  twitter: { library: "fab", icon: "x-twitter" },
  x: { library: "fab", icon: "x-twitter" },
  mail: { library: "fas", icon: "envelope" },
  email: { library: "fas", icon: "envelope" },
  phone: { library: "fas", icon: "phone" },
  website: { library: "fas", icon: "globe" },
  globe: { library: "fas", icon: "globe" },
  mapPin: { library: "fas", icon: "location-dot" },
  messageCircle: { library: "fas", icon: "comment" },
};

export const searchIcons = (query: string, limit = 12): IconChoice[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return ICONS.slice(0, limit);
  }

  return ICONS.filter((item) => item.label.toLowerCase().includes(normalized)).slice(0, limit);
};
