import React, { useState } from "react";
import { ChevronDown, ChevronUp, GitBranch, ArrowDown, Check } from "lucide-react";

/**
 * InvestigationTrail
 * "How DeepScout Reached This Conclusion" - Section 23.
 * Clean, editorial visual explanation of the research journey matching Landing Page dark theme.
 */
export const InvestigationTrail = ({
  question,
  subQuestions = [],
  keyFindings = [],
  conflictingEvidence = [],
  conditions = [],
  conclusion,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!question) return null;

  const totalSources = subQuestions.reduce(
    (acc, sq) => acc + (sq.sources?.length || 0),
    0
  );
  const totalClaims = subQuestions.reduce(
    (acc, sq) => acc + (sq.claims?.length || 0),
    0
  );

  return (
    <section className="border border-slate-800 rounded-2xl bg-[#0F172A]/90 p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-4 text-slate-100">
      {/* Header / Toggle */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              How We Investigated
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Transparent research trail: question decomposition, authoritative source queries, and cross-evidence synthesis.
          </p>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label={expanded ? "Collapse trail" : "Expand trail"}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Trail */}
      {expanded && (
        <div className="pt-6 border-t border-slate-800/80 space-y-6 animate-fade-in text-xs text-slate-300">
          {/* Step 1: Central Question */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-md shadow-blue-500/25">
              1
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Question
              </span>
              <p className="text-sm font-semibold text-white">
                "{question}"
              </p>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 2: Focused Questions */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              2
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Focused Questions ({subQuestions.length})
              </span>
              <div className="space-y-2">
                {subQuestions.map((sq, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="font-semibold text-cyan-400">{idx + 1}. </span>
                    {sq.subQuestion}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 3: Evidence */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              3
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Evidence Gathered
              </span>
              <p className="text-xs text-slate-300">
                Evaluated {totalSources} primary research sources and extracted {totalClaims} verifiable claims across independent domains.
              </p>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 4: Findings */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              4
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Findings Synthesized ({keyFindings.length})
              </span>
              <p className="text-xs text-slate-300">
                Extracted claims were grouped and compared to establish empirical patterns across studies.
              </p>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 5: Conflicting Evidence */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              5
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Conflicting Evidence Partitioned ({conflictingEvidence.length})
              </span>
              <p className="text-xs text-slate-300">
                Disagreements were examined to determine whether differences stemmed from study design, worker demographic, or substantive contradictions.
              </p>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 6: Conditions */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              6
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                Conditions & Nuances Identified ({conditions.length})
              </span>
              <p className="text-xs text-slate-300">
                Key operational variables (task complexity, time duration, supervisory support) mapped out to define boundaries.
              </p>
            </div>
          </div>

          <div className="pl-3 ml-3 border-l-2 border-slate-800">
            <ArrowDown className="w-3.5 h-3.5 text-slate-600 my-0.5" />
          </div>

          {/* Step 7: Conclusion */}
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                Conclusion Formed
              </span>
              <p className="text-xs text-slate-300">
                Final synthesis constructed directly reflecting the evidence balance and verified citations.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
