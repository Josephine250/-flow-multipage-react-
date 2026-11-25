import { useEffect } from "react";

// Syncs the browser tab title (an external system) with the current page.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}