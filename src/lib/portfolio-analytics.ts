export type AnalyticsEventType =
  | "visit"
  | "page_view"
  | "button_click"
  | "link_click"
  | "download_click"
  | "time_spent";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  page: string;
  referrer: string;
  browser: string;
  os: string;
  device: "mobile" | "tablet" | "desktop";
  label?: string;
  href?: string;
  seconds?: number;
}

const STORAGE_KEY = "portfolio.analytics.events.v1";
const VISIT_GUARD_KEY = "portfolio.analytics.visit.guard";
const MAX_EVENTS = 3000;
export const ANALYTICS_UPDATED_EVENT = "portfolio:analytics-updated";

const hasWindow = () => typeof window !== "undefined";

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getUA = () => (hasWindow() ? window.navigator.userAgent ?? "" : "");

const getBrowser = () => {
  const ua = getUA().toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";
  return "Unknown";
};

const getOs = () => {
  const ua = getUA().toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) return "iOS";
  if (ua.includes("linux")) return "Linux";
  return "Unknown";
};

const getDevice = (): "mobile" | "tablet" | "desktop" => {
  const ua = getUA().toLowerCase();
  if (ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"))) return "tablet";
  if (
    ua.includes("mobi") ||
    ua.includes("iphone") ||
    ua.includes("android")
  ) {
    return "mobile";
  }
  return "desktop";
};

const getPage = () => {
  if (!hasWindow()) return "/";
  return `${window.location.pathname}${window.location.hash}`;
};

const getReferrer = () => {
  if (!hasWindow()) return "direct";
  return document.referrer || "direct";
};

export const readAnalyticsEvents = (): AnalyticsEvent[] => {
  if (!hasWindow()) return [];
  return parseJson<AnalyticsEvent[]>(window.localStorage.getItem(STORAGE_KEY), []);
};

const writeAnalyticsEvents = (events: AnalyticsEvent[]) => {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
};

export const trackAnalyticsEvent = (
  type: AnalyticsEventType,
  options?: {
    label?: string;
    href?: string;
    seconds?: number;
    page?: string;
  },
) => {
  if (!hasWindow()) return;
  const events = readAnalyticsEvents();
  const event: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    type,
    timestamp: Date.now(),
    page: options?.page ?? getPage(),
    referrer: getReferrer(),
    browser: getBrowser(),
    os: getOs(),
    device: getDevice(),
    label: options?.label,
    href: options?.href,
    seconds: options?.seconds,
  };
  events.push(event);
  writeAnalyticsEvents(events);
  window.dispatchEvent(new CustomEvent(ANALYTICS_UPDATED_EVENT));
};

export const trackVisitOncePerSession = () => {
  if (!hasWindow()) return;
  const today = new Date().toISOString().slice(0, 10);
  const guard = window.sessionStorage.getItem(VISIT_GUARD_KEY);
  const value = `${today}:${window.location.pathname}`;
  if (guard === value) return;
  window.sessionStorage.setItem(VISIT_GUARD_KEY, value);
  trackAnalyticsEvent("visit");
};

const referrerSource = (referrer: string) => {
  if (!referrer || referrer === "direct") return "Direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google.")) return "Google";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("github.")) return "GitHub";
    if (host.includes("twitter.") || host.includes("x.com")) return "X / Twitter";
    return host.replace("www.", "");
  } catch {
    return "Direct";
  }
};

const countBy = <T extends string>(arr: T[]) =>
  arr.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});

export const getAnalyticsSummary = () => {
  const events = readAnalyticsEvents();
  const visits = events.filter((e) => e.type === "visit");
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const visitsToday = visits.filter((v) => new Date(v.timestamp).toISOString().slice(0, 10) === today).length;

  const visitsPerDay = countBy(
    visits.map((v) => new Date(v.timestamp).toISOString().slice(0, 10)),
  );

  const visitsPerHour = countBy(
    visits.map((v) => String(new Date(v.timestamp).getHours()).padStart(2, "0")),
  );

  const trafficSource = countBy(visits.map((v) => referrerSource(v.referrer)));
  const browserType = countBy(visits.map((v) => v.browser));
  const osType = countBy(visits.map((v) => v.os));
  const deviceType = countBy(visits.map((v) => v.device));

  const timeSpentSeconds = events
    .filter((e) => e.type === "time_spent")
    .reduce((sum, e) => sum + (e.seconds ?? 0), 0);

  const timeSpentAvgSeconds =
    visits.length > 0 ? Math.round(timeSpentSeconds / visits.length) : 0;

  const clickCounts = {
    button: events.filter((e) => e.type === "button_click").length,
    link: events.filter((e) => e.type === "link_click").length,
    download: events.filter((e) => e.type === "download_click").length,
  };

  return {
    totalEvents: events.length,
    totalVisits: visits.length,
    visitsToday,
    visitsPerDay,
    visitsPerHour,
    trafficSource,
    browserType,
    osType,
    deviceType,
    timeSpentAvgSeconds,
    clickCounts,
  };
};
