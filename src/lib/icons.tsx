import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { FALLBACK_ICON, ICONS, LEGACY_ICON_MAP } from "@/lib/icon-catalog";
import type { IconValue } from "@/types/portfolio-content";

const ICON_SET = new Set(ICONS.map((item) => `${item.library}:${item.icon}`));

export const normalizeIconValue = (value?: IconValue | string | null): IconValue => {
  if (value && typeof value === "object" && "library" in value && "icon" in value) {
    const key = `${value.library}:${value.icon}`;
    if (ICON_SET.has(key)) {
      return { library: value.library, icon: value.icon };
    }
  }

  if (typeof value === "string") {
    const raw = value.trim();
    const legacy = LEGACY_ICON_MAP[raw] ?? LEGACY_ICON_MAP[raw.toLowerCase()];
    if (legacy) {
      return legacy;
    }
  }

  return { library: FALLBACK_ICON.library, icon: FALLBACK_ICON.icon };
};

export const SafeFaIcon = ({
  value,
  className,
}: {
  value?: IconValue | string | null;
  className?: string;
}) => {
  const normalized = normalizeIconValue(value);
  return (
    <FontAwesomeIcon
      icon={[normalized.library as IconPrefix, normalized.icon]}
      className={`fa-center-fix ${className ?? ""}`.trim()}
    />
  );
};

export const iconLabelFromValue = (value?: IconValue | string | null): string => {
  const normalized = normalizeIconValue(value);
  const found = ICONS.find((item) => item.library === normalized.library && item.icon === normalized.icon);
  return found?.label ?? FALLBACK_ICON.label;
};
