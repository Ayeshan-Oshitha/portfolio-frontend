import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface PendingChange {
  readonly key: string;
  readonly value: string;
  readonly defaultValue: string;
}

/**
 * Shared across every `useSearchParamState` instance on the page — see the
 * note in `setValue` below for why a module-level queue, not per-hook state,
 * is what makes batching work.
 */
let pendingChanges: PendingChange[] = [];
let flushScheduled = false;

/**
 * A single filter value synced to the URL's query string instead of local
 * state, so the current view survives a refresh and can be shared as a link.
 * Uses `replace` navigation — every keystroke would otherwise be a back-button
 * stop — and omits the key entirely once it matches `defaultValue`, keeping
 * URLs clean.
 *
 * Calls to `setValue` are queued and flushed together in one microtask
 * rather than applied immediately. React Router's `setSearchParams` builds
 * its next URL from the `location.search` captured at render time, so
 * multiple calls in the same handler (e.g. resetting the page *and* changing
 * a filter) would otherwise each start from that same stale snapshot —
 * `replace: true` then collapses them onto one history entry and only the
 * *last* call's change survives, silently dropping the others. Queuing and
 * applying every change from one tick in a single `setSearchParams` call
 * fixes that at the source, so no call site needs to know about it.
 */
export function useSearchParamState<T extends string>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = (searchParams.get(key) as T | null) ?? defaultValue;

  // The flush runs after this render's handler returns, so it must call
  // whatever `setSearchParams` is current at flush time, not at schedule time.
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);

  const setValue = useCallback(
    (next: T) => {
      pendingChanges.push({ key, value: next, defaultValue });

      if (!flushScheduled) {
        flushScheduled = true;
        queueMicrotask(() => {
          const changes = pendingChanges;
          pendingChanges = [];
          flushScheduled = false;

          setSearchParamsRef.current(
            (prev) => {
              const params = new URLSearchParams(prev);
              for (const change of changes) {
                if (change.value === change.defaultValue) {
                  params.delete(change.key);
                } else {
                  params.set(change.key, change.value);
                }
              }
              return params;
            },
            { replace: true },
          );
        });
      }
    },
    [key, defaultValue],
  );

  return [value, setValue];
}
