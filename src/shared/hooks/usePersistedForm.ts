import { useEffect, useRef } from "react";
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

function readDraft<T>(storageKey: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

/**
 * Wraps `useForm` with a localStorage-backed draft, so an accidental refresh
 * or a stray back/forward doesn't lose in-progress input. The draft is
 * cleared automatically on unmount, which is the same moment a modal closes
 * or a route change tears the form down — a real browser refresh does not
 * run unmount effects, so the draft survives exactly the cases it should.
 */
export function usePersistedForm<T extends FieldValues>(
  storageKey: string,
  options: UseFormProps<T>,
): UseFormReturn<T> & { clearPersisted: () => void } {
  const draft = useRef(readDraft<T>(storageKey)).current;

  const form = useForm<T>({
    ...options,
    defaultValues: {
      ...options.defaultValues,
      ...draft,
    } as UseFormProps<T>["defaultValues"],
  });

  const clearPersisted = useRef(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Storage can be unavailable (private browsing, quota); losing the draft is harmless.
    }
  }).current;

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
      } catch {
        // Same as above — persistence is a convenience, not a requirement.
      }
    });
    return () => subscription.unsubscribe();
  }, [form, storageKey]);

  useEffect(() => {
    return () => clearPersisted();
    // Only ever wired to the mount/unmount of this instance, not `clearPersisted`'s identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...form, clearPersisted };
}
