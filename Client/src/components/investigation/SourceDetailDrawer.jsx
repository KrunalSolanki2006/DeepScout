import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Calendar, CheckCircle2, AlertTriangle, BookOpen, FileCheck } from "lucide-react";
import { SourceFavicon } from "./SourceFavicon.jsx";
import { extractDomainInfo, formatExternalUrl } from "../../utils/sourceIcons.js";

/**
 * SourceDetailDrawer
 * Slide-in drawer displaying in-depth source details matching Landing Page dark theme.
 */
export const SourceDetailDrawer = ({
  source,
  isOpen,
  onClose,
  allFindings = [],
  allConflicts = [],
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !source) return null;
  if (typeof document === "undefined") return null;

  const info = extractDomainInfo(source.url);
  const publisher = source.source || info.publisher;
  const domain = info.hostname;
  const externalUrl = formatExternalUrl(source.url);

  // Determine finding relationships
  const supportedFindings = allFindings
    .map((finding, idx) => ({ finding, idx: idx + 1 }))
    .filter(({ finding }) => {
      const sourceIds = finding?.sourceIds || [];
      return sourceIds.includes(source.id);
    });

  const relatedConflicts = allConflicts
    .map((conflict, idx) => ({ conflict, idx: idx + 1 }))
    .filter(({ conflict }) => {
      const sourceIds = conflict?.sourceIds || [];
      return sourceIds.includes(source.id);
    });

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-lg h-full bg-[#0B1120] text-slate-100 shadow-2xl z-10 flex flex-col border-l border-slate-800 animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#090D16]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Primary Evidence Source</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close detail drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Source identity header */}
          <div className="flex items-start gap-4">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 hover:opacity-80 transition-opacity"
              title="Visit source website"
            >
              <SourceFavicon url={source.url} domain={domain} publisher={publisher} size="lg" />
            </a>

            <div className="flex-1 min-w-0">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-white hover:text-cyan-300 transition-colors leading-snug inline-flex items-center gap-1.5"
              >
                <span>{publisher}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                {domain}
              </p>

              {source.publishedDate && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Published: {source.publishedDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Document Title
            </span>
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors leading-relaxed inline-flex items-start gap-1.5 group"
            >
              <span>{source.title || "Untitled Research Document"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 shrink-0 mt-0.5" />
            </a>
          </div>

          {/* Extraction status */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {source.extractionStatus === "success"
                ? "Full webpage extracted & verified"
                : "Authoritative search snippet & empirical claims verified"}
            </span>
          </div>

          {/* Verified Evidence Excerpt */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Verified Evidence Excerpt
            </span>
            <div className="p-4 rounded-xl bg-slate-900/90 border-l-4 border-l-cyan-400 border border-slate-800 text-slate-200 text-xs md:text-sm leading-relaxed italic">
              "{source.semanticReason || source.excerpt || "Evidence extracted for contextual question resolution."}"
            </div>
          </div>

          {/* Finding Relationships */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Relationship to Findings
            </span>

            {supportedFindings.length === 0 && relatedConflicts.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono">
                Provides background empirical baseline for overall inquiry synthesis.
              </p>
            ) : (
              <div className="space-y-2">
                {supportedFindings.map(({ finding, idx }) => (
                  <div
                    key={`finding-${idx}`}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-emerald-300 font-mono">
                        Supports Finding 0{idx}
                      </span>
                      <p className="text-emerald-100 text-[11px] mt-0.5 line-clamp-2">
                        {typeof finding === "object" ? finding.text : finding}
                      </p>
                    </div>
                  </div>
                ))}

                {relatedConflicts.map(({ conflict, idx }) => (
                  <div
                    key={`conflict-${idx}`}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-xs text-amber-200"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300 font-mono">
                        Conflicting Evidence in Finding 0{idx}
                      </span>
                      <p className="text-amber-100 text-[11px] mt-0.5 line-clamp-2">
                        {conflict.description || conflict.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-right rounded-lg shadow-md shadow-blue-500/25 border border-blue-400/30 transition-all"
          >
            <span>Open Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};
