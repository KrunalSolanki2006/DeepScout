import React from "react";
import { SlidersHorizontal, GitCompare } from "lucide-react";

/**
 * ConditionsSection
 * "WHAT MATTERS" - Flow Step 5.
 * Meaningful conditions, operational parameters, and comparability variables with Landing Page dark theme.
 */
export const ConditionsSection = ({ conditions = [], comparabilityNotes = [] }) => {
  const hasConditions = Array.isArray(conditions) && conditions.length > 0;
  const hasComparability = Array.isArray(comparabilityNotes) && comparabilityNotes.length > 0;

  if (!hasConditions && !hasComparability) return null;

  const formatComparabilityType = (type) => {
    switch (type) {
      case "different_task_type":
        return "Task Type";
      case "different_measurement":
        return "Measurement Method";
      case "different_population":
        return "Population Context";
      case "different_outcome":
        return "Outcome Metric";
      case "insufficient_comparability":
        return "Scope Boundary";
      default:
        return "Scope Variation";
    }
  };

  return (
    <section className="space-y-6 pt-2 text-slate-100">
      {/* Section Header */}
      <div className="space-y-1 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            What Matters
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 text-sky-400 border border-sky-500/30 font-mono">
            {conditions.length + comparabilityNotes.length} Nuances & Conditions
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Critical operational parameters, worker populations, time horizons, and study methodologies that change or qualify the answer.
        </p>
      </div>

      {/* Rows Container */}
      <div className="divide-y divide-neutral-800/80 border border-neutral-800 rounded-2xl bg-[#0c0c0c] overflow-hidden shadow-xl shadow-black backdrop-blur-md">
        {/* Core Conditions */}
        {conditions.map((cond, idx) => {
          const condText = typeof cond === "object" ? cond.text : cond;

          return (
            <div
              key={`cond-${idx}`}
              className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-[#141414] transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-neutral-900 text-cyan-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border border-cyan-500/30">
                {idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                  {condText}
                </p>
              </div>
            </div>
          );
        })}

        {/* Comparability / Methodological Nuances if present */}
        {comparabilityNotes.map((note, idx) => {
          const typeLabel = formatComparabilityType(note.type);
          const desc = note.description || note.text || "";
          const why = note.whyTheyDiffer || "";

          return (
            <div
              key={`comp-${idx}`}
              className="p-4 sm:p-5 flex items-start gap-3.5 bg-black/40 hover:bg-[#141414] transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-neutral-900 text-neutral-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border border-neutral-800">
                {conditions.length + idx + 1}
              </span>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 bg-neutral-900 text-cyan-300 rounded border border-neutral-700">
                    {typeLabel}
                  </span>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                  {desc}
                </p>
                {why && (
                  <p className="text-xs text-neutral-400 italic pl-2.5 border-l border-cyan-500/40 mt-1.5">
                    {why}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
