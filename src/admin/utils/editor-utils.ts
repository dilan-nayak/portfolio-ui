export const moveItem = <T,>(items: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= items.length || from === to) return items;
  const clone = [...items];
  const [item] = clone.splice(from, 1);
  clone.splice(to, 0, item);
  return clone;
};

export const removeAt = <T,>(items: T[], index: number): T[] => {
  return items.filter((_, itemIndex) => itemIndex !== index);
};

export const insertAt = <T,>(items: T[], index: number, next: T): T[] => {
  const safeIndex = Math.max(0, Math.min(index, items.length));
  const clone = [...items];
  clone.splice(safeIndex, 0, next);
  return clone;
};

export const updateAt = <T,>(items: T[], index: number, next: T): T[] => {
  return items.map((item, itemIndex) => (itemIndex === index ? next : item));
};

export const reorderByKeys = <T,>(
  items: T[],
  currentKeys: string[],
  nextKeys: string[],
): T[] => {
  const keyedItems = new Map(currentKeys.map((key, index) => [key, items[index]] as const));
  return nextKeys
    .map((key) => keyedItems.get(key))
    .filter((item): item is T => item !== undefined);
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unknown file error"));
    reader.readAsDataURL(file);
  });
