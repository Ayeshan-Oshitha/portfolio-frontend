import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext, type ToastItem } from "@/admin/context/toastContext";
import ToastContainer from "@/admin/components/ui/ToastContainer";

interface ToastProviderProps {
  readonly children: React.ReactNode;
}

const AUTO_DISMISS_MS = 4000;

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (variant: ToastItem["variant"], message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, variant, message }]);
      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach((timer) => clearTimeout(timer));
      timersMap.clear();
    };
  }, []);

  const success = useCallback(
    (message: string) => push("success", message),
    [push],
  );
  const error = useCallback(
    (message: string) => push("error", message),
    [push],
  );
  const info = useCallback((message: string) => push("info", message), [push]);

  const value = useMemo(
    () => ({ toasts, dismiss, success, error, info }),
    [toasts, dismiss, success, error, info],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
