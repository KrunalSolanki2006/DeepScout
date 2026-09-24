import React from "react";
import { GitCompare } from "lucide-react";

/**
 * ComparabilitySection
 * Explains non-contradictory differences in research methodology.
 */
export const ComparabilitySection = ({ comparabilityNotes = [] }) => {
  if (!Array.isArray(comparabilityNotes) || comparabilityNotes.length === 0) {
    return null;
  }

  const formatType = (type) => {
    switch (type) {
      case "different_task_type":
        return "Task Type Variation";
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
    <section className="space-y-4 pt-2">
      <div className="space-y-1 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Study Comparability Notes
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {comparabilityNotes.length} Non-Contradictory Variations
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Findings that differ due to study methodology or measurement parameters rather than substantive contradictions.
        </p>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
        {comparabilityNotes.map((note, idx) => {
          const typeLabel = formatType(note.type);
          const desc = note.description || note.text || "";
          const why = note.whyTheyDiffer || "";

          return (
            <div key={idx} className="p-4 sm:p-5 space-y-2 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono">
                  {typeLabel}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-normal">
                {desc}
              </p>
              {why && (
                <p className="text-xs text-slate-500 italic pl-3 border-l-2 border-slate-200">
                  {why}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
