import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, User, LogOut, Menu, PanelLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useInvestigation } from "../../context/InvestigationContext.jsx";
import { DeepScoutLogo } from "../ui/DeepScoutLogo.jsx";

/**
 * TopBar
 * Professional research workspace navigation matching ChatGPT / Gemini clean layout.
 */
export const TopBar = ({ onToggleSidebar, sidebarOpen = true, onToggleDesktopSidebar }) => {
  const { user, logout } = useAuth();
  const { clearActiveInvestigation, investigating } = useInvestigation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewInvestigation = () => {
    clearActiveInvestigation();
    navigate("/app");
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#090D16]/90 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between text-slate-100 transition-all select-none">
      {/* Left: Sidebar Toggle + Brand Identity */}
      <div className="flex items-center gap-2.5">
        {/* Mobile menu toggle */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            aria-label="Toggle investigation library"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Sidebar Toggle (like ChatGPT/Gemini) */}
        {onToggleDesktopSidebar && (
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden md:inline-flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <Link
          to="/app"
          onClick={handleNewInvestigation}
          className="flex items-center gap-2 group transition-opacity pl-1"
        >
          <DeepScoutLogo size="xs" glow={false} />
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-black text-sm sm:text-base tracking-tight text-white group-hover:text-blue-300 transition-colors flex items-center">
              DEEP<span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">SCOUT</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono pl-1.5 border-l border-slate-800">
              Workspace
            </span>
          </div>
        </Link>

        {/* Quick New Investigation button when sidebar is collapsed */}
        {!sidebarOpen && (
          <button
            type="button"
            onClick={handleNewInvestigation}
            disabled={investigating}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-850 border border-slate-700/80 rounded-lg transition-colors shadow-2xs ml-2"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New</span>
          </button>
        )}
      </div>

      {/* Right: User Profile Menu */}
      <div className="flex items-center gap-2.5">
        {/* User Account Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2.5 pr-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-colors"
            aria-expanded={dropdownOpen}
            aria-label="User account menu"
          >
            <span className="text-xs font-medium text-slate-300 hidden sm:inline-block max-w-[120px] truncate">
              {user?.name || "Researcher"}
            </span>
            <div className="w-6 h-6 rounded-full bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold uppercase shadow-2xs">
              {user?.name ? user.name.charAt(0) : <User className="w-3 h-3 text-cyan-400" />}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl shadow-black/70 py-1.5 z-40 animate-fade-in text-xs backdrop-blur-xl text-slate-200">
              <div className="px-3.5 py-2.5 border-b border-slate-800/80">
                <p className="font-semibold text-white truncate">
                  {user?.name || "Researcher"}
                </p>
                <p className="text-slate-400 truncate mt-0.5">{user?.email || "Signed in"}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  handleNewInvestigation();
                }}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Investigation</span>
              </button>

              <div className="border-t border-slate-800/80 my-1"></div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
