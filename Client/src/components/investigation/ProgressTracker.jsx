import React from "react";
import { Check, Clock, BookOpen } from "lucide-react";
import { STAGES, useInvestigation } from "../../context/InvestigationContext.jsx";

/**
 * ProgressTracker
 * Modern dark telemetry & research lifecycle tracker matching Landing Page aesthetics.
 */
export const ProgressTracker = () => {
  const { currentStageIndex, elapsedSeconds, lastSubmittedQuestion } = useInvestigation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16 space-y-8 animate-fade-in text-slate-100">
      {/* Top Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-300 bg-black/90 border border-cyan-500/40 uppercase shadow-md shadow-black">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </span>
          <span>INVESTIGATION IN PROGRESS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Investigating your question
        </h2>

        <p className="text-sm md:text-base text-cyan-200/90 italic max-w-lg mx-auto font-serif">
          "{lastSubmittedQuestion?.question}"
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-mono pt-1">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Elapsed: {elapsedSeconds}s</span>
          <span>•</span>
          <span className="capitalize">{lastSubmittedQuestion?.sourceType || "web"} search</span>
        </div>
      </div>

      {/* Subtle Glowing Progress Bar */}
      <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden relative shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(56,189,248,0.7)]"
          style={{
            width: `${Math.min(100, ((currentStageIndex + 1) / STAGES.length) * 100)}%`,
          }}
        />
      </div>

      {/* 5-Step Human Research Lifecycle Card in deep black */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0c0c0c] border border-neutral-800 shadow-2xl shadow-black backdrop-blur-xl space-y-4">
        <div className="space-y-4">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3.5 transition-opacity duration-300 ${
                  isCompleted || isCurrent ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* State Symbol */}
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/25 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700" />
                  )}
                </div>

                {/* Stage Label */}
                <span
                  className={`text-sm ${
                    isCurrent
                      ? "text-cyan-300 font-bold"
                      : isCompleted
                      ? "text-slate-200 font-medium"
                      : "text-slate-500 font-normal"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skeleton Result Structures Preview */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block text-center">
          Assembling Research Document
        </span>

        <div className="space-y-3 opacity-60">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="h-3.5 bg-slate-800 rounded w-1/4 animate-pulse" />
            <div className="h-3 bg-slate-850 rounded w-full animate-pulse" />
            <div className="h-3 bg-slate-850 rounded w-5/6 animate-pulse" />
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="h-3.5 bg-slate-800 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-850 rounded w-11/12 animate-pulse" />
              <div className="h-3 bg-slate-850 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
