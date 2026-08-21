import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * A single filter value synced to the URL's query string instead of local
 * state, so the current view survives a refresh and can be shared as a link.
 * Uses `replace` navigation — every keystroke would otherwise be a back-button
 * stop — and omits the key entirely once it matches `defaultValue`, keeping
 * URLs clean.
 */
export function useSearchParamState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = (searchParams.get(key) as T | null) ?? defaultValue;

  const setValue = useCallback(
    (next: T) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === defaultValue) {
            params.delete(key);
          } else {
            params.set(key, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [key, defaultValue, setSearchParams],
  );

  return [value, setValue];
}
