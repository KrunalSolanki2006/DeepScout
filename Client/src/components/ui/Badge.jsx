import React from "react";

export const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  const variants = {
    neutral: "bg-neutral-900 text-neutral-300 border-neutral-800",
    blue: "bg-neutral-900 text-sky-400 border-sky-500/30",
    green: "bg-neutral-900 text-emerald-400 border-emerald-500/30",
    amber: "bg-neutral-900 text-amber-400 border-amber-500/30",
    red: "bg-neutral-900 text-rose-400 border-rose-500/30",
    purple: "bg-neutral-900 text-indigo-400 border-indigo-500/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};
