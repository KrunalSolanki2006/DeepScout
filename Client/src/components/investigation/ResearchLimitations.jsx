import React from "react";
import { HelpCircle } from "lucide-react";

/**
 * ResearchLimitations
 * "WHAT WE DON'T KNOW" - Flow Step 6.
 * Human, transparent language detailing evidence boundaries and unresolved limits with Landing Page theme.
 */
export const ResearchLimitations = ({ metadata }) => {
  if (!metadata) return null;

  const {
    partialInvestigation,
    searchFailures = [],
    extractionFailures = [],
    candidateSourceCount = 0,
    relevantSourceCount = 0,
  } = metadata;

  const hasUnresolvedItems = searchFailures.length > 0 || extractionFailures.length > 0;

  return (
    <section className="space-y-4 pt-2 text-slate-100">
      {/* Section Header */}
      <div className="space-y-1 pb-3 border-b border-slate-800/80">
        <h2 className="text-xl font-bold tracking-tight text-white">
          What We Don't Know
        </h2>
        <p className="text-xs text-slate-400">
          Boundaries of current empirical coverage, unverified claims, and methodological limits.
        </p>
      </div>

      <div className="p-5 md:p-6 rounded-2xl border border-neutral-800 bg-[#0c0c0c] space-y-4 text-xs md:text-sm text-neutral-300 leading-relaxed shadow-xl shadow-black backdrop-blur-md">
        <p>
          DeepScout synthesizes findings strictly from gathered and verified primary sources. The conclusions reflect the specific sample populations, publication time horizons, and experimental settings documented in these studies, rather than a universal guarantee.
        </p>

        {partialInvestigation && hasUnresolvedItems && (
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1.5">
            <span className="font-semibold text-cyan-300 font-mono">
              Note on source retrieval limits:
            </span>
            <p className="text-neutral-400 leading-relaxed">
              Certain specific academic queries or full text extractions were restricted by paywalls or server timeouts. Conclusions are drawn from the remaining verified empirical sources.
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
          <span>Sources Screened: {candidateSourceCount}</span>
          <span>•</span>
          <span>In-Depth Analyzed: {relevantSourceCount}</span>
        </div>
      </div>
    </section>
  );
};
