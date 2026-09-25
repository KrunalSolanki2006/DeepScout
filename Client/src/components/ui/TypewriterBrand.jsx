import React, { useState, useEffect } from "react";

/**
 * TypewriterBrand
 * Renders the DeepScout wordmark with a cyber-research typing animation.
 * Features:
 * - Types character-by-character with glowing blinking terminal cursor
 * - Characters 1-4 ("DEEP") styled in crisp white
 * - Characters 5-9 ("SCOUT") styled in vibrant cyan-indigo gradient
 * - Pauses gracefully on complete word before looping
 * - Scalable size classes
 */
export const TypewriterBrand = ({
  className = "",
  textSize = "text-2xl sm:text-3xl md:text-4xl",
  loop = true,
  typingSpeed = 100,
  deletingSpeed = 45,
  pauseDelay = 4200,
}) => {
  const fullText = "DeepScout";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && displayText.length < fullText.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && displayText.length === fullText.length) {
      // Completed full word -> wait for pauseDelay
      if (loop) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else if (isDeleting && displayText.length > 0) {
      // Deleting backwards
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && displayText.length === 0) {
      // Fully cleared -> wait briefly before retyping
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, loop, typingSpeed, deletingSpeed, pauseDelay]);

  // First 4 characters ("Deep") in white, remaining ("Scout") in cyan gradient
  const deepPart = displayText.slice(0, 4);
  const scoutPart = displayText.slice(4);

  return (
    <span
      className={`inline-flex items-center font-mono font-black tracking-tight select-none ${textSize} ${className}`}
      aria-label="DeepScout"
    >
      {/* "Deep" in crisp white */}
      <span className="text-white drop-shadow-sm">{deepPart}</span>

      {/* "Scout" in vibrant cyan-indigo gradient */}
      <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        {scoutPart}
      </span>

      {/* Blinking Minimalist Terminal Cursor */}
      <span
        className="inline-block text-cyan-400 font-light ml-0.5 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
};
