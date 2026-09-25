import React from "react";
import { ExternalLink } from "lucide-react";
import { SourceFavicon } from "./SourceFavicon.jsx";
import { extractDomainInfo, formatExternalUrl } from "../../utils/sourceIcons.js";

/**
 * FindingsSection
 * "KEY FINDINGS" - Flow Step 3.
 * Core empirical findings verified across independent sources matching Landing Page dark theme.
 */
export const FindingsSection = ({
  keyFindings = [],
  sources = [],
  onSelectSource,
}) => {
  if (!Array.isArray(keyFindings) || keyFindings.length === 0) return null;

  // Build a lookup map of sources by ID and by URL
  const sourceMap = new Map();
  sources.forEach((s) => {
    if (s.id) sourceMap.set(s.id, s);
    if (s.url) sourceMap.set(s.url, s);
  });

  return (
    <section className="space-y-6 pt-2 text-slate-100">
      {/* Section Header */}
      <div className="space-y-1 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Key Findings
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-900 text-sky-400 border border-sky-500/30 font-mono">
            {keyFindings.length} Verified
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Core empirical conclusions verified across independent research studies and primary documents.
        </p>
      </div>

      {/* Findings List */}
      <div className="space-y-8">
        {keyFindings.map((finding, idx) => {
          const findingNumber = String(idx + 1).padStart(2, "0");
          const findingText = typeof finding === "object" ? finding.text : finding;
          const citedSourceIds = finding.sourceIds || [];

          // Find the actual source objects cited by this finding
          const citedSources = citedSourceIds
            .map((id) => sourceMap.get(id))
            .filter(Boolean);

          return (
            <article
              key={idx}
              className="space-y-3 pb-8 border-b border-slate-800/70 last:border-b-0"
            >
              {/* Finding Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  Finding {findingNumber}
                </span>
              </div>

              {/* Finding Statement */}
              <h3 className="text-base md:text-lg font-semibold text-slate-100 leading-snug">
                {findingText}
              </h3>

              {/* Evidence References */}
              {citedSources.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                    Supporting Evidence
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {citedSources.map((source) => {
                      const info = extractDomainInfo(source.url);
                      const publisher = source.source || info.publisher;
                      const externalUrl = formatExternalUrl(source.url);

                      return (
                        <a
                          key={source.id}
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-[#0c0c0c] hover:border-cyan-500/40 hover:bg-[#141414] transition-all shadow-xs group text-xs text-neutral-300 hover:text-white"
                          title={`Open ${publisher} website (${info.hostname}) in new tab`}
                        >
                          <SourceFavicon
                            url={source.url}
                            domain={info.hostname}
                            publisher={publisher}
                            size="sm"
                          />
                          <span className="font-medium truncate max-w-[200px]">
                            {publisher}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
