import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

export const ErrorAlert = ({
  title = "Investigation encountered an issue",
  message,
  details,
  onRetry,
  className = "",
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-rose-900/60 bg-rose-950/40 p-5 text-rose-200 shadow-xl backdrop-blur-md ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
          <p className="mt-1 text-sm text-rose-300/90 leading-relaxed">
            {message || "An unexpected error occurred during research synthesis. Please try again."}
          </p>

          {details && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-medium text-rose-400 hover:text-rose-200 inline-flex items-center gap-1 transition-colors"
              >
                {showDetails ? (
                  <>
                    Hide diagnostic details <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Show diagnostic details <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {showDetails && (
                <pre className="mt-2 p-3 rounded-xl bg-slate-900/90 text-[11px] font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap border border-rose-900/40">
                  {typeof details === "object" ? JSON.stringify(details, null, 2) : String(details)}
                </pre>
              )}
            </div>
          )}

          {onRetry && (
            <div className="mt-3.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-md shadow-rose-950/50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Investigation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
