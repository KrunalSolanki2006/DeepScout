import React from "react";
import { BookOpen } from "lucide-react";

/**
 * SummarySection
 * "Evidence Summary" - Conforms to Section 17, 24 & 25 (NEVER "GPT Summary").
 * A concise, readable executive synthesis of the investigation.
 */
export const SummarySection = ({ summary, keyFindings = [] }) => {
  // If backend provided a summary string, use it. Otherwise, create a clean synthesis from the primary findings.
  let content = summary;

  if (!content && keyFindings.length > 0) {
    const firstTwo = keyFindings.slice(0, 2).map((f) => (typeof f === "object" ? f.text : f));
    content = firstTwo.join(" ");
  }

  if (!content) return null;

  return (
    <section className="space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Evidence Summary
        </h2>
      </div>

      <div className="text-slate-800 text-base md:text-lg leading-relaxed font-normal">
        <p className="whitespace-pre-line">{content}</p>
      </div>
    </section>
  );
};
