import React from "react";
import { ExternalLink } from "lucide-react";
import { SourceFavicon } from "./SourceFavicon.jsx";
import { extractDomainInfo, formatExternalUrl } from "../../utils/sourceIcons.js";

/**
 * SourcesSection
 * "SOURCES" - Flow Step 7.
 * Premium vertical research list conforming to Landing Page dark theme.
 */
export const SourcesSection = ({
  subQuestions = [],
  keyFindings = [],
  conflictingEvidence = [],
}) => {
  // Aggregate all unique sources across subquestions
  const allSources = [];
  const seenIds = new Set();
  const seenUrls = new Set();

  subQuestions.forEach((sq) => {
    (sq.sources || []).forEach((src) => {
      if (!seenIds.has(src.id) && src.url && !seenUrls.has(src.url)) {
        seenIds.add(src.id);
        seenUrls.add(src.url);
        allSources.push({
          ...src,
          subQuestion: sq.subQuestion,
        });
      }
    });
  });

  if (allSources.length === 0) return null;

  return (
    <section className="space-y-6 pt-4 text-slate-100">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Sources
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-mono">
              {allSources.length} Primary Documents
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Primary documents, preprints, and studies retrieved and evaluated during this investigation. Click any document title to visit the original source.
          </p>
        </div>
      </div>

      {/* Vertical Research Document List */}
      <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl bg-[#0F172A]/90 overflow-hidden shadow-xl backdrop-blur-md">
        {allSources.map((source, idx) => {
          const info = extractDomainInfo(source.url);
          const publisher = source.source || info.publisher;
          const domain = info.hostname;
          const displayIdx = String(idx + 1).padStart(2, "0");
          const externalUrl = formatExternalUrl(source.url);

          // Determine finding links for badges
          const findingLinks = keyFindings
            .map((f, fIdx) => ({ f, fIdx: fIdx + 1 }))
            .filter(({ f }) => (f.sourceIds || []).includes(source.id));

          const conflictLinks = conflictingEvidence
            .map((c, cIdx) => ({ c, cIdx: cIdx + 1 }))
            .filter(({ c }) => (c.sourceIds || []).includes(source.id));

          return (
            <div
              key={source.id || idx}
              className="group py-5 px-4 sm:px-6 hover:bg-slate-850/60 transition-colors flex items-start gap-4"
            >
              {/* Index & Favicon & Source Identity */}
              <span className="text-xs font-mono font-bold text-slate-500 pt-1 shrink-0">
                SOURCE {displayIdx}
              </span>

              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 hover:opacity-80 transition-opacity pt-0.5"
                title={`Visit ${publisher} website`}
              >
                <SourceFavicon
                  url={source.url}
                  domain={domain}
                  publisher={publisher}
                  size="md"
                />
              </a>

              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Publisher & Domain */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{publisher}</span>
                  </a>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                    {domain}
                  </span>
                  {source.publishedDate && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      • {source.publishedDate}
                    </span>
                  )}
                </div>

                {/* Title (Clickable link directly to external website) */}
                <h3 className="leading-snug">
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors inline-flex items-start gap-1.5 group/link"
                  >
                    <span>{source.title || "Untitled Research Document"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover/link:text-cyan-300 shrink-0 mt-0.5" />
                  </a>
                </h3>

                {/* Excerpt */}
                {source.semanticReason && (
                  <blockquote className="text-xs text-slate-300 leading-relaxed italic pl-3 border-l-2 border-cyan-500/40 line-clamp-2">
                    "{source.semanticReason}"
                  </blockquote>
                )}

                {/* Relationship Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {findingLinks.map(({ fIdx }) => (
                    <span
                      key={`f-${fIdx}`}
                      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono"
                    >
                      Supports Finding 0{fIdx}
                    </span>
                  ))}

                  {conflictLinks.map(({ cIdx }) => (
                    <span
                      key={`c-${cIdx}`}
                      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono"
                    >
                      Contradiction in Finding 0{cIdx}
                    </span>
                  ))}

                  {source.extractionStatus === "success" && (
                    <span className="text-[10px] font-medium text-slate-500 font-mono">
                      • Verified Text
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
