import React from "react";

export const useStableListKeys = (length: number, sessionKey: number, prefix: string) => {
  const sequenceRef = React.useRef(0);
  const sessionRef = React.useRef(sessionKey);
  const makeKey = React.useCallback(() => {
    sequenceRef.current += 1;
    return `${prefix}-${sequenceRef.current}`;
  }, [prefix]);

  const [keys, setKeys] = React.useState<string[]>(() =>
    Array.from({ length }, () => makeKey()),
  );

  React.useEffect(() => {
    if (sessionRef.current !== sessionKey) {
      sessionRef.current = sessionKey;
      setKeys(Array.from({ length }, () => makeKey()));
      return;
    }

    setKeys((prev) => {
      if (prev.length === length) return prev;
      if (prev.length < length) {
        return [...prev, ...Array.from({ length: length - prev.length }, () => makeKey())];
      }
      return prev.slice(0, length);
    });
  }, [length, makeKey, sessionKey]);

  return [keys, setKeys] as const;
};
