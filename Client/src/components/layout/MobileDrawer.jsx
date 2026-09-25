import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar.jsx";

export const MobileDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[85vw] h-full bg-[#000000] border-r border-slate-800 shadow-2xl z-10 flex flex-col text-slate-100">
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider">
            History & Workspace
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Sidebar onCloseMobile={onClose} />
        </div>
      </div>
    </div>
  );
};
