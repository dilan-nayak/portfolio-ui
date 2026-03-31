const EXTERNAL_PROTOCOL_PATTERN = /^(https?:|mailto:|tel:)/i;

export const isSafeLinkTarget = (href: string | undefined | null): boolean => {
  if (!href) return false;
  const normalized = href.trim();
  return (
    normalized.startsWith("/") ||
    normalized.startsWith("#") ||
    EXTERNAL_PROTOCOL_PATTERN.test(normalized)
  );
};

export const toSafeHref = (
  href: string | undefined | null,
  fallback = "#",
): string => {
  if (!href) return fallback;
  const normalized = href.trim();
  return isSafeLinkTarget(normalized) ? normalized : fallback;
};

export const isExternalLink = (href: string | undefined | null): boolean => {
  if (!href) return false;
  return EXTERNAL_PROTOCOL_PATTERN.test(href.trim());
};
