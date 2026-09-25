import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Clock,
  Compass,
  PanelLeftClose,
} from "lucide-react";
import { useInvestigation } from "../../context/InvestigationContext.jsx";
import { formatRelativeDate } from "../../utils/date.js";
import { Skeleton } from "../ui/Skeleton.jsx";

/**
 * Sidebar
 * Modern dark research library matching Landing Page aesthetics.
 */
export const Sidebar = ({ onCloseMobile, onToggleCollapse }) => {
  const {
    history,
    historyLoading,
    activeInvestigation,
    selectInvestigation,
    deleteHistoryItem,
    clearActiveInvestigation,
    investigating,
  } = useInvestigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const handleSelect = async (id) => {
    navigate(`/app/investigation/${id}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNew = () => {
    clearActiveInvestigation();
    navigate("/app");
    if (onCloseMobile) onCloseMobile();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteHistoryItem(id);
      if (activeInvestigation?.id === id) {
        navigate("/app");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Filter history based on search query
  const filteredHistory = history.filter((item) =>
    (item.question || item.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group into Recent (< 48 hours) and Earlier
  const now = new Date().getTime();
  const twoDaysMs = 48 * 60 * 60 * 1000;

  const recentItems = [];
  const earlierItems = [];

  filteredHistory.forEach((item) => {
    const itemTime = new Date(item.createdAt).getTime();
    if (now - itemTime < twoDaysMs) {
      recentItems.push(item);
    } else {
      earlierItems.push(item);
    }
  });

  return (
    <aside className="w-72 lg:w-80 h-full flex flex-col bg-[#000000] border-r border-slate-800/80 text-slate-200 select-none">
      {/* Sidebar Header & New Investigation */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNew}
            disabled={investigating}
            className="flex-1 relative group overflow-hidden inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/25 border border-blue-400/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Investigation</span>
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:inline-flex p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors shrink-0"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investigations..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-black text-white border border-neutral-800 rounded-lg placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* History Library List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {historyLoading && history.length === 0 ? (
          <div className="p-3 space-y-3">
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/60" />
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/60" />
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/60" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            {searchQuery ? (
              <p className="text-xs text-slate-500">
                No investigations matching "{searchQuery}"
              </p>
            ) : (
              <div className="space-y-2">
                <Clock className="w-5 h-5 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No investigations yet</p>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                  Your completed investigations will appear here.
                </p>
                <button
                  type="button"
                  onClick={handleNew}
                  className="mt-2 text-xs font-semibold text-cyan-400 hover:underline transition-colors"
                >
                  Start an Investigation
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Group */}
            {recentItems.length > 0 && (
              <div className="space-y-1">
                <div className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-500">
                  Recent
                </div>
                {recentItems.map((item) => {
                  const isActive = activeInvestigation?.id === item.id || activeInvestigation?._id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`group relative flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                        isActive
                          ? "bg-[#141414] text-white border-l-2 border-l-cyan-400 border-neutral-800 shadow-sm font-semibold"
                          : "hover:bg-[#111111] text-neutral-300 hover:text-white border-transparent"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSelect(item.id);
                        }
                      }}
                    >
                      <FileText
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isActive ? "text-cyan-400" : "text-neutral-500 group-hover:text-neutral-300"
                        }`}
                      />

                      <div className="flex-1 min-w-0 pr-5">
                        <h4 className="text-xs font-normal line-clamp-2 leading-snug">
                          {item.question}
                        </h4>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <span>{formatRelativeDate(item.createdAt)}</span>
                          {item.sourceType && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{item.sourceType}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quiet delete button */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item.id)}
                        disabled={deletingId === item.id}
                        className="absolute right-1.5 top-2 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label="Delete investigation"
                        title="Delete investigation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Earlier Group */}
            {earlierItems.length > 0 && (
              <div className="space-y-1 pt-2">
                <div className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-500">
                  Earlier
                </div>
                {earlierItems.map((item) => {
                  const isActive = activeInvestigation?.id === item.id || activeInvestigation?._id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`group relative flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all border ${
                        isActive
                          ? "bg-[#171717] text-white border-neutral-700 shadow-sm font-semibold"
                          : "hover:bg-[#111111] text-neutral-300 hover:text-white border-transparent"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSelect(item.id);
                        }
                      }}
                    >
                      <FileText
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                        }`}
                      />

                      <div className="flex-1 min-w-0 pr-5">
                        <h4 className="text-xs font-normal line-clamp-2 leading-snug">
                          {item.question}
                        </h4>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <span>{formatRelativeDate(item.createdAt)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item.id)}
                        disabled={deletingId === item.id}
                        className="absolute right-1.5 top-2 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label="Delete investigation"
                        title="Delete investigation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Library Footer */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <span>Library</span>
        <span>{history.length} records</span>
      </div>
    </aside>
  );
};
