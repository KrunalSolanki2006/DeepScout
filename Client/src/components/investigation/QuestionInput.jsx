import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  Globe,
  Newspaper,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useInvestigation } from "../../context/InvestigationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * QuestionInput
 * ChatGPT & Gemini style centered inquiry composer with balanced proportions and zero wasted space.
 */
export const QuestionInput = () => {
  const [question, setQuestion] = useState("");
  const [sourceType, setSourceType] = useState("web");
  const { startInvestigation, investigating } = useInvestigation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const maxChars = 1000;
  const firstName = user?.name ? user.name.split(" ")[0] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || investigating) return;
    try {
      const res = await startInvestigation({ question: question.trim(), sourceType });
      const newId = res?.id || res?._id || res?.data?.id;
      if (newId) {
        navigate(`/app/investigation/${newId}`);
      }
    } catch {
      // Handled via context
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex flex-col justify-center items-center py-4 sm:py-8 space-y-6 sm:space-y-8 text-slate-100">
      {/* Centered Gemini/ChatGPT Style Greeting Header */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-300 bg-black border border-cyan-500/40 uppercase shadow-md shadow-black animate-slide-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </span>
          <span>EVIDENCE-DRIVEN INVESTIGATION</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight animate-slide-up-delay-1">
          {firstName ? (
            <>
              <span className="text-white">Hello, {firstName}. </span>
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                What shall we investigate?
              </span>
            </>
          ) : (
            <>
              <span className="text-white">What do you want to </span>
              <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                investigate?
              </span>
            </>
          )}
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal animate-slide-up-delay-2">
          DeepScout gathers primary empirical research, contrasts divergent studies, and presents verified conclusions.
        </p>
      </div>

      {/* Hero Composer Box (ChatGPT & Gemini Style Elevated Card) */}
      <form onSubmit={handleSubmit} className="w-full px-2 sm:px-0 animate-slide-up-delay-3">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0c0c0c] border border-neutral-800 shadow-2xl shadow-black focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all p-3 sm:p-4 backdrop-blur-xl group hover:border-neutral-700">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, maxChars))}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Ask a question to investigate with evidence (e.g. Does AI replace routine labor?)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base resize-none border-0 focus:outline-none px-2 pt-1 pb-2 min-h-[64px] sm:min-h-[76px] leading-relaxed font-normal"
            disabled={investigating}
          />

          {/* Composer Bottom Toolbar */}
          <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            {/* Source Mode Filter Chips */}
            <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-neutral-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSourceType("web")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sourceType === "web"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-semibold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType("news")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sourceType === "news"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-semibold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>News</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType("scholar")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sourceType === "scholar"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-semibold shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Scholar</span>
              </button>
            </div>

            {/* Right side: hint, count & send button */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
                {question.length > 0 ? `${question.length}/${maxChars}` : "Enter ↵ to send"}
              </span>

              <button
                type="submit"
                disabled={!question.trim() || investigating}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 hover:shadow-indigo-500/30 border border-blue-400/40 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:scale-100 disabled:cursor-not-allowed"
                title="Start investigation"
              >
                {investigating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Bottom Disclaimer */}
      <div className="text-center pt-2 px-4 animate-slide-up-delay-4">
        <p className="text-[11px] font-mono text-slate-500">
          DeepScout cross-references peer-reviewed studies and audits source divergence. Verify citations for critical applications.
        </p>
      </div>
    </div>
  );
};
