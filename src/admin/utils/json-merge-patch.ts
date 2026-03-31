const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

const isEqual = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

export const buildMergePatch = (original: unknown, updated: unknown): unknown | undefined => {
  if (isEqual(original, updated)) {
    return undefined;
  }

  if (Array.isArray(original) && Array.isArray(updated)) {
    return updated;
  }

  if (isPlainObject(original) && isPlainObject(updated)) {
    const patch: Record<string, unknown> = {};
    const keys = new Set([...Object.keys(original), ...Object.keys(updated)]);

    for (const key of keys) {
      const hasOriginal = Object.prototype.hasOwnProperty.call(original, key);
      const hasUpdated = Object.prototype.hasOwnProperty.call(updated, key);

      if (!hasUpdated && hasOriginal) {
        patch[key] = null;
        continue;
      }

      if (hasUpdated) {
        const nestedPatch = buildMergePatch(original[key], updated[key]);
        if (nestedPatch !== undefined) {
          patch[key] = nestedPatch;
        }
      }
    }

    return Object.keys(patch).length > 0 ? patch : undefined;
  }

  return updated;
};

