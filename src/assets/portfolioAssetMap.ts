import catCloseImage from "./images/cat-close.png";
import catOpenImage from "./images/cat-open.png";
import dilanImage from "./images/dilan.jpg";
import localdropImage from "./images/localdrop.png";
import mumbaiImage from "./images/mumbai.jpg";
import sunsetImage from "./images/sunset.jpg";

const assetPathMap: Record<string, string> = {
  "/images/cat-close.png": catCloseImage,
  "/images/cat-open.png": catOpenImage,
  "/images/dilan.jpg": dilanImage,
  "/images/localdrop.png": localdropImage,
  "/images/mumbai.jpg": mumbaiImage,
  "/images/sunset.jpg": sunsetImage,
};

const resolveValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return assetPathMap[value] ?? value;
  }

  if (Array.isArray(value)) {
    return value.map(resolveValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, resolveValue(nestedValue)]),
    );
  }

  return value;
};

export const resolvePortfolioContentAssets = <T>(content: T): T =>
  resolveValue(content) as T;
