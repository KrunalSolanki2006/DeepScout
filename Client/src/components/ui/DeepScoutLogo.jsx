import React from "react";

/**
 * DeepScoutLogo
 * Clean, prominent two-character monogram logo for DeepScout.
 * Displays "DS" where 'D' is white and 'S' is blue in a sleek dark badge.
 */
export const DeepScoutLogo = ({
  size = "md",
  withText = false,
  className = "",
  glow = true,
}) => {
  // Size presets for icon with enhanced scale
  const sizeMap = {
    xs: { box: "w-7 h-7 rounded-md", font: "text-xs font-black", sub: "text-[10px]" },
    sm: { box: "w-9 h-9 sm:w-10 sm:h-10 rounded-xl", font: "text-sm sm:text-base font-black", sub: "text-[11px]" },
    md: { box: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl", font: "text-lg sm:text-xl font-black", sub: "text-xs" },
    lg: { box: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl", font: "text-2xl sm:text-3xl font-black", sub: "text-sm" },
    xl: { box: "w-20 h-20 rounded-2xl", font: "text-4xl font-black", sub: "text-base" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Icon Graphic Container */}
      <div
        className={`relative ${currentSize.box} shrink-0 bg-[#0B1120] border border-slate-700/80 shadow-md shadow-black/30 flex items-center justify-center select-none group-hover:border-blue-500/50 transition-all duration-200`}
      >
        {/* Soft Ambient Core Glow */}
        {glow && (
          <div
            className={`absolute inset-0 ${currentSize.box} bg-blue-500/25 blur-[6px] -z-10 group-hover:bg-blue-500/40 transition-all`}
            aria-hidden="true"
          />
        )}

        {/* Monogram: D (White) + S (Blue) */}
        <span
          className={`font-black font-sans tracking-tight flex items-center justify-center leading-none ${currentSize.font}`}
        >
          <span className="text-white">D</span>
          <span className="text-blue-500">S</span>
        </span>
      </div>

      {/* Optional Wordmark */}
      {withText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-mono font-black tracking-tight text-white ${currentSize.font}`}>
              DEEP
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                SCOUT
              </span>
            </span>
          </div>
          <span className={`text-slate-400 font-normal tracking-wide ${currentSize.sub}`}>
            Evidence-driven investigation
          </span>
        </div>
      )}
    </div>
  );
};
