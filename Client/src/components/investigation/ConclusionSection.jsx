import React from "react";
import { Check } from "lucide-react";

/**
 * ConclusionSection
 * "CONCLUSION / ANSWER" - Flow Step 2.
 * High-impact illuminated evidence conclusion matching Landing Page theme.
 */
export const ConclusionSection = ({ conclusion, summary, metadata = {} }) => {
  if (!conclusion && !summary) return null;

  const conclusionText =
    typeof conclusion === "object" && conclusion !== null
      ? conclusion.text
      : conclusion || summary;

  const claimCount = conclusion?.claimIds?.length || metadata.claimsUsedInConclusion || 0;
  const sourceCount = conclusion?.sourceIds?.length || metadata.sourcesUsedInConclusion || 0;

  return (
    <section className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-blue-950/70 to-slate-900/80 border border-blue-500/40 shadow-inner space-y-4 text-slate-100">
      {/* Eyebrow & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-cyan-300">
            <Check className="w-3.5 h-3.5 stroke-[2.5] text-cyan-400" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300 font-mono">
            Conclusion / Answer
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {sourceCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-medium">
              {sourceCount} Verified {sourceCount === 1 ? "Source" : "Sources"}
            </span>
          )}
          {claimCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-800/50 font-medium">
              {claimCount} Cited {claimCount === 1 ? "Claim" : "Claims"}
            </span>
          )}
        </div>
      </div>

      {/* Main Answer Text */}
      <div className="text-blue-50 text-sm sm:text-base leading-relaxed font-normal">
        <p className="whitespace-pre-line">{conclusionText}</p>
      </div>

      {/* If a complementary summary exists that provides distinct lead-in context */}
      {summary && summary !== conclusionText && (
        <div className="pt-3 border-t border-blue-900/40 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
          <span className="font-semibold text-blue-300 not-italic">Executive Context: </span>
          {summary}
        </div>
      )}
    </section>
  );
};
