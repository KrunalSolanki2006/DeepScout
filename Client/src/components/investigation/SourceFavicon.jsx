import React, { useState } from "react";
import { extractDomainInfo, getFaviconUrl, getMonogramStyle } from "../../utils/sourceIcons.js";

/**
 * SourceFavicon
 * Renders an authoritative domain favicon with graceful instant fallback
 * to a styled monogram. Conforms to Section 18, 19, and 34.
 */
export const SourceFavicon = ({
  url,
  domain: directDomain,
  publisher: directPublisher,
  size = "md", // "sm" (24px), "md" (32px), "lg" (40px)
  className = "",
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const info = extractDomainInfo(url);
  const targetDomain = directDomain || info.rootDomain || info.hostname;
  const targetPublisher = directPublisher || info.publisher;
  const monogram = info.monogram;

  const faviconSrc = targetDomain && !imageFailed ? getFaviconUrl(targetDomain, 64) : null;
  const style = getMonogramStyle(targetDomain);

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px] rounded",
    md: "w-8 h-8 text-xs rounded-md",
    lg: "w-10 h-10 text-sm rounded-lg",
  }[size] || "w-8 h-8 text-xs rounded-md";

  const imgSizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size] || "w-4 h-4";

  if (faviconSrc && !imageFailed) {
    return (
      <div
        className={`shrink-0 flex items-center justify-center bg-white border border-slate-200/90 shadow-2xs overflow-hidden ${sizeClasses} ${className}`}
        title={`${targetPublisher} (${info.hostname})`}
      >
        <img
          src={faviconSrc}
          alt=""
          loading="lazy"
          className={`${imgSizeClasses} object-contain transition-opacity duration-200`}
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  // Fallback Monogram
  return (
    <div
      className={`shrink-0 flex items-center justify-center font-bold font-mono tracking-tight border shadow-2xs select-none ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
      title={`${targetPublisher} (${info.hostname})`}
      aria-label={`${targetPublisher} icon`}
    >
      {monogram}
    </div>
  );
};
