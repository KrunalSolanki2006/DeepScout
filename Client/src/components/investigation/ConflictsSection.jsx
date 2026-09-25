import React from "react";
import { GitCompare, HelpCircle, ExternalLink } from "lucide-react";
import { SourceFavicon } from "./SourceFavicon.jsx";
import { extractDomainInfo, formatExternalUrl } from "../../utils/sourceIcons.js";

/**
 * ConflictsSection
 * "WHERE EVIDENCE DIFFERS" - Flow Step 4.
 * Highlights empirical disagreements and clarifies why study results diverge with Landing Page theme.
 */
export const ConflictsSection = ({
  conflictingEvidence = [],
  sources = [],
  onSelectSource,
}) => {
  if (!Array.isArray(conflictingEvidence) || conflictingEvidence.length === 0) {
    return null;
  }

  // Lookup map of sources
  const sourceMap = new Map();
  sources.forEach((s) => {
    if (s.id) sourceMap.set(s.id, s);
    if (s.url) sourceMap.set(s.url, s);
  });

  return (
    <section className="space-y-6 pt-2 text-slate-100">
      {/* Section Header */}
      <div className="space-y-1 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Where Evidence Differs
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
            {conflictingEvidence.length} {conflictingEvidence.length === 1 ? "Disagreement" : "Disagreements"}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Credible studies examine comparable questions but reach divergent empirical findings. DeepScout highlights these contradictions rather than flattening nuance.
        </p>
      </div>

      {/* Disagreements List */}
      <div className="space-y-6">
        {conflictingEvidence.map((conflict, idx) => {
          const desc = conflict.description || conflict.text || "";
          const why = conflict.whyTheyDiffer || "";
          const sourceIds = conflict.sourceIds || [];
          const citedSources = sourceIds.map((id) => sourceMap.get(id)).filter(Boolean);

          return (
            <div
              key={idx}
              className="p-5 md:p-6 rounded-2xl border border-neutral-800 bg-[#0c0c0c] space-y-4 shadow-xl shadow-black backdrop-blur-md"
            >
              {/* Conflict Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <GitCompare className="w-3.5 h-3.5 text-amber-400" />
                <span>Empirical Contradiction 0{idx + 1}</span>
              </div>

              {/* Main Conflict Description */}
              <h3 className="text-base font-semibold text-white leading-snug">
                {desc}
              </h3>

              {/* Why Results Differ */}
              {why && (
                <div className="p-4 rounded-xl bg-black border border-cyan-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 font-mono">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>WHY MIGHT THESE RESULTS DIFFER?</span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-200 leading-relaxed">
                    {why}
                  </p>
                </div>
              )}

              {/* Referenced Sources */}
              {citedSources.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-mono">
                    Referenced Sources:
                  </span>
                  {citedSources.map((source) => {
                    const info = extractDomainInfo(source.url);
                    const publisher = source.source || info.publisher;
                    const externalUrl = formatExternalUrl(source.url);

                    return (
                      <a
                        key={source.id}
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-[#141414] hover:bg-[#1e1e1e] border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors shadow-xs font-medium"
                        title={`Open ${publisher} website (${info.hostname})`}
                      >
                        <SourceFavicon
                          url={source.url}
                          domain={info.hostname}
                          publisher={publisher}
                          size="sm"
                        />
                        <span className="truncate max-w-[160px] font-medium">{publisher}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
