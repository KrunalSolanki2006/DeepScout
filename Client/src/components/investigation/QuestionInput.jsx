import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  Globe,
  Newspaper,
  GraduationCap,
  Loader2,
  Brain,
  TrendingUp,
  Activity,
  Scale,
} from "lucide-react";
import { useInvestigation } from "../../context/InvestigationContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const SUGGESTED_INQUIRIES = [
  {
    icon: Brain,
    category: "AI & Automation",
    color: "text-cyan-400 bg-cyan-950/80 border-cyan-800/60",
    question: "Does AI improve student learning outcomes in primary education?",
  },
  {
    icon: TrendingUp,
    category: "Macroeconomics",
    color: "text-emerald-400 bg-emerald-950/80 border-emerald-800/60",
    question: "What are the economic impacts of remote work on commercial real estate?",
  },
  {
    icon: Activity,
    category: "Metabolic Health",
    color: "text-blue-400 bg-blue-950/80 border-blue-800/60",
    question: "Does intermittent fasting provide metabolic benefits beyond caloric restriction?",
  },
  {
    icon: Scale,
    category: "Societal Policy",
    color: "text-indigo-400 bg-indigo-950/80 border-indigo-800/60",
    question: "How does social media usage impact adolescent cognitive development?",
  },
];

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
    <div className="w-full max-w-3xl lg:max-w-4xl mx-auto flex flex-col justify-center items-center py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in text-slate-100">
      {/* Centered Gemini/ChatGPT Style Greeting Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-cyan-300 bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-blue-950/90 border border-cyan-500/40 uppercase shadow-md shadow-cyan-950/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </span>
          <span>EVIDENCE-DRIVEN INVESTIGATION</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {firstName ? (
            <>
              <span className="text-white">Hello, {firstName}. </span>
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(56,189,248,0.2)]">
                What shall we investigate?
              </span>
            </>
          ) : (
            <>
              <span className="text-white">What do you want to </span>
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(56,189,248,0.2)]">
                investigate?
              </span>
            </>
          )}
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal">
          DeepScout gathers primary empirical research, contrasts divergent studies, and presents verified conclusions.
        </p>
      </div>

      {/* Hero Composer Box (ChatGPT & Gemini Style Elevated Card) */}
      <form onSubmit={handleSubmit} className="w-full px-2 sm:px-0">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0F172A]/95 via-[#0B1120]/98 to-[#070B14]/98 border border-slate-700/80 shadow-2xl shadow-blue-950/50 focus-within:border-cyan-400/80 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all p-3 sm:p-4 backdrop-blur-xl group hover:border-slate-600">
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
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/90 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSourceType("web")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  sourceType === "web"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
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
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
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
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25 border border-blue-400/30 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
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

      {/* 4 Suggested Inquiries (ChatGPT & Gemini Responsive Card Grid) */}
      <div className="w-full space-y-2.5 pt-1 px-2 sm:px-0">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
          <span className="uppercase tracking-wider font-semibold">Suggested Inquiries</span>
          <span className="hidden sm:inline-block">Empirical Benchmark Topics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {SUGGESTED_INQUIRIES.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setQuestion(item.question)}
                className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-blue-950/30 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${item.color}`}>
                    <IconComponent className="w-3 h-3" />
                    <span>{item.category}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all">
                    →
                  </span>
                </div>
                <p className="text-xs text-slate-200 group-hover:text-white leading-relaxed line-clamp-2">
                  {item.question}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="text-center pt-2 px-4">
        <p className="text-[11px] font-mono text-slate-500">
          DeepScout cross-references peer-reviewed studies and audits source divergence. Verify citations for critical applications.
        </p>
      </div>
    </div>
  );
};
