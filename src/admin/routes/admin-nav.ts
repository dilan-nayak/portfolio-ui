import type { IconValue } from "@/types/portfolio-content";

interface AdminNavItem {
  to: string;
  label: string;
  icon: IconValue;
  children?: AdminNavItem[];
}

export const adminNavItems: AdminNavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: { library: "fas", icon: "table-columns" } },
  { to: "/admin/home", label: "Home / Hero", icon: { library: "fas", icon: "house" } },
  { to: "/admin/about", label: "About", icon: { library: "fas", icon: "user" } },
  { to: "/admin/status", label: "Status", icon: { library: "fas", icon: "signal" } },
  {
    to: "/admin/skills",
    label: "Skills",
    icon: { library: "fas", icon: "star" },
    children: [
      { to: "/admin/skills", label: "Technology Stack", icon: { library: "fas", icon: "code" } },
      { to: "/admin/learning", label: "Learning", icon: { library: "fas", icon: "graduation-cap" } },
    ],
  },
  { to: "/admin/experience", label: "Experience", icon: { library: "fas", icon: "briefcase" } },
  { to: "/admin/projects", label: "Projects", icon: { library: "fas", icon: "folder" } },
  { to: "/admin/contact", label: "Contact / Profile", icon: { library: "fas", icon: "address-card" } },
  { to: "/admin/analytics", label: "Analytics", icon: { library: "fas", icon: "signal" } },
  { to: "/admin/settings", label: "Settings", icon: { library: "fas", icon: "gear" } },
];

export const adminTitleByPath = adminNavItems.reduce<Record<string, string>>((acc, item) => {
  acc[item.to] = item.label;
  item.children?.forEach((child) => {
    acc[child.to] = child.label;
  });
  return acc;
}, {});
