import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * The CMS shell: a fixed sidebar, a sticky topbar, and the routed page.
 *
 * The sidebar is taken out of flow (`md:pl-68` on the content column
 * reserves its width), so it stays put while long pages scroll.
 */
export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-h-screen flex-col md:pl-68">
        <Topbar onMenu={() => setNavOpen(true)} />

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
