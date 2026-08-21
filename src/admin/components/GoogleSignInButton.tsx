import { useEffect, useRef, useState } from "react";
import { toErrorMessage } from "@/admin/api/ApiError";
import useAuth from "@/admin/context/useAuth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  readonly credential: string;
}

interface GoogleIdentityServices {
  readonly accounts: {
    readonly id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: { theme: string; size: string; width?: number },
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google Sign-In."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface GoogleSignInButtonProps {
  readonly onError?: (message: string) => void;
}

/**
 * Renders nothing when `VITE_GOOGLE_CLIENT_ID` is unset, which it is until a
 * real Google OAuth Client ID is provisioned — no client ID exists anywhere
 * in this repo yet.
 */
export default function GoogleSignInButton({
  onError,
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            loginWithGoogle(response.credential).catch((cause: unknown) => {
              onError?.(toErrorMessage(cause));
            });
          },
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
        });
        setIsReady(true);
      })
      .catch((cause: unknown) => {
        onError?.(toErrorMessage(cause));
      });

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, onError]);

  if (!CLIENT_ID) return null;

  return (
    <div className="pt-2">
      <div className="mb-4 flex items-center gap-3 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border-subtle" />
        or
        <span className="h-px flex-1 bg-border-subtle" />
      </div>
      <div ref={containerRef} className={isReady ? "" : "h-10"} />
    </div>
  );
}
