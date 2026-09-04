import { createPortal } from "react-dom";

interface AdminPortalProps {
  readonly children: React.ReactNode;
}

/**
 * Portals admin overlays to `document.body` with the admin theme reattached.
 *
 * Anything portalled escapes `AdminRoot`'s wrapper, and with it the
 * `data-theme="admin-light"` block that supplies every admin token. Without
 * this the subtree falls back to whichever theme the visitor picked on
 * `<html>` — so a dialog would render in the marketing palette, in dark mode
 * on a light page.
 *
 * The wrapper is `display: contents`, so it supplies the theme without
 * introducing a box: custom properties inherit down the DOM tree regardless
 * of whether an element generates one, which keeps the child's `fixed`
 * positioning and stacking behaviour exactly as if it were portalled
 * directly.
 *
 * Every portalled admin component should go through this rather than calling
 * `createPortal` itself.
 */
export default function AdminPortal({ children }: AdminPortalProps) {
  return createPortal(
    <div data-theme="admin-light" className="contents">
      {children}
    </div>,
    document.body,
  );
}
