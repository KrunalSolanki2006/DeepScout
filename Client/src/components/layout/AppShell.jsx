import React, { useState } from "react";
import { TopBar } from "./TopBar.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { MobileDrawer } from "./MobileDrawer.jsx";

export const AppShell = ({ children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative h-screen bg-[#000000] text-neutral-100 flex flex-col font-sans selection:bg-white/20 selection:text-white antialiased overflow-hidden">
      {/* Background Architectural Grid Texture */}
      <div
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-20 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top-Right Ambient Monochrome Backlight */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[450px] bg-gradient-to-bl from-white/[0.05] via-neutral-500/[0.02] to-transparent blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Navigation */}
      <TopBar
        onToggleSidebar={() => setMobileDrawerOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleDesktopSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Collapsible like ChatGPT/Gemini) */}
        <div
          className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-72 lg:w-80" : "w-0 overflow-hidden"
          }`}
        >
          <Sidebar onToggleCollapse={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile Slide-over Drawer */}
        <MobileDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-transparent flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
