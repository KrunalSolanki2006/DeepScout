import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Plus } from "lucide-react";
import { ConclusionSection } from "./ConclusionSection.jsx";
import { FindingsSection } from "./FindingsSection.jsx";
import { ConflictsSection } from "./ConflictsSection.jsx";
import { ConditionsSection } from "./ConditionsSection.jsx";
import { ResearchLimitations } from "./ResearchLimitations.jsx";
import { SourcesSection } from "./SourcesSection.jsx";
import { InvestigationTrail } from "./InvestigationTrail.jsx";
import { SourceDetailDrawer } from "./SourceDetailDrawer.jsx";
import { useInvestigation } from "../../context/InvestigationContext.jsx";
import { formatInvestigatedDate } from "../../utils/date.js";

/**
 * ResultView
 * Exact Answer Flow matching Landing Page Section 3 theme:
 * QUESTION -> CONCLUSION -> KEY FINDINGS -> WHERE EVIDENCE DIFFERS -> WHAT MATTERS -> SOURCES
 */
export const ResultView = ({ result }) => {
  const { clearActiveInvestigation } = useInvestigation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  if (!result) return null;

  const {
    question,
    summary,
    conclusion,
    keyFindings = [],
    conflictingEvidence = [],
    comparabilityNotes = [],
    conditions = [],
    subQuestions = [],
    metadata = {},
    createdAt,
  } = result;

  // Flatten all sources for lookup
  const allSources = [];
  const seenIds = new Set();
  subQuestions.forEach((sq) => {
    (sq.sources || []).forEach((src) => {
      if (!seenIds.has(src.id) && src.url) {
        seenIds.add(src.id);
        allSources.push(src);
      }
    });
  });

  const handleCopyReport = () => {
    const conclusionText =
      typeof conclusion === "object" && conclusion !== null
        ? conclusion.text
        : conclusion;

    const copyText = `DEEPSCOUT INVESTIGATION REPORT
====================================
Question: ${question}
Investigated: ${formatInvestigatedDate(createdAt)}

CONCLUSION / ANSWER:
${conclusionText}

KEY FINDINGS:
${keyFindings.map((f, i) => `${i + 1}. ${typeof f === "object" ? f.text : f}`).join("\n")}
====================================`;

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-6 md:py-10 animate-fade-in text-slate-100">
      {/* Research Document Shell matching Landing Page Preview Card */}
      <div className="border border-slate-800/90 rounded-2xl bg-[#0F172A]/90 shadow-2xl shadow-blue-950/40 overflow-hidden backdrop-blur-md transition-all">
        {/* Mock Browser / Document Header */}
        <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-xs sm:text-sm text-slate-200 ml-3 font-sans font-semibold">
              DeepScout Investigation Result
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">Primary Research Document</span>
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-md text-slate-300 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
                  <span className="text-cyan-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Document Content Flow */}
        <div className="p-6 sm:p-8 md:p-10 space-y-10 bg-[#0E1526]/80">
          {/* 1. QUESTION */}
          <header className="space-y-2 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <span>QUESTION</span>
              <span>•</span>
              <span className="text-slate-400">{formatInvestigatedDate(createdAt)}</span>
              {metadata.sourceType && (
                <>
                  <span>•</span>
                  <span className="capitalize text-slate-400">{metadata.sourceType} Sources</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {question}
            </h1>
          </header>

          {/* 2. CONCLUSION / ANSWER */}
          <ConclusionSection
            conclusion={conclusion}
            summary={summary}
            metadata={metadata}
          />

          {/* 3. KEY FINDINGS */}
          <FindingsSection
            keyFindings={keyFindings}
            sources={allSources}
            onSelectSource={setSelectedSource}
          />

          {/* 4. WHERE EVIDENCE DIFFERS */}
          <ConflictsSection
            conflictingEvidence={conflictingEvidence}
            sources={allSources}
            onSelectSource={setSelectedSource}
          />

          {/* 5. WHAT MATTERS */}
          <ConditionsSection
            conditions={conditions}
            comparabilityNotes={comparabilityNotes}
          />

          {/* 6. WHAT WE DON'T KNOW */}
          <ResearchLimitations metadata={metadata} />

          {/* 7. SOURCES */}
          <SourcesSection
            subQuestions={subQuestions}
            keyFindings={keyFindings}
            conflictingEvidence={conflictingEvidence}
            onSelectSource={setSelectedSource}
          />

          {/* 8. HOW WE INVESTIGATED */}
          <InvestigationTrail
            question={question}
            subQuestions={subQuestions}
            keyFindings={keyFindings}
            conflictingEvidence={conflictingEvidence}
            conditions={conditions}
            conclusion={conclusion}
          />

          {/* Bottom CTA */}
          <div className="pt-8 border-t border-slate-800/80 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Have a follow-up or adjacent inquiry to explore?
            </p>
            <button
              type="button"
              onClick={() => {
                clearActiveInvestigation();
                navigate("/app");
              }}
              className="relative group overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/30 border border-blue-400/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Start a New Investigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Right-Side Source Detail Drawer */}
      <SourceDetailDrawer
        source={selectedSource}
        isOpen={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
        allFindings={keyFindings}
        allConflicts={conflictingEvidence}
      />
    </div>
  );
};
