import { useEffect } from "react";

/** Sets the browser tab title while the calling component is mounted. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
